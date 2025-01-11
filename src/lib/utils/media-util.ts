export interface MediaMetadata {
  width: number;
  height: number;
  duration?: number; 
  frameRate?: number; 
}

/**
 * Get dimensions of an image file
 * @param file Image file to process
 * @returns Promise resolving to MediaMetadata
 */
export const getImageDimensions = async (file: File): Promise<MediaMetadata> => {
  if (!file.type.startsWith("image/")) {
    throw new Error("File is not an image");
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Get metadata of a video file
 * @param file Video file to process
 * @returns Promise resolving to MediaMetadata
 */
export const getVideoMetadata = async (file: File): Promise<MediaMetadata> => {
  if (!file.type.startsWith("video/")) {
    throw new Error("File is not a video");
  }

  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      // Using getVideoPlaybackQuality for frame rate if available
      const frameRate = video.getVideoPlaybackQuality 
        ? video.getVideoPlaybackQuality().totalVideoFrames / video.duration
        : 0;

      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: Math.round(video.duration),
        frameRate: Math.round(frameRate)
      });
    };

    video.onerror = () => {
      reject(new Error('Failed to load video metadata'));
    };

    video.src = URL.createObjectURL(file);
  });
};
