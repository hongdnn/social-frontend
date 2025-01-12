import { UserModel } from "@/src/models/user";
import Image from "next/image";
import { ReactNode, useState } from "react";

export const User: React.FC<{
    user: UserModel;
    onClick: (id: string) => void
    isShowSelected?: boolean
  }> = ({
    user,
    onClick,
    isShowSelected
  }: {
    user: UserModel;
    onClick: (id: string) => void
    isShowSelected?: boolean
  }): ReactNode => {
    const { id, firstName, lastName , image } = user
    const defaultAvatar = "/default_avatar.svg";
    const [imgSrc, setImgSrc] = useState<string>(image || defaultAvatar);
    const handleImageError = () => {
      setImgSrc(defaultAvatar);
    };
  
    return (
      <div
        className="flex h-10 w-full items-center space-x-2 p-1 pr-4"
        onClick={() => onClick(id)}
      >
        <Image
          src={imgSrc}
          width={50}
          height={50}
          alt={"avatar"}
          className="h-[50px] w-[50px] rounded-full bg-gray-300 object-cover"
          onError={handleImageError}
        />
        <div className="flex-1">
          <label htmlFor="name" className="font-semibold">
            {`${firstName} ${lastName}`}
          </label>
          {/* <label className="truncate text-sm" htmlFor="following">
            {}
          </label> */}
        </div>
        {isShowSelected && (
          <input
            type="checkbox"
            className="h-5 w-5 cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-primary checked:bg-primary"
          />
        )}
      </div>
    );
  };