import React, { useEffect } from "react";
import Image from "next/image";
import { MediaCarousel } from "./MediaCarousel";
import { format } from "date-fns";
import { Heart, MessageCircle, Send } from "lucide-react";
import { debounce } from "lodash";
import { parseUserFromJson } from "@/src/models/user";
import { usePostDetail } from "@/src/app/(home)/hooks/use-post-detail";

interface PostDetailModalProps {
  onClose: () => void;
  postId: string;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({
  onClose,
  postId
}) => {
  const {
    loading,
    error,
    reactPost,
    currentPost,
    createComment,
    comment,
    isCommenting,
    setComment,
    isReacted,
    reactionCount,
    setCurrentUser,
    getPostDetail,
  } = usePostDetail();
  const defaultAvatar = "/default_avatar.svg";
  

  useEffect(() => {
    getPostDetail(postId);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(parseUserFromJson(storedUser));
    }
  }, [getPostDetail, postId, setCurrentUser]);

  const handleReaction = debounce(() => {
    reactPost(postId);
  }, 200);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      createComment(postId, comment)
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`grid h-[90vh] max-w-6xl ${currentPost?.medias?.length ? "w-full grid-cols-[1fr,400px]" : "w-[500px] grid-cols-1"}  rounded border-[1px] border-gray-500 bg-background shadow-xl`}>
        {loading ? (
          /* // Loading indicator centered in the entire modal */
          <div className="col-span-2 flex h-full w-full items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-blue-500"></div>
          </div>
        ) : !currentPost ? (
          /* Error state */
          <div className="col-span-2 flex h-full w-full flex-col items-center justify-center p-6 text-center">
            <div className="text-red-500 mb-2 text-xl">Something went wrong</div>
            <p className="text-gray-500">
              {error || "We couldn't load this post. Please try again later."}
            </p>
            <button
              onClick={onClose}
              className="mt-4 rounded bg-primary px-4 py-2 text-white"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {currentPost.medias?.length > 0 && <MediaCarousel medias={currentPost.medias} />}
  
            {/* Right side - Comments */}
            <div className="flex flex-col border-l border-gray-500">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-500 p-4">
                <div className="flex items-center space-x-3">
                  <Image
                    src={currentPost.user?.image || defaultAvatar}
                    width={32}
                    height={32}
                    alt="avatar"
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="font-medium">
                    {currentPost.user?.firstName} {currentPost.user?.lastName}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
  
              {/* Comments section */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* Original post content */}
                <div className="mb-4 flex space-x-3">
                  <Image
                    src={currentPost.user?.image || defaultAvatar}
                    width={32}
                    height={32}
                    alt="avatar"
                    className="h-8 w-8 rounded-full"
                  />
                  <div className="mb-6">
                    <span className="mr-2 font-medium">
                      {currentPost.user?.firstName} {currentPost.user?.lastName}
                    </span>
                    <span className="whitespace-pre-wrap">{currentPost.content}</span>
                    <div className="mt-2 text-xs text-gray-500">
                      {currentPost.createdDate && format(currentPost.createdDate, "MMM d, yyyy")}
                    </div>
                  </div>
                </div>
  
                {/* Comments list */}
                {currentPost.comments.map((comment) => (
                  <div key={comment.id} className="mb-4 flex space-x-3">
                    <Image
                      src={comment.user?.image || defaultAvatar}
                      width={32}
                      height={32}
                      alt="avatar"
                      className="h-8 w-8 rounded-full"
                    />
                    <div>
                      <span className="mr-2 font-medium">
                        {comment.user?.firstName} {comment.user?.lastName}
                      </span>
                      <span className="whitespace-pre-wrap">{comment.content}</span>
                      <div className="mt-2 text-xs text-gray-500">
                        {format(comment.createdDate, "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
  
              {/* Actions section */}
              <div className="border-t border-gray-500 px-4 py-2">
                <div className="mb-4 flex space-x-4">
                  <Heart
                    className={`h-6 w-6 cursor-pointer ${isReacted ? "fill-current text-red-500" : ""}`}
                    onClick={handleReaction}
                  />
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div className="mb-4 font-semibold">
                  {reactionCount} {reactionCount === 1 ? "like" : "likes"}
                </div>
                <div className="text-xs text-gray-500">
                  {currentPost.createdDate && format(currentPost.createdDate, "MMM d, yyyy")}
                </div>
              </div>
  
              {/* Comment input */}
              <form
                onSubmit={handleSubmitComment}
                className="border-t border-gray-500 p-4 items-center"
              >
                <div className={`flex space-x-2 ${isCommenting ? "opacity-55" : ""} items-center`}>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 h-10 pt-2 overflow-hidden rounded bg-background focus:border-primary focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!comment.trim()}
                    className="text-primary hover:text-primary/90 disabled:opacity-50"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostDetailModal;
