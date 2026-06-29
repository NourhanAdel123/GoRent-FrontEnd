import RegisterForm from '@/components/auth/RegisterForm';
import { Box, Container } from '@mui/material';
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'تسجيل حساب جديد | GoRent',
  description: 'قم بإنشاء حساب جديد في منصة GoRent'
};

export default function RegisterPage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', py: 4 }}>
        <RegisterForm />
      </Box>
    </Container>
  );
}
