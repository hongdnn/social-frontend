"use client";

import { Toolbar } from "@/src/components/Toolbar";
import { useEffect } from "react";
import { useChat } from "./hooks/use-chat";
import { ConversationList } from "@/src/components/chat/ConversationList";
import { Message } from "@/src/components/chat/Message";
import { parseUserFromJson } from "@/src/models/user";
import { useSocket } from "../socket-context";
import { MessageModel, MessageType } from "@/src/models/message";
import { ChatInput } from "@/src/components/chat/ChatInput";
import { ConversationType } from "@/src/models/conversation";

export default function Home() {
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
  } = useChat();

  useEffect(() => {
    setUser(parseUserFromJson(localStorage.getItem("user")));
    getConversations(false);
  }, [getConversations, setUser]);

  useEffect(() => {
    const unsubscribe = subscribeToMessages((message: MessageModel) => {
      receiveNewMessage(message)
    });

    // Clean up the subscription when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [subscribeToMessages, receiveNewMessage])

  const handleSendMessage = (message: string) => {
    if (!currentConversation || !user) return;

    const receiverId = currentConversation.conversationType === ConversationType.Private
      ? currentConversation.members.find(member => member.userId !== user.id)?.userId
      : '';
    if(receiverId) {
      sendPrivateMessage({
        sender_id: user?.id ?? '',
        receiver_id: receiverId,
        message: message,
        message_type: MessageType.Text,
      })
    }
  };

  return (
    <div className="flex h-screen">
      <Toolbar />

      {/* Chat List */}
      <ConversationList
        conversations={conversations}
        loading={loading}
        onConversationClick={(id) => handleConversationClick(id)}
      />

      {/* Chat Room */}
      <div className="flex flex-grow flex-col shadow-md">
        {/* Header */}
        <div className="border-b p-4 min-h-[65px]">
          <h2 className="text-lg font-semibold">{currentConversation?.getConversationName()}</h2>
        </div>

        {/* Messages */}
        <div className="flex-grow space-y-4 overflow-y-auto p-4">
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
            </div>
          )}
        </div>

        {/* Input Box */}
        <ChatInput onSend={(message) => {handleSendMessage(message)}}/>
      </div>
    </div>
  );
}
