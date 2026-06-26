'use client';

import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Divider, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ReviewsIcon from '@mui/icons-material/Reviews';
import GavelIcon from '@mui/icons-material/Gavel';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 260;

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { title: 'نظرة عامة', path: '/dashboard/admin', icon: <DashboardIcon /> },
    { title: 'المستخدمين', path: '/dashboard/admin/users', icon: <PeopleIcon /> },
    { title: 'العقارات', path: '/dashboard/admin/properties', icon: <HomeWorkIcon /> },
    { title: 'التقييمات', path: '/dashboard/admin/reviews', icon: <ReviewsIcon /> },
    { title: 'النزاعات', path: '/dashboard/admin/disputes', icon: <GavelIcon /> },
    { title: 'التقارير', path: '/dashboard/admin/reports', icon: <AssessmentIcon /> },
  ];

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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mr: { md: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            لوحة تحكم المشرف
          </Typography>
          <Button color="primary" component={Link} href="/" variant="outlined" size="small">
            العودة للموقع
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Better open performance on mobile.
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          anchor="right"
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderLeft: '1px solid #eaeaea', borderRight: 'none' },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, width: { md: `calc(100% - ${drawerWidth}px)` }, mt: '64px' }}
      >
        {children}
      </Box>
    </Box>
  );
}
