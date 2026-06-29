import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { Box, Container } from '@mui/material';

export const metadata = {
  title: 'استعادة كلمة المرور | GoRent',
  description: 'قم باستعادة كلمة المرور لحسابك في GoRent'
};

export default function ForgotPasswordPage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <ForgotPasswordForm />
      </Box>
    </Container>
  );
}
