import { COMMENTS_PER_PAGE } from "@/src/config/config";
import { commentApi } from "@/src/lib/api/comment-api";
import { postApi } from "@/src/lib/api/post-api";
import { reactionApi } from "@/src/lib/api/reaction-api";
import { PostModel } from "@/src/models/post";
import { useCallback, useEffect, useRef, useState } from "react";
import { produce } from "immer";
import { parseUserFromJson, UserModel } from "@/src/models/user";

export const usePostDetail = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPost, setCurrentPost] = useState<PostModel | null>(null);
  const [page, setPage] = useState(1);
  const pageRef = useRef(page);
  const [canLoadMore, setCanLoadMore] = useState<boolean>(true);
  const currentPostRef = useRef<PostModel | null>(null);
  const [comment, setComment] = useState("");
  const [isReacted, setIsReacted] = useState(false);
  const [isCommenting, setCommenting] = useState(false);
  const [reactionCount, setReactionCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<UserModel | null>(null);
  const commentsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    currentPostRef.current = currentPost;
    pageRef.current = page;
  }, [currentPost, page]);

  const getPostDetail = useCallback(async (postId: string) => {
    setLoading(true);
    setError(null);

    try {
      const [postResponse, commentResponse] = await Promise.all([
        postApi.getPostDetail(postId),
        commentApi.fetchComments(postId, COMMENTS_PER_PAGE, pageRef.current),
      ]);
      if (postResponse.error || commentResponse.error) {
        setError(`${postResponse.error || commentResponse.error}`);
      } else if (
        postResponse.status === 0 &&
        postResponse.data &&
        commentResponse.status === 0
      ) {
        postResponse.data.comments = commentResponse.comments;
        setCurrentPost(postResponse.data);
        setReactionCount(postResponse.data.reactionCount);
        setIsReacted(postResponse.data.isReacted);
        setPage(pageRef.current + 1);
        if (commentResponse.comments.length < COMMENTS_PER_PAGE) {
          setCanLoadMore(false);
        }
      }
      console.log(pageRef.current);
    } catch (error) {
      console.log(error);
      setError("There is something wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCurrentUser = useCallback(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(parseUserFromJson(storedUser));
    }
  }, [])

  const loadMoreComment = useCallback(async () => {
    console.log(pageRef.current);
    try {
      const commentResponse = await commentApi.fetchComments(
        currentPostRef.current?.id ?? "",
        COMMENTS_PER_PAGE,
        pageRef.current,
      );
      if (commentResponse.status === 0) {
        if (commentResponse.comments.length > 0) {
          setCurrentPost(
            produce((draft) => {
              if (draft) {
                /* Prevent from adding new comments that the current user has just created */
                const existingIds = new Set(draft.comments.map((c) => c.id));
                const newComments = commentResponse.comments.filter(
                  (c) => !existingIds.has(c.id),
                );
                draft.comments.push(...newComments);
              }
            }),
          );
        }
        setPage(pageRef.current + 1);
        if (commentResponse.comments.length < COMMENTS_PER_PAGE) {
          setCanLoadMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {

    }
  }, []);

  const reactPost = async (post_id: string) => {
    try {
      if (isReacted) {
        setReactionCount((prev) => Math.max(0, prev - 1));
      } else {
        setReactionCount((prev) => prev + 1);
      }
      setIsReacted(!isReacted);
      const response = await reactionApi.react(post_id);
      if (response.status !== 0) {
        console.log(response.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createComment = async (
    postId: string,
    content: string,
    repliedCommentId?: string,
  ) => {
    try {
      setCommenting(true);
      const response = await commentApi.createComment(
        postId,
        content,
        repliedCommentId,
      );
      if (response.status === 0 && response.comment) {
        if (currentUser) {
          response.comment.user = currentUser;
        }
        setCurrentPost(
          produce((draft) => {
            if (draft) {
              draft.comments.unshift(response.comment!);
            }
          }),
        );
        setComment("");
        /* Scroll to top of comments */
        setTimeout(() => {
          commentsContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
      }

      return response.comment;
    } catch (error) {
      console.log(error);
    } finally {
      setCommenting(false);
    }
  };

  return {
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
    commentsContainerRef
  };
};
