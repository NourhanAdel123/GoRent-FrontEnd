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

export interface CreateBookingRequest {
  propertyId: string;
  startDate: string;
  endDate: string;
}

export interface BookingSignatures {
  tenantSigned: boolean;
  ownerSigned: boolean;
}

export interface CreatedBooking {
  _id: string;
  propertyId: string;
  tenantId: string;
  stripePaymentIntentId: string;
  amountPaid: number;
  status: "PENDING" | "APPROVED" | "CANCELLED";
  contractPdfUrl: string;
  signatures: BookingSignatures;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateBookingResponse {
  message: string;
  booking: CreatedBooking;
}

export interface BookingModalProps {
  propertyId: string;
  pricePerMonth: number;
  onClose: () => void;
}
