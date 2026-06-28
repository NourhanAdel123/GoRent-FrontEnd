"use client";

import { useCallback, useEffect, useState } from "react";
import { bookingService } from "../services/booking";
import { OwnerAnalytics } from "../types/booking";

const emptyAnalytics: OwnerAnalytics = {
  statusBreakdown: {
    PENDING_OWNER_APPROVAL: 0,
    PENDING_PAYMENT: 0,
    RESERVED: 0,
    REJECTED: 0,
    CANCELLED: 0,
  },
  monthlyTrend: [],
  perProperty: [],
  totals: { total: 0, reserved: 0, acceptanceRate: 0, cancellationRate: 0 },
};

export function useOwnerAnalytics() {
  const [analytics, setAnalytics] = useState<OwnerAnalytics>(emptyAnalytics);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await bookingService.getOwnerAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل تحميل التحليلات");
      setAnalytics(emptyAnalytics);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { analytics, isLoading, error, refetch: fetchAnalytics };
}
