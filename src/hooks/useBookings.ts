"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Booking } from "../types/booking";
import { bookingService } from "../services/booking";

export function useBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isMounted = useRef(false);

    const fetchBookings = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await bookingService.getTenantBookings();
            setBookings(data.bookings);
        } catch {
            setError("عذراً، واجهنا مشكلة في تحميل حجوزاتك.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const cancelBooking = async (id: string) => {
        try {
            await bookingService.cancelBooking(id);
            await fetchBookings();
        } catch {
            setError("عذراً، لم نتمكن من إلغاء الحجز، حاول مرة أخرى.");
        }
    };

    // Initial load
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            fetchBookings();
        }
    }, [fetchBookings]);

    // Refetch when user returns from Paymob payment page
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                fetchBookings();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [fetchBookings]);

    return { bookings, isLoading, error, cancelBooking, fetchBookings };
}