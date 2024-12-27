import { conversationApi } from "@/src/lib/api/conversation-api";
import { ConversationModel } from "@/src/models/conversation";
import { MessageModel } from "@/src/models/message";
import {  UserModel } from "@/src/models/user";
import { useCallback, useEffect, useRef, useState } from "react";

export const useChat = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationModel[]>([]);
  const [user, setUser] = useState<UserModel | null>(null);
  const [currentConversation, setCurrentConversation] =
    useState<ConversationModel | null>(null);

  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  /* store the conversations state inside useCallback without creating a dependency */
  const conversationsRef = useRef<ConversationModel[]>([]);
  const currentConversationRef = useRef<ConversationModel>(null);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  useEffect(() => {
    currentConversationRef.current = currentConversation;
  }, [currentConversation]);

  const scrollToMessage = useCallback((messageId: string, autoBehavior?: boolean) => {
    setTimeout(() => {
      const messageElement = messageRefs.current[messageId];
      if (messageElement) {
        messageElement.scrollIntoView({
          behavior: autoBehavior === true ? 'auto' : 'smooth',
          block: "center",
        });
      }
    }, 1);
  }, []);

  const getConversations = useCallback(async (loadMore?: boolean) => {
    setLoading(true);
    setError(null);

    try {
        /* get the latest message time of oldest conversation if existed to load more */
        let lastMessageDate
        if(loadMore !== false && conversationsRef.current.length > 0) {
            const oldestMessages = conversationsRef.current[0].messages
            lastMessageDate = oldestMessages[oldestMessages.length - 1].createdDate
        }

        const response = await conversationApi.getConversations(15, lastMessageDate);
      if (response.status === 0) {
        setConversations(response.conversations);
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.log(error);
      setError("There is something wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleConversationClick = (id: string) => {
    const selectedConversation = conversations.find((conv) => conv.id === id);
    if (!selectedConversation) return;
    setCurrentConversation(selectedConversation);

    const messages = selectedConversation.messages;
    if (messages.length > 0) {
      const lastMessageId = messages[messages.length - 1].id;
      scrollToMessage(lastMessageId, true);
    }
  };

  /* handle new message from socket */
  const receiveNewMessage = useCallback((newMessage: MessageModel) => {
    const index = conversationsRef.current.findIndex(
      conv => conv.id === newMessage.conversation?.id
    );
    
    if (index !== -1) {
      const newConversations = [...conversationsRef.current];
      newConversations[index] = new ConversationModel(
        newConversations[index].id,
        newConversations[index].conversationName,
        newConversations[index].conversationType,
        newConversations[index].image,
        newConversations[index].createdDate,
        newConversations[index].members,
        [...newConversations[index].messages, newMessage],
      );
      setConversations(newConversations);

      /* If the new message belongs to the current conversation, scroll to it */
    if (currentConversationRef.current && currentConversationRef.current.id === newMessage.conversation?.id) {
      setCurrentConversation(newConversations[index])
      scrollToMessage(newMessage.id, false)
    }
    }
  }, [scrollToMessage]);

  return {
    loading,
    error,
    conversations,
    getConversations,
    user,
    setUser,
    currentConversation,
    handleConversationClick,
    messageRefs,
    scrollToMessage,
    receiveNewMessage,
  };
};
