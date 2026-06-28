import { fetchApi } from "./auth";

const validateObjectId = (id: string, label: string) => {
    if (!id || typeof id !== "string") {
        throw new Error(`${label} is required`);
    }
    if (!/^[a-f\d]{24}$/i.test(id)) {
        throw new Error(`Invalid ${label}`);
    }
};

export interface PaymentResponse {
    paymentUrl: string;
    orderId?: string;
}

export const paymentService = {
    initiateBookingFeePayment: async (bookingId: string): Promise<PaymentResponse> => {
        validateObjectId(bookingId, "booking ID");
        return fetchApi<PaymentResponse>(`/api/payment/booking-fee/${bookingId}`, {
            method: "POST",
        });
    },

    initiateListingFeePayment: async (propertyId: string): Promise<PaymentResponse> => {
        validateObjectId(propertyId, "property ID");
        return fetchApi<PaymentResponse>(`/api/payment/listing-fee/${propertyId}`, {
            method: "POST",
        });
    },
};