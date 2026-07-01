// import { fetchApi } from "./auth";
// import { CreateBookingRequest, CreateBookingResponse } from "@/types/booking";

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// export const bookingService = {
//     getTenantBookings: async () => {
//         const token = localStorage.getItem("token");
//         const res = await fetch(`${API_URL}/api/bookings/tenant`, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`,
//             },
//         });
//         if (!res.ok) throw new Error("تعذر تحميل قائمة الحجوزات.");
//         return res.json();
//     },

//     cancelBooking: async (id: string) => {
//         const token = localStorage.getItem("token");
//         const res = await fetch(`${API_URL}/api/bookings/${id}/cancel`, {
//             method: "PATCH",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`,
//             },
//         });
//         if (!res.ok) throw new Error("تعذر إلغاء الحجز، يرجى المحاولة لاحقاً.");
//         return res.json();
//     },

//     createBooking: async (payload: CreateBookingRequest): Promise<CreateBookingResponse> => {
//         return fetchApi<CreateBookingResponse>("/api/bookings", {
//             method: "POST",
//             body: JSON.stringify(payload),
//         });
//     },
// };
import { fetchApi } from "./auth";
import {
  Booking,
  CreateBookingRequest,
  CreateBookingResponse,
  OwnerBookingsResponse,
  OwnerAnalytics,
} from "@/types/booking";

interface GetTenantBookingsResponse {
  bookings: Booking[];
}

export const bookingService = {
  // Tenant actions
  getTenantBookings: async (): Promise<GetTenantBookingsResponse> => {
    return fetchApi<GetTenantBookingsResponse>("/api/bookings/tenant");
  },
  cancelBooking: async (id: string) => {
    return fetchApi(`/api/bookings/${id}/cancel`, {
      method: "PATCH",
    });
  },
  createBooking: async (
    payload: CreateBookingRequest,
  ): Promise<CreateBookingResponse> => {
    return fetchApi<CreateBookingResponse>("/api/bookings", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Owner actions
  getOwnerBookings: async (
    year?: number,
    month?: number,
  ): Promise<OwnerBookingsResponse> => {
    const params = new URLSearchParams();
    if (year !== undefined) params.set("year", String(year));
    if (month !== undefined) params.set("month", String(month));
    const query = params.toString();
    return fetchApi<OwnerBookingsResponse>(
      `/api/bookings/owner${query ? `?${query}` : ""}`,
    );
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
