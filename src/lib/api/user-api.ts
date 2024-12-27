import { chatServiceInstance } from "@/src/lib/api/axios";
import { mapFromDTO, UserModel } from "@/src/models/user";

interface LoginResponse {
  status: number;
  message: string;
  token: string | null;
  user: UserModel | null;
}

export const userApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await chatServiceInstance.post("/users/login", {
        email,
        password,
      });
      return {
        status: response.data.status,
        message: response.data.message,
        token: response.data.token,
        user: mapFromDTO(response.data.user),
      };
    } catch (error) {
      console.log(error);
      return {
        status: 1,
        message: "There's something wrong",
        token: null,
        user: null,
      };
    }
  },
};
