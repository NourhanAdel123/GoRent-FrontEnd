import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { notificationService } from "../services/notificationService";
import { INotification } from "../types/notification";
import { useAuth } from "./useAuth";

export const getNotificationMessage = (type: string) => {
  switch (type) {
    case 'VIEWING_REQUEST': return 'لديك طلب مشاهدة جديد لعقارك 🏠';
    case 'VIEWING_ACCEPTED': return 'تمت الموافقة على طلب المشاهدة الخاص بك ✅';
    case 'BOOKING_REQUEST': return 'هناك طلب حجز جديد لعقارك 💰';
    case 'NEW_REVIEW': return 'قام شخص بإضافة تقييم جديد ⭐';
    case 'LISTING_APPROVED': return 'تمت الموافقة على نشر عقارك بنجاح ✅';
    case 'LISTING_REJECTED': return 'نأسف، تم رفض نشر عقارك ❌';
    case 'NEW_MESSAGE': return 'لديك رسالة جديدة 💬';
    case 'NEW_LISTING_PENDING': return 'هناك عقار جديد بانتظار المراجعة (للآدمن) ⚙️';
    default: return 'لديك إشعار جديد';
  }
};

export const useNotifications = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await notificationService.getNotifications();
        if (res && res.notifications) {
          setUnreadCount(res.unreadCount);
        }
      } catch (error) {
        console.error("Failed to load notifications", error);
      }
    };

    if (user) {
      loadNotifications();

      socketRef.current = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
        withCredentials: true,
        transports: ['polling', 'websocket'],
      });

      socketRef.current.on("connect", () => {
        console.log("Socket connected for notifications");
      });
      socketRef.current.on("connect_error", (err) => {
        console.log("Socket connection error:", err.message);
      });

      socketRef.current.on("notification:new", (newNotification: INotification) => {
        setUnreadCount((prev) => prev + 1);
        setToastMessage(getNotificationMessage(newNotification.type));
        setToastOpen(true);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [user]);

  const handleCloseToast = () => setToastOpen(false);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastOpen(true);
  }, []);

  return { unreadCount, toastOpen, toastMessage, handleCloseToast, showToast };
};
