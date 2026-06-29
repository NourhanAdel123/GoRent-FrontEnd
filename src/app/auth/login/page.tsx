import LoginForm from '@/components/auth/LoginForm';
import { Box, Container } from '@mui/material';
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'تسجيل الدخول | GoRent',
  description: 'قم بتسجيل الدخول إلى حسابك في GoRent'
};

export default function LoginPage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <LoginForm />
      </Box>
    </Container>
  );
}
