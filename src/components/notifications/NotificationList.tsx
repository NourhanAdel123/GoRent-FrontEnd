"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  Chip,
  Divider,
  CircularProgress,
  IconButton,
  Fade,
  Paper,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import HomeIcon from "@mui/icons-material/Home";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StarRateIcon from "@mui/icons-material/StarRate";
import CancelIcon from "@mui/icons-material/Cancel";
import MessageIcon from "@mui/icons-material/Message";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import CheckIcon from "@mui/icons-material/Check";
import { INotification } from "../../types/notification";
import { notificationService } from "../../services/notificationService";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../../hooks/useAuth";

const getNotificationIcon = (type: string, isRead: boolean) => {
  switch (type) {
    case "VIEWING_REQUEST":
    case "VIEWING_ACCEPTED":
      return <HomeIcon color={isRead ? "primary" : "inherit"} />;
    case "BOOKING_REQUEST":
      return <AttachMoneyIcon color={isRead ? "success" : "inherit"} />;
    case "NEW_REVIEW":
      return <StarRateIcon color={isRead ? "warning" : "inherit"} />;
    case "LISTING_APPROVED":
      return <CheckIcon color={isRead ? "success" : "inherit"} />;
    case "LISTING_REJECTED":
      return <CancelIcon color={isRead ? "error" : "inherit"} />;
    case "NEW_MESSAGE":
      return <MessageIcon color={isRead ? "info" : "inherit"} />;
    case "NEW_LISTING_PENDING":
      return <SettingsSuggestIcon color={isRead ? "secondary" : "inherit"} />;
    default:
      return <NotificationsActiveIcon color={isRead ? "action" : "inherit"} />;
  }
};

const getNotificationMessage = (type: string) => {
  switch (type) {
    case "VIEWING_REQUEST":
      return "لديك طلب مشاهدة جديد لعقارك 🏠";
    case "VIEWING_ACCEPTED":
      return "تمت الموافقة على طلب المشاهدة الخاص بك ✅";
    case "BOOKING_REQUEST":
      return "هناك طلب حجز جديد لعقارك 💰";
    case "NEW_REVIEW":
      return "قام شخص بإضافة تقييم جديد ⭐";
    case "LISTING_APPROVED":
      return "تمت الموافقة على نشر عقارك بنجاح 🎉";
    case "LISTING_REJECTED":
      return "نأسف، تم رفض نشر عقارك ❌";
    case "NEW_MESSAGE":
      return "لديك رسالة جديدة 💬";
    case "NEW_LISTING_PENDING":
      return "هناك عقار جديد بانتظار المراجعة (للآدمن) ⚙️";
    default:
      return "لديك إشعار جديد";
  }
};

export default function NotificationList() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await notificationService.getNotifications();
        if (res && res.notifications) {
          setNotifications(res.notifications);
        }
      } catch (error) {
        console.error("Failed to load notifications", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadNotifications();

      socketRef.current = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
        withCredentials: true,
        transports: ['polling', 'websocket'],
      });

      socketRef.current.on("notification:new", (newNotification: INotification) => {
        // Fallback for createdAt to avoid 'Invalid Date' if backend doesn't send it immediately
        const notifWithDate = {
          ...newNotification,
          createdAt: newNotification.createdAt || new Date().toISOString()
        };
        setNotifications((prev) => [notifWithDate, ...prev]);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [user]);

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Container maxWidth="md" sx={{ py: 6, minHeight: "80vh" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "text.primary", fontWeight: "bold" }}
        >
          <NotificationsActiveIcon fontSize="large" color="primary" />
          الإشعارات
          {unreadCount > 0 && (
            <Chip
              label={`${unreadCount} جديد`}
              color="error"
              size="small"
              sx={{ ml: 1, fontWeight: "bold" }}
            />
          )}
        </Typography>

        {unreadCount > 0 && (
          <Button
            variant="outlined"
            startIcon={<CheckIcon />}
            onClick={handleMarkAllAsRead}
            sx={{
              borderRadius: "20px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            تحديد الكل كمقروء
          </Button>
        )}
      </Box>

      {notifications.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            py: 10,
            textAlign: "center",
            bgcolor: "background.default",
            borderRadius: 4,
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <NotificationsActiveIcon sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            لا توجد لديك إشعارات حالياً
          </Typography>
        </Paper>
      ) : (
        <Card elevation={0} sx={{ borderRadius: 4, overflow: "hidden", border: "1px solid", borderColor: "divider" }}>
          <List disablePadding>
            {notifications.map((notif, index) => (
              <Fade in={true} key={notif._id} timeout={500 + index * 100}>
                <Box>
                  <ListItem
                    alignItems="center"
                    sx={{
                      py: 2.5,
                      px: 3,
                      bgcolor: notif.isRead ? "transparent" : "primary.50",
                      transition: "background-color 0.3s ease",
                      "&:hover": {
                        bgcolor: notif.isRead ? "action.hover" : "primary.100",
                      },
                      cursor: notif.isRead ? "default" : "pointer",
                    }}
                    onClick={() => handleMarkAsRead(notif._id, notif.isRead)}
                  >
                    <ListItemAvatar sx={{ minWidth: 56 }}>
                      <Avatar
                        sx={{
                          bgcolor: notif.isRead ? "grey.200" : "primary.main",
                          color: notif.isRead ? "text.secondary" : "white",
                        }}
                      >
                        {getNotificationIcon(notif.type, notif.isRead)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          sx={{ 
                            fontWeight: notif.isRead ? 500 : 700,
                            color: notif.isRead ? "text.secondary" : "text.primary"
                          }}
                          gutterBottom
                        >
                          {getNotificationMessage(notif.type)}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {new Date(notif.createdAt).toLocaleDateString("ar-EG", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Typography>
                      }
                    />
                    {!notif.isRead && (
                      <Box sx={{ alignSelf: "center", ml: 1 }}>
                        <IconButton
                          aria-label="mark as read"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notif._id, notif.isRead);
                          }}
                          color="primary"
                          title="تحديد كمقروء"
                          sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
                        >
                          <CheckIcon />
                        </IconButton>
                      </Box>
                    )}
                  </ListItem>
                  {index < notifications.length - 1 && <Divider component="li" />}
                </Box>
              </Fade>
            ))}
          </List>
        </Card>
      )}
    </Container>
  );
}
