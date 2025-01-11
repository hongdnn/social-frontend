"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";
import { ConversationModel } from "@/src/models/conversation";
import { UserModel } from "@/src/models/user";

export const Conversation: React.FC<{
  conversationModel: ConversationModel;
  user: UserModel | null;
  onClick: (id: string) => void
}> = ({
  conversationModel,
  user,
  onClick
}: {
  conversationModel: ConversationModel,
  user: UserModel | null;
  onClick: (id: string) => void
}): ReactNode => {
  const { id, image, messages } = conversationModel;
  const defaultAvatar = "/default_avatar.svg";
  const [imgSrc, setImgSrc] = useState<string>(image || defaultAvatar);
  const handleImageError = () => {
    setImgSrc(defaultAvatar);
  };

  return (
    <div className="flex h-20 w-full items-center space-x-2 p-1" onClick={() => onClick(id)}>
      <Image
        src={imgSrc}
        width={60}
        height={60}
        alt={"avatar"}
        className="h-[60px] w-[60px] rounded-full bg-gray-300"
        onError={handleImageError}
      />
      <div className="flex min-w-0 flex-col">
        <label htmlFor="name" className="font-semibold">
          {conversationModel.getConversationName(user?.id)}
        </label>
        <label className="truncate text-sm" htmlFor="message">
          {messages[messages.length - 1].message}
        </label>
      </div>
    </div>
  );
};
