'use client';

import React, { useState } from 'react';
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
  FormHelperText,
  IconButton,
  InputAdornment
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { LoginCredentials } from '../../types/user';

export default function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm<LoginCredentials>({
    defaultValues: {
      email: '',
      password: '',
      role: 'tenant'
    }
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login(data);
    } catch (err) {
      // Error is handled in the hook
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        width: '100%',
        maxWidth: 400,
        mx: 'auto',
        mt: 8,
        borderRadius: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 2
      }}
    >
      <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: "bold" }} color="primary">
        تسجيل الدخول
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
          id="email"
          label="البريد الإلكتروني"
          autoComplete="email"
          autoFocus
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
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="current-password"
          disabled={isLoading}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                    sx={{ color: 'text.secondary' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }
          }}
          {...register('password', { required: 'كلمة المرور مطلوبة' })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 3, mb: 2, borderRadius: 1.5 }}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
        >
          دخول
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Link href="/auth/forgot-password" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" sx={{ color: 'primary.main' }}>
              نسيت كلمة المرور؟
            </Typography>
          </Link>
          <Link href="/auth/register" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" sx={{ color: 'primary.main' }}>
              ليس لديك حساب؟ سجل الآن
            </Typography>
          </Link>
        </Box>
      </Box>
    </Paper>
  );
}