'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useAuth } from '../../../hooks/useAuth';

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
          مرحباً، {user?.name ?? 'بك'} 👋
        </Typography>
        <Typography color="text.secondary">
          هذه لوحة تحكم المستأجر الخاصة بك
        </Typography>
      </Box>
    </Container>
  );
}
