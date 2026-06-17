'use client';

import React, { useState, useRef } from 'react';
import { Box, Container } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import ProfileSidebar, { TabType } from '../../components/profile/ProfileSidebar';
import ProfileContent from '../../components/profile/ProfileContent';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('bookings');
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setTimeout(() => {
      const element = contentRef.current;
      if (element) {
        const navbarHeight = 64;
        const top = element.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 100);
  };

  if (!isAuthenticated || !user) {
    return null;
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
          <Box sx={{ width: { xs: '100%', md: '320px' }, flexShrink: 0 }}>
            <ProfileSidebar
              user={user}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onLogout={logout}
            />
          </Box>

          {/* Content */}
          <Box
            ref={contentRef}
            sx={{
              flex: 1,
              minWidth: 0,
              width: { xs: '100%', md: 'auto' },
            }}
          >
            <ProfileContent user={user} activeTab={activeTab} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}