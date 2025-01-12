import { ApiResponse, chatServiceInstance } from "@/src/lib/api/axios";
import { UserDTO, UserModel } from "@/src/models/user";

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

interface SearchUsersResponse {
  status: number;
  message: string;
  data: UserModel[];
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

  searchUsers: async (keyword: string): Promise<SearchUsersResponse> => {
    try {
      const response = await chatServiceInstance.get<ApiResponse<UserDTO[]>>("/users", {
        params: { keyword },
      });
      
      return {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data.map(userDTO => UserModel.fromDTO(userDTO))
      }
    } catch (error) {
      console.log(error)
      return {
        status: 1,
        message: "There's something wrong",
        data: []
      };
    }
  }

};
