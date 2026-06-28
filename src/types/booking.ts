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

// --- Owner-specific types ---

export type BookingStatus =
  | "PENDING_OWNER_APPROVAL"
  | "PENDING_PAYMENT"
  | "RESERVED"
  | "REJECTED"
  | "CANCELLED";

export interface OwnerBookingTenant {
  _id: string;
  name: string;
  email: string;
}

export interface OwnerBookingProperty {
  _id: string;
  title: string;
}

export interface OwnerBooking {
  _id: string;
  propertyId: OwnerBookingProperty;
  tenantId: OwnerBookingTenant;
  status: BookingStatus;
  ownerAccepted: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface OwnerBookingsResponse {
  bookings: OwnerBooking[];
}

export interface MonthlyTrendItem {
  label: string;
  total: number;
  reserved: number;
  cancelled: number;
}

export interface PerPropertyStat {
  title: string;
  total: number;
  reserved: number;
  rejected: number;
  cancelled: number;
  pending: number;
}

export interface OwnerAnalytics {
  statusBreakdown: {
    PENDING_OWNER_APPROVAL: number;
    PENDING_PAYMENT: number;
    RESERVED: number;
    REJECTED: number;
    CANCELLED: number;
  };
  monthlyTrend: MonthlyTrendItem[];
  perProperty: PerPropertyStat[];
  totals: {
    total: number;
    reserved: number;
    acceptanceRate: number;
    cancellationRate: number;
  };
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
