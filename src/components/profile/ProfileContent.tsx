"use client";

import React, { useEffect, useRef, useState } from "react";
import { Ellipsis, Grid, Settings } from "lucide-react";
import Image from "next/image";
import { useProfile } from "@/src/app/(profile)/[id]/hooks/use-profile";
import { debounce } from "lodash";
import { Post } from "../home/Post";
import { parseUserFromJson, UserModel } from "@/src/models/user";

interface ProfileContentProps {
  userId: string;
}

export const ProfileContent = ({ userId }: ProfileContentProps) => {
  const defaultAvatar = "/default_avatar.svg";
  const [currentUser, setCurrentUser] = useState<UserModel | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(parseUserFromJson(storedUser));
    }
  }, []);

  const {
    userProfile,
    fetchUserProfile,
    handleFollow,
    getProfilePosts,
    posts,
    canLoadMore,
    loading,
    error,
    reactPost
  } = useProfile();
  const [imgSrc, setImgSrc] = useState<string>(
    userProfile?.image ?? defaultAvatar,
  );
  const handleImageError = () => {
    setImgSrc(defaultAvatar);
  };

  const observerRef = useRef<HTMLDivElement>(null);
  /* Flag to track if posts have been fetched when open screen */
  const hasFetchPosts = useRef(false);

  useEffect(() => {
    if (!hasFetchPosts.current) {
      getProfilePosts(userId);
      hasFetchPosts.current = true;
    }
  }, [getProfilePosts, userId]);

  useEffect(() => {
    const handleLoadMore = debounce(() => {
      if (!loading && canLoadMore) {
        getProfilePosts(userId);
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
  }, [getProfilePosts, loading, canLoadMore, userId]);

  useEffect(() => {
    fetchUserProfile(userId);
  }, [fetchUserProfile, userId]);

  if (!userProfile) {
    return null;
  }

  const onClickFollow = debounce(() => {
    handleFollow(userId);
  }, 300);

  return (
    <div className="mx-auto mt-6 flex w-full flex-col overflow-y-auto p-4">
      <div className="mx-auto mb-8 flex w-[60%] flex-col items-center">
        <div className="flex flex-col items-center gap-8 space-x-16 md:flex-row md:items-center md:justify-center">
          <Image
            src={imgSrc}
            width={120}
            height={120}
            alt={"avatar"}
            className="h-[120px] w-[120px] rounded-full bg-gray-300"
            onError={handleImageError}
          />

          <div className="max-w-xl flex-1">
            <div className="mb-4 flex flex-col items-center gap-4 space-x-3 md:flex-row md:items-start">
              <div className="mt-1 flex items-center gap-2">
                <h1 className="break-words text-xl font-semibold">
                  {userProfile.firstName} {userProfile.lastName}
                </h1>
              </div>
              <div className="flex gap-2">
                {currentUser?.id === userProfile.id ? (
                  <button className="rounded-xl bg-primary px-6 py-1.5 font-semibold text-white">
                    Edit profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={onClickFollow}
                      className="rounded-xl bg-primary px-6 py-1.5 font-semibold text-white"
                    >
                      {userProfile.isFollowing ? "Following" : "Follow"}
                    </button>
                    <button className="rounded-xl bg-gray-700 px-6 py-1.5 font-semibold">
                      Message
                    </button>
                  </>
                )}

                <button className="rounded-lg p-1.5">
                  {currentUser?.id === userProfile.id ? (
                    <Settings className="h-5 w-5" />
                  ) : (
                    <Ellipsis className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-4 flex gap-14">
              <div className="text-center md:text-left">
                <span className="font-semibold">{userProfile.followers}</span>
                <span className="ml-1 text-gray-500">followers</span>
              </div>
              <div className="text-center md:text-left">
                <span className="font-semibold">{userProfile.followees}</span>
                <span className="ml-1 text-gray-500">following</span>
              </div>
            </div>

            <div>
              <h2 className="font-semibold">{userProfile.email}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-28 w-[60%] border-t border-gray-800">
        <div className="flex justify-center gap-12">
          <button className="-mt-px flex items-center gap-2 border-t border-white py-4 text-sm font-medium">
            <Grid className="h-4 w-4" />
            <span>POSTS</span>
          </button>
        </div>
      </div>

      {/* Posts Section */}
      {/* <div className="flex-1 px-4 py-16"> */}
      <div className="mx-auto w-[36rem] space-y-20 px-4 py-16">
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
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <Post key={post.id} post={post} onReact={() => {reactPost(post.id)}} onComment={() => {}} />
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
      {/* </div> */}
    </div>
  );
};
