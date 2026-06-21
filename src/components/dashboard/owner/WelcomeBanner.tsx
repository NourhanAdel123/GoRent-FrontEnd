"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

interface WelcomeBannerProps {
  userName?: string;
}

export default function WelcomeBanner({ userName = "أحمد" }: WelcomeBannerProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          مرحباً بك، {userName}
        </h1>
        <p className="mt-1 text-sm text-gray-500 sm:text-base">
          إليك نظرة سريعة على أداء عقاراتك ونشاطك الأخير
        </p>
      </div>
      <Link
        href="/dashboard/owner/properties"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
      >
        <Plus className="h-5 w-5" />
        إضافة عقار جديد
      </Link>
    </div>
  );
}
