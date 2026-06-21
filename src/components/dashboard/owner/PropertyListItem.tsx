"use client";

import Image from "next/image";
import { Eye, MessageSquare, Pencil, Trash2 } from "lucide-react";
import { Property } from "../../../types/property";
import {
  formatCurrency,
  formatPropertyLocation,
  formatRelativeTime,
} from "../../../lib/formatters";

interface PropertyListItemProps {
  property: Property;
  onEdit?: (property: Property) => void;
  onDelete?: (property: Property) => void;
  isDeleting?: boolean;
}

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='90' viewBox='0 0 120 90'%3E%3Crect fill='%23e5e7eb' width='120' height='90'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='12'%3Eلا توجد صورة%3C/text%3E%3C/svg%3E";

const STATUS_LABELS: Record<Property["status"], string> = {
  PENDING: "قيد المراجعة",
  APPROVED: "معتمد",
  REJECTED: "مرفوض",
};

const STATUS_COLORS: Record<Property["status"], string> = {
  PENDING: "bg-amber-50 text-amber-700",
  APPROVED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-red-50 text-red-700",
};

export default function PropertyListItem({
  property,
  onEdit,
  onDelete,
  isDeleting,
}: PropertyListItemProps) {
  const imageSrc = property.images?.[0] || PLACEHOLDER_IMAGE;
  const views = property.views ?? 0;
  const inquiries = property.viewingCount ?? 0;

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-[72px] w-[96px] shrink-0 overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={imageSrc}
          alt={property.title}
          fill
          className="object-cover"
          unoptimized={
            imageSrc.startsWith("data:") ||
            imageSrc.startsWith("http://localhost") ||
            imageSrc.includes("cloudinary.com")
          }
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-base font-bold text-gray-900">
            {property.title}
          </h3>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[property.status]}`}
          >
            {STATUS_LABELS[property.status]}
          </span>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
            {formatRelativeTime(property.updatedAt)}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">
          {formatPropertyLocation(property.location)}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1.5">
            <Eye className="h-4 w-4 text-gray-400" />
            {views.toLocaleString("ar-SA")} مشاهدة
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4 text-gray-400" />
            {inquiries.toLocaleString("ar-SA")} طلب معاينة
          </span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <p className="text-lg font-bold text-blue-600">
          {formatCurrency(property.pricePerMonth)}
        </p>
        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(property)}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
              aria-label="تعديل العقار"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(property)}
              disabled={isDeleting}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              aria-label="حذف العقار"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
