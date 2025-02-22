import { PostModel } from "@/src/models/post";
import { format } from "date-fns";
import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { MediaCarousel } from "./MediaCarousel";
import { debounce } from "lodash";

export const Post = ({
  post,
  onReact,
  onComment,
}: {
  post: PostModel;
  onReact: () => void;
  onComment: () => void;
}) => {
  const defaultAvatar = "/default_avatar.svg";
  const [imgSrc, setImgSrc] = useState<string>(
    post.user?.image || defaultAvatar,
  );
  const [isReacted, setIsReacted] = useState(post.isReacted);
  const [reactionCount, setReactionCount] = useState<number>(
    post.reactionCount,
  );
  const handleImageError = () => {
    setImgSrc(defaultAvatar);
  };

  const handleReaction = debounce(() => {
    if (isReacted) {
      setReactionCount((prev) => Math.max(0, prev - 1));
    } else {
      setReactionCount((prev) => prev + 1);
    }
    setIsReacted(!isReacted);
    onReact();
  }, 200);

  const handleComment = debounce(() => {
    onComment();
  }, 200);

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
              <div className="flex items-center">
                <span className="font-medium">
                  {post.user?.firstName} {post.user?.lastName}
                </span>
                <span className="mx-2 text-xs uppercase text-gray-500">•</span>
                <span className="text-xs uppercase text-gray-500">
                  {post.createdDate && format(post.createdDate, "MMM d, yyyy")}
                </span>
              </div>

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
              <Heart
                className={`h-6 w-6 cursor-pointer ${isReacted ? "fill-current text-red-500" : null}`}
                onClick={handleReaction}
              />
            </div>
            <div>
              <MessageCircle
                className="h-6 w-6 cursor-pointer"
                onClick={handleComment}
              />
            </div>
          </div>
        </div>

        <div className="font-semibold">
          <span>
            {reactionCount} {reactionCount <= 1 ? "like" : "likes"}
          </span>
        </div>

        {/* Content */}
        <div>
          <span className="mr-2 font-semibold">
            {post.user?.firstName} {post.user?.lastName}
          </span>
          <span className="inline whitespace-pre-wrap">{post.content}</span>
        </div>

        {/* Number of comments */}
        {post.commentCount > 0 && (
          <p
          className="cursor-pointer text-sm text-gray-500 mt-2"
          onClick={handleComment}
        >
          View all {post.commentCount} comments
        </p>
        )}
        
      </div>
    </div>
  );
};
