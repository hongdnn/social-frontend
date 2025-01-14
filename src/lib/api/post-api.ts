import { ApiResponse, ErrorResponse, postServiceInstance } from "@/src/lib/api/axios";
import { PostDTO, PostModel } from "@/src/models/post";
import axios, { AxiosError } from "axios";

interface PresignUrlRequest {
    file_name: string;
    type: string;
}

interface PresignedUrl {
  key: string;
  url: string;
}

interface PresignUrlResponse {
  status: number;
  message: string;
  data: PresignedUrl[] | null;
}

interface FileUploadResult {
    success: boolean;
    error?: string;
}

interface CreatePostResponse {
    status: number;
    message: string;
    data?: PostModel;
    error?: string;
}

interface FetchPostsResponse {
  status: number;
  message: string;
  data: PostModel[];
  error?: string;
}

export const postApi = {
  /* create aws s3 presign url for each media file */
  generatePresignUrls: async (
    presignUrlRequest: PresignUrlRequest[],
  ): Promise<PresignUrlResponse> => {
    try {
      const request = { files: presignUrlRequest };
      const response = await postServiceInstance.post(
        "/posts/presign",
        request,
      );
      return {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 1,
        message: "There's something wrong",
        data: null,
      };
    }
  },

  /* upload media files to s3 */
  uploadFiles: async (
    files: File[],
    presignedUrls: PresignedUrl[],
  ): Promise<FileUploadResult> => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = presignedUrls[i].url;
      try {
        await axios.put(url, file, {
          headers: {
            "Content-Type": file.type,
          },
        });
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        return {
          success: false,
          error: "Error when upload image/video. Please try again.",
        };
      }
    }
    return { success: true };
  },

  createPost: async (post: PostDTO): Promise<CreatePostResponse> => {
    try {
      const response = await postServiceInstance.post("/posts", post);
      return {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data,
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

  fetchPosts: async (size: number, date?: Date): Promise<FetchPostsResponse> => {
    try {
      const isoDate = date?.toISOString();
      const response = await postServiceInstance.get<ApiResponse<PostDTO[]>>("/posts", {
        params: { size, date: isoDate },
      });
      
      return {
        status: response.data.status,
        message: response.data.message,
        data: response.data.data.map(postDto => PostModel.fromDTO(postDto)),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response && axiosError.response.data) {
          return {
            status: axiosError.response.data.status,
            error: axiosError.response.data.error,
            message: axiosError.response.data.message,
            data: []
          };
        }
      }
      return {
        status: 1,
        message: "There's something wrong",
        error: `${error}`,
        data: []
      };
    }
  },
};
