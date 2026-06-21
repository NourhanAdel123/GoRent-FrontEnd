"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useOwnerBookings } from "../../../hooks/useOwnerBookings";
import {
  getAvailableDaysInMonth,
  getBookedDaysInMonth,
  getBookingsForDay,
} from "../../../lib/bookingCalendar";

type DayStatus = "available" | "booked" | "default";

const WEEKDAYS = ["أحد", "إث", "ث", "أر", "خ", "ج", "س"];

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "بانتظار الدفع",
  RESERVED: "محجوز",
  CANCELLED: "ملغي",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

interface AvailabilityCalendarProps {
  hasAvailableProperties?: boolean;
}

export default function AvailabilityCalendar({
  hasAvailableProperties = false,
}: AvailabilityCalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const { bookings, isLoading, error } = useOwnerBookings(
    currentYear,
    currentMonth,
  );

  const bookedDays = useMemo(
    () => getBookedDaysInMonth(bookings, currentYear, currentMonth),
    [bookings, currentYear, currentMonth],
  );

  const availableDays = useMemo(
    () =>
      getAvailableDaysInMonth(
        bookings,
        currentYear,
        currentMonth,
        hasAvailableProperties,
      ),
    [bookings, currentYear, currentMonth, hasAvailableProperties],
  );

  const selectedDayBookings = useMemo(() => {
    if (selectedDay === null) return [];
    return getBookingsForDay(
      bookings,
      currentYear,
      currentMonth,
      selectedDay,
    );
  }, [bookings, currentYear, currentMonth, selectedDay]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const monthLabel = new Intl.DateTimeFormat("ar-SA", {
    month: "long",
    year: "numeric",
  }).format(new Date(currentYear, currentMonth));

  const goToPrevMonth = () => {
    setSelectedDay(null);
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    setSelectedDay(null);
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const getDayStatus = (day: number): DayStatus => {
    if (bookedDays.has(day)) return "booked";
    if (availableDays.has(day)) return "available";
    return "default";
  };

  const dayStatusClasses: Record<DayStatus, string> = {
    available: "bg-blue-600 text-white",
    booked: "bg-rose-400 text-white",
    default: "text-gray-700 hover:bg-gray-100",
  };

  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarCells.push(day);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">تقويم التوفر</h2>
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>

      {error && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
          {error}
        </p>
      )}

      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={goToNextMonth}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
          aria-label="الشهر التالي"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold text-gray-800">{monthLabel}</span>
        <button
          type="button"
          onClick={goToPrevMonth}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
          aria-label="الشهر السابق"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((day) => (
          <span key={day} className="py-1 text-xs font-medium text-gray-400">
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarCells.map((day, index) =>
          day === null ? (
            <div key={`empty-${index}`} className="aspect-square" />
          ) : (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`aspect-square rounded-lg text-sm font-medium transition-colors ${dayStatusClasses[getDayStatus(day)]} ${
                day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear()
                  ? "ring-2 ring-blue-300 ring-offset-1"
                  : ""
              } ${
                selectedDay === day
                  ? "ring-2 ring-gray-400 ring-offset-1"
                  : ""
              }`}
            >
              {day}
            </button>
          ),
        )}
      </div>

      <div className="mt-4 flex items-center justify-center gap-5 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-blue-600" />
          متاح
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-rose-400" />
          محجوز
        </span>
      </div>

      {selectedDay !== null && (
        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
          <p className="mb-2 text-sm font-semibold text-gray-800">
            {selectedDay} {monthLabel}
          </p>
          {selectedDayBookings.length === 0 ? (
            <p className="text-xs text-gray-500">
              {bookedDays.has(selectedDay)
                ? "لا توجد تفاصيل حجز"
                : "لا توجد حجوزات في هذا اليوم"}
            </p>
          ) : (
            <ul className="space-y-2">
              {selectedDayBookings.map((booking) => {
                const propertyTitle =
                  typeof booking.propertyId === "object"
                    ? booking.propertyId.title
                    : "عقار";
                const tenantName =
                  typeof booking.tenantId === "object"
                    ? booking.tenantId.name
                    : "مستأجر";

                return (
                  <li
                    key={booking._id}
                    className="rounded-lg bg-white px-3 py-2 text-xs text-gray-600"
                  >
                    <p className="font-medium text-gray-800">{propertyTitle}</p>
                    <p>{tenantName}</p>
                    <p className="text-gray-400">
                      {new Date(booking.startDate).toLocaleDateString("ar-SA")}{" "}
                      —{" "}
                      {new Date(booking.endDate).toLocaleDateString("ar-SA")}
                    </p>
                    <span className="mt-1 inline-block rounded-full bg-rose-50 px-2 py-0.5 text-[10px] text-rose-600">
                      {STATUS_LABELS[booking.status] ?? booking.status}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
