import { POSTS_PER_PAGE } from "@/src/config/config";
import { followApi } from "@/src/lib/api/follow-api";
import { postApi } from "@/src/lib/api/post-api";
import { reactionApi } from "@/src/lib/api/reaction-api";
import { userApi } from "@/src/lib/api/user-api";
import { PostModel } from "@/src/models/post";
import { UserModel } from "@/src/models/user";
import { useCallback, useEffect, useRef, useState } from "react";

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserModel | null>(null);
  const [posts, setPosts] = useState<PostModel[]>([]);
  const postsRef = useRef<PostModel[]>([]);
  const [canLoadMore, setCanLoadMore] = useState<boolean>(true);
  const [currentPost, setCurrentPost] = useState<PostModel | null>(null);
  const currentPostRef = useRef<PostModel | null>(null);

  useEffect(() => {
    postsRef.current = posts;
    currentPostRef.current = currentPost;
  }, [posts, currentPost]);

  /* fetch list of user profile's posts */
  const getProfilePosts = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      let lastPostDate;
      if (postsRef.current.length > 0) {
        lastPostDate =
          postsRef.current[postsRef.current.length - 1].createdDate;
      }
      const response = await postApi.fetchProfilePosts(
        userId,
        POSTS_PER_PAGE,
        lastPostDate ?? undefined,
      );
      if (response.error) {
        setError(`${response.error}`);
        setCanLoadMore(false);
      } else if (response.status === 0 && response.data.length > 0) {
        if (response.data.length < POSTS_PER_PAGE) {
          setCanLoadMore(false);
        }
        const updatedPosts = [...postsRef.current, ...response.data];
        setPosts(updatedPosts);
      }
    } catch (error) {
      console.log(error);
      setError("There is something wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = useCallback(async (userId: string) => {
    const response = await userApi.fetchProfile(userId);
    if (response.status === 0) {
      setUserProfile(response.data);
    } else {
      setError(response.message);
    }
  }, []);

  const handleFollow = useCallback(
    async (userId: string) => {
      const response = await followApi.updateFollow(userId);
      if (response.status === 0) {
        const updatedUserProfile = new UserModel(
          userProfile?.id ?? "",
          userProfile?.firstName ?? "",
          userProfile?.lastName ?? "",
          userProfile?.email ?? "",
          userProfile?.phone ?? "",
          userProfile?.image ?? "",
          response.message === "Following",
          userProfile?.followers ?? 0,
          userProfile?.followees ?? 0,
        );
        setUserProfile(updatedUserProfile);
      }
    },
    [userProfile],
  );

  const reactPost = async (post_id: string) => {
    try {
      const response = await reactionApi.react(post_id);
      if (response.status !== 0) {
        console.log(response.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickPost = useCallback(
    async (postId: string, isOpen: boolean) => {
      if (!isOpen) {
        setCurrentPost(null);
      } else {
        const post = postsRef.current.find((post) => post.id === postId);
        if (post) {
          setCurrentPost(post);
        }
      }
    },
    [],
  );

  return {
    loading,
    error,
    userProfile,
    fetchUserProfile,
    handleFollow,
    canLoadMore,
    posts,
    getProfilePosts,
    reactPost,
    currentPost,
    handleClickPost,
  };
};
