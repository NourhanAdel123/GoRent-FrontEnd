'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Skeleton,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import { useSuperAdmin } from '../../../../hooks/useSuperAdmin';
import { AdminUser } from '../../../../types/admin';

export default function ManageAdminsPage() {
  const { admins, isLoading, error, promoteAdmin, demoteAdmin } = useSuperAdmin();
  const [emailToPromote, setEmailToPromote] = useState('');
  const [adminToDemote, setAdminToDemote] = useState<AdminUser | null>(null);
  const [isPromoting, setIsPromoting] = useState(false);

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailToPromote) return;
    setIsPromoting(true);
    try {
      await promoteAdmin(emailToPromote);
      setEmailToPromote('');
    } finally {
      setIsPromoting(false);
    }
  };

  const handleConfirmDemote = async () => {
    if (adminToDemote) {
      await demoteAdmin(adminToDemote._id);
      setAdminToDemote(null);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        إدارة المشرفين
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        ترقية مستخدمين إلى مشرفين أو تجريدهم من صلاحياتهم.
      </Typography>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none' }}>
        <Typography variant="h6" gutterBottom>
          ترقية مستخدم
        </Typography>
        <Box component="form" onSubmit={handlePromote} sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
          <TextField
            label="البريد الإلكتروني للمستخدم"
            type="email"
            value={emailToPromote}
            onChange={(e) => setEmailToPromote(e.target.value)}
            size="small"
            required
            sx={{ flexGrow: 1, maxWidth: 400 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isPromoting || !emailToPromote}
            sx={{ px: 4, fontWeight: 'bold', boxShadow: 'none' }}
          >
            {isPromoting ? 'جاري الترقية...' : 'ترقية إلى مشرف'}
          </Button>
        </Box>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>الاسم</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>البريد الإلكتروني</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>رقم الهاتف</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>تاريخ الانضمام</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading &&
                [1, 2, 3].map((i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!isLoading && admins.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <SupervisedUserCircleIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 1 }} />
                      <Typography variant="h6" color="text.secondary">
                        لا يوجد مشرفين حالياً
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                admins.map((admin) => (
                  <TableRow key={admin._id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.phone || '—'}</TableCell>
                    <TableCell>{new Date(admin.createdAt).toLocaleDateString('ar-EG')}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => setAdminToDemote(admin)}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                      >
                        إلغاء الترقية
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={!!adminToDemote} onClose={() => setAdminToDemote(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>تأكيد إلغاء الترقية</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            هل أنت متأكد من تجريد <strong>{adminToDemote?.name}</strong> من صلاحيات المشرف وإعادته لمستأجر؟
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setAdminToDemote(null)}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            تراجع
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDemote}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}
          >
            تأكيد التجريد
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
