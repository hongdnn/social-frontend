import { Bell } from "lucide-react";
import { useEffect } from "react";
import { Notification } from "./Notification";
import { useNotification } from "@/src/app/(home)/hooks/use-notification";
import { useSocket } from "@/src/app/socket-context";
import { NotificationModel, NotificationType } from "@/src/models/notification";
import { debounce } from "lodash";

interface NotificationPanelProps {
  isOpen: boolean;
  onClick: (notification: NotificationModel) => void;
}

export const NotificationPanel = ({ isOpen, onClick }: NotificationPanelProps) => {
  const {
    notifications,
    loading,
    fetchNotifications,
    receiveNewNotification,
    readNotification,
  } = useNotification();
  const { subscribeToNotifications } = useSocket();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  useEffect(() => {
    const unsubscribe = subscribeToNotifications((notification: NotificationModel) => {
      receiveNewNotification(notification);
    });

    /* Clean up the subscription when the component unmounts */
    return () => {
      unsubscribe();
    };
  }, [subscribeToNotifications, receiveNewNotification]);

  const onNotificationClick = debounce((notification: NotificationModel) => {
    readNotification(notification.id);
    if (
      notification.type === NotificationType.REACTION ||
      notification.type === NotificationType.COMMENT ||
      notification.type === NotificationType.REPLY_COMMENT
    ) {
      onClick(notification);
    }
  }, 200);

  return (
    <div
      className={`fixed h-screen w-[20%] border-r bg-background shadow-lg transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ left: "8.33%" }}
    >
      <div className="flex h-full flex-col">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Notifications</h2>
            <Bell className="h-5 w-5" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-primary"></div>
            </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Notification
                key={notification.id}
                notification={notification}
                onNotifcationClick={() => onNotificationClick(notification)}
              />
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground pt-10 text-center">
            <p>No notifications yet</p>
          </div>
        )}
                </div>
      </div>
    </div>
  );
};
