import { ConversationDTO, ConversationModel } from "@/src/models/conversation";
import { ApiResponse, chatServiceInstance } from "./axios";

interface GetConversationsResponse {
  status: number;
  message: string;
  conversations: ConversationModel[];
}


export const conversationApi = {
  getConversations: async (
    size: number,
    date?: Date,
  ): Promise<GetConversationsResponse> => {
    try {
      const response = await chatServiceInstance.get<ApiResponse<ConversationDTO[]>>("/conversations", {
        params: { size, date },
      });
      
      return {
        status: response.data.status,
        message: response.data.message,
        conversations: response.data.data.map(conversationDTO => ConversationModel.fromDTO(conversationDTO))
      }
    } catch (error) {
      console.log(error);
      return {
        status: 1,
        message: "There's something wrong",
        conversations: [],
      };
    }
  },
};
