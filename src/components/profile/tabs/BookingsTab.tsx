"use client";

import { Box, Typography, Skeleton, Alert, IconButton, Tooltip } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useBookings } from "../../../hooks/useBookings";
import BookingCard from "../../Booking/BookingCard";

function BookingSkeleton() {
    return (
        <Box
            sx={{
                display: "flex",
                gap: 2,
                p: 2.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
            }}
        >
            <Skeleton variant="rectangular" width={90} height={90} sx={{ borderRadius: 2, flexShrink: 0 }} />
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1.5, justifyContent: "center" }}>
                <Skeleton variant="text" sx={{ fontSize: "1.1rem", width: "70%" }} />
                <Skeleton variant="text" sx={{ fontSize: "0.875rem", width: "50%" }} />
                <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                    <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
                </Box>
            </Box>
        </Box>
    );
}

export default function BookingsTab() {
    const { bookings, isLoading, error, cancelBooking, fetchBookings } = useBookings();

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {[1, 2, 3].map((i) => (
                    <BookingSkeleton key={i} />
                ))}
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (bookings.length === 0) {
        return (
            <Box
                sx={{
                    textAlign: "center",
                    py: { xs: 6, md: 10 },
                    px: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        width: 140,
                        height: 140,
                        borderRadius: "50%",
                        bgcolor: "background.default",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 4,
                        border: "2px dashed",
                        borderColor: "divider",
                    }}
                >
                    <CalendarMonthIcon sx={{ fontSize: 64, color: "primary.main", opacity: 0.5 }} />
                </Box>
                <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700, mb: 1 }}>
                    لا توجد حجوزات حتى الآن
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                    ابدأ بالبحث عن عقارك المثالي وقم بإتمام عملية الحجز
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, width: "100%" }}>
            {/* Header with refresh button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Tooltip title="Refresh bookings">
                    <IconButton onClick={fetchBookings} size="small">
                        <RefreshIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>

            {bookings.map((booking) => (
                <BookingCard
                    key={booking._id}
                    booking={booking}
                    onCancel={cancelBooking}
                />
            ))}
        </Box>
    );
}