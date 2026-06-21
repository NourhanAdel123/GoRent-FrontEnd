"use client";

import { useState } from "react";
import { Box, Typography, Card, CardContent, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Booking } from "../../types/booking";

const statusMap = {
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

    const handleConfirm = () => {
        onCancel(booking._id);
        setOpen(false);
    };

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
                            {booking.propertyId.title}
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
                            {typeof booking.propertyId.location === "string"
                                ? booking.propertyId.location
                                : booking.propertyId.address || "لا يوجد عنوان"}
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

                    {/* Footer */}
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        pt: 1.5,
                        borderTop: "1px solid",
                        borderColor: "divider"
                    }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "primary.main", fontSize: { xs: '0.9rem', md: '1rem' } }}>
                            {booking.amountPaid.toLocaleString()} ج.م / شهر
                        </Typography>

                        {booking.status !== "CANCELLED" && (
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
                </CardContent>
            </Card>

            {/* Confirmation Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>تأكيد إلغاء الحجز</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        هل أنت متأكد من إلغاء حجز <strong>{booking.propertyId.title}</strong>؟ لا يمكن التراجع عن هذا الإجراء.
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