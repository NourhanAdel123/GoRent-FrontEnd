'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Divider,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import { useOwnerAnalytics } from '../../../../hooks/useOwnerAnalytics';
import { MonthlyTrendItem, PerPropertyStat } from '../../../../types/booking';

// --- KPI Card ---
interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  bgColor: string;
}

function KpiCard({ icon, label, value, sub, color, bgColor }: KpiCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'white',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 2.5,
          bgcolor: bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: "bold", lineHeight: 1.2 }}>
          {value}
        </Typography>
        {sub && (
          <Typography variant="caption" color="text.disabled">
            {sub}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

// --- Monthly Trend Bar Chart ---
function TrendChart({ data }: { data: MonthlyTrendItem[] }) {
  const max = Math.max(...data.map((d) => d.total), 1);

  return (
    <Paper
      elevation={0}
      sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'white' }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>
        الاتجاه الشهري للحجوزات
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        آخر 6 أشهر — إجمالي الحجوزات والمحجوزات
      </Typography>

      {data.length === 0 ? (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography color="text.disabled">لا توجد بيانات بعد</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 200 }}>
          {data.map((item, idx) => {
            const totalH = Math.round((item.total / max) * 160);
            const reservedH = Math.round((item.reserved / max) * 160);

            return (
              <Tooltip
                key={idx}
                title={
                  <Box>
                    <div>الإجمالي: {item.total}</div>
                    <div>محجوز: {item.reserved}</div>
                    <div>ملغي: {item.cancelled}</div>
                  </Box>
                }
                arrow
              >
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                    cursor: 'default',
                  }}
                >
                  {/* Stacked bars */}
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      height: 160,
                      borderRadius: 1,
                      overflow: 'hidden',
                      gap: '1px',
                    }}
                  >
                    {/* Total bar (grey) */}
                    <Box
                      sx={{
                        width: '100%',
                        height: totalH || 2,
                        bgcolor: '#e3f2fd',
                        borderRadius: '4px 4px 0 0',
                        position: 'relative',
                        '&:hover': { bgcolor: '#bbdefb' },
                        transition: 'height 0.4s ease',
                      }}
                    >
                      {/* Reserved portion (blue) overlaid */}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: reservedH || 0,
                          bgcolor: '#1976d2',
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.4s ease',
                        }}
                      />
                    </Box>
                  </Box>
                  {/* Label */}
                  <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: 11 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: "bold", fontSize: 11 }}>
                    {item.total}
                  </Typography>
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      )}

      {/* Legend */}
      <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
        <Stack direction="row" spacing={0.7} sx={{ alignItems: "center" }}>
          <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: '#1976d2' }} />
          <Typography variant="caption" color="text.secondary">محجوز</Typography>
        </Stack>
        <Stack direction="row" spacing={0.7} sx={{ alignItems: "center" }}>
          <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: '#e3f2fd' }} />
          <Typography variant="caption" color="text.secondary">إجمالي</Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

// --- Status Breakdown Donut-style bar list ---
interface StatusBreakdownProps {
  breakdown: {
    PENDING_OWNER_APPROVAL: number;
    PENDING_PAYMENT: number;
    RESERVED: number;
    REJECTED: number;
    CANCELLED: number;
  };
  total: number;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  RESERVED: { label: 'محجوز', color: '#2e7d32' },
  PENDING_OWNER_APPROVAL: { label: 'بانتظار الموافقة', color: '#ed6c02' },
  PENDING_PAYMENT: { label: 'بانتظار الدفع', color: '#0288d1' },
  REJECTED: { label: 'مرفوض', color: '#c62828' },
  CANCELLED: { label: 'ملغي', color: '#757575' },
};

function StatusBreakdown({ breakdown, total }: StatusBreakdownProps) {
  const entries = Object.entries(breakdown) as [string, number][];

  return (
    <Paper
      elevation={0}
      sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'white' }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>
        توزيع الحالات
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {total} حجز إجمالاً
      </Typography>

      <Stack spacing={2}>
        {entries.map(([status, count]) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const cfg = STATUS_LABELS[status];
          return (
            <Box key={status}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: cfg.color }} />
                  <Typography variant="body2">{cfg.label}</Typography>
                </Stack>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {count} <Typography component="span" variant="caption" color="text.secondary">({pct}%)</Typography>
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={pct}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: '#f0f0f0',
                  '& .MuiLinearProgress-bar': { bgcolor: cfg.color, borderRadius: 3 },
                }}
              />
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
}

