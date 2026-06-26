'use client';

import React from 'react';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Divider,
  ButtonBase,
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { User } from '../../types/user';

export type TabType = 'profile' | 'bookings' | 'contracts' | 'messages' | 'reviews' | 'settings';

interface ProfileSidebarProps {
  user: User;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onLogout: () => void;
}

export default function ProfileSidebar({ user, activeTab, onTabChange, onLogout }: ProfileSidebarProps) {
  const menuItems = [
    { id: 'bookings', label: 'حجوزاتي', icon: <EventAvailableIcon /> },
    { id: 'contracts', label: 'عقودي', icon: <DescriptionOutlinedIcon /> },
    { id: 'messages', label: 'الرسائل', icon: <ChatBubbleOutlinedIcon /> },
    { id: 'reviews', label: 'التقييمات', icon: <StarOutlinedIcon /> },
    { id: 'settings', label: 'الإعدادات', icon: <SettingsOutlinedIcon /> },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0px 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      {/* User Info - Desktop only */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'center', p: 4 }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar src={user.profileImage} sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main', fontSize: '2rem' }}>
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </Avatar>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
        <Typography variant="body2" color="text.secondary">مستأجر</Typography>
      </Box>

      {/* User Info - Mobile only (compact row) */}
      <Box sx={{
        display: { xs: 'flex', md: 'none' },
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.5,
      }}>
        <Box sx={{ position: 'relative', flexShrink: 0 }}>
          <Avatar src={user.profileImage} sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontSize: '1rem' }}>
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </Avatar>

        </Box>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>{user.name}</Typography>
          <Typography variant="caption" color="text.secondary">مستأجر</Typography>
        </Box>
      </Box>

      <Divider />

      {/* Menu */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'row', md: 'column' },
        overflowX: { xs: 'auto', md: 'unset' },
        px: { xs: 1, md: 2 },
        py: { xs: 1, md: 2 },
        gap: 1,
        bgcolor: 'background.paper',
        '&::-webkit-scrollbar': { display: 'none' },
      }}>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <ButtonBase
              key={item.id}
              onClick={() => onTabChange(item.id as TabType)}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                gap: { xs: 0.5, md: 1.5 },
                px: { xs: 1.5, md: 2 },
                py: { xs: 1, md: 1.2 },
                borderRadius: 2,
                flexShrink: 0,
                bgcolor: isActive ? 'primary.main' : 'transparent',
                color: isActive ? '#fff' : 'text.primary',
                transition: 'all 0.2s ease',
                '&:hover': { bgcolor: isActive ? 'primary.dark' : 'action.hover' },
              }}
            >
              <Box sx={{ color: isActive ? '#fff' : 'text.secondary', display: 'flex', '& svg': { fontSize: { xs: '18px', md: '22px' } } }}>
                {item.icon}
              </Box>
              <Typography variant="body2" sx={{ fontWeight: isActive ? 700 : 500, fontSize: { xs: '0.7rem', md: '0.875rem' } }}>
                {item.label}
              </Typography>
            </ButtonBase>
          );
        })}
      </Box>

      <Divider />

      {/* Logout */}
      <Box sx={{ px: { xs: 1, md: 2 }, py: 1, bgcolor: 'background.paper' }}>
        <ButtonBase
          onClick={onLogout}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: { xs: 0.5, md: 1.5 },
            px: { xs: 1.5, md: 2 },
            py: { xs: 1, md: 1.2 },
            borderRadius: 2,
            width: '100%',
            color: 'error.main',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <LogoutOutlinedIcon sx={{ fontSize: { xs: '18px', md: '22px' } }} />
          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.7rem', md: '0.875rem' } }}>
            خروج
          </Typography>
        </ButtonBase>
      </Box>
    </Paper>
  );
}