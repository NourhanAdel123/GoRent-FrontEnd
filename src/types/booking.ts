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
