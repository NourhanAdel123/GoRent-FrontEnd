import { fetchApi } from "./auth";
import { CreateBookingRequest, CreateBookingResponse } from "@/types/booking";

export const bookingService = {
    getTenantBookings: async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/bookings/tenant", {
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        if (!res.ok) throw new Error("فشل جلب الحجوزات");
        return res.json();
    },

    cancelBooking: async (id: string) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/bookings/${id}/cancel`, {
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        if (!res.ok) throw new Error("فشل إلغاء الحجز");
        return res.json();
    },

    createBooking: async (payload: CreateBookingRequest): Promise<CreateBookingResponse> => {
        return fetchApi<CreateBookingResponse>("/api/bookings", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },
};