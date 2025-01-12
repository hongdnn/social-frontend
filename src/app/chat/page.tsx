"use client";

import { Toolbar } from "@/src/components/common/Toolbar";
import { useEffect, useMemo, useRef } from "react";
import { useChat } from "./hooks/use-chat";
import { ConversationList } from "@/src/components/chat/ConversationList";
import { Message } from "@/src/components/chat/Message";
import { parseUserFromJson } from "@/src/models/user";
import { useSocket } from "../socket-context";
import { MessageModel, MessageType } from "@/src/models/message";
import { ChatInput } from "@/src/components/chat/ChatInput";
import { ConversationType } from "@/src/models/conversation";
import { debounce } from "lodash";
import { NewMessageModal } from "@/src/components/chat/NewMessageModal";

export default function Chat() {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const { subscribeToMessages, sendPrivateMessage } = useSocket();
  

  const {
    loading,
    error,
    conversations,
    getConversations,
    currentConversation,
    handleConversationClick,
    user,
    setUser,
    messageRefs,
    receiveNewMessage,
    loadMoreMessages,
    isNewMessageModalOpen,
    setIsNewMessageModalOpen,
    fetchConversation
  } = useChat();

  useEffect(() => {
    setUser(parseUserFromJson(localStorage.getItem("user")));
    getConversations(false);
  }, [getConversations, setUser]);

  useEffect(() => {
    const unsubscribe = subscribeToMessages((message: MessageModel) => {
      receiveNewMessage(message);
    });

    // Clean up the subscription when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [subscribeToMessages, receiveNewMessage]);

  const handleScroll = useMemo(
    () =>
      debounce(() => {
        const container = messagesContainerRef.current;
        if (container && container.scrollTop < 250) {
          console.log("container.scrollTop, ", container.scrollTop);
          loadMoreMessages();
        }
      }, 500),
    [loadMoreMessages],
  );

  const handleSendMessage = (message: string) => {
    if (!currentConversation || !user) return;

    const receiverId =
      currentConversation.conversationType === ConversationType.Private
        ? currentConversation.members.find(
            (member) => member.userId !== user.id,
          )?.userId
        : "";
    if (receiverId) {
      sendPrivateMessage({
        sender_id: user?.id ?? "",
        receiver_id: receiverId,
        message: message,
        message_type: MessageType.Text,
      });
    }
  };

  return (
    <>
      <div className="flex h-screen">
        <Toolbar />

        {/* Chat List */}
        <ConversationList
          conversations={conversations}
          loading={loading}
          user={user}
          onConversationClick={(id) => handleConversationClick(id)}
          onCreateConversation={() => setIsNewMessageModalOpen(true)}
        />

        {/* Chat Room */}
        <div className="flex flex-grow flex-col shadow-md">
          {/* Header */}
          <div className="min-h-[65px] border-b p-4">
            <h2 className="text-lg font-semibold">
              {currentConversation?.getConversationName(user?.id)}
            </h2>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-grow space-y-4 overflow-y-auto p-4"
          >
            {currentConversation !== null ? (
              currentConversation.messages.map((messageModel) => (
                <Message
                  key={messageModel.id}
                  messageModel={messageModel}
                  isCurrentUserMessage={messageModel.sender.userId === user?.id}
                  ref={(el) => {
                    messageRefs.current[messageModel.id] = el;
                  }}
                />
              ))
            ) : (
              <div className="flex h-full flex-col items-center justify-center">
                <h2>Your messages</h2>
                <p>Send a message to start a chat</p>
                <button
                  onClick={() => {
                    setIsNewMessageModalOpen(true);
                  }}
                  className="mt-3 rounded-xl border bg-primary px-4 py-2"
                >
                  Send message
                </button>
              </div>
            )}
          </div>

          {/* Input Box */}
          <ChatInput
            onSend={(message) => {
              handleSendMessage(message);
            }}
          />
        </div>
      </div>

      <NewMessageModal
        isOpen={isNewMessageModalOpen}
        onClose={() => {
          setIsNewMessageModalOpen(false);
        }}
        onStartConversation={userIds => fetchConversation(userIds)}
      />
    </>
  );
}
