export interface Booking {
    _id: string;
    propertyId: {
        _id: string;
        title: string;
        pricePerMonth: number;
        location: string | { type: string; coordinates: number[] };
        address?: string;
    };
    tenantId: string;
    startDate: string;
    endDate: string;
    amountPaid: number;
    status: "PENDING_PAYMENT" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
    createdAt: string;
}