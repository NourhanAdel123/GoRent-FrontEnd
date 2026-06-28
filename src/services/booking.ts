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
//         if (!res.ok) throw new Error("فشل جلب الحجوزات");
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
//         if (!res.ok) throw new Error("فشل إلغاء الحجز");
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
import { CreateBookingRequest, CreateBookingResponse } from "@/types/booking";

export const bookingService = {
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
};
// import { Booking, OwnerBookingsResponse } from "../types/booking";
// 
// async function fetchJson<T>(
//   endpoint: string,
//   options: RequestInit = {},
// ): Promise<T> {
//   const response = await fetch(endpoint, {
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//       ...options.headers,
//     },
//     ...options,
//   });
// 
//   const data = await response.json();
// 
//   if (!response.ok) {
//     throw new Error(data.message || "حدث خطأ أثناء جلب الحجوزات");
//   }
// 
//   return data as T;
// }
// 
// export const bookingService = {
//   getTenantBookings: async (): Promise<OwnerBookingsResponse> => {
//     return fetchJson<OwnerBookingsResponse>("/api/bookings/tenant");
//   },
// 
//   getOwnerBookings: async (
//     year: number,
//     month: number,
//   ): Promise<OwnerBookingsResponse> => {
//     const params = new URLSearchParams({
//       year: String(year),
//       month: String(month + 1),
//     });
//     return fetchJson<OwnerBookingsResponse>(
//       `/api/bookings/owner?${params.toString()}`,
//     );
//   },
// 
//   cancelBooking: async (id: string) => {
//     return fetchJson<{ message: string }>(`/api/bookings/${id}/cancel`, {
//       method: "PATCH",
//     });
//   },
// };
// 
// export type { Booking };
