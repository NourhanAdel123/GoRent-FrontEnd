'use client';

import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { RegisterCredentials } from '../../types/user';

export default function RegisterForm() {
  const { register: registerUser, isLoading, error } = useAuth();
  const searchParams = useSearchParams();

  const { register, handleSubmit, control, formState: { errors } } = useForm<RegisterCredentials>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'tenant'
    }
  });

  const onSubmit = async (data: RegisterCredentials) => {
    try {
      await registerUser(data);
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 450, mx: 'auto', mt: 8, mb: 8, borderRadius: 2 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: "bold" }} color="primary">
        إنشاء حساب جديد
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="الاسم الكامل"
          autoComplete="name"
          autoFocus
          disabled={isLoading}
          {...register('name', {
            required: 'الاسم مطلوب',
            minLength: { value: 3, message: 'يجب أن يكون الاسم 3 أحرف على الأقل' }
          })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="البريد الإلكتروني"
          autoComplete="email"
          disabled={isLoading}
          {...register('email', {
            required: 'البريد الإلكتروني مطلوب',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'بريد إلكتروني غير صالح'
            }
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="كلمة المرور"
          type="password"
          id="password"
          autoComplete="new-password"
          disabled={isLoading}
          {...register('password', {
            required: 'كلمة المرور مطلوبة',
            minLength: { value: 6, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <TextField
          margin="normal"
          fullWidth
          id="phone"
          label="رقم الهاتف"
          autoComplete="tel"
          disabled={isLoading}
          {...register('phone')}
          error={!!errors.phone}
          helperText={errors.phone?.message}
        />

        <FormControl fullWidth margin="normal" error={!!errors.role}>
          <InputLabel id="role-select-label">نوع الحساب</InputLabel>
          <Controller
            name="role"
            control={control}
            rules={{ required: 'يرجى اختيار نوع الحساب' }}
            render={({ field }) => (
              <Select
                {...field}
                labelId="role-select-label"
                id="role-select"
                label="نوع الحساب"
                disabled={isLoading}
              >
                <MenuItem value="tenant">مستخدم (مستأجر)</MenuItem>
                <MenuItem value="owner">مالك عقار</MenuItem>
                <MenuItem value="admin">مدير</MenuItem>
              </Select>
            )}
          />
          {errors.role && <FormHelperText>{errors.role.message}</FormHelperText>}
        </FormControl>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 3, mb: 2, borderRadius: 2 }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'تسجيل'}
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Link href="/auth/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
            <Typography variant="body2">لديك حساب بالفعل؟ سجل دخولك</Typography>
          </Link>
        </Box>
      </Box>
    </Paper>
  );
}
