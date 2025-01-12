import { conversationApi } from "@/src/lib/api/conversation-api";
import { messageApi } from "@/src/lib/api/message-api";
import { ConversationModel } from "@/src/models/conversation";
import { MessageModel } from "@/src/models/message";
import { UserModel } from "@/src/models/user";
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
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  useEffect(() => {
    currentConversationRef.current = currentConversation;
  }, [currentConversation]);

  /* scroll to a specific message, such as latest message in the bottom */
  const scrollToMessage = useCallback(
    (messageId: string, autoBehavior?: boolean) => {
      setTimeout(() => {
        const messageElement = messageRefs.current[messageId];
        if (messageElement) {
          messageElement.scrollIntoView({
            behavior: autoBehavior === true ? "auto" : "smooth",
            block: "center",
          });
        }
      }, 1);
    },
    [],
  );

  /* fetch list of conversations in the chat page */
  const getConversations = useCallback(async (loadMore?: boolean) => {
    setLoading(true);
    setError(null);

    try {
      /* get the latest message time of oldest conversation if existed to load more */
      let lastMessageDate;
      if (loadMore !== false && conversationsRef.current.length > 0) {
        const oldestMessages = conversationsRef.current[0].messages;
        lastMessageDate = oldestMessages[oldestMessages.length - 1].createdDate;
      }

      const response = await conversationApi.getConversations(
        15,
        lastMessageDate,
      );
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

  /* load more messages in the current conversation(in chat room) */
  const loadMoreMessages = useCallback(async () => {
    try {
      /* get the oldest message create time if existed to load more */
      if (
        currentConversationRef.current &&
        currentConversationRef.current.messages.length > 0
      ) {
        const response = await messageApi.getMessages(
          currentConversationRef.current.id,
          15,
          currentConversationRef.current.messages[0].createdDate,
        );
        if (response.status === 0) {
          const updatedCurrentConversation = new ConversationModel(
            currentConversationRef.current.id,
            currentConversationRef.current.conversationName,
            currentConversationRef.current.conversationType,
            currentConversationRef.current.image,
            currentConversationRef.current.createdDate,
            currentConversationRef.current.members,
            [...response.messages, ...currentConversationRef.current.messages],
          );
          setCurrentConversation(updatedCurrentConversation);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  /* handle selecting a conversation to show in chat room */
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
  const receiveNewMessage = useCallback(
    async (newMessage: MessageModel) => {
      const index = conversationsRef.current.findIndex(
        (conv) => conv.id === newMessage.conversation?.id,
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
        if (
          currentConversationRef.current &&
          currentConversationRef.current.id === newMessage.conversation?.id
        ) {
          setCurrentConversation(newConversations[index]);
          scrollToMessage(newMessage.id, false);
        }
      } else {
        try {
          const response = await conversationApi.fetchConversation(newMessage.conversation?.id ?? '')
          if(response.status === 0) {
            const newConversations = [response.conversation!,...conversationsRef.current];
            setConversations(newConversations);
  
            /* If the new message belongs to the current conversation, scroll to it */
            if (
              currentConversationRef.current &&
              currentConversationRef.current.id === newMessage.conversation?.id
            ) {
              setCurrentConversation(response.conversation!);
              scrollToMessage(newMessage.id, false);
            }
          }
        } catch (error) {
          console.log(error)
        }
      }
    },
    [scrollToMessage],
  );

  /* when create a new conversation */
  const fetchNewConversation = useCallback(async (userIds: string[]) => {
    setError(null);
    try {
      const response =
        await conversationApi.fetchConversationByUserIds(userIds);
      if (response.status === 0) {
        setCurrentConversation(response.conversation);
      }
    } catch (error) {
      setError(`${error}`);
    }
  }, []);

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
    loadMoreMessages,
    isNewMessageModalOpen,
    setIsNewMessageModalOpen,
    fetchConversation: fetchNewConversation,
  };
};
