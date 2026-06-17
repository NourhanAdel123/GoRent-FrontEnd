"use client";

import { useState, useEffect, useCallback } from "react";
import { Booking } from "../types/booking";
import { bookingService } from "../services/booking";

export function useBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBookings = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await bookingService.getTenantBookings();
            setBookings(data.bookings);
        } catch {
            setError("فشل جلب الحجوزات");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const cancelBooking = async (id: string) => {
        try {
            await bookingService.cancelBooking(id);
            await fetchBookings();
        } catch {
            setError("فشل إلغاء الحجز");
        }
    };

    useEffect(() => {
        let ignore = false;

        const load = async () => {
            try {
                setIsLoading(true);
                const data = await bookingService.getTenantBookings();
                if (!ignore) setBookings(data.bookings);
            } catch {
                if (!ignore) setError("فشل جلب الحجوزات");
            } finally {
                if (!ignore) setIsLoading(false);
            }
        };

        load();

        return () => {
            ignore = true;
        };
    }, []);

    return { bookings, isLoading, error, cancelBooking };
}