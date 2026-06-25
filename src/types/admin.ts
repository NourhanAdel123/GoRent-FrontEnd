export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}
export interface PropertiesResponse {
  properties: AdminProperty[];
  pagination: {
    totalItems: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}
export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "tenant" | "owner" | "admin" | "superadmin";
  phone?: string;
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
}

export interface AdminProperty {
  _id: string;
  title: string;
  ownerName: string;
  location: string;
  pricePerMonth: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export interface AdminReview {
  _id: string;
  propertyTitle: string;
  tenantName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AdminDispute {
  _id: string;
  propertyTitle: string;
  tenantName: string;
  ownerName: string;
  subject: string;
  description: string;
  status: "OPEN" | "IN_REVIEW" | "RESOLVED" | "REJECTED";
  createdAt: string;
}

export interface TopProperty {
  title: string;
  bookings: number;
  revenue: number;
}

export interface PlatformReport {
  totalUsers: number;
  totalOwners: number;
  totalTenants: number;
  totalProperties: number;
  approvedProperties: number;
  pendingProperties: number;
  totalBookings: number;
  totalRevenue: number;
  openDisputes: number;
  resolvedDisputes: number;
  averageRating: number;
  topProperties: TopProperty[];
}
