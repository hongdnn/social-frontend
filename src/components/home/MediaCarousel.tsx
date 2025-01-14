import { MediaModel } from "@/src/models/media";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MEDIA_BASE_URL } from "@/src/lib/utils/media-util";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const MediaCarousel = ({ medias }: { medias: MediaModel[] }) => {
  const defaultImage = "/no-image.svg";
  const [mediaSources, setMediaSources] = useState<string[]>(
    medias.map(media => `${MEDIA_BASE_URL}/${media.mediaUrl}`)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleImageError = (index: number) => {
    setMediaSources(prev => {
      const newSources = [...prev];
      newSources[index] = defaultImage;
      return newSources;
    });
  };

  useEffect(() => {
    // Reset media sources when medias prop changes
    setMediaSources(medias.map(media => `${MEDIA_BASE_URL}/${media.mediaUrl}`));
  }, [medias]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? medias.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === medias.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative pb-[100%]">
      <div className="absolute inset-0">
        {medias[currentIndex].mediaType === 0 ? (
          <Image
            src={mediaSources[currentIndex]}
            alt={`Media ${currentIndex + 1}`}
            fill
            sizes="100vw"
            priority
            className="object-cover bg-gray-500"
            onError={() => handleImageError(currentIndex)}
          />
        ) : (
          <video
            ref={videoRef}
            src={mediaSources[currentIndex]}
            className="h-full w-full object-cover"
            controls
            onError={() => handleImageError(currentIndex)}
          />
        )}

        {medias.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {medias.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 w-2 rounded-full ${
                    index === currentIndex ? "bg-blue-500" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
