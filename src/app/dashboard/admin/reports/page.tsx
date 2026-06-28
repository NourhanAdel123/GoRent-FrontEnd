'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Alert,
  LinearProgress,
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useAdminReport } from '@/hooks/useAdminReport';

export default function AdminReportsPage() {
  const { report, isLoading, error } = useAdminReport();

  const ownersPercent = report
    ? Math.round((report.totalOwners / (report.totalUsers || 1)) * 100)
    : 0;
  const approvedPercent = report
    ? Math.round((report.approvedProperties / (report.totalProperties || 1)) * 100)
    : 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        التقارير والإحصائيات
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        نظرة عامة على أداء المنصة: المستخدمون، العقارات، الحجوزات، والنزاعات.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {isLoading && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Skeleton variant="rectangular" height={110} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      )}

      {!isLoading && report && (
        <>
          {/* Stat Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none' }}>
                <Typography variant="h6" color="text.secondary">إجمالي المستخدمين</Typography>
                <Typography variant="h3" color="primary" sx={{ mt: 1, fontWeight: 'bold' }}>{report.totalUsers}</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none' }}>
                <Typography variant="h6" color="text.secondary">إجمالي العقارات</Typography>
                <Typography variant="h3" color="success.main" sx={{ mt: 1, fontWeight: 'bold' }}>{report.totalProperties}</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none' }}>
                <Typography variant="h6" color="text.secondary">إجمالي الحجوزات</Typography>
                <Typography variant="h3" color="primary" sx={{ mt: 1, fontWeight: 'bold' }}>{report.totalBookings}</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none' }}>
                <Typography variant="h6" color="text.secondary">الإيرادات التقديرية</Typography>
                <Typography variant="h3" color="success.main" sx={{ mt: 1, fontWeight: 'bold' }}>
                  {report.totalRevenue.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">جنيه مصري</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none' }}>
                <Typography variant="h6" color="text.secondary">النزاعات المفتوحة</Typography>
                <Typography variant="h3" color="warning.main" sx={{ mt: 1, fontWeight: 'bold' }}>{report.openDisputes}</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none' }}>
                <Typography variant="h6" color="text.secondary">متوسط التقييم</Typography>
                <Typography variant="h3" color="warning.main" sx={{ mt: 1, fontWeight: 'bold' }}>{report.averageRating}</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Breakdown */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>توزيع المستخدمين</Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">مؤجرون</Typography>
                    <Typography variant="body2" color="text.secondary">{report.totalOwners}</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={ownersPercent} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">مستأجرون</Typography>
                    <Typography variant="body2" color="text.secondary">{report.totalTenants}</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={100 - ownersPercent}
                    color="secondary"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>حالة العقارات</Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">مقبولة</Typography>
                    <Typography variant="body2" color="text.secondary">{report.approvedProperties}</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={approvedPercent}
                    color="success"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">قيد المراجعة</Typography>
                    <Typography variant="body2" color="text.secondary">{report.pendingProperties}</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={100 - approvedPercent}
                    color="warning"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Top Properties */}
          <Paper sx={{ borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none', overflow: 'hidden' }}>
            <Box sx={{ p: 3, pb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>أفضل العقارات أداءً</Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>العقار</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>عدد الحجوزات</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>الإيرادات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.topProperties.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                          <AssessmentIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 1 }} />
                          <Typography variant="h6" color="text.secondary">
                            لا توجد بيانات كافية حتى الآن
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                  {report.topProperties.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3}>
                        </TableCell>
                      </TableRow>
                  )}
                  {report.topProperties.map((p, index) => (
                      <TableRow key={`${p.title}-${index}`} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{p.title}</TableCell>
                        <TableCell>{p.bookings}</TableCell>
                        <TableCell>{p.revenue.toLocaleString()} ج.م</TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
    </Box>
  );
}
