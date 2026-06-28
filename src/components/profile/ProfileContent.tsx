'use client';

import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { User } from '../../types/user';
import { TabType } from './ProfileSidebar';
import BookingsTab from './tabs/BookingsTab';
import SettingsTab from './tabs/SettingsTab';
import MessagesTab from './tabs/MessagesTab';

interface ProfileContentProps {
  user: User;
  activeTab: TabType;
  onUpdate?: () => void;
}

const ChatFallback = (
  <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
    <CircularProgress />
  </Box>
);

export default function ProfileContent({ user, activeTab, onUpdate }: ProfileContentProps) {
  switch (activeTab) {
    case 'bookings':
      return <BookingsTab />;
    case 'messages':
      return (
        <Suspense fallback={ChatFallback}>
          <MessagesTab />
        </Suspense>
      );
    case 'settings':
      return <SettingsTab user={user} onUpdate={onUpdate} />;
    default:
      return <BookingsTab />;
  }
}
