import { PostModel } from "@/src/models/post";
import { format } from "date-fns";
import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { MediaCarousel } from "./MediaCarousel";

export const Post = ({ post }: { post: PostModel }) => {
  const defaultAvatar = "/default_avatar.svg";
  const [imgSrc, setImgSrc] = useState<string>(
    post.user?.image || defaultAvatar,
  );
  const handleImageError = () => {
    setImgSrc(defaultAvatar);
  };

  return (
    <div className="mb-6 rounded-lg border border-gray-700 bg-background">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex flex-col">
          <div className="flex items-center space-x-3">
            <Image
              src={imgSrc}
              width={40}
              height={40}
              alt={"avatar"}
              className="h-[40px] w-[40px] rounded-full bg-gray-300"
              onError={handleImageError}
            />
            <div className="flex flex-col">
              <span className="font-medium">
                {post.user?.firstName} {post.user?.lastName}
              </span>
              {post.location && (
                <span className="text-sm text-gray-500">{post.location}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Post Media */}
      {post.medias.length > 0 && <MediaCarousel medias={post.medias} />}

      {/* Post Actions */}
      <div className="p-4">
        <div className="mb-4 flex justify-between">
          <div className="flex space-x-4">
            <div>
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <MessageCircle className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-2">
          <span className="mr-2 font-semibold">
            {post.user?.firstName} {post.user?.lastName}
          </span>
          <span className="inline whitespace-pre-wrap">{post.content}</span>
        </div>

        {/* Timestamp */}
        <div className="text-xs uppercase text-gray-500">
          {post.createdDate && format(post.createdDate, "MMM d, yyyy")}
        </div>
      </div>
    </div>
  );
};
