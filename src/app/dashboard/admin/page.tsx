'use client';

import React from 'react';
import { Box, Typography, Paper, Grid, Button, Skeleton } from '@mui/material';
import Link from 'next/link';
import { useAuth } from '../../../hooks/useAuth';
import { useAdminReport } from '../../../hooks/useAdminReport';

const statCardSx = {
  p: 3,
  textAlign: 'center' as const,
  border: '1px solid' as const,
  borderColor: 'divider' as const,
  boxShadow: 'none' as const,
};

export default function AdminDashboardOverview() {
  const { user } = useAuth();
  const { report, isLoading } = useAdminReport();

  return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold',color: 'text.secondary' }}>
          مرحباً بك، {user?.name || 'المدير'}
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Stats Cards */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={statCardSx}>
              <Typography variant="h6" color="text.secondary">إجمالي المستخدمين</Typography>
              {isLoading ? (
                  <Skeleton variant="text" width={60} height={48} sx={{ mx: 'auto', mt: 1 }} />
              ) : (
                  <Typography variant="h3" color="primary" sx={{ mt: 1, fontWeight: 'bold' }}>
                    {report?.totalUsers ?? 0}
                  </Typography>
              )}
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={statCardSx}>
              <Typography variant="h6" color="text.secondary">إجمالي العقارات</Typography>
              {isLoading ? (
                  <Skeleton variant="text" width={60} height={48} sx={{ mx: 'auto', mt: 1 }} />
              ) : (
                  <Typography variant="h3" color="success.main" sx={{ mt: 1, fontWeight: 'bold' }}>
                    {report?.totalProperties ?? 0}
                  </Typography>
              )}
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={statCardSx}>
              <Typography variant="h6" color="text.secondary">النزاعات المفتوحة</Typography>
              {isLoading ? (
                  <Skeleton variant="text" width={60} height={48} sx={{ mx: 'auto', mt: 1 }} />
              ) : (
                  <Typography variant="h3" color="warning.main" sx={{ mt: 1, fontWeight: 'bold' }}>
                    {report?.openDisputes ?? 0}
                  </Typography>
              )}
            </Paper>
          </Grid>

          {/* Action Area */}
          <Grid size={12} sx={{ mt: 4 }}>
            <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                إدارة المنصة
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
                من هنا يمكنك إدارة جميع المستخدمين، ومراجعة العقارات، وحل النزاعات بين المؤجرين والمستأجرين.
              </Typography>
              <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  href="/dashboard/admin/reports"
                  sx={{ px: 4, py: 1.5 }}
              >
                عرض التقارير
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
  );
}