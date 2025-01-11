import { MediaDTO, MediaModel } from "./media";

export interface PostDTO {
    id?: string;
    content: string;
    user_id?: string;
    location?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    created_date?: Date | null; 
    updated_date?: Date | null; 
    medias?: MediaDTO[]
  }
  
  export class PostModel {
    id: string;
    content: string;
    userId: string;
    location?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    createdDate?: Date | null; 
    updatedDate?: Date | null; 
    medias: MediaModel[];
  
    constructor(
      id: string,
      content: string,
      userId: string,
      location?: string | null,
      latitude?: number | null,
      longitude?: number | null,
      createdDate?: Date | null,
      updatedDate?: Date | null,
      medias?: MediaModel[],
    ) {
      this.id = id;
      this.content = content;
      this.userId = userId;
      this.location = location;
      this.latitude = latitude;
      this.longitude = longitude;
      this.createdDate = createdDate;
      this.updatedDate = updatedDate;
      this.medias = medias ?? [];
    }
  
    static fromDTO(dto: PostDTO): PostModel {
        return new PostModel(
          dto.id ?? '',
          dto.content,
          dto.user_id ?? '',
          dto.location,
          dto.latitude,
          dto.longitude,
          dto.created_date, 
          dto.updated_date,
          (dto.medias ?? []).map((mediaDTO) => MediaModel.fromDTO(mediaDTO)),
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