import { NotificationDTO, NotificationModel } from "@/src/models/notification";
import { ApiListResponse, chatServiceInstance } from "./axios";

export const notificationApi = {
    getNotifications: async (
      size: number,
      page: number,
    ): Promise<ApiListResponse<NotificationModel>> => {
      try {
        const response = await chatServiceInstance.get<
        ApiListResponse<NotificationDTO>
        >("/notifications", {
          params: { size, page },
        });
  
        return {
          status: response.data.status,
          message: response.data.message,
          data: response.data.data.map((notificationDTO) =>
            NotificationModel.fromDTO(notificationDTO),
          ),
        };
      } catch (error) {
        console.log(error);
        return {
          status: 1,
          message: "There's something wrong",
          data: [],
        };
      }
    },

    readNotification: async (notificationId: string): Promise<boolean> => {
      try {
        const response = await chatServiceInstance.put(`/notifications/${notificationId}`);
        return response.data.status === 0;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
}