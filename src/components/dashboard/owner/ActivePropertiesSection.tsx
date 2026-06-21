"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Property } from "../../../types/property";
import PropertyListItem from "./PropertyListItem";

type PropertyTab = "active" | "archive";

interface ActivePropertiesSectionProps {
  properties: Property[];
  isLoading: boolean;
}

export default function ActivePropertiesSection({
  properties,
  isLoading,
}: ActivePropertiesSectionProps) {
  const [activeTab, setActiveTab] = useState<PropertyTab>("active");

  const filteredProperties = useMemo(() => {
    if (activeTab === "active") {
      return properties.filter(
        (p) => p.status === "APPROVED" || p.status === "PENDING",
      );
    }
    return properties.filter((p) => p.status === "REJECTED");
  }, [properties, activeTab]);

  const displayedProperties = filteredProperties.slice(0, 4);
  const totalCount = properties.length;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-gray-900">عقاراتك النشطة</h2>
        <div className="inline-flex rounded-xl bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "active"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            نشطة
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("archive")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "archive"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            أرشيف
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>
      ) : displayedProperties.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center">
          <p className="text-gray-500">
            {activeTab === "active"
              ? "لا توجد عقارات نشطة حالياً"
              : "لا توجد عقارات في الأرشيف"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedProperties.map((property) => (
            <PropertyListItem
              key={property._id}
              property={property}
            />
          ))}
        </div>
      )}

      {totalCount > 0 && (
        <div className="mt-6 flex justify-center">
          <Link
            href="/dashboard/owner/properties"
            className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            عرض جميع العقارات ({totalCount.toLocaleString("ar-SA")})
          </Link>
        </div>
      )}
    </section>
  );
}
