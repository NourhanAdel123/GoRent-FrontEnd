'use client';

import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Divider, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import { useNotifications } from '../../../hooks/useNotifications';
import DashboardSidebar, { DashboardNavItem } from '../../../components/shared/DashboardSidebar';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ReviewsIcon from '@mui/icons-material/Reviews';
import GavelIcon from '@mui/icons-material/Gavel';
import AssessmentIcon from '@mui/icons-material/Assessment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EmailIcon from '@mui/icons-material/Email';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';

const drawerWidth = 260;

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();
  const { unreadCount, toastOpen, toastMessage, handleCloseToast } = useNotifications();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems: DashboardNavItem[] = [
    { id: 'overview', label: 'نظرة عامة', href: '/dashboard/admin', icon: <DashboardIcon /> },
    {
      id: 'notifications',
      label: 'الإشعارات',
      href: '/dashboard/admin/notifications',
      icon: (
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      ),
    },
    { id: 'users', label: 'المستخدمين', href: '/dashboard/admin/users', icon: <PeopleIcon /> },
    { id: 'properties', label: 'العقارات', href: '/dashboard/admin/properties', icon: <HomeWorkIcon /> },
    { id: 'reviews', label: 'التقييمات', href: '/dashboard/admin/reviews', icon: <ReviewsIcon /> },
    { id: 'disputes', label: 'النزاعات', href: '/dashboard/admin/disputes', icon: <GavelIcon /> },
    { id: 'reports', label: 'التقارير', href: '/dashboard/admin/reports', icon: <AssessmentIcon /> },
  ];

  if (user?.role === 'superadmin') {
    const usersIndex = menuItems.findIndex(item => item.path === '/dashboard/admin/users');
    menuItems.splice(usersIndex + 1, 0, { title: 'إدارة المشرفين', path: '/dashboard/admin/admins', icon: <SupervisedUserCircleIcon /> });
  }

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
          GoRent Admin
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1, px: 2, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <ListItem disablePadding key={item.path} sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                href={item.path}
                onClick={isMobile ? handleDrawerToggle : undefined}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'white' : 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.title} sx={{ typography: 'body1', fontWeight: isActive ? 'bold' : 'normal' }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <List sx={{ px: 2, py: 2 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={logout} sx={{ borderRadius: 2 }}>
            <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="تسجيل الخروج" sx={{ color: 'error.main' }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  if (!isMounted) {
    return <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fa' }} />;
  }

  return (
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
              roleLabel="مشرف"
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
  );
}
