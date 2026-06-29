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
  Pagination as MuiPagination,
  Chip,
  Button,
  Skeleton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { useAdminUsers } from '../../../../hooks/useAdminUsers';
import { AdminUser } from '../../../../types/admin';

const statusMap = {
  ACTIVE: { label: 'نشط', color: 'success' as const },
  SUSPENDED: { label: 'معلق', color: 'error' as const },
};

const roleMap = {
  tenant: { label: 'مستأجر', color: 'default' as const },
  owner: { label: 'مؤجر', color: 'primary' as const },
  admin: { label: 'مشرف', color: 'secondary' as const },
  superadmin: { label: 'مشرف عام', color: 'secondary' as const },
};

export default function AdminUsersPage() {
  const {
    users,
    isLoading,
    error,
    page,
    totalPages,
    totalItems,
    pageSize,
    setPage,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    totalActive,
    totalSuspended,
    toggleUserStatus,
  } = useAdminUsers();

  const [target, setTarget] = useState<AdminUser | null>(null);

  const handleConfirmToggle = () => {
    if (target) {
      toggleUserStatus(target._id, target.status);
      setTarget(null);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        إدارة المستخدمين
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        عرض جميع المستخدمين المسجلين على المنصة، وتعليق أو تنشيط حساباتهم عند الحاجة.
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none' }}>
            <Typography variant="h6" color="text.secondary">إجمالي المستخدمين</Typography>
            <Typography variant="h3" color="primary" sx={{ mt: 1, fontWeight: 'bold' }}>
              {totalActive + totalSuspended}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none' }}>
            <Typography variant="h6" color="text.secondary">حسابات نشطة</Typography>
            <Typography variant="h3" color="success.main" sx={{ mt: 1, fontWeight: 'bold' }}>{totalActive}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none' }}>
            <Typography variant="h6" color="text.secondary">حسابات معلقة</Typography>
            <Typography variant="h3" color="error.main" sx={{ mt: 1, fontWeight: 'bold' }}>{totalSuspended}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 1 }}>
        <TextField
          placeholder="بحث بالاسم أو البريد الإلكتروني "
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
          <InputLabel id="role-filter-label">الدور</InputLabel>
          <Select
            labelId="role-filter-label"
            label="الدور"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
          >
            <MenuItem value="all">جميع الأدوار</MenuItem>
            <MenuItem value="tenant">مستأجر</MenuItem>
            <MenuItem value="owner">مؤجر</MenuItem>
            <MenuItem value="admin">مشرف</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>الاسم</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>البريد الإلكتروني</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>الدور</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>الحالة</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>تاريخ التسجيل</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading &&
                [1, 2, 3, 4].map((i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!isLoading && users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <PeopleIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 1 }} />
                      <Typography variant="h6" color="text.secondary">
                        لا يوجد مستخدمون مطابقون لهذا البحث
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                users.map((u) => (
                  <TableRow key={u._id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={roleMap[u.role].label}
                        color={roleMap[u.role].color}
                        size="small"
                        sx={{ fontWeight: 600, borderRadius: 2 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusMap[u.status].label}
                        color={statusMap[u.status].color}
                        size="small"
                        sx={{ fontWeight: 600, borderRadius: 2 }}
                      />
                    </TableCell>
                    <TableCell>{new Date(u.createdAt).toLocaleDateString('ar-EG')}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        color={u.status === 'ACTIVE' ? 'error' : 'success'}
                        onClick={() => setTarget(u)}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                      >
                        {u.status === 'ACTIVE' ? 'تعليق' : 'تنشيط'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {!isLoading && totalPages > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, borderTop: '1px solid #eaeaea' }}>
              <MuiPagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  shape="rounded"
              />
            </Box>
        )}
      </Paper>

      {/* Confirm Dialog */}
      <Dialog open={!!target} onClose={() => setTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {target?.status === 'ACTIVE' ? 'تأكيد تعليق الحساب' : 'تأكيد تنشيط الحساب'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            هل أنت متأكد من {target?.status === 'ACTIVE' ? 'تعليق' : 'تنشيط'} حساب{' '}
            <strong>{target?.name}</strong>؟
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setTarget(null)}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            تراجع
          </Button>
          <Button
            variant="contained"
            color={target?.status === 'ACTIVE' ? 'error' : 'success'}
            onClick={handleConfirmToggle}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}
          >
            تأكيد
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
