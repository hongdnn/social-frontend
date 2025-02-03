import { NotificationModel } from "@/src/models/notification";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface NotificationProps {
    notification: NotificationModel;
    onNotifcationClick: () => void
}

const getNotificationText = (notification: NotificationModel): string => {
    switch (notification.type) {
      case 0:
        return "liked your post";
      case 1:
        return "commented on your post";
      case 2:
        return "replied your comment in the post";
      case 3:
        return "started following you";
      default:
        return "";
    }
};

export const Notification = ({ notification, onNotifcationClick }: NotificationProps) => {
    const defaultAvatar = "/default_avatar.svg";
    const [imgSrc, setImgSrc] = useState<string>(defaultAvatar);
    const handleImageError = () => {
      setImgSrc(defaultAvatar);
    };

    return (
      <div
        key={notification.id}
        className={`hover:bg-muted rounded-lg p-3 transition-colors duration-200 ${
          !notification.isRead ? "bg-muted/50" : ""
        }`}
        onClick={onNotifcationClick}
      >
        <div className="flex items-start gap-3">
          <Image
            src={imgSrc}
            width={40}
            height={40}
            alt={"avatar"}
            className="h-[40px] w-[40px] rounded-full bg-gray-300 object-cover"
            onError={handleImageError}
          />
          <div className="flex-1">
            <Link
              href={`/${notification.createdBy?.id}`}
              className="font-semibold hover:underline"
            >
              {notification.createdBy?.firstName}
            </Link>{" "}
            <span className="text-sm">{getNotificationText(notification)}</span>
            {notification.createdDate && (
              <span className="text-muted-foreground mt-1 block text-xs">
                {formatDistanceToNow(notification.createdDate, {
                  addSuffix: true,
                })}
              </span>
            )}
          </div>
          {!notification.isRead && (
            <div className="h-2 w-2 rounded-full bg-primary"></div>
          )}
        </div>
      </div>
    );
}