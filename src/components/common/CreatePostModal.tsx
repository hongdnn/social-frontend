"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { Carousel, MediaFile } from "./Carousel";
import { useCreatePost } from "@/src/app/(home)/hooks/use-create-post";
import { debounce } from "lodash";
import { UserModel } from "@/src/models/user";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserModel | null; 
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [media, setMedia] = useState<MediaFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleCreatePost, loading } = useCreatePost(user);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selectedFiles]);

    /* Create preview URLs for both images and videos */
    const newMedia = selectedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("image/")
        ? "image"
        : ("video" as "image" | "video"),
    }));
    setMedia((prev) => [...prev, ...newMedia]);
  };

  const handleRemoveMedia = (index: number) => {
    URL.revokeObjectURL(media[index].url);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = debounce(async () => {
    await handleCreatePost(content, files);
    /* Clear form */
    cleanup(); 
  }, 500);

  /* Cleanup preview URLs on unmount */
  const cleanup = () => {
    media.forEach((m) => URL.revokeObjectURL(m.url));
    setContent("");
    setFiles([]);
    setMedia([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
      <div className="w-full max-w-[32rem] rounded border-[1px] border-gray-500 p-8 shadow-xl bg-background">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded bg-black/50">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        )}
        <div className="mb-4 flex items-center">
          <h2 className="flex-grow text-center text-xl font-semibold">
            Create Post
          </h2>
          <button
            onClick={() => {
              if (!loading) {
                cleanup();
                onClose();
              }
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <textarea
          className="mb-1 h-20 w-full resize-none bg-background  rounded p-2 focus:border-primary focus:outline-none"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {media.length > 0 ? (
          <div className="mb-4 aspect-square w-full overflow-hidden rounded border border-gray-500">
            <Carousel media={media} onRemove={handleRemoveMedia} />
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="mb-4 flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded border border-gray-500 hover:bg-gray-900"
          >
            <Image
              src="/add-image.svg"
              width={40}
              height={40}
              alt="add media"
              className=""
            />
            <p>Add images and videos</p>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*,video/*"
          multiple
          className="hidden"
        />

        <button
          onClick={handleSubmit}
          disabled={(!content.trim() && files.length === 0) || loading}
          className="hover:bg-primary/90 w-full rounded bg-primary px-4 py-2 text-white disabled:opacity-50"
        >
          Post
        </button>
      </div>
    </div>
  );
};
