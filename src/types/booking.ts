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
  paymentId: string | null;
  ownerAccepted: boolean;
  status: "PENDING_OWNER_APPROVAL" | "REJECTED" | "PENDING_PAYMENT" | "RESERVED" | "CANCELLED";
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
  pricePerDay?: number;
  onClose: () => void;
}

// export type BookingStatus = "PENDING_PAYMENT" | "RESERVED" | "CANCELLED";
// 
// export interface BookingProperty {
//   _id: string;
//   title: string;
//   pricePerMonth?: number;
//   location?: string | { type: string; coordinates: number[] };
//   address?: string;
// }
// 
// export interface BookingTenant {
//   _id: string;
//   name: string;
//   email?: string;
// }
// 
// export interface Booking {
//   _id: string;
//   propertyId: BookingProperty;
//   tenantId: BookingTenant | string;
//   startDate: string;
//   endDate: string;
//   amountPaid: number;
//   status: BookingStatus;
//   createdAt: string;
// }
// 
// export interface OwnerBookingsResponse {
//   bookings: Booking[];
// }
