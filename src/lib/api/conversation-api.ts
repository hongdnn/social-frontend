import { ConversationDTO, ConversationModel } from "@/src/models/conversation";
import { ApiResponse, chatServiceInstance } from "./axios";

interface GetConversationsResponse {
  status: number;
  message: string;
  conversations: ConversationModel[];
}

interface FetchConversationResponse {
  status: number;
  message: string;
  conversation: ConversationModel | null;
}

export const conversationApi = {
  getConversations: async (
    size: number,
    date?: Date,
  ): Promise<GetConversationsResponse> => {
    try {
      const response = await chatServiceInstance.get<
        ApiResponse<ConversationDTO[]>
      >("/conversations", {
        params: { size, date },
      });

      return {
        status: response.data.status,
        message: response.data.message,
        conversations: response.data.data.map((conversationDTO) =>
          ConversationModel.fromDTO(conversationDTO),
        ),
      };
    } catch (error) {
      console.log(error);
      return {
        status: 1,
        message: "There's something wrong",
        conversations: [],
      };
    }
  },

  /* fetch 1 conversation by userIds (create new if need) */
  fetchConversationByUserIds: async (
    user_ids: string[],
  ): Promise<FetchConversationResponse> => {
    try {
      const response = await chatServiceInstance.post<
        ApiResponse<ConversationDTO>
      >("/conversations", { user_ids });

      return {
        status: response.data.status,
        message: response.data.message,
        conversation: ConversationModel.fromDTO(response.data.data),
      };
    } catch (error) {
      console.log(error);
      return {
        status: 1,
        message: "There's something wrong",
        conversation: null,
      };
    }
  },

  /* fetch an existed conversation by its id */
  fetchConversation: async (
    conversation_id: string,
  ): Promise<FetchConversationResponse> => {
    try {
      const response = await chatServiceInstance.get<
        ApiResponse<ConversationDTO>
      >(`/conversations/${conversation_id}`);

      return {
        status: response.data.status,
        message: response.data.message,
        conversation: ConversationModel.fromDTO(response.data.data),
      };
    } catch (error) {
      console.log(error);
      return {
        status: 1,
        message: "There's something wrong",
        conversation: null,
      };
    }
  },
};
