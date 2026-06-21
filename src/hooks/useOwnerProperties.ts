"use client";

import { useCallback, useEffect, useState } from "react";
import { propertyService } from "../services/property";
import { Property } from "../types/property";

export function useOwnerProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await propertyService.getOwnerProperties();
      setProperties(data.properties ?? []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "فشل تحميل العقارات";
      setError(message);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return {
    properties,
    isLoading,
    error,
    refetch: fetchProperties,
  };
}
