"use client";

import { Box, Typography, Card, CardContent, Chip, Button } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Booking } from "../../types/booking";

const statusMap = {
    PENDING_PAYMENT: { label: "في انتظار الدفع", color: "warning" as const },
    CONFIRMED: { label: "مؤكد", color: "success" as const },
    CANCELLED: { label: "ملغي", color: "error" as const },
    COMPLETED: { label: "مكتمل", color: "default" as const },
};

interface BookingCardProps {
    booking: Booking;
    onCancel: (id: string) => void;
}

export default function BookingCard({ booking, onCancel }: BookingCardProps) {
    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0px 2px 12px rgba(0,0,0,0.06)",
                transition: "box-shadow 0.2s ease",
                "&:hover": {
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.10)",
                },
            }}
        >
            <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {booking.propertyId.title}
                    </Typography>
                    <Chip
                        label={statusMap[booking.status]?.label}
                        color={statusMap[booking.status]?.color}
                        size="small"
                        sx={{ fontWeight: 600, borderRadius: 2 }}
                    />
                </Box>

                {/* Location */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                    <LocationOnIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                        {typeof booking.propertyId.location === "string"
                            ? booking.propertyId.location
                            : booking.propertyId.address || "لا يوجد عنوان"}
                    </Typography>
                </Box>

                {/* Dates */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 3 }}>
                    <CalendarMonthIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                        {new Date(booking.startDate).toLocaleDateString("ar-EG")} ←{" "}
                        {new Date(booking.endDate).toLocaleDateString("ar-EG")}
                    </Typography>
                </Box>

                {/* Footer */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        pt: 2,
                        borderTop: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "primary.main" }}>
                        {booking.amountPaid.toLocaleString()} ج.م / شهر
                    </Typography>

                    {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" && (
                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            startIcon={<CancelOutlinedIcon />}
                            onClick={() => onCancel(booking._id)}
                            sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                px: 2,
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
    );
}