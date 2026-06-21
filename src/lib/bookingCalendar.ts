import { Booking } from "../types/booking";

export function getBookedDaysInMonth(
  bookings: Booking[],
  year: number,
  month: number,
): Set<number> {
  const bookedDays = new Set<number>();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (const booking of bookings) {
    if (booking.status === "CANCELLED") continue;

    const rangeStart = new Date(booking.startDate);
    const rangeEnd = new Date(booking.endDate);

    for (let day = 1; day <= daysInMonth; day++) {
      const dayStart = new Date(year, month, day);
      const dayEnd = new Date(year, month, day, 23, 59, 59, 999);

      if (dayEnd >= rangeStart && dayStart <= rangeEnd) {
        bookedDays.add(day);
      }
    }
  }

  return bookedDays;
}

export function getBookingsForDay(
  bookings: Booking[],
  year: number,
  month: number,
  day: number,
): Booking[] {
  const dayStart = new Date(year, month, day);
  const dayEnd = new Date(year, month, day, 23, 59, 59, 999);

  return bookings.filter((booking) => {
    if (booking.status === "CANCELLED") return false;
    const rangeStart = new Date(booking.startDate);
    const rangeEnd = new Date(booking.endDate);
    return dayEnd >= rangeStart && dayStart <= rangeEnd;
  });
}

export function getAvailableDaysInMonth(
  bookings: Booking[],
  year: number,
  month: number,
  hasAvailableProperties: boolean,
): Set<number> {
  if (!hasAvailableProperties) return new Set();

  const bookedDays = getBookedDaysInMonth(bookings, year, month);
  const availableDays = new Set<number>();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let day = 1; day <= daysInMonth; day++) {
    const current = new Date(year, month, day);
    if (!bookedDays.has(day) && current >= today) {
      availableDays.add(day);
    }
  }

  return availableDays;
}
