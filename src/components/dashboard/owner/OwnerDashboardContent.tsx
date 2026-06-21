"use client";

import { AlertCircle } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useOwnerDashboard } from "../../../hooks/useOwnerDashboard";
import WelcomeBanner from "./WelcomeBanner";
import StatsGrid from "./StatsGrid";
import ActivePropertiesSection from "./ActivePropertiesSection";
import AvailabilityCalendar from "./AvailabilityCalendar";
import MediaManagement from "./MediaManagement";

export default function OwnerDashboardContent() {
  const { user } = useAuth();
  const { properties, stats, isLoading, error } = useOwnerDashboard();

  return (
    <div className="space-y-6">
      <WelcomeBanner userName={user?.name} />

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <StatsGrid stats={stats} isLoading={isLoading} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px]">
        <ActivePropertiesSection
          properties={properties}
          isLoading={isLoading}
        />

        <aside className="space-y-6">
          <AvailabilityCalendar
            hasAvailableProperties={properties.some(
              (p) => p.isAvailable && p.status === "APPROVED",
            )}
          />
          <MediaManagement properties={properties} />
        </aside>
      </div>
    </div>
  );
}
