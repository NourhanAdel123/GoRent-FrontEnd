'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { alpha } from '@mui/material/styles';

export default function NotFound() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
        }}
      >
        {/* Decorative Icon Circle */}
        <Box
          sx={{
            width: 140,
            height: 140,
            borderRadius: '50%',
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
            border: '2px dashed',
            borderColor: (theme) => alpha(theme.palette.error.main, 0.3),
          }}
        >
          <SearchOffIcon sx={{ fontSize: 70, color: 'error.main', opacity: 0.8 }} />
        </Box>

        {/* Giant 404 Text */}
        <Typography
          variant="h1"
          sx={{
            fontWeight: 900,
            mb: 1,
            color: 'error.main',
            fontSize: { xs: '6rem', md: '8rem' },
            lineHeight: 1,
            opacity: 0.2,
            position: 'absolute',
            mt: -8,
            zIndex: 0,
            userSelect: 'none',
          }}
        >
          404
        </Typography>

        <Typography variant="h5" color="text.primary" sx={{ mb: 1.5, fontWeight: 'bold', position: 'relative', zIndex: 1 }}>
          عذراً، الصفحة غير موجودة!
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 5, maxWidth: 400, lineHeight: 1.8, position: 'relative', zIndex: 1 }}>
          يبدو أن الصفحة التي تبحث عنها قد تم نقلها، حذفها، أو أنها لم تعد موجودة.
        </Typography>

        <Link href="/" passHref style={{ textDecoration: 'none' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<ArrowForwardIcon />}
            sx={{
              borderRadius: 1.5,
              px: 4,
              py: 1.5,
              boxShadow: 'none',
              position: 'relative',
              zIndex: 1,
              '&:hover': { boxShadow: 4 },
            }}
          >
            العودة للرئيسية
          </Button>
        </Link>
      </Box>
    </Container>
  );
}