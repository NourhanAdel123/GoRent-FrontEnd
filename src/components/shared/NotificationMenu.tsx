"use client";

import React, { useState, useEffect, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { io, Socket } from "socket.io-client";
import { notificationService } from "../../services/notificationService";
import { INotification } from "../../types/notification";
import { useAuth } from "../../hooks/useAuth";
import Link from "next/link";

const getNotificationMessage = (type: string) => {
  switch (type) {
    case 'VIEWING_REQUEST':
      return 'لديك طلب مشاهدة جديد لعقارك 🏠';
    case 'VIEWING_ACCEPTED':
      return 'تمت الموافقة على طلب المشاهدة الخاص بك ✅';
    case 'BOOKING_REQUEST':
      return 'هناك طلب حجز جديد لعقارك 💰';
    case 'NEW_REVIEW':
      return 'قام شخص بإضافة تقييم جديد ⭐';
    case 'LISTING_APPROVED':
      return 'تمت الموافقة على نشر عقارك بنجاح ✅';
    case 'LISTING_REJECTED':
      return 'نأسف، تم رفض نشر عقارك ❌';
    case 'NEW_MESSAGE':
      return 'لديك رسالة جديدة 💬';
    case 'NEW_LISTING_PENDING':
      return 'هناك عقار جديد بانتظار المراجعة (للآدمن) ⚙️';
    default:
      return 'لديك إشعار جديد';
  }
};

export default function NotificationMenu() {
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

  if (!user || user.role !== "tenant") return null;

  return (
    <>
      <IconButton color="inherit" sx={{ mr: 2 }} component={Link} href="/notifications">
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon color="primary" />
        </Badge>
      </IconButton>

      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseToast} severity="info" sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
