'use client';

import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Skeleton,
  Alert,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Pagination as MuiPagination,
} from '@mui/material';
import ReviewsIcon from '@mui/icons-material/Reviews';
import SearchIcon from '@mui/icons-material/Search';
import { useAdminReviews } from '../../../../hooks/useAdminReviews';
import { AdminReview } from '../../../../types/admin';

export default function AdminReviewsPage() {
  const { reviews, pagination, page, setPage, isLoading, error, deleteReview } = useAdminReviews();
  const [search, setSearch] = useState('');
  const [reviewToDelete, setReviewToDelete] = useState<AdminReview | null>(null);

  const filteredReviews = useMemo(() => {
    return reviews.filter(
        (r) =>
            r.propertyTitle.toLowerCase().includes(search.toLowerCase()) ||
            r.tenantName.toLowerCase().includes(search.toLowerCase())
    );
  }, [reviews, search]);

  const averageRating =
      reviews.length === 0
          ? 0
          : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const totalNegative = reviews.filter((r) => r.rating <= 2).length;

  const handleConfirmDelete = () => {
    if (reviewToDelete) {
      deleteReview(reviewToDelete._id);
      setReviewToDelete(null);
    }
  };

  return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          إدارة التقييمات
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          مراجعة تقييمات المستأجرين، وحذف التقييمات غير المناسبة.
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none' }}>
              <Typography variant="h6" color="text.secondary">إجمالي التقييمات</Typography>
              <Typography variant="h3" color="primary" sx={{ mt: 1, fontWeight: 'bold' }}>{pagination.totalItems}</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none' }}>
              <Typography variant="h6" color="text.secondary">متوسط التقييم</Typography>
              <Typography variant="h3" color="warning.main" sx={{ mt: 1, fontWeight: 'bold' }}>
                {averageRating.toFixed(1)}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none' }}>
              <Typography variant="h6" color="text.secondary">تقييمات سلبية (1-2 نجمة)</Typography>
              <Typography variant="h3" color="error.main" sx={{ mt: 1, fontWeight: 'bold' }}>{totalNegative}</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Alert severity="info" sx={{ mb: 3 }}>
          حذف التقييم متاح حالياً فقط إذا كان حساب المشرف هو كاتب التقييم نفسه (قيد على مستوى الـ API)، وسيظهر سبب الرفض من الخادم إذا حاولت حذف تقييم مستخدم آخر.
        </Alert>

        <TextField
            placeholder="بحث باسم العقار أو المستأجر"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ mb: 3, width: { xs: '100%', sm: 320 } }}
            slotProps={{
              input: {
                startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                ),
              },
            }}
        />

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Paper sx={{ borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>العقار</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>المستأجر</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>التقييم</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>التعليق</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading &&
                    [1, 2, 3, 4].map((i) => (
                        <TableRow key={i}>
                          {Array.from({ length: 5 }).map((_, j) => (
                              <TableCell key={j}>
                                <Skeleton variant="text" />
                              </TableCell>
                          ))}
                        </TableRow>
                    ))}

                {!isLoading && filteredReviews.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                          <ReviewsIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 1 }} />
                          <Typography variant="h6" color="text.secondary">
                            لا توجد تقييمات مطابقة لهذا البحث
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                )}

                {!isLoading &&
                    filteredReviews.map((r) => (
                        <TableRow key={r._id} hover>
                          <TableCell sx={{ fontWeight: 600 }}>{r.propertyTitle}</TableCell>
                          <TableCell>{r.tenantName}</TableCell>
                          <TableCell>
                            <Rating value={r.rating} readOnly size="small" />
                          </TableCell>
                          <TableCell sx={{ maxWidth: 280 }}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                            >
                              {r.comment}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => setReviewToDelete(r)}
                                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                            >
                              حذف
                            </Button>
                          </TableCell>
                        </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>

          {!isLoading && pagination.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, borderTop: '1px solid #eaeaea' }}>
                <MuiPagination
                    count={pagination.totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    shape="rounded"
                />
              </Box>
          )}
        </Paper>

        <Dialog open={!!reviewToDelete} onClose={() => setReviewToDelete(null)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>تأكيد حذف التقييم</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              هل أنت متأكد من حذف تقييم <strong>{reviewToDelete?.tenantName}</strong> لعقار{' '}
              <strong>{reviewToDelete?.propertyTitle}</strong>؟ لا يمكن التراجع عن هذا الإجراء.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button
                variant="outlined"
                onClick={() => setReviewToDelete(null)}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              تراجع
            </Button>
            <Button
                variant="contained"
                color="error"
                onClick={handleConfirmDelete}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}
            >
              تأكيد الحذف
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
  );
}