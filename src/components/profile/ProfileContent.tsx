"use client";

import React, { useEffect, useState } from "react";
import { Ellipsis, Grid, Settings } from "lucide-react";
import Image from "next/image";
import { useProfile } from "@/src/app/(profile)/[id]/hooks/use-profile";
import { debounce } from "lodash";

interface ProfileContentProps {
  userId: string;
}

export const ProfileContent = ({ userId }: ProfileContentProps) => {
  const defaultAvatar = "/default_avatar.svg";
  const { userProfile, fetchUserProfile, currentUser, handleFollow } = useProfile();
  const [imgSrc, setImgSrc] = useState<string>(
    userProfile?.image ?? defaultAvatar,
  );
  const handleImageError = () => {
    setImgSrc(defaultAvatar);
  };

  useEffect(() => {
    fetchUserProfile(userId);
  }, [fetchUserProfile, userId]);

  if (!userProfile) {
    return null;
  }

  const onClickFollow = debounce(() => {
    handleFollow(userId);
  }, 300)

  return (
    <div className="mx-auto mt-6 flex w-[60%] flex-col items-center p-4">
      <div className="mb-8 flex flex-col items-center gap-8 space-x-16 md:flex-row md:items-start">
        <Image
          src={imgSrc}
          width={120}
          height={120}
          alt={"avatar"}
          className="h-[120px] w-[120px] rounded-full bg-gray-300"
          onError={handleImageError}
        />

        <div className="flex-1">
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
                  <button onClick={onClickFollow} className="rounded-xl bg-primary px-6 py-1.5 font-semibold text-white">
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

      <div className="mt-28 w-full border-t border-gray-800">
        <div className="flex justify-center gap-12">
          <button className="-mt-px flex items-center gap-2 border-t border-white py-4 text-sm font-medium">
            <Grid className="h-4 w-4" />
            <span>POSTS</span>
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="mt-4 grid grid-cols-3 gap-1"></div>
    </div>
  );
};
