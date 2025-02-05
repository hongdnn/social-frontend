import { NOTIFICATIONS_PER_PAGE } from "@/src/config/config";
import { notificationApi } from "@/src/lib/api/notification-api";
import { NotificationModel } from "@/src/models/notification";
import { useCallback, useEffect, useRef, useState } from "react";


export const useNotification = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<NotificationModel[]>([]);
    const [page, setPage] = useState(0);
    const pageRef = useRef(0);
    const notificationsRef = useRef<NotificationModel[]>([]);
    const [canLoadMore, setCanLoadMore] = useState<boolean>(true);

    useEffect(() => {
        notificationsRef.current = notifications
        pageRef.current = page;
    }, [page, notifications]);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await notificationApi.getNotifications(NOTIFICATIONS_PER_PAGE, pageRef.current)
            if(response.status === 0) {
                if(response.data.length < 10) {
                    setCanLoadMore(false)
                } else {
                    setPage(prev => prev + 1)
                }
                if(response.data.length > 0) {
                    setNotifications(response.data)
                }  
            }
        } catch (error) {
            setError(`${error}`)
        } finally {
            setLoading(false)
        }
    }, []);

    const handleNotificationClick = useCallback(
      async (id: string, type: number, targetId: string, postId?: string) => {
        try {
            console.log(type, targetId, postId);
            setNotifications(
                notificationsRef.current.map((notification) =>
                notification.id === id
                    ? { ...notification, isRead: true }
                    : notification,
                ),
            );
        } catch (error) {
          console.error("Error marking notification as read:", error);
        }
      },
      [],
    );

    const receiveNewNotification = useCallback((notification: NotificationModel) => {
        setNotifications((prevNotifications) => {
            const index = prevNotifications.findIndex((noti) => noti.id === notification.id);
            if (index !== -1) {
                const newNotifications = [...prevNotifications];
                newNotifications[index] = notification;
                return newNotifications;
            } else {
                return [notification, ...prevNotifications];
            }
        });
    }, [])


    return { loading, error, notifications, fetchNotifications, canLoadMore, handleNotificationClick, receiveNewNotification }
}