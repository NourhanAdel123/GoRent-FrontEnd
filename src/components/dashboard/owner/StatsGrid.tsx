"use client";

import {
  CalendarCheck,
  Eye,
  FileText,
  LucideIcon,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { formatCurrency } from "../../../lib/formatters";
import { OwnerDashboardStats } from "../../../types/property";

export interface StatCardData {
  label: string;
  value: number;
  change: number;
  icon: LucideIcon;
  isCurrency?: boolean;
}

interface StatCardProps {
  stat: StatCardData;
}

function formatChange(change: number) {
  const prefix = change > 0 ? "+ " : change < 0 ? "- " : "";
  return `${prefix}${Math.abs(change)}%`;
}

function StatCard({ stat }: StatCardProps) {
  const Icon = stat.icon;
  const isPositive = stat.change > 0;
  const isNegative = stat.change < 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
            isPositive
              ? "bg-emerald-50 text-emerald-600"
              : isNegative
                ? "bg-red-50 text-red-600"
                : "bg-gray-100 text-gray-500"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : isNegative ? (
            <TrendingDown className="h-3 w-3" />
          ) : null}
          {formatChange(stat.change)}
        </span>
      </div>
      <p className="text-sm text-gray-500">{stat.label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">
        {stat.isCurrency
          ? formatCurrency(stat.value)
          : stat.value.toLocaleString("ar-SA")}
      </p>
    </div>
  );
}

interface StatsGridProps {
  stats: OwnerDashboardStats;
  isLoading?: boolean;
}

export default function StatsGrid({ stats, isLoading }: StatsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl bg-gray-100"
          />
        ))}
      </div>
    );
  }

  const cards: StatCardData[] = [
    {
      label: "إجمالي المشاهدات",
      value: stats.totalViews,
      change: stats.changes.totalViews,
      icon: Eye,
    },
    {
      label: "العقود النشطة",
      value: stats.activeContracts,
      change: stats.changes.activeContracts,
      icon: FileText,
    },
    {
      label: "طلبات المعاينة",
      value: stats.viewingRequests,
      change: stats.changes.viewingRequests,
      icon: CalendarCheck,
    },
    {
      label: "الدخل الشهري",
      value: stats.monthlyIncome,
      change: stats.changes.monthlyIncome,
      icon: Wallet,
      isCurrency: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}
