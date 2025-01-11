"use client";

import Image from "next/image";
import { useState, useRef } from "react";

export interface MediaFile {
  url: string;
  type: "image" | "video";
}

interface CarouselProps {
  media: MediaFile[];
  onRemove?: (index: number) => void;
}

export const Carousel: React.FC<CarouselProps> = ({ media, onRemove }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative h-full w-full">

      {media[currentIndex].type === "image" ? (
        <Image
          src={media[currentIndex].url}
          alt="preview"
          fill
          className="object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          src={media[currentIndex].url}
          className="h-full w-full object-cover"
          controls
        />
      )}

      {media.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
          >
            ←
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
          >
            →
          </button>
        </>
      )}

      {onRemove && (
        <button
          onClick={() => {
            if(currentIndex === media.length - 1 && media.length > 1) {
              setCurrentIndex(currentIndex - 1);
            }
            onRemove(currentIndex);
          }}
          className="absolute right-2 top-2 flex size-9 items-center justify-center rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
        >
          ✕
        </button>
      )}

      {media.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {media.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full ${
                index === currentIndex ? "bg-primary" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
