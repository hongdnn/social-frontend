import { POSTS_PER_PAGE } from "@/src/config/config";
import { postApi } from "@/src/lib/api/post-api";
import { reactionApi } from "@/src/lib/api/reaction-api";
import { PostModel } from "@/src/models/post";
import { useCallback, useEffect, useRef, useState } from "react";

export const usePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [currentPost, setCurrentPost] = useState<PostModel | null>(null);
  const postsRef = useRef<PostModel[]>([]);
  const currentPostRef = useRef<PostModel | null>(null);
  const [canLoadMore, setCanLoadMore] = useState<boolean>(true);

  useEffect(() => {
    postsRef.current = posts;
    currentPostRef.current = currentPost;
  }, [posts, currentPost]);

  /* fetch list of posts */
  const getPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let lastPostDate;
      if (postsRef.current.length > 0) {
        lastPostDate =
          postsRef.current[postsRef.current.length - 1].createdDate;
      }
      const response = await postApi.fetchPosts(POSTS_PER_PAGE, lastPostDate ?? undefined);
      if(response.error) {
        setError(`${response.error}`);
        setCanLoadMore(false);
      }
      else if (response.status === 0 && response.data.length > 0) {
        if(response.data.length < POSTS_PER_PAGE) {
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

  const reactPost = async(post_id: string) => {
    try {
      const response = await reactionApi.react(post_id)
      if(response.status !== 0) {
        console.log(response.error)
      }
    } catch (error) {
      console.log(error);
    }
  }

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

  return { loading, error, posts, getPosts, canLoadMore, reactPost, currentPost, handleClickPost }
};
