"use client";

import Image from "next/image";
import { Upload } from "lucide-react";
import { Property } from "../../../types/property";

interface MediaManagementProps {
  properties: Property[];
}

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='120' viewBox='0 0 160 120'%3E%3Crect fill='%23f3f4f6' width='160' height='120'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23d1d5db' font-size='11'%3Eصورة%3C/text%3E%3C/svg%3E";

export default function MediaManagement({ properties }: MediaManagementProps) {
  const previewImages = properties.flatMap((p) => p.images ?? []).slice(0, 4);

  while (previewImages.length < 4) {
    previewImages.push(PLACEHOLDER_IMAGE);
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-gray-900">إدارة الوسائط</h2>

      <div className="mb-4 grid grid-cols-2 gap-2">
        {previewImages.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100"
          >
            <Image
              src={src}
              alt={`معاينة ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={
                src.startsWith("data:") || src.startsWith("http://localhost")
              }
            />
          </div>
        ))}
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center transition-colors hover:border-blue-300 hover:bg-blue-50/50">
        <Upload className="mb-2 h-8 w-8 text-gray-400" />
        <p className="text-sm text-gray-500">
          اسحب الصور هنا أو اضغط للتصفح من جهازك
        </p>
        <input type="file" className="hidden" accept="image/*" multiple />
      </label>
    </section>
  );
}
