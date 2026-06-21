"use client";

import { useCallback, useEffect, useState } from "react";
import { propertyService } from "../services/property";
import { OwnerDashboardStats, Property } from "../types/property";

const emptyStats: OwnerDashboardStats = {
  totalViews: 0,
  activeContracts: 0,
  viewingRequests: 0,
  monthlyIncome: 0,
  changes: {
    totalViews: 0,
    activeContracts: 0,
    viewingRequests: 0,
    monthlyIncome: 0,
  },
};

export function useOwnerDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState<OwnerDashboardStats>(emptyStats);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await propertyService.getOwnerDashboard();
      setProperties(data.properties ?? []);
      setStats(data.stats ?? emptyStats);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "فشل تحميل لوحة التحكم";
      setError(message);
      setProperties([]);
      setStats(emptyStats);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    properties,
    stats,
    isLoading,
    error,
    refetch: fetchDashboard,
  };
}
