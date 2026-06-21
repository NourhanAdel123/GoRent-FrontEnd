import { Booking, OwnerBookingsResponse } from "../types/booking";

async function fetchJson<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(endpoint, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "حدث خطأ أثناء جلب الحجوزات");
  }

  return data as T;
}

export const bookingService = {
  getTenantBookings: async (): Promise<OwnerBookingsResponse> => {
    return fetchJson<OwnerBookingsResponse>("/api/bookings/tenant");
  },

  getOwnerBookings: async (
    year: number,
    month: number,
  ): Promise<OwnerBookingsResponse> => {
    const params = new URLSearchParams({
      year: String(year),
      month: String(month + 1),
    });
    return fetchJson<OwnerBookingsResponse>(
      `/api/bookings/owner?${params.toString()}`,
    );
  },

  cancelBooking: async (id: string) => {
    return fetchJson<{ message: string }>(`/api/bookings/${id}/cancel`, {
      method: "PATCH",
    });
  },
};

export type { Booking };
