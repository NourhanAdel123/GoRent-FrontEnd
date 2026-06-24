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
    InputAdornment,
} from '@mui/material';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import SearchIcon from '@mui/icons-material/Search';
import { useAdminProperties } from '../../../../hooks/useAdminProperties';
import { AdminProperty } from '../../../../types/admin';

const statusMap = {
    PENDING: { label: 'قيد المراجعة', color: 'warning' as const },
    APPROVED: { label: 'مقبول', color: 'success' as const },
    REJECTED: { label: 'مرفوض', color: 'error' as const },
};

type PendingAction = { property: AdminProperty; status: AdminProperty['status'] };

export default function AdminPropertiesPage() {
    const { properties, isLoading, error, updatePropertyStatus } = useAdminProperties();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | AdminProperty['status']>('all');
    const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

    const filteredProperties = useMemo(() => {
        return properties.filter((p) => {
            const matchesSearch =
                p.title.toLowerCase().includes(search.toLowerCase()) ||
                p.ownerName.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [properties, search, statusFilter]);

    const totalApproved = properties.filter((p) => p.status === 'APPROVED').length;
    const totalPending = properties.filter((p) => p.status === 'PENDING').length;

    const handleConfirm = () => {
        if (pendingAction) {
            updatePropertyStatus(pendingAction.property._id, pendingAction.status);
            setPendingAction(null);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                إدارة العقارات
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                مراجعة العقارات المضافة على المنصة، والموافقة عليها أو رفضها.
            </Typography>

            {/* Stats */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none' }}>
                        <Typography variant="h6" color="text.secondary">إجمالي العقارات</Typography>
                        <Typography variant="h3" color="primary" sx={{ mt: 1, fontWeight: 'bold' }}>{properties.length}</Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none' }}>
                        <Typography variant="h6" color="text.secondary">عقارات مقبولة</Typography>
                        <Typography variant="h3" color="success.main" sx={{ mt: 1, fontWeight: 'bold' }}>{totalApproved}</Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, border: '1px solid #eaeaea', boxShadow: 'none' }}>
                        <Typography variant="h6" color="text.secondary">قيد المراجعة</Typography>
                        <Typography variant="h3" color="warning.main" sx={{ mt: 1, fontWeight: 'bold' }}>{totalPending}</Typography>
                    </Paper>
                </Grid>
            </Grid>

      {/*      { <Alert severity="info" sx={{ mb: 3 }}>*/}
      {/*  قائمة العقارات حالياً تعرض العقارات المقبولة فقط (قيد على مستوى الـ API)، فلن تظهر هنا العقارات التي في انتظار المراجعة حتى تتوفر صلاحية إضافية للمشرف على الخادم. أزرار القبول والرفض تعمل بشكل حقيقي على أي عقار ظاهر في القائمة.*/}
      {/*</Alert> }*/}

            {/* Filters */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
                <TextField
                    placeholder="بحث باسم العقار أو المالك"
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
                    <InputLabel id="property-status-filter-label">الحالة</InputLabel>
                    <Select
                        labelId="property-status-filter-label"
                        label="الحالة"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                    >
                        <MenuItem value="all">جميع الحالات</MenuItem>
                        <MenuItem value="PENDING">قيد المراجعة</MenuItem>
                        <MenuItem value="APPROVED">مقبول</MenuItem>
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
                                <TableCell sx={{ fontWeight: 'bold' }}>المالك</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>الموقع</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>السعر الشهري</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>الحالة</TableCell>
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

                            {!isLoading && filteredProperties.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <Box sx={{ textAlign: 'center', py: 6 }}>
                                            <HomeWorkIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 1 }} />
                                            <Typography variant="h6" color="text.secondary">
                                                لا توجد عقارات مطابقة لهذا البحث
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}

                            {!isLoading &&
                                filteredProperties.map((p) => (
                                    <TableRow key={p._id} hover>
                                        <TableCell sx={{ fontWeight: 600 }}>{p.title}</TableCell>
                                        <TableCell>{p.ownerName}</TableCell>
                                        <TableCell>{p.location}</TableCell>
                                        <TableCell>{p.pricePerMonth.toLocaleString()} ج.م</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={statusMap[p.status].label}
                                                color={statusMap[p.status].color}
                                                size="small"
                                                sx={{ fontWeight: 600, borderRadius: 2 }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            {p.status === 'PENDING' ? (
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        size="small"
                                                        onClick={() => setPendingAction({ property: p, status: 'APPROVED' })}
                                                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}
                                                    >
                                                        قبول
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => setPendingAction({ property: p, status: 'REJECTED' })}
                                                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                                                    >
                                                        رفض
                                                    </Button>
                                                </Box>
                                            ) : (
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() =>
                                                        setPendingAction({
                                                            property: p,
                                                            status: p.status === 'APPROVED' ? 'REJECTED' : 'APPROVED',
                                                        })
                                                    }
                                                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                                                >
                                                    {p.status === 'APPROVED' ? 'إلغاء القبول' : 'إعادة القبول'}
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Confirm Dialog */}
            <Dialog open={!!pendingAction} onClose={() => setPendingAction(null)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>
                    {pendingAction?.status === 'APPROVED' ? 'تأكيد قبول العقار' : 'تأكيد رفض العقار'}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        هل أنت متأكد من {pendingAction?.status === 'APPROVED' ? 'قبول' : 'رفض'} عقار{' '}
                        <strong>{pendingAction?.property.title}</strong>؟
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setPendingAction(null)}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                    >
                        تراجع
                    </Button>
                    <Button
                        variant="contained"
                        color={pendingAction?.status === 'APPROVED' ? 'success' : 'error'}
                        onClick={handleConfirm}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}
                    >
                        تأكيد
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
