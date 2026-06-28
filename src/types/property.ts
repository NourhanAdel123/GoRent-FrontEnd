export type PropertyStatus = "PENDING" | "APPROVED" | "REJECTED";
export type PropertyType = "APARTMENT" | "SHOP";

export interface PropertyLocation {
  type: "Point";
  coordinates: [number, number];
}

export interface PropertySpecifications {
  apartment?: {
    bedrooms?: number | null;
    bathrooms?: number | null;
    hasElevator?: boolean | null;
  };
  shop?: {
    electricityCapacity?: number | null;
    footTrafficTier?: string | null;
    commercialLicenseRequired?: boolean | null;
  };
}

export interface Property {
  _id: string;
  ownerId: string;
  type: PropertyType;
  title: string;
  description: string;
  pricePerMonth: number;
  squareFootage: number;
  images: string[];
  views?: number;
  viewingCount?: number;
  location: PropertyLocation;
  isAvailable: boolean;
  status: PropertyStatus;
  specifications?: PropertySpecifications;
  createdAt: string;
  updatedAt: string;
}

export interface OwnerPropertiesResponse {
  properties: Property[];
}

export interface OwnerDashboardStats {
  totalViews: number;
  activeContracts: number;
  viewingRequests: number;
  monthlyIncome: number;
  changes: {
    totalViews: number;
    activeContracts: number;
    viewingRequests: number;
    monthlyIncome: number;
  };
}

export interface OwnerDashboardResponse {
  stats: OwnerDashboardStats;
  properties: Property[];
}

export interface CreatePropertyPayload {
  type: PropertyType;
  title: string;
  description: string;
  pricePerMonth: number;
  squareFootage: number;
  location: PropertyLocation;
  isAvailable: boolean;
  specifications?: {
    apartment?: {
      bedrooms?: number;
      bathrooms?: number;
      hasElevator?: boolean;
    };
    shop?: {
      electricityCapacity?: number;
      footTrafficTier?: string;
      commercialLicenseRequired?: boolean;
    };
  };
}

export interface CreatePropertyResponse {
  message: string;
  property: Property;
}

export interface UpdatePropertyResponse {
  message: string;
  property: Property;
}

export interface DeletePropertyResponse {
  message: string;
}

export interface PropertyFormValues {
  title: string;
  description: string;
  type: PropertyType;
  pricePerMonth: string;
  squareFootage: string;
  isAvailable: boolean;
  bedrooms: string;
  bathrooms: string;
  hasElevator: boolean;
  electricityCapacity: string;
  footTrafficTier: string;
  commercialLicenseRequired: boolean;
}
export interface Property {
  _id: string;
  title: string;
  description: string;
  type: "APARTMENT" | "SHOP";
  pricePerMonth: number;
  squareFootage: number;
  images: string[];
  isAvailable: boolean;
  status: string;
  location: {
    type: string;
    coordinates: number[];
  };
  specifications: {
    apartment?: {
      bedrooms: number | null;
      bathrooms: number | null;
      hasElevator: boolean | null;
    };
    shop?: {
      electricityCapacity: number | null;
      footTrafficTier: string | null;
      commercialLicenseRequired: boolean | null;
    };
  };
  ownerId: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface PropertyCardProps {
  property: Property;
}

export interface PropertyResponse {
  properties: Property[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface PropertyFilters {
  page?: number;
  limit?: number;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  bedrooms?: number;
  bathrooms?: number;
  lng?: number;
  lat?: number;
  radius?: number;
  [key: string]: unknown;
}