// --- Per-property table ---
function PropertyTable({ data }: { data: PerPropertyStat[] }) {
  return (
    <Paper
      elevation={0}
      sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'white' }}
    >
      <Stack direction="row" spacing={1.5} sx={{ mb: 2.5, alignItems: "center" }}>
        <HomeWorkIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>تحليل العقارات</Typography>
      </Stack>

      {data.length === 0 ? (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography color="text.disabled">لا توجد بيانات</Typography>
        </Box>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Box
            component="table"
            sx={{
              width: '100%',
              borderCollapse: 'collapse',
              '& th': {
                fontSize: 12,
                fontWeight: 700,
                color: 'text.secondary',
                p: '8px 12px',
                textAlign: 'right',
                borderBottom: '2px solid',
                borderColor: 'divider',
                bgcolor: '#f8f9fa',
              },
              '& td': {
                fontSize: 13,
                p: '10px 12px',
                textAlign: 'right',
                borderBottom: '1px solid',
                borderColor: 'divider',
              },
              '& tr:last-child td': { borderBottom: 'none' },
              '& tr:hover td': { bgcolor: '#fafafa' },
            }}
          >
            <thead>
              <tr>
                <th>العقار</th>
                <th>إجمالي</th>
                <th>محجوز</th>
                <th>بانتظار</th>
                <th>مرفوض</th>
                <th>ملغي</th>
                <th>نسبة القبول</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p, idx) => {
                const decided = p.reserved + p.rejected;
                const rate = decided > 0 ? Math.round((p.reserved / decided) * 100) : null;
                return (
                  <tr key={idx}>
                    <td>
                      <Typography variant="body2" noWrap sx={{ fontWeight: 600, maxWidth: 220 }}>
                        {p.title}
                      </Typography>
                    </td>
                    <td>
                      <Chip label={p.total} size="small" variant="outlined" />
                    </td>
                    <td>
                      <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>{p.reserved}</Typography>
                    </td>
                    <td>
                      <Typography variant="body2" color="warning.main">{p.pending}</Typography>
                    </td>
                    <td>
                      <Typography variant="body2" color="error.main">{p.rejected}</Typography>
                    </td>
                    <td>
                      <Typography variant="body2" color="text.secondary">{p.cancelled}</Typography>
                    </td>
                    <td>
                      {rate !== null ? (
                        <Chip
                          label={`${rate}%`}
                          size="small"
                          color={rate >= 70 ? 'success' : rate >= 40 ? 'warning' : 'error'}
                          sx={{ fontWeight: 700 }}
                        />
                      ) : (
                        <Typography variant="caption" color="text.disabled">—</Typography>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Box>
        </Box>
      )}
    </Paper>
  );
}

// --- Main Page ---
export default function OwnerAnalyticsPage() {
  const { analytics, isLoading, error } = useOwnerAnalytics();
  const { totals, statusBreakdown, monthlyTrend, perProperty } = analytics;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Box dir="rtl" sx={{ maxWidth: 1100, mx: 'auto' }}>
      {/* Header */}
      <Stack direction="row" spacing={2} sx={{ mb: 4, alignItems: "center" }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2.5,
            bgcolor: 'primary.50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main',
          }}
        >
          <InsightsIcon />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>التحليلات</Typography>
          <Typography variant="body2" color="text.secondary">
            نظرة شاملة على أداء حجوزات عقاراتك
          </Typography>
        </Box>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {/* KPI Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' },
          gap: 2.5,
          mb: 3,
        }}
      >
        <KpiCard
          icon={<EventNoteIcon />}
          label="إجمالي الحجوزات"
          value={totals.total}
          sub="منذ البداية"
          color="#1565c0"
          bgColor="#e3f2fd"
        />
        <KpiCard
          icon={<CheckCircleIcon />}
          label="الحجوزات المؤكدة"
          value={totals.reserved}
          sub="حجوزات مكتملة الدفع"
          color="#2e7d32"
          bgColor="#e8f5e9"
        />
        <KpiCard
          icon={<ThumbUpAltIcon />}
          label="نسبة القبول"
          value={`${totals.acceptanceRate}%`}
          sub="من الحجوزات المقررة"
          color="#7b1fa2"
          bgColor="#f3e5f5"
        />
        <KpiCard
          icon={<CancelIcon />}
          label="نسبة الإلغاء"
          value={`${totals.cancellationRate}%`}
          sub="من إجمالي الحجوزات"
          color="#c62828"
          bgColor="#ffebee"
        />
      </Box>

      {/* Charts Row */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 2.5,
          mb: 3,
        }}
      >
        <TrendChart data={monthlyTrend} />
        <StatusBreakdown breakdown={statusBreakdown} total={totals.total} />
      </Box>

      {/* Per-property table */}
      <PropertyTable data={perProperty} />
    </Box>
  );
}