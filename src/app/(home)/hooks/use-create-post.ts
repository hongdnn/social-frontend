import { postApi } from "@/src/lib/api/post-api";
import { getImageDimensions, getVideoMetadata } from "@/src/lib/utils/media-util";
import { MediaDTO } from "@/src/models/media";
import { PostDTO } from "@/src/models/post";
import { useState } from "react";

export const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreatePost = async (content: string, files: File[]) => {
    setLoading(true);
    setError(null);
    try {
      let medias: MediaDTO[] = [];
      if (files.length > 0) {
        const request = files.map(file => ({ file_name: file.name, type: file.type }));
        const presignedResponse = await postApi.generatePresignUrls(request);
        if (presignedResponse.status !== 0 || presignedResponse.data?.length !== files.length) {
          setError("Failed to upload images/videos");
          return;
        }

        const uploadResult = await postApi.uploadFiles(
          files,
          presignedResponse.data ?? [],
        );
        if (!uploadResult.success) {
          console.log(uploadResult.error)
          setError("Failed to upload images/videos");
          return;
        }

        medias = await Promise.all(
          files.map(async (file, index) => {
            const metadata = file.type.startsWith("image/")
              ? await getImageDimensions(file)
              : await getVideoMetadata(file);

            return {
              media_type: file.type.startsWith("image/") ? 0 : 1,
              media_url: presignedResponse.data?.[index].key ?? '',
              file_size: file.size,
              file_name: file.name,
              mime_type: file.type,
              width: metadata.width,
              height: metadata.height,
              video_duration: metadata.duration,
              video_frame_rate: metadata.frameRate,
            };
          }),
        );
      }
      const postDTO: PostDTO = {
        content,
        medias: medias.length > 0 ? medias : undefined
      }
      const response = await postApi.createPost(postDTO)
      if(response.status === 0) {
        console.log("Create post success")
      }
    } catch (error) {
      console.log(error);
      setError("Something wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleCreatePost,
  };
};
