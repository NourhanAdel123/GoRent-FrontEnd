"use client";

import { Box, Typography, Skeleton, Alert } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useBookings } from "../../../hooks/useBookings";
import BookingCard from "../../Booking/BookingCard";

export default function BookingsTab() {
    const { bookings, isLoading, error, cancelBooking } = useBookings();

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                ))}
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (bookings.length === 0) {
        return (
            <Box sx={{ textAlign: "center", py: 8 }}>
                <CalendarMonthIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                    لا توجد حجوزات حتى الآن
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: '100%' }}>
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