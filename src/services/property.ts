import { fetchApi } from "./auth";
import { Property, PropertyResponse, PropertyFilters } from "../types/property";

export const propertyService = {
  fetchProperties: async (
    filters?: PropertyFilters,
  ): Promise<PropertyResponse> => {
    let url = "/api/properties";
    if (filters) {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          queryParams.append(key, String(value));
        }
      });
      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    return fetchApi<PropertyResponse>(url);
  },
  fetchPropertyById: async (id: string): Promise<{ property: Property }> => {
    return fetchApi<{ property: Property }>(`/api/properties/${id}`);
  },
};
import {
  CreatePropertyPayload,
  CreatePropertyResponse,
  DeletePropertyResponse,
  OwnerDashboardResponse,
  OwnerPropertiesResponse,
  UpdatePropertyResponse,
} from "../types/property";

async function fetchJson<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(endpoint, {
    credentials: "include",
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? options.headers
        : { "Content-Type": "application/json", ...options.headers }),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "حدث خطأ أثناء تنفيذ الطلب");
  }

  return data as T;
}

function buildPropertyFormData(
  payload: CreatePropertyPayload,
  images: File[],
  existingImages?: string[],
): FormData {
  const formData = new FormData();
  formData.append("type", payload.type);
  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("pricePerMonth", String(payload.pricePerMonth));
  formData.append("squareFootage", String(payload.squareFootage));
  formData.append("location", JSON.stringify(payload.location));
  formData.append("isAvailable", String(payload.isAvailable));

  if (payload.specifications) {
    formData.append("specifications", JSON.stringify(payload.specifications));
  }

  if (existingImages !== undefined) {
    formData.append("existingImages", JSON.stringify(existingImages));
  }

  images.forEach((file) => formData.append("images", file));

  return formData;
}

export const propertyService = {
  getOwnerProperties: async (): Promise<OwnerPropertiesResponse> => {
    return fetchJson<OwnerPropertiesResponse>("/api/properties/get/owner");
  },

  getOwnerDashboard: async (): Promise<OwnerDashboardResponse> => {
    return fetchJson<OwnerDashboardResponse>("/api/properties/owner/dashboard");
  },

  createProperty: async (
    payload: CreatePropertyPayload,
    images: File[] = [],
  ): Promise<CreatePropertyResponse> => {
    return fetchJson<CreatePropertyResponse>("/api/properties", {
      method: "POST",
      body: buildPropertyFormData(payload, images),
    });
  },

  updateProperty: async (
    id: string,
    payload: CreatePropertyPayload,
    images: File[] = [],
    existingImages: string[] = [],
  ): Promise<UpdatePropertyResponse> => {
    return fetchJson<UpdatePropertyResponse>(`/api/properties/${id}`, {
      method: "PUT",
      body: buildPropertyFormData(payload, images, existingImages),
    });
  },

  deleteProperty: async (id: string): Promise<DeletePropertyResponse> => {
    return fetchJson<DeletePropertyResponse>(`/api/properties/${id}`, {
      method: "DELETE",
    });
  },
};
