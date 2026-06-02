'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from 'next/link';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'جميع الحقوق محفوظة © '}
      <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
        GoRent
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h6" align="center" gutterBottom color="primary.main" sx={{ fontWeight: 'bold' }}>
          GoRent
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          أفضل منصة لتأجير السيارات بكل سهولة وأمان
        </Typography>
        <Copyright />
      </Container>
    </Box>
  );
}
