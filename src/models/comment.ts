import { UserDTO, UserModel } from "./user";
import { immerable } from "immer";

export interface CommentDTO {
    id: string;
    user_id: string;
    post_id: string;
    content: string;
    created_date: Date;
    updated_date?: Date;
    replied_comment_id?: string;
    user?: UserDTO;
}

export class CommentModel {
    [immerable] = true;

    id: string;
    userId: string;
    postId: string;
    content: string;
    createdDate: Date;
    updatedDate?: Date;
    repliedCommentId?: string;
    user?: UserModel;

    constructor(
        id: string,
        userId: string,
        postId: string,
        content: string,
        createdDate: Date,
        updatedDate?: Date,
        repliedCommentId?: string,
        user?: UserModel
    ) {
        this.id = id;
        this.userId = userId;
        this.postId = postId;
        this.content = content;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.repliedCommentId = repliedCommentId;
        this.user = user;
    }

    static fromDTO(dto: CommentDTO): CommentModel {
        return new CommentModel(
            dto.id,
            dto.user_id,
            dto.post_id,
            dto.content,
            dto.created_date,
            dto.updated_date ?? undefined,
            dto.replied_comment_id,
            dto.user ? UserModel.fromDTO(dto.user) : undefined
        );
    }

    mapToDTO(): CommentDTO {
        return {
            id: this.id,
            user_id: this.userId,
            post_id: this.postId,
            content: this.content,
            created_date: this.createdDate,
            updated_date: this.updatedDate,
            replied_comment_id: this.repliedCommentId,
        };
    }
}