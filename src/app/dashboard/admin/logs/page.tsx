'use client';

import React from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Pagination as MuiPagination, Skeleton, Alert
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useAdminLogs } from '@/hooks/useAdminLogs';

export default function AdminLogsPage() {
  const { logs, adminsMap, isLoading, error, page, setPage, totalPages } = useAdminLogs();

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        سجلات النظام
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        سجل بجميع الإجراءات التي قام بها المشرفون على المنصة.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>اسم المشرف</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>الإجراء</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>التفاصيل</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>التاريخ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading &&
                [1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <TableCell key={j}><Skeleton variant="text" /></TableCell>
                    ))}
                  </TableRow>
                ))}

              {!isLoading && logs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <ReceiptLongIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 1 }} />
                      <Typography variant="h6" color="text.secondary">
                        لا توجد سجلات متاحة حالياً
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                logs.map((log) => (
                  <TableRow key={log._id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {adminsMap[log.adminId] || 'مشرف غير معروف'}
                    </TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>
                      {log.details || '—'}
                    </TableCell>
                    <TableCell>
                      {new Date(log.createdAt).toLocaleString('ar-EG', {
                        year: 'numeric', month: 'numeric', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
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
    </Box>
  );
}
