export const paymentService = {
    initiateBookingFeePayment: async (bookingId: string) => {
        const res = await fetch(`/api/payments/booking-fee/${bookingId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "فشل بدء عملية الدفع");
        }
        return res.json();
    },

    initiateListingFeePayment: async (propertyId: string) => {
        const res = await fetch(`/api/payments/listing-fee/${propertyId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "فشل بدء عملية الدفع");
        }
        return res.json();
    },
};