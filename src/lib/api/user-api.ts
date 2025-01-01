import { chatServiceInstance } from "@/src/lib/api/axios";
import { UserModel } from "@/src/models/user";

interface LoginResponse {
  status: number;
  message: string;
  token: string | null;
  user: UserModel | null;
}

interface SignUpResponse {
  status: number;
  message: string;
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
        user: UserModel.fromDTO(response.data.user),
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

  register: async (first_name: string, last_name: string, email: string, password: string, phone?: string): Promise<SignUpResponse> => {
    try {
      console.log({first_name, last_name, email, phone, password})
      const response = await chatServiceInstance.post("/users/register", {
        first_name, last_name, email, phone, password
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
};
