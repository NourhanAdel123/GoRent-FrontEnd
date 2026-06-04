'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '../../../services/auth';

export default function RegisterPage() {

  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'tenant',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await registerUser(formData);

      if (data.success) {
        router.push('/auth/login');
      } else {
        setError('حدث خطأ أثناء التسجيل.');
      }
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'فشل الاتصال بالخادم. يرجى المحاولة لاحقاً.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ p: 5, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h4" align="center" color="primary.main" sx={{ fontWeight: 'bold' }} gutterBottom>
          إنشاء حساب جديد
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          انضم إلى GoRent وابدأ في استكشاف وإدارة العقارات
        </Typography>

        {error && (
          <Typography color="error" align="center" sx={{ mb: 3 }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="الاسم الكامل"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="البريد الإلكتروني"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="كلمة المرور"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            select
            label="نوع الحساب (Role)"
            name="role"
            value={formData.role}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="tenant">مستأجر (Tenant)</MenuItem>
            <MenuItem value="owner">مالك عقار (Owner)</MenuItem>
          </TextField>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 2, py: 1.5, fontSize: '1.1rem', borderRadius: 2 }}
          >
            {loading ? 'جاري التسجيل...' : 'تسجيل حساب'}
          </Button>

          <Typography align="center" sx={{ mt: 2 }}>
            لديك حساب بالفعل؟{' '}
            <Link href="/auth/login" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}>
              تسجيل الدخول
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
