import { ApiResponse, chatServiceInstance } from "./axios";
import { MessageDTO, MessageModel } from "@/src/models/message";

interface GetMessagesResponse {
  status: number;
  message: string;
  messages: MessageModel[];
}


export const messageApi = {

  /* load more messages */
  getMessages: async (
    conversation_id: string,
    size: number,
    date?: Date,
  ): Promise<GetMessagesResponse> => {
    try {
      const response = await chatServiceInstance.get<ApiResponse<MessageDTO[]>>("/messages", {
        params: { conversation_id, size, date },
      });
      
      return {
        status: response.data.status,
        message: response.data.message,
        messages: response.data.data.map(MessageModel.fromDTO)
      }
    } catch (error) {
      console.log(error);
      return {
        status: 1,
        message: "There's something wrong",
        messages: [],
      };
    }
  },
};
