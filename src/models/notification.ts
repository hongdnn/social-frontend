import { UserDTO, UserModel } from './user';

export const NotificationType = {
    REACTION: 0,
    COMMENT: 1,
    REPLY_COMMENT: 2,
    FOLLOW: 3
}

export interface NotificationDTO {
    _id?: string;
    type: number;
    created_date?: Date | null;
    creator?: UserDTO;
    post_id?: string;
    target_id: string;
    is_read: boolean;
}

export class NotificationModel {
    id: string;
    type: number;
    createdDate: Date | null;
    creator: UserModel | null;
    postId?: string;
    targetId: string;
    isRead: boolean;

    constructor(
        id: string,
        type: number,
        createdDate: Date | null,
        targetId: string,
        isRead: boolean,
        creator?: UserDTO,
        postId?: string
    ) {
        this.id = id;
        this.type = type;
        this.createdDate = createdDate;
        this.creator = creator ? UserModel.fromDTO(creator): null;
        this.postId = postId;
        this.targetId = targetId;
        this.isRead = isRead;
    }

    static fromDTO(dto: NotificationDTO): NotificationModel {
        return new NotificationModel(
            dto._id ?? '',
            dto.type,
            dto.created_date ?? null,
            dto.target_id,
            dto.is_read,
            dto.creator,
            dto.post_id
        );
    }
}
