import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import API from "../api/axios";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  const fetchNotifications = useCallback(async () => {
    if (!user?._id) return;

    try {
      const response = await API.get("/api/notifications");
      if (response.data.success) {
        setNotifications(response.data.data || []);
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  }, [user]);

  useEffect(() => {
    if (!user?._id) {
      queueMicrotask(() => {
        setNotifications([]);
        setUnreadCount(0);
      });
      return;
    }

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user, fetchNotifications]);

  const markAsRead = async (notificationId) => {
    try {
      await API.patch(`/api/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.patch("/api/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    }
  };

  const value = {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined || context === null) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
