"use client";

import React, { useEffect } from "react";
import {
  Box,
  Divider,
  useMediaQuery,
  useTheme,
  Container,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { useNotifications } from "../../../hooks/useNotifications";
import DashboardSidebar, {
  DashboardNavItem,
} from "../../../components/shared/DashboardSidebar";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import ReviewsIcon from "@mui/icons-material/Reviews";
import GavelIcon from "@mui/icons-material/Gavel";
import AssessmentIcon from "@mui/icons-material/Assessment";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import Badge from "@mui/material/Badge";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { logout, user, isAuthenticated, isLoading } = useAuth();
  const { unreadCount, toastOpen, toastMessage, handleCloseToast } =
    useNotifications();
  const pathname = usePathname();

  // Redirect to login if not authenticated after loading completes
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Using 'href' and 'label' to match your components structure
  const menuItems: DashboardNavItem[] = [
    {
      id: "overview",
      label: "نظرة عامة",
      href: "/dashboard/admin",
      icon: <DashboardIcon />,
    },
    {
      id: "notifications",
      label: "الإشعارات",
      href: "/dashboard/admin/notifications",
      icon: (
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      ),
    },
    {
      id: "users",
      label: "المستخدمين",
      href: "/dashboard/admin/users",
      icon: <PeopleIcon />,
    },
    {
      id: "properties",
      label: "العقارات",
      href: "/dashboard/admin/properties",
      icon: <HomeWorkIcon />,
    },
    {
      id: "reviews",
      label: "التقييمات",
      href: "/dashboard/admin/reviews",
      icon: <ReviewsIcon />,
    },
    {
      id: "disputes",
      label: "النزاعات",
      href: "/dashboard/admin/disputes",
      icon: <GavelIcon />,
    },
    {
      id: "reports",
      label: "التقارير",
      href: "/dashboard/admin/reports",
      icon: <AssessmentIcon />,
    },
  ];

  if (user?.role === "superadmin") {
    // Fixed: changed item.path to item.href
    const usersIndex = menuItems.findIndex(
      (item) => item.href === "/dashboard/admin/users",
    );

    if (usersIndex !== -1) {
      // Fixed: changed title -> label, and path -> href to stay consistent
      menuItems.splice(usersIndex + 1, 0, {
        id: "admins",
        label: "إدارة المشرفين",
        href: "/dashboard/admin/admins",
        icon: <SupervisedUserCircleIcon />,
      });
    }
  }

  // Removed the unused duplicate drawerContent code since DashboardSidebar is rendering the sidebar

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", bgcolor: "#f8f9fa" }}>
        <CircularProgress />
      </Box>
    );
  }

  // Don't render dashboard content if not authenticated (redirect is happening)
  if (!isAuthenticated || !user) return null;

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "calc(100vh - 64px)",
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          {/* Sidebar */}
          <Box sx={{ width: { xs: "100%", md: "280px" }, flexShrink: 0 }}>
            <DashboardSidebar
              user={user ?? { name: "مستحدم", profileImage: undefined }}
              roleLabel="مشرف"
              menuItems={menuItems}
              onLogout={logout}
            />
          </Box>

          {/* Main content */}
          <Box sx={{ flex: 1, minWidth: 0, width: { xs: "100%", md: "auto" } }}>
            {children}
          </Box>
        </Box>
      </Container>

      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity="info"
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
