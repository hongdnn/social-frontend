import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { MediaCarousel } from "./MediaCarousel";
import { format } from "date-fns";
import { CirclePlus, Heart, MessageCircle, Send } from "lucide-react";
import { debounce } from "lodash";
import { usePostDetail } from "@/src/app/(home)/hooks/use-post-detail";

interface PostDetailModalProps {
  onClose: () => void;
  postId: string;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({
  onClose,
  postId,
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
    loadCurrentUser,
    getPostDetail,
    canLoadMore,
    loadMoreComment,
    commentsContainerRef,
  } = usePostDetail();
  const defaultAvatar = "/default_avatar.svg";
  const isInitialLoaded = useRef(false);

  useEffect(() => {
    if (!isInitialLoaded.current) {
      loadCurrentUser();
      getPostDetail(postId);
      isInitialLoaded.current = true;
    }
  }, [getPostDetail, postId, loadCurrentUser]);

  const handleReaction = debounce(() => {
    reactPost(postId);
  }, 200);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      createComment(postId, comment);
    }
  };

  const handleLoadMoreComments = debounce(() => {
    loadMoreComment();
  }, 200);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`grid h-[90vh] max-w-6xl ${currentPost?.medias?.length ? "w-full grid-cols-[1fr,400px]" : "w-[500px] grid-cols-1"} rounded border-[1px] border-gray-500 bg-background shadow-xl`}
      >
        {loading ? (
          /* // Loading indicator centered in the entire modal */
          <div className="col-span-2 flex h-full w-full items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-blue-500"></div>
          </div>
        ) : !currentPost ? (
          /* Error state */
          <div className="col-span-2 flex h-full w-full flex-col items-center justify-center p-6 text-center">
            <div className="mb-2 text-xl text-red-500">
              Something went wrong
            </div>
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
            {currentPost.medias?.length > 0 && (
              <MediaCarousel medias={currentPost.medias} />
            )}

            {/* Right side - Comments */}
            <div className="flex h-[90vh] flex-col border-l border-gray-500">
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
              <div className="flex flex-1 flex-col overflow-hidden p-4">
                <div className="flex space-x-3">
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
                    <span className="whitespace-pre-wrap">
                      {currentPost.content}
                    </span>
                    <div className="mt-2 text-xs text-gray-500">
                      {currentPost.createdDate &&
                        format(currentPost.createdDate, "MMM d, yyyy")}
                    </div>
                  </div>
                </div>

                {/* Comments list */}
                <div
                  className="scrollable-hide flex flex-col"
                  ref={commentsContainerRef}
                >
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
                        <span className="whitespace-pre-wrap">
                          {comment.content}
                        </span>
                        <div className="mt-2 text-xs text-gray-500">
                          {format(comment.createdDate, "MMM d, yyyy")}
                        </div>
                      </div>
                    </div>
                  ))}
                  {canLoadMore && (
                    <div className="flex justify-center pt-2">
                      <CirclePlus
                        onClick={handleLoadMoreComments}
                        className="h-6 w-6 cursor-pointer text-gray-500 hover:text-gray-700"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Actions section */}
              <div className="border-t border-gray-500 px-4 py-2">
                <div className="mb-2 flex space-x-4">
                  <Heart
                    className={`h-6 w-6 cursor-pointer ${isReacted ? "fill-current text-red-500" : ""}`}
                    onClick={handleReaction}
                  />
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div className="mb-2 font-semibold">
                  {reactionCount} {reactionCount === 1 ? "like" : "likes"}
                </div>
                <div className="text-xs text-gray-500">
                  {currentPost.createdDate &&
                    format(currentPost.createdDate, "MMM d, yyyy")}
                </div>
              </div>

              {/* Comment input */}
              <form
                onSubmit={handleSubmitComment}
                className="items-center border-t border-gray-500 p-4"
              >
                <div
                  className={`flex space-x-2 ${isCommenting ? "opacity-55" : ""} items-center`}
                >
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="h-10 flex-1 overflow-hidden rounded bg-background pt-2 focus:border-primary focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!comment.trim()}
                    className="hover:text-primary/90 text-primary disabled:opacity-50"
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
