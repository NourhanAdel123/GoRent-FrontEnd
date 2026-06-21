"use client";

import { useCallback, useEffect, useState } from "react";
import { bookingService } from "../services/booking";
import { Booking } from "../types/booking";

export function useOwnerBookings(year: number, month: number) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await bookingService.getOwnerBookings(year, month);
      setBookings(data.bookings ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "فشل تحميل الحجوزات",
      );
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, isLoading, error, refetch: fetchBookings };
}
