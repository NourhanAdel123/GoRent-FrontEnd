import { fetchApi } from "./auth";
import { CreateBookingRequest, CreateBookingResponse, OwnerBookingsResponse, OwnerAnalytics } from "@/types/booking";

export const bookingService = {
  // Tenant actions
  getTenantBookings: async () => {
    return fetchApi("/api/bookings/tenant");
  },

  cancelBooking: async (id: string) => {
    return fetchApi(`/api/bookings/${id}/cancel`, {
      method: "PATCH",
    });
  },

  createBooking: async (payload: CreateBookingRequest): Promise<CreateBookingResponse> => {
    return fetchApi<CreateBookingResponse>("/api/bookings", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Owner actions
  getOwnerBookings: async (year?: number, month?: number): Promise<OwnerBookingsResponse> => {
    const params = new URLSearchParams();
    if (year !== undefined) params.set("year", String(year));
    if (month !== undefined) params.set("month", String(month));
    const query = params.toString();
    return fetchApi<OwnerBookingsResponse>(`/api/bookings/owner${query ? `?${query}` : ""}`);
  },

  acceptBooking: async (id: string): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>(`/api/bookings/${id}/accept`, {
      method: "PATCH",
    });
  },

  rejectBooking: async (id: string): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>(`/api/bookings/${id}/reject`, {
      method: "PATCH",
    });
  },

  getOwnerAnalytics: async (): Promise<OwnerAnalytics> => {
    return fetchApi<OwnerAnalytics>("/api/bookings/owner/analytics");
  },
};
