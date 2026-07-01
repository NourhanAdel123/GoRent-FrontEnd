'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import NextLink from 'next/link';
import Image from "next/image";
import { Copyright as CopyrightIcon } from '@mui/icons-material';

// Small reusable footer link — avoids repeating the Link + Typography + hover
// pattern for every single item below.
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Typography
      component={NextLink}
      href={href}
      variant="body2"
      color="text.secondary"
      sx={{
        textDecoration: 'none',
        transition: 'color 0.15s ease',
        '&:hover': { color: 'primary.main' },
      }}
    >
      {children}
    </Typography>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubscribe = () => {
    if (!isValidEmail(email)) {
      setStatus('error');
      return;
    }
    // TODO: wire to a real newsletter endpoint/service when one exists.
    setStatus('success');
    setEmail('');
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        pt: 6,
        pb: 2,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ justifyContent: 'space-between' }}>

          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Image
                src="/GoRent-logo.png"
                priority={true}
                alt="GoRent Logo"
                width={140}
                height={40}
                style={{ objectFit: "contain", width: "auto",height:"auto" }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              المنصة الذكية الرائدة لتأجير العقارات في المنطقة. توفر تجربة موثوقة وسهلة للمستأجرين والملاك
            </Typography>
          </Grid>

          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              الروابط السريعة
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FooterLink href="/about">عن الشركة</FooterLink>
              {/* These three routes don't exist yet under app/ — create the pages
                  before launch, or temporarily remove the links to avoid 404s. */}
              <FooterLink href="/how-it-works">كيف يعمل goRent</FooterLink>
              <FooterLink href="/faq">الأسئلة الشائعة</FooterLink>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              الدعم الفني
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FooterLink href="/contact">اتصل بنا</FooterLink>
              <FooterLink href="/terms">شروط الاستخدام</FooterLink>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              اشترك في النشرة البريدية
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="البريد الإلكتروني"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== 'idle') setStatus('idle');
                }}
                error={status === 'error'}
                helperText={status === 'error' ? 'بريد إلكتروني غير صحيح' : ' '}
                sx={{ flexGrow: 1, backgroundColor: 'background.default' }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubscribe}
                sx={{ whiteSpace: 'nowrap', height: 40 }}
              >
                اشتراك
              </Button>
            </Box>
            {status === 'success' && (
              <Typography variant="caption" color="success.main">
                تم الاشتراك بنجاح ✓
              </Typography>
            )}
          </Grid>

        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            <CopyrightIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            {new Date().getFullYear()} جميع الحقوق محفوظة goRent
          </Typography>
        </Box>

      </Container>
    </Box>
  );
}