export interface Property {
  _id: string;
  title: string;
  description: string;
  type: "RESIDENTIAL" | "COMMERCIAL";
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
