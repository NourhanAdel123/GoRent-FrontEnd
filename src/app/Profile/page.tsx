'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, CircularProgress, Container } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import ProfileSidebar, { TabType } from '../../components/profile/ProfileSidebar';
import ProfileContent from '../../components/profile/ProfileContent';
import { ChatSocketProvider } from '../../context/ChatSocketContext';

function parseTabParam(value: string | null): TabType {
  if (value === 'messages' || value === 'settings') return value;
  return 'bookings';
}

function ProfilePageContent() {
  const { user, isAuthenticated, logout, checkAuth } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>(() =>
    parseTabParam(searchParams.get('tab')),
  );
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveTab(parseTabParam(searchParams.get('tab')));
  }, [searchParams]);

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
            <ProfileContent user={user} activeTab={activeTab} onUpdate={checkAuth} />
          </Box>
        </Box>
      </Container>
    </Box>
    </ChatSocketProvider>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      }
    >
      <ProfilePageContent />
    </Suspense>
  );
}