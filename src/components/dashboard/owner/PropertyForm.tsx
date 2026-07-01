"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { propertyService } from "../../../services/property";
import {
  CreatePropertyPayload,
  Property,
  PropertyFormValues,
} from "../../../types/property";
import LocationPicker, { MapCoordinates } from "./LocationPicker";
import ImageUploader from "./ImageUploader";

interface PropertyFormProps {
  property?: Property | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const emptyValues: PropertyFormValues = {
  title: "",
  description: "",
  type: "APARTMENT",
  pricePerMonth: "",
  squareFootage: "",
  isAvailable: true,
  bedrooms: "",
  bathrooms: "",
  hasElevator: false,
  electricityCapacity: "",
  footTrafficTier: "",
  commercialLicenseRequired: false,
};

function propertyToFormValues(property: Property): PropertyFormValues {
  const apt = property.specifications?.apartment;
  const shop = property.specifications?.shop;

  return {
    title: property.title,
    description: property.description,
    type: property.type,
    pricePerMonth: String(property.pricePerMonth),
    squareFootage: String(property.squareFootage),
    isAvailable: property.isAvailable,
    bedrooms: apt?.bedrooms != null ? String(apt.bedrooms) : "",
    bathrooms: apt?.bathrooms != null ? String(apt.bathrooms) : "",
    hasElevator: apt?.hasElevator ?? false,
    electricityCapacity:
      shop?.electricityCapacity != null
        ? String(shop.electricityCapacity)
        : "",
    footTrafficTier: shop?.footTrafficTier ?? "",
    commercialLicenseRequired: shop?.commercialLicenseRequired ?? false,
  };
}

function buildPayload(
  values: PropertyFormValues,
  location: MapCoordinates,
): CreatePropertyPayload {
  const payload: CreatePropertyPayload = {
    type: values.type,
    title: values.title.trim(),
    description: values.description.trim(),
    pricePerMonth: Number(values.pricePerMonth),
    squareFootage: Number(values.squareFootage),
    location: {
      type: "Point",
      coordinates: [location.lng, location.lat],
    },
    isAvailable: values.isAvailable,
  };

  if (values.type === "APARTMENT") {
    payload.specifications = {
      apartment: {
        bedrooms: values.bedrooms ? Number(values.bedrooms) : undefined,
        bathrooms: values.bathrooms ? Number(values.bathrooms) : undefined,
        hasElevator: values.hasElevator,
      },
    };
  } else {
    payload.specifications = {
      shop: {
        electricityCapacity: values.electricityCapacity
          ? Number(values.electricityCapacity)
          : undefined,
        footTrafficTier: values.footTrafficTier || undefined,
        commercialLicenseRequired: values.commercialLicenseRequired,
      },
    };
  }

  return payload;
}

export default function PropertyForm({
  property,
  onSuccess,
  onCancel,
}: PropertyFormProps) {
  const isEditing = Boolean(property);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [location, setLocation] = useState<MapCoordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormValues>({ defaultValues: emptyValues });

  const propertyType = watch("type");

  useEffect(() => {
    if (property) {
      reset(propertyToFormValues(property));
      const [lng, lat] = property.location.coordinates;
      setLocation({ lat, lng });
      setExistingImages(property.images ?? []);
      setNewImages([]);
    } else {
      reset(emptyValues);
      setLocation(null);
      setExistingImages([]);
      setNewImages([]);
    }
    setSubmitError(null);
    setSuccessMessage(null);
    setLocationError(null);
  }, [property, reset]);

  const onSubmit = async (values: PropertyFormValues) => {
    if (!location) {
      setLocationError("يرجى التأكد من تحديد موقع العقار بدقة على الخريطة.");
      return;
    }

    try {
      setSubmitError(null);
      setSuccessMessage(null);
      setLocationError(null);

      const payload = buildPayload(values, location);

      const response = isEditing && property
        ? await propertyService.updateProperty(
            property._id,
            payload,
            newImages,
            existingImages,
          )
        : await propertyService.createProperty(payload, newImages);

      setSuccessMessage(
        response.message ||
          (isEditing ? "تم تحديث العقار بنجاح" : "تم إضافة العقار بنجاح"),
      );

      if (!isEditing) {
        reset(emptyValues);
        setLocation(null);
        setExistingImages([]);
        setNewImages([]);
      } else {
        setNewImages([]);
        if ("property" in response) {
          setExistingImages(response.property.images ?? []);
        }
      }

      onSuccess?.();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "فشل حفظ العقار",
      );
    }
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {isEditing ? "تعديل العقار" : "إضافة عقار جديد"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {isEditing
              ? "عدّل بيانات العقار واحفظ التغييرات"
              : "سيتم مراجعة العقار من قبل الإدارة قبل نشره"}
          </p>
        </div>
        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            إلغاء
          </button>
        )}
      </div>

      {submitError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {submitError}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="عنوان العقار" error={errors.title?.message}>
            <input
              type="text"
              className={inputClass(!!errors.title)}
              {...register("title", { required: "العنوان مطلوب" })}
            />
          </Field>

          <Field label="نوع العقار" error={errors.type?.message}>
            <select
              className={inputClass(!!errors.type)}
              {...register("type", { required: "نوع العقار مطلوب" })}
            >
              <option value="APARTMENT">شقة</option>
              <option value="SHOP">محل تجاري</option>
            </select>
          </Field>

          <Field label="السعر الشهري (ر.س)" error={errors.pricePerMonth?.message}>
            <input
              type="number"
              min="0"
              className={inputClass(!!errors.pricePerMonth)}
              {...register("pricePerMonth", {
                required: "السعر مطلوب",
                min: { value: 0, message: "السعر يجب أن يكون موجباً" },
              })}
            />
          </Field>

          <Field label="المساحة (م²)" error={errors.squareFootage?.message}>
            <input
              type="number"
              min="0"
              className={inputClass(!!errors.squareFootage)}
              {...register("squareFootage", {
                required: "المساحة مطلوبة",
                min: { value: 0, message: "المساحة يجب أن تكون موجبة" },
              })}
            />
          </Field>
        </div>

        <ImageUploader
          existingImages={existingImages}
          newImages={newImages}
          onExistingChange={setExistingImages}
          onNewChange={setNewImages}
        />

        <LocationPicker
          value={location}
          onChange={(coords) => {
            setLocation(coords);
            setLocationError(null);
          }}
          error={locationError ?? undefined}
        />

        <Field label="الوصف" error={errors.description?.message}>
          <textarea
            rows={4}
            className={inputClass(!!errors.description)}
            {...register("description", { required: "الوصف مطلوب" })}
          />
        </Field>

        {propertyType === "APARTMENT" ? (
          <div className="grid grid-cols-1 gap-4 rounded-xl bg-gray-50 p-4 md:grid-cols-3">
            <Field label="عدد الغرف">
              <input
                type="number"
                min="0"
                className={inputClass(false)}
                {...register("bedrooms")}
              />
            </Field>
            <Field label="عدد الحمامات">
              <input
                type="number"
                min="0"
                className={inputClass(false)}
                {...register("bathrooms")}
              />
            </Field>
            <label className="flex items-center gap-2 self-end pb-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
                {...register("hasElevator")}
              />
              يوجد مصعد
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 rounded-xl bg-gray-50 p-4 md:grid-cols-3">
            <Field label="قدرة الكهرباء (أمبير)">
              <input
                type="number"
                min="0"
                className={inputClass(false)}
                {...register("electricityCapacity")}
              />
            </Field>
            <Field label="مستوى حركة المشاة">
              <select className={inputClass(false)} {...register("footTrafficTier")}>
                <option value="">اختر المستوى</option>
                <option value="LOW">منخفض</option>
                <option value="MEDIUM">متوسط</option>
                <option value="HIGH">مرتفع</option>
              </select>
            </Field>
            <label className="flex items-center gap-2 self-end pb-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
                {...register("commercialLicenseRequired")}
              />
              يتطلب رخصة تجارية
            </label>
          </div>
        )}

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
            {...register("isAvailable")}
          />
          العقار متاح للإيجار
        </label>

        <div className="flex justify-end gap-3">
          {isEditing && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              إلغاء
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : isEditing ? (
              "حفظ التعديلات"
            ) : (
              "حفظ العقار"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
    hasError ? "border-red-300" : "border-gray-200"
  }`;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
