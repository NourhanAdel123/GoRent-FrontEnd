"use client";

import React, { useState, useEffect, useCallback } from "react";
import { bookingService } from "@/services/booking";
import { BookingModalProps, CreateBookingResponse } from "@/types/booking";
import BookingModalHeader from "../Booking/BookingModalHeader";
import BookingFormStep from "../Booking//BookingFormStep";
import BookingSuccessStep from "../Booking/BookingSuccessStep";

export default function BookingModal({ propertyId, pricePerMonth, onClose }: BookingModalProps) {
  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<CreateBookingResponse | null>(null);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  // Derived calculations — use calendar arithmetic to avoid 31-day month rounding bugs
  const estimatedMonths = (() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    // Add 1 if there are extra days beyond the full months
    const dayRemainder =
      end.getDate() > start.getDate()
        ? 1
        : 0;
    return Math.max(0, months + dayRemainder);
  })();
  const estimatedTotal = estimatedMonths * pricePerMonth;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!startDate || !endDate) {
      setError("يرجى تحديد تاريخ البداية والنهاية.");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setError("يجب أن يكون تاريخ النهاية بعد تاريخ البداية.");
      return;
    }

    setLoading(true);
    try {
      const result = await bookingService.createBooking({ propertyId, startDate, endDate });
      setSuccess(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع، حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <BookingModalHeader onClose={onClose} />

        <div className="p-6">
          {success ? (
            <BookingSuccessStep
              booking={success.booking}
              message={success.message}
              onClose={onClose}
            />
          ) : (
            <BookingFormStep
              today={today}
              startDate={startDate}
              endDate={endDate}
              pricePerMonth={pricePerMonth}
              estimatedMonths={estimatedMonths}
              estimatedTotal={estimatedTotal}
              loading={loading}
              error={error}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onSubmit={handleSubmit}
              onCancel={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
