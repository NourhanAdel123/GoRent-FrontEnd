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
  IconButton,
  InputAdornment
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { passwordResetService } from '../../services/passwordReset';

type Step = 'EMAIL' | 'OTP' | 'NEW_PASSWORD';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register: registerEmail, handleSubmit: handleEmailSubmit, formState: { errors: emailErrors } } = useForm<{ email: string }>();
  const { register: registerOtp, handleSubmit: handleOtpSubmit, formState: { errors: otpErrors } } = useForm<{ otp: string }>();
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, watch, formState: { errors: passwordErrors } } = useForm({
    defaultValues: { newPassword: '', confirmPassword: '' }
  });

  const onEmailSubmit = async (data: { email: string }) => {
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await passwordResetService.forgotPassword(data.email);
      setEmail(data.email);
      setStep('OTP');
      setSuccessMsg('تم إرسال رمز التحقق إلى بريدك الإلكتروني.');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إرسال رمز التحقق.');
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpSubmit = async (data: { otp: string }) => {
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await passwordResetService.verifyOTP(email, data.otp);
      setOtp(data.otp);
      setStep('NEW_PASSWORD');
      setSuccessMsg('تم التحقق من الرمز بنجاح. الرجاء إدخال كلمة المرور الجديدة.');
    } catch (err: any) {
      setError(err.message || 'رمز التحقق غير صحيح أو منتهي الصلاحية.');
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await passwordResetService.resetPassword(email, otp, data.newPassword);
      setSuccessMsg('تم تغيير كلمة المرور بنجاح. جاري التوجيه لتسجيل الدخول...');
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تغيير كلمة المرور.');
    } finally {
      setIsLoading(false);
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
        استعادة كلمة المرور
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMsg}
        </Alert>
      )}

      {step === 'EMAIL' && (
        <Box component="form" onSubmit={handleEmailSubmit(onEmailSubmit)} sx={{ mt: 2 }} noValidate>
          <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
            أدخل بريدك الإلكتروني وسنرسل لك رمزاً لإعادة تعيين كلمة المرور.
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="البريد الإلكتروني"
            autoComplete="email"
            autoFocus
            disabled={isLoading}
            {...registerEmail('email', {
              required: 'البريد الإلكتروني مطلوب',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'بريد إلكتروني غير صالح'
              }
            })}
            error={!!emailErrors.email}
            helperText={emailErrors.email?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2, borderRadius: 1.5 }}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LockResetIcon />}
          >
            إرسال الرمز
          </Button>
        </Box>
      )}

      {step === 'OTP' && (
        <Box component="form" onSubmit={handleOtpSubmit(onOtpSubmit)} sx={{ mt: 2 }} noValidate>
          <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
            أدخل رمز التحقق المكون من 6 أرقام المرسل إلى {email}
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="otp"
            label="رمز التحقق"
            autoFocus
            disabled={isLoading}
            {...registerOtp('otp', {
              required: 'رمز التحقق مطلوب',
              pattern: {
                value: /^\d{6}$/,
                message: 'يجب أن يكون الرمز مكوناً من 6 أرقام'
              }
            })}
            error={!!otpErrors.otp}
            helperText={otpErrors.otp?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2, borderRadius: 1.5 }}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LockResetIcon />}
          >
            تحقق من الرمز
          </Button>
          <Button
            fullWidth
            variant="text"
            sx={{ mt: 1 }}
            disabled={isLoading}
            onClick={() => {
              setStep('EMAIL');
              setError(null);
              setSuccessMsg(null);
            }}
          >
            تغيير البريد الإلكتروني
          </Button>
        </Box>
      )}

      {step === 'NEW_PASSWORD' && (
        <Box component="form" onSubmit={handlePasswordSubmit(onPasswordSubmit)} sx={{ mt: 2 }} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            label="كلمة المرور الجديدة"
            type={showPassword ? 'text' : 'password'}
            id="newPassword"
            disabled={isLoading}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }
            }}
            {...registerPassword('newPassword', { 
              required: 'كلمة المرور مطلوبة',
              minLength: { value: 6, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }
            })}
            error={!!passwordErrors.newPassword}
            helperText={passwordErrors.newPassword?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="تأكيد كلمة المرور"
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            disabled={isLoading}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }
            }}
            {...registerPassword('confirmPassword', { 
              required: 'تأكيد كلمة المرور مطلوب',
              validate: (val: string) => {
                if (watch('newPassword') != val) {
                  return 'كلمات المرور غير متطابقة';
                }
              }
            })}
            error={!!passwordErrors.confirmPassword}
            helperText={passwordErrors.confirmPassword?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2, borderRadius: 1.5 }}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LockResetIcon />}
          >
            تغيير كلمة المرور
          </Button>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Link href="/auth/login" style={{ textDecoration: 'none' }}>
          <Typography variant="body2" sx={{ color: 'primary.main' }}>
            العودة إلى تسجيل الدخول
          </Typography>
        </Link>
      </Box>
    </Paper>
  );
}
