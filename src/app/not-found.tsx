import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

export default function NotFound() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" color="primary.main" sx={{ fontWeight: 'bold', mb: 2 }}>
          404
        </Typography>
        <Typography variant="h5" color="text.primary" sx={{ mb: 2, fontWeight: 'bold' }}>
          عذراً، الصفحة غير موجودة!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          يبدو أن الصفحة التي تبحث عنها قد تم نقلها أو أنها لم تعد موجودة.
        </Typography>
        <Link href="/" passHref style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary" size="large" sx={{ borderRadius: 2 }}>
            العودة للرئيسية
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
