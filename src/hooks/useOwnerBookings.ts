"use client";

import { useCallback, useEffect, useState } from "react";
import { bookingService } from "../services/booking";
import { OwnerBooking } from "../types/booking";

export function useOwnerBookings(year?: number, month?: number) {
  const [bookings, setBookings] = useState<OwnerBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await bookingService.getOwnerBookings(year, month);
      setBookings(data.bookings ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل تحميل الحجوزات");
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const acceptBooking = async (id: string) => {
    try {
      setActionLoading(id);
      await bookingService.acceptBooking(id);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "PENDING_PAYMENT" as const, ownerAccepted: true } : b))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل قبول الحجز");
    } finally {
      setActionLoading(null);
    }
  };

  const rejectBooking = async (id: string) => {
    try {
      setActionLoading(id);
      await bookingService.rejectBooking(id);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "REJECTED" as const } : b))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل رفض الحجز");
    } finally {
      setActionLoading(null);
    }
  };

  return { bookings, isLoading, error, actionLoading, acceptBooking, rejectBooking, refetch: fetchBookings };
}
