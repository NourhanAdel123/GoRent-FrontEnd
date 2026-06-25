'use client';

import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Skeleton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  InputAdornment,
  Pagination as MuiPagination,
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import SearchIcon from '@mui/icons-material/Search';
import { useAdminDisputes } from '../../../../hooks/useAdminDisputes';
import { AdminDispute } from '../../../../types/admin';

const statusMap = {
  OPEN: { label: 'مفتوح', color: 'warning' as const },
  IN_REVIEW: { label: 'قيد المراجعة', color: 'info' as const },
  RESOLVED: { label: 'تم الحل', color: 'success' as const },
  REJECTED: { label: 'مرفوض', color: 'error' as const },
};

export default function AdminDisputesPage() {
  const { disputes, pagination, page, setPage, isLoading, error, updateDisputeStatus } = useAdminDisputes();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AdminDispute['status']>('all');
  const [selectedDispute, setSelectedDispute] = useState<AdminDispute | null>(null);

  const filteredDisputes = useMemo(() => {
    return disputes.filter((d) => {
      const matchesSearch =
          d.propertyTitle.toLowerCase().includes(search.toLowerCase()) ||
          d.subject.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [disputes, search, statusFilter]);

  const totalOpen = disputes.filter((d) => d.status === 'OPEN' || d.status === 'IN_REVIEW').length;
  const totalResolved = disputes.filter((d) => d.status === 'RESOLVED').length;

  const handleResolve = (status: AdminDispute['status']) => {
    if (selectedDispute) {
      updateDisputeStatus(selectedDispute._id, status);
      setSelectedDispute(null);
    }
  };

  return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          إدارة النزاعات
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          مراجعة النزاعات المفتوحة بين المؤجرين والمستأجرين، واتخاذ القرار المناسب لحلها.
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none' }}>
              <Typography variant="h6" color="text.secondary">إجمالي النزاعات</Typography>
              <Typography variant="h3" color="primary" sx={{ mt: 1, fontWeight: 'bold' }}>{pagination.totalItems}</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none' }}>
              <Typography variant="h6" color="text.secondary">نزاعات مفتوحة</Typography>
              <Typography variant="h3" color="warning.main" sx={{ mt: 1, fontWeight: 'bold' }}>{totalOpen}</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none' }}>
              <Typography variant="h6" color="text.secondary">نزاعات محلولة</Typography>
              <Typography variant="h3" color="success.main" sx={{ mt: 1, fontWeight: 'bold' }}>{totalResolved}</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
          <TextField
              placeholder="بحث باسم العقار أو موضوع النزاع"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ flexGrow: 1 }}
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
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="dispute-status-filter-label">الحالة</InputLabel>
            <Select
                labelId="dispute-status-filter-label"
                label="الحالة"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            >
              <MenuItem value="all">جميع الحالات</MenuItem>
              <MenuItem value="OPEN">مفتوح</MenuItem>
              <MenuItem value="IN_REVIEW">قيد المراجعة</MenuItem>
              <MenuItem value="RESOLVED">تم الحل</MenuItem>
              <MenuItem value="REJECTED">مرفوض</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Paper sx={{ borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>العقار</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>الموضوع</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>المستأجر</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>المؤجر</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>تاريخ الفتح</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>الحالة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading &&
                    [1, 2, 3, 4].map((i) => (
                        <TableRow key={i}>
                          {Array.from({ length: 7 }).map((_, j) => (
                              <TableCell key={j}>
                                <Skeleton variant="text" />
                              </TableCell>
                          ))}
                        </TableRow>
                    ))}

                {!isLoading && filteredDisputes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                          <GavelIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 1 }} />
                          <Typography variant="h6" color="text.secondary">
                            لا توجد نزاعات مطابقة لهذا البحث
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                )}

                {!isLoading &&
                    filteredDisputes.map((d) => (
                        <TableRow key={d._id} hover>
                          <TableCell sx={{ fontWeight: 600 }}>{d.propertyTitle}</TableCell>
                          <TableCell>{d.subject}</TableCell>
                          <TableCell>{d.tenantName}</TableCell>
                          <TableCell>{d.ownerName}</TableCell>
                          <TableCell>{new Date(d.createdAt).toLocaleDateString('ar-EG')}</TableCell>
                          <TableCell>
                            <Chip
                                label={statusMap[d.status].label}
                                color={statusMap[d.status].color}
                                size="small"
                                sx={{ fontWeight: 600, borderRadius: 2 }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => setSelectedDispute(d)}
                                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                            >
                              عرض التفاصيل
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

        <Dialog open={!!selectedDispute} onClose={() => setSelectedDispute(null)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>{selectedDispute?.subject}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>العقار:</strong> {selectedDispute?.propertyTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>المستأجر:</strong> {selectedDispute?.tenantName} &nbsp;|&nbsp; <strong>المؤجر:</strong>{' '}
                {selectedDispute?.ownerName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>تاريخ الفتح:</strong>{' '}
                {selectedDispute && new Date(selectedDispute.createdAt).toLocaleDateString('ar-EG')}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1">{selectedDispute?.description}</Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button
                variant="outlined"
                onClick={() => setSelectedDispute(null)}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              إغلاق
            </Button>
            <Button
                variant="outlined"
                color="error"
                onClick={() => handleResolve('REJECTED')}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              رفض النزاع
            </Button>
            <Button
                variant="contained"
                color="success"
                onClick={() => handleResolve('RESOLVED')}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}
            >
              تأكيد الحل
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
  );
}