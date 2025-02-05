import { Bell } from "lucide-react";
import { useEffect } from "react";
import { Notification } from "./Notification";
import { useNotification } from "@/src/app/(home)/hooks/use-notification";
import { useSocket } from "@/src/app/socket-context";
import { NotificationModel } from "@/src/models/notification";

interface NotificationPanelProps {
  isOpen: boolean;
}

export const NotificationPanel = ({ isOpen }: NotificationPanelProps) => {
  const {notifications, loading, fetchNotifications, handleNotificationClick, receiveNewNotification } = useNotification();
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
                onNotifcationClick={() => handleNotificationClick(
                  notification.id,
                  notification.type,
                  notification.targetId,
                  notification.postId,
                )}
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
