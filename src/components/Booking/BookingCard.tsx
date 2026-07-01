"use client";

import { useState } from "react";
import { Box, Typography, Card, CardContent, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaymentIcon from "@mui/icons-material/Payment";
import { Booking } from "../../types/booking";
import { paymentService } from "../../services/payment";
import { calculateBookingBreakdown } from "../../lib/pricing";
import { formatCurrency } from "../../lib/formatters";

const statusMap = {
    PENDING_OWNER_APPROVAL: { label: "في انتظار موافقة المالك", color: "warning" as const },
    REJECTED: { label: "مرفوض", color: "error" as const },
    PENDING_PAYMENT: { label: "في انتظار الدفع", color: "warning" as const },
    RESERVED: { label: "محجوز", color: "success" as const },
    CANCELLED: { label: "ملغي", color: "error" as const },
};

interface BookingCardProps {
    booking: Booking;
    onCancel: (id: string) => void;
}

export default function BookingCard({ booking, onCancel }: BookingCardProps) {
    const [open, setOpen] = useState(false);
    const [payLoading, setPayLoading] = useState(false);
    const [payError, setPayError] = useState<string | null>(null);

    const handleConfirm = () => {
        onCancel(booking._id);
        setOpen(false);
    };

    const handlePay = async () => {
        try {
            setPayLoading(true);
            setPayError(null);
            const data = await paymentService.initiateBookingFeePayment(booking._id);
            window.location.href = data.paymentUrl;
        } catch (err: unknown) {
            setPayError(err instanceof Error ? err.message : "فشل بدء عملية الدفع");
            setPayLoading(false);
        }
    };

    const property = booking.propertyId;

    return (
        <>
            <Card
                elevation={0}
                sx={{
                    width: '100%',
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "0px 2px 12px rgba(0,0,0,0.06)",
                    transition: "box-shadow 0.2s ease",
                    "&:hover": { boxShadow: "0px 4px 20px rgba(0,0,0,0.10)" },
                }}
            >
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    {/* Header */}
                    <Box sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", md: "center" },
                        gap: { xs: 0.5, md: 0 },
                        mb: 1.5
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                            {property?.title || "عقار غير متاح"}
                        </Typography>
                        <Chip
                            label={statusMap[booking.status]?.label}
                            color={statusMap[booking.status]?.color}
                            size="small"
                            sx={{ fontWeight: 600, borderRadius: 2, alignSelf: 'flex-start' }}
                        />
                    </Box>

                    {/* Location */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                        <LocationOnIcon sx={{ fontSize: { xs: 14, md: 16 } }} color="action" />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {property
                                ? typeof property.location === "string"
                                    ? property.location
                                    : property.address || "لا يوجد عنوان"
                                : "لا يوجد عنوان"}
                        </Typography>
                    </Box>

                    {/* Dates */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2 }}>
                        <CalendarMonthIcon sx={{ fontSize: { xs: 14, md: 16 } }} color="action" />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {new Date(booking.startDate).toLocaleDateString("ar-EG")} ←{" "}
                            {new Date(booking.endDate).toLocaleDateString("ar-EG")}
                        </Typography>
                    </Box>

                    {/* Price Breakdown */}
                    {booking.status === "PENDING_PAYMENT" && property && (
                        <Box sx={{ mb: 2, p: 1.5, bgcolor: "grey.50", borderRadius: 2, border: "1px solid", borderColor: "grey.100" }}>
                            <Typography variant="body2" color="text.secondary" sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                <span>قيمة الإيجار:</span>
                                <span>{formatCurrency(calculateBookingBreakdown(booking.startDate, booking.endDate, property).stayValue)}</span>
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                <span>رسوم السمسرة (10%):</span>
                                <span>{formatCurrency(calculateBookingBreakdown(booking.startDate, booking.endDate, property).brokerageFee)}</span>
                            </Typography>
                            <Typography variant="subtitle2" color="primary.main" sx={{ display: "flex", justifyContent: "space-between", mt: 1, fontWeight: 700 }}>
                                <span>الإجمالي المطلوب:</span>
                                <span>{formatCurrency(calculateBookingBreakdown(booking.startDate, booking.endDate, property).totalAmount)}</span>
                            </Typography>
                        </Box>
                    )}

                    {/* Pay Error */}
                    {payError && (
                        <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                            {payError}
                        </Typography>
                    )}

                    {/* Footer */}
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        pt: 1.5,
                        borderTop: "1px solid",
                        borderColor: "divider",
                        gap: 1,
                    }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "primary.main", fontSize: { xs: '0.9rem', md: '1rem' } }}>
                            {new Date(booking.startDate).toLocaleDateString("ar-EG")} — {new Date(booking.endDate).toLocaleDateString("ar-EG")}
                        </Typography>

                        <Box sx={{ display: "flex", gap: 1 }}>
                            {/* Pay Button */}
                            {booking.status === "PENDING_PAYMENT" && (
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    onClick={handlePay}
                                    disabled={payLoading}
                                    startIcon={payLoading ? <CircularProgress size={14} color="inherit" /> : <PaymentIcon fontSize="small" />}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontWeight: 600,
                                        px: { xs: 1.5, md: 2 },
                                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                                        boxShadow: "none",
                                        "&:hover": { boxShadow: "none" },
                                    }}
                                >
                                    ادفع الآن
                                </Button>
                            )}

                            {/* Cancel Button */}
                            {booking.status !== "CANCELLED" && booking.status !== "REJECTED" && booking.status !== "RESERVED" && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={() => setOpen(true)}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontWeight: 600,
                                        px: { xs: 1.5, md: 2 },
                                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                                        boxShadow: "none",
                                        "&:hover": { boxShadow: "none" },
                                    }}
                                >
                                    إلغاء الحجز
                                </Button>
                            )}
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Confirmation Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>تأكيد إلغاء الحجز</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        هل أنت متأكد من إلغاء حجز <strong>{property?.title || "عقار غير متاح"}</strong>؟ لا يمكن التراجع عن هذا الإجراء.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setOpen(false)}
                        sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                    >
                        تراجع
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleConfirm}
                        sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, boxShadow: "none" }}
                    >
                        تأكيد الإلغاء
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}