"use client";

import { Toolbar } from "@/src/components/common/Toolbar";
import { Post } from "@/src/components/home/Post";
import { usePost } from "./hooks/use-post";
import { useEffect, useRef } from "react";
import { debounce } from "lodash";

export default function Home() {
  const { loading, error, posts, getPosts, canLoadMore } = usePost();
  const observerRef = useRef<HTMLDivElement>(null);
  /* Flag to track if posts have been fetched when open screen */
  const hasFetchPosts = useRef(false); 

  useEffect(() => {
    if (!hasFetchPosts.current) {
      getPosts();
      hasFetchPosts.current = true; 
    }
  }, [getPosts]);

  useEffect(() => {
    const handleLoadMore = debounce(() => {
      if (!loading && canLoadMore) {
        getPosts();
      }
    }, 300);

    const observer = new IntersectionObserver(
      (entries) => {
        const [target] = entries;
        if (target.isIntersecting && canLoadMore) {
          handleLoadMore();
        }
      },
      { rootMargin: "100px" }, // Trigger 100px before the element is visible
    );

    const currentElement = observerRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    /* Cleanup when unmount */
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
      handleLoadMore.cancel();
    };
  }, [getPosts, loading, canLoadMore]);

  return (
    <div className="flex h-screen">
      <Toolbar />
      <main className="flex-1 overflow-y-auto px-4 py-16">
        <div className="mx-auto max-w-xl space-y-20">
          {posts.length === 0 && !loading ? (
            <div className="flex h-[50vh] flex-col items-center justify-center text-gray-500">
              <svg
                className="mb-4 h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mb-2 text-xl font-semibold">No Posts Yet</h3>
              <p className="text-center text-gray-400">
                Follow some users to see their posts in your feed
              </p>
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <Post key={post.id} post={post} />
              ))}

              {/* Loading state */}
              {loading && (
                <div className="flex justify-center py-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-blue-500"></div>
                </div>
              )}

              {/* Error state */}
              {error && (
                <div className="py-4 text-center text-red-500">
                  Error loading posts. Please try again.
                </div>
              )}

              <div ref={observerRef} className="h-4" />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
