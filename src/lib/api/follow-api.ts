import { chatServiceInstance } from "./axios";

interface FollowUpdateResponse {
    status: number;
    message: string;
  }

export const followApi = {
    updateFollow: async (user_id: string): Promise<FollowUpdateResponse> => {
      try {
        const response = await chatServiceInstance.post("/follows", {
            user_id
        });
        return {
          status: response.data.status,
          message: response.data.message,
        };
      } catch (error) {
        console.log(error);
        return {
          status: 1,
          message: "There's something wrong",
        };
      }
    },
}