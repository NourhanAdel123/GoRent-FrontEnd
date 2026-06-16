'use client';

import React, { useState } from 'react';
import { Box, Typography, Grid, TextField, Button } from '@mui/material';
import { User } from '../../types/user';
import { TabType } from './ProfileSidebar';
import BookingsTab from "./tabs/BookingsTab";

interface ProfileContentProps {
  user: User;
  activeTab: TabType;
}

export default function ProfileContent({ user, activeTab }: ProfileContentProps) {
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
      return <Typography variant="h5" sx={{ fontWeight: 'bold' }}>الإعدادات</Typography>;
    default:
      return <BookingsTab />;
  }
}
