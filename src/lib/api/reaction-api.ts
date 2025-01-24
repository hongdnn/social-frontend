import axios, { AxiosError } from "axios";
import { ErrorResponse, postServiceInstance } from "./axios";

export interface ReactResponse {
  status: number;
  message: string;
  error?: string;
}

export const reactionApi = {
  react: async (post_id: string): Promise<ReactResponse> => {
    try {
      const response = await postServiceInstance.post("/reactions", {
        post_id,
      });
      return {
        status: response.data.status,
        message: response.data.message,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response && axiosError.response.data) {
          return {
            status: axiosError.response.data.status,
            error: axiosError.response.data.error,
            message: axiosError.response.data.message,
          };
        }
      }
      return {
        status: 1,
        message: "There's something wrong",
        error: `${error}`,
      };
    }
  },
};
