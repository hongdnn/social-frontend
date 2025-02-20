import { CommentDTO, CommentModel } from "./comment";
import { MediaDTO, MediaModel } from "./media";
import { UserDTO, UserModel } from "./user";
import { immerable } from "immer";


export interface PostDTO {
    id?: string;
    content: string;
    user_id?: string;
    location?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    created_date?: Date | null; 
    updated_date?: Date | null; 
    medias?: MediaDTO[];
    user?: UserDTO;
    reaction_count?: number;
    is_reacted?: boolean;
    comments?: CommentDTO[];
  }
  
  export class PostModel {
    [immerable] = true;
    
    id: string;
    content: string;
    userId: string;
    location?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    createdDate?: Date | null; 
    updatedDate?: Date | null; 
    medias: MediaModel[];
    user?: UserModel;
    reactionCount: number;
    isReacted: boolean;
    comments: CommentModel[];
  
    constructor(
      id: string,
      content: string,
      userId: string,
      comments: CommentModel[],
      location?: string | null,
      latitude?: number | null,
      longitude?: number | null,
      createdDate?: Date | null,
      updatedDate?: Date | null,
      medias?: MediaModel[],
      user?: UserModel,
      reaction_count?: number,
      is_reacted?: boolean,
    ) {
      this.id = id;
      this.content = content;
      this.userId = userId;
      this.comments = comments;
      this.location = location;
      this.latitude = latitude;
      this.longitude = longitude;
      this.createdDate = new Date(createdDate ?? '');
      this.updatedDate = updatedDate;
      this.medias = medias ?? [];
      this.user = user;
      this.reactionCount = reaction_count ?? 0;
      this.isReacted = is_reacted ?? false;
    }
  
    static fromDTO(dto: PostDTO): PostModel {
        return new PostModel(
          dto.id ?? '',
          dto.content,
          dto.user_id ?? '',
          (dto.comments ?? []).map((commentDTO) => CommentModel.fromDTO(commentDTO)),
          dto.location,
          dto.latitude,
          dto.longitude,
          dto.created_date, 
          dto.updated_date,
          (dto.medias ?? []).map((mediaDTO) => MediaModel.fromDTO(mediaDTO)),
          dto.user ? UserModel.fromDTO(dto.user) : undefined,
          dto.reaction_count,
          dto.is_reacted,
        );
      }
    
      mapToDTO(): PostDTO {
        return {
          id: this.id,
          content: this.content,
          user_id: this.userId,
          location: this.location,
          latitude: this.latitude,
          longitude: this.longitude,
          created_date: this.createdDate,
          updated_date: this.updatedDate,
          medias: this.medias.map((mediaModel) => mediaModel.mapToDTO()), 
        };
      }
    }