"use client";

import { useRef, useState } from "react";
import { useOwnerProperties } from "../../../hooks/useOwnerProperties";
import { propertyService } from "../../../services/property";
import { Property } from "../../../types/property";
import PropertyForm from "./PropertyForm";
import PropertyListItem from "./PropertyListItem";

export default function OwnerPropertiesContent() {
  const { properties, isLoading, error, refetch } = useOwnerProperties();
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setDeleteError(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDelete = async (property: Property) => {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف "${property.title}"؟ لا يمكن التراجع عن هذا الإجراء.`,
    );
    if (!confirmed) return;

    try {
      setDeletingId(property._id);
      setDeleteError(null);
      await propertyService.deleteProperty(property._id);

      if (editingProperty?._id === property._id) {
        setEditingProperty(null);
      }

      await refetch();
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "فشل حذف العقار",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormSuccess = async () => {
    await refetch();
    if (editingProperty) {
      setEditingProperty(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          إدارة العقارات
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          أضف عقارات جديدة، عدّل أو احذف عقاراتك الحالية
        </p>
      </div>

      <div ref={formRef}>
        <PropertyForm
          property={editingProperty}
          onSuccess={handleFormSuccess}
          onCancel={() => setEditingProperty(null)}
        />
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-gray-900">عقاراتك</h2>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {deleteError && (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {deleteError}
          </p>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-gray-500">
            لا توجد عقارات بعد — استخدم النموذج أعلاه لإضافة أول عقار
          </div>
        ) : (
          <div className="space-y-3">
            {properties.map((property) => (
              <PropertyListItem
                key={property._id}
                property={property}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={deletingId === property._id}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
