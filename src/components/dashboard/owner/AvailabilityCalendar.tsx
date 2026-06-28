"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

type DayStatus = "available" | "booked" | "default";

const WEEKDAYS = ["أحد", "إث", "ث", "أر", "خ", "ج", "س"];

// const STATUS_LABELS: Record<string, string> = {
//   PENDING_PAYMENT: "بانتظار الدفع",
//   RESERVED: "محجوز",
//   CANCELLED: "ملغي",
// };

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

interface AvailabilityCalendarProps {
  hasAvailableProperties?: boolean;
}

export default function AvailabilityCalendar(
  {
    // hasAvailableProperties = false,
  }: AvailabilityCalendarProps,
) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

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

  const dayStatusClasses: Record<DayStatus, string> = {
    available: "bg-blue-600 text-white",
    booked: "bg-rose-400 text-white",
    default: "text-gray-700 hover:bg-gray-100",
  };

  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarCells.push(day);

  function getDayStatus(day: number): DayStatus {
    return "default";
  }

  return (
    <section
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
      dir="rtl"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">تقويم التوفر</h2>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={goToNextMonth}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
          aria-label="الشهر التالي"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold text-gray-800">
          {monthLabel}
        </span>
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
                selectedDay === day ? "ring-2 ring-gray-400 ring-offset-1" : ""
              }`}
            >
              {day}
            </button>
          ),
        )}
      </div>
    </section>
  );
}
