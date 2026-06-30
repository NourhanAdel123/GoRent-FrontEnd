'use client';

import React from 'react';
import { Box, Container, Snackbar, Alert, Badge } from '@mui/material';
import { useAuth } from '../../../hooks/useAuth';
import { useNotifications } from '../../../hooks/useNotifications';
import { ChatSocketProvider } from '../../../context/ChatSocketContext';
import DashboardSidebar, { DashboardNavItem } from '../../../components/shared/DashboardSidebar';
import ChatNavBadge from '../../../components/chat/ChatNavBadge';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import EventNoteIcon from '@mui/icons-material/EventNote';
import MessageIcon from '@mui/icons-material/Message';
import InsightsIcon from '@mui/icons-material/Insights';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

export default function OwnerDashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout, isAuthenticated, user } = useAuth();
  const { unreadCount, toastOpen, toastMessage, handleCloseToast } = useNotifications();

  const menuItems: DashboardNavItem[] = [
    { id: 'overview', label: 'نظرة عامة', href: '/dashboard/owner', icon: <DashboardIcon /> },
    {
      id: 'notifications',
      label: 'الإشعارات',
      href: '/dashboard/owner/notifications',
      icon: (
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      ),
    },
    { id: 'properties', label: 'العقارات', href: '/dashboard/owner/properties', icon: <HomeWorkIcon /> },
    { id: 'bookings', label: 'الحجوزات', href: '/dashboard/owner/bookings', icon: <EventNoteIcon /> },
    {
      id: 'messages',
      label: 'الرسائل',
      href: '/dashboard/owner/messages',
      icon: (
          <Badge badgeContent={unreadCount} color="error">
            <MessageIcon />
          </Badge>
      ),
    },
    { id: 'analytics', label: 'التحليلات', href: '/dashboard/owner/analytics', icon: <InsightsIcon /> },
    { id: 'settings', label: 'الإعدادات', href: '/dashboard/owner/settings', icon: <SettingsOutlinedIcon /> },
  ];

  if (!user) return null;

  return (
    <ChatSocketProvider enabled={isAuthenticated}>
      <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 64px)', py: 6 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
              alignItems: 'flex-start',
              width: '100%',
            }}
          >
            {/* Sidebar */}
            <Box sx={{ width: { xs: '100%', md: '280px' }, flexShrink: 0 }}>
              <DashboardSidebar
                user={user}
                roleLabel="مالك"
                menuItems={menuItems}
                onLogout={logout}
              />
            </Box>

            {/* Main content */}
            <Box sx={{ flex: 1, minWidth: 0, width: { xs: '100%', md: 'auto' } }}>
              {children}
            </Box>
          </Box>
        </Container>

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
      </Box>
    </ChatSocketProvider>
  );
}
