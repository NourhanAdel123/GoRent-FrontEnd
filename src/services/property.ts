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
