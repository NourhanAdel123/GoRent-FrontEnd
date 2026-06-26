export interface Booking {
    _id: string;
    propertyId: {
        _id: string;
        title: string;
        pricePerMonth: number;
        pricePerDay?: number;
        location: string | { type: string; coordinates: number[] };
        address?: string;
    } | null;
    tenantId: string;
    paymentId?: string | null;
    ownerAccepted: boolean;
    status: "PENDING_OWNER_APPROVAL" | "REJECTED" | "PENDING_PAYMENT" | "RESERVED" | "CANCELLED";
    contractPdfUrl?: string;
    signatures: {
        tenantSigned: boolean;
        ownerSigned: boolean;
    };
    startDate: string;
    endDate: string;
    createdAt: string;
}