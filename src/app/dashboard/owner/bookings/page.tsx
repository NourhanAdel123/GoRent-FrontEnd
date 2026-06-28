'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Tooltip,
  Avatar,
  Divider,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import { useOwnerBookings } from '../../../../hooks/useOwnerBookings';
import { BookingStatus } from '../../../../types/booking';

// --- Status label/color helpers ---
const STATUS_CONFIG: Record<BookingStatus, { label: string; color: 'warning' | 'info' | 'success' | 'error' | 'default' }> = {
  PENDING_OWNER_APPROVAL: { label: 'بانتظار الموافقة', color: 'warning' },
  PENDING_PAYMENT:        { label: 'بانتظار الدفع',    color: 'info' },
  RESERVED:               { label: 'محجوز',            color: 'success' },
  REJECTED:               { label: 'مرفوض',            color: 'error' },
  CANCELLED:              { label: 'ملغي',             color: 'default' },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// --- Month/Year selector helpers ---
const MONTHS = [
  { value: 1,  label: 'يناير' },
  { value: 2,  label: 'فبراير' },
  { value: 3,  label: 'مارس' },
  { value: 4,  label: 'أبريل' },
  { value: 5,  label: 'مايو' },
  { value: 6,  label: 'يونيو' },
  { value: 7,  label: 'يوليو' },
  { value: 8,  label: 'أغسطس' },
  { value: 9,  label: 'سبتمبر' },
  { value: 10, label: 'أكتوبر' },
  { value: 11, label: 'نوفمبر' },
  { value: 12, label: 'ديسمبر' },
];

const currentYear = new Date().getFullYear();
const YEARS = [currentYear - 1, currentYear, currentYear + 1];

export default function OwnerBookingsPage() {
  const [filterYear,  setFilterYear]  = useState<number | ''>('');
  const [filterMonth, setFilterMonth] = useState<number | ''>('');

  const { bookings, isLoading, error, actionLoading, acceptBooking, rejectBooking } =
    useOwnerBookings(
      filterYear  !== '' ? filterYear  : undefined,
      filterMonth !== '' ? filterMonth : undefined,
    );

  const pendingCount = bookings.filter((b) => b.status === 'PENDING_OWNER_APPROVAL').length;

  return (
    <Box dir="rtl" sx={{ maxWidth: 1100, mx: 'auto' }}>
      {/* Page header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }} gutterBottom>
          الحجوزات
        </Typography>
        <Typography variant="body1" color="text.secondary">
          عرض وإدارة جميع حجوزات عقاراتك
        </Typography>
      </Box>

      {/* Pending badge */}
      {pendingCount > 0 && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          لديك <strong>{pendingCount}</strong> {pendingCount === 1 ? 'حجز' : 'حجوزات'} بانتظار موافقتك
        </Alert>
      )}

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'white',
        }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            تصفية حسب:
          </Typography>

          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>السنة</InputLabel>
            <Select
              value={filterYear}
              label="السنة"
              onChange={(e) => setFilterYear(e.target.value as number | '')}
            >
              <MenuItem value="">الكل</MenuItem>
              {YEARS.map((y) => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>الشهر</InputLabel>
            <Select
              value={filterMonth}
              label="الشهر"
              onChange={(e) => setFilterMonth(e.target.value as number | '')}
            >
              <MenuItem value="">الكل</MenuItem>
              {MONTHS.map((m) => (
                <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {(filterYear !== '' || filterMonth !== '') && (
            <Button
              variant="text"
              size="small"
              onClick={() => { setFilterYear(''); setFilterMonth(''); }}
              sx={{ color: 'text.secondary' }}
            >
              مسح الفلتر
            </Button>
          )}

          <Box sx={{ ml: 'auto' }}>
            <Chip
              label={`${bookings.length} حجز`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        </Stack>
      </Paper>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
      )}

      {/* Loading */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : bookings.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 8,
            textAlign: 'center',
            borderRadius: 3,
            border: '1px dashed',
            borderColor: 'divider',
          }}
        >
          <EventIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            لا توجد حجوزات
          </Typography>
          <Typography variant="body2" color="text.disabled">
            لم يتم العثور على حجوزات لهذه الفترة
          </Typography>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>المستأجر</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>العقار</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>من</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>إلى</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>الحالة</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => {
                const cfg = STATUS_CONFIG[booking.status];
                const isPending = booking.status === 'PENDING_OWNER_APPROVAL';
                const isActing = actionLoading === booking._id;

                return (
                  <TableRow
                    key={booking._id}
                    sx={{
                      '&:hover': { bgcolor: '#fafafa' },
                      borderLeft: isPending ? '3px solid' : '3px solid transparent',
                      borderLeftColor: isPending ? 'warning.main' : 'transparent',
                    }}
                  >
                    {/* Tenant */}
                    <TableCell>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                        <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.50', color: 'primary.main', fontSize: 14 }}>
                          {booking.tenantId?.name?.[0]?.toUpperCase() || <PersonIcon sx={{ fontSize: 18 }} />}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                            {booking.tenantId?.name || '—'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {booking.tenantId?.email || ''}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    {/* Property */}
                    <TableCell>
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <HomeWorkIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                        <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>
                          {booking.propertyId?.title || '—'}
                        </Typography>
                      </Stack>
                    </TableCell>

                    {/* Dates */}
                    <TableCell>
                      <Typography variant="body2">{formatDate(booking.startDate)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatDate(booking.endDate)}</Typography>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Chip
                        label={cfg.label}
                        color={cfg.color}
                        size="small"
                        sx={{ fontWeight: 600, fontSize: 11 }}
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      {isPending ? (
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="قبول الحجز">
                            <span>
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                disabled={isActing}
                                startIcon={isActing ? <CircularProgress size={14} color="inherit" /> : <CheckIcon />}
                                onClick={() => acceptBooking(booking._id)}
                                sx={{ borderRadius: 2, fontSize: 12, textTransform: 'none', minWidth: 80 }}
                              >
                                قبول
                              </Button>
                            </span>
                          </Tooltip>
                          <Tooltip title="رفض الحجز">
                            <span>
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                disabled={isActing}
                                startIcon={<CloseIcon />}
                                onClick={() => rejectBooking(booking._id)}
                                sx={{ borderRadius: 2, fontSize: 12, textTransform: 'none', minWidth: 80 }}
                              >
                                رفض
                              </Button>
                            </span>
                          </Tooltip>
                        </Stack>
                      ) : (
                        <Typography variant="caption" color="text.disabled">—</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}