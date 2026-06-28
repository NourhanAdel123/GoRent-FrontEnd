"use client";

import React from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useAuth } from "../../hooks/useAuth";
import { useNotifications } from "../../hooks/useNotifications";
import Link from "next/link";

export default function NotificationMenu() {
  const { user } = useAuth();
  const { unreadCount, toastOpen, toastMessage, handleCloseToast } = useNotifications();

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