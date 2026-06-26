'use client';

import React, { useState } from 'react';
import { Box, Typography, Grid, TextField, Button } from '@mui/material';
import { User } from '../../types/user';
import { TabType } from './ProfileSidebar';
import BookingsTab from "./tabs/BookingsTab";
import SettingsTab from "./tabs/SettingsTab";
interface ProfileContentProps {
  user: User;
  activeTab: TabType;
  onUpdate?: () => void;
}

export default function ProfileContent({ user, activeTab, onUpdate }: ProfileContentProps) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('');

  switch (activeTab) {
    case 'bookings':
      return <BookingsTab />;
    case 'contracts':
      return <Typography variant="h5" sx={{ fontWeight: 'bold' }}>عقودي وإيجاراتي</Typography>;
    case 'messages':
      return <Typography variant="h5" sx={{ fontWeight: 'bold' }}>الرسائل</Typography>;
    case 'reviews':
      return <Typography variant="h5" sx={{ fontWeight: 'bold' }}>التقييمات</Typography>;
    case 'settings':
      return <SettingsTab user={user} onUpdate={onUpdate} />;
    default:
      return <BookingsTab />;
  }
}
