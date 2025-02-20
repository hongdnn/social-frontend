import { CommentDTO, CommentModel } from "@/src/models/comment";
import { ApiListResponse, ApiResponse, postServiceInstance } from "./axios";


interface CreateCommentResponse {
    status: number;
    message: string;
    comment?: CommentModel;
    error?: string;
}

interface FetchCommentsResponse {
    status: number;
    message: string;
    comments: CommentModel[];
    error?: string;
}

export const commentApi = {
    createComment: async (post_id: string, content: string, replied_comment_id?: string): Promise<CreateCommentResponse> => {
        try {
            const response = await postServiceInstance.post<ApiResponse<CommentDTO>>("/comments", {
                post_id,
                content,
                replied_comment_id
            });
            return {
                status: response.data.status,
                message: response.data.message,
                comment: response.data.data ? CommentModel.fromDTO(response.data.data) : undefined
            }
        } catch (error) {
            return {
                status: 1,
                message: "There's something wrong",
                error: `${error}`,
            };
        }
    },

    fetchComments: async (post_id: string, size: number, page: number): Promise<FetchCommentsResponse> => {
        try {
            const response = await postServiceInstance.get<ApiListResponse<CommentDTO>>(`/comments/post/${post_id}`, {
                params: { size, page },
              });
            return {
                status: response.data.status,
                message: response.data.message,
                comments: response.data.data.map((commentDTO) => CommentModel.fromDTO(commentDTO))
            }
        } catch (error) {
            return {
                status: 1,
                message: "There's something wrong",
                comments: [],
                error: `${error}`,
            };
        }
    }
}