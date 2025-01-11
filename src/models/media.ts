export interface MediaDTO {
    id?: string;
    post_id?: string;
    media_type: number;
    media_url: string;
    file_size: number;
    file_name?: string | null; 
    mime_type: string;
    created_date?: Date | null; 
    width: number;
    height: number;
    video_duration?: number | null; 
    video_frame_rate?: number | null;
  }
  
  export class MediaModel {
    id: string;
    postId: string;
    mediaType: number;
    mediaUrl: string;
    fileSize: number;
    fileName?: string | null; 
    mimeType: string;
    createdDate: Date | null;
    width: number;
    height: number;
    videoDuration?: number | null;
    videoFrameRate?: number | null; 
  
    constructor(
      id: string,
      postId: string,
      mediaType: number,
      mediaUrl: string,
      fileSize: number,
      fileName: string | null,
      mimeType: string,
      createdDate: Date | null,
      width: number,
      height: number,
      videoDuration?: number | null,
      videoFrameRate?: number | null
    ) {
      this.id = id;
      this.postId = postId;
      this.mediaType = mediaType;
      this.mediaUrl = mediaUrl;
      this.fileSize = fileSize;
      this.fileName = fileName;
      this.mimeType = mimeType;
      this.createdDate = createdDate;
      this.width = width;
      this.height = height;
      this.videoDuration = videoDuration;
      this.videoFrameRate = videoFrameRate;
    }
  
    static fromDTO(dto: MediaDTO): MediaModel {
      return new MediaModel(
        dto.id ?? '',
        dto.post_id ?? '',
        dto.media_type,
        dto.media_url,
        dto.file_size,
        dto.file_name ?? null,
        dto.mime_type,
        dto.created_date ?? null, 
        dto.width,
        dto.height,
        dto.video_duration ?? null,
        dto.video_frame_rate ?? null
      );
    }
  
    mapToDTO(): MediaDTO {
      return {
        id: this.id,
        post_id: this.postId,
        media_type: this.mediaType,
        media_url: this.mediaUrl,
        file_size: this.fileSize,
        file_name: this.fileName || null,
        mime_type: this.mimeType,
        created_date: this.createdDate,
        width: this.width,
        height: this.height,
        video_duration: this.videoDuration || null, 
        video_frame_rate: this.videoFrameRate || null, 
      };
    }
  }
  