"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Upload, X } from "lucide-react";

const MAX_IMAGES = 10;

interface ImageUploaderProps {
  existingImages: string[];
  newImages: File[];
  onExistingChange: (urls: string[]) => void;
  onNewChange: (files: File[]) => void;
  error?: string;
}

export default function ImageUploader({
  existingImages,
  newImages,
  onExistingChange,
  onNewChange,
  error,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const totalCount = existingImages.length + newImages.length;

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const incoming = Array.from(files).filter((file) =>
        file.type.startsWith("image/"),
      );
      const remaining = MAX_IMAGES - totalCount;
      if (remaining <= 0) return;
      onNewChange([...newImages, ...incoming.slice(0, remaining)]);
    },
    [newImages, onNewChange, totalCount],
  );

  const removeExisting = (index: number) => {
    onExistingChange(existingImages.filter((_, i) => i !== index));
  };

  const removeNew = (index: number) => {
    onNewChange(newImages.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        صور العقار
      </label>

      {(existingImages.length > 0 || newImages.length > 0) && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {existingImages.map((url, index) => (
            <div
              key={`existing-${url}-${index}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100"
            >
              <Image
                src={url}
                alt={`صورة ${index + 1}`}
                fill
                className="object-cover"
                unoptimized={url.startsWith("http://localhost")}
              />
              <button
                type="button"
                onClick={() => removeExisting(index)}
                className="absolute left-2 top-2 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="حذف الصورة"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {newImages.map((file, index) => (
            <div
              key={`new-${file.name}-${index}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100"
            >
              <Image
                src={URL.createObjectURL(file)}
                alt={`صورة جديدة ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => removeNew(index)}
                className="absolute left-2 top-2 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="حذف الصورة"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {totalCount < MAX_IMAGES && (
        <div
          role="button"
          tabIndex={0}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
            isDragging
              ? "border-blue-400 bg-blue-50"
              : "border-gray-200 bg-gray-50 hover:border-blue-300"
          }`}
        >
          <Upload className="mb-2 h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-500">
            اسحب الصور هنا أو اضغط للتصفح من جهازك
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {totalCount}/{MAX_IMAGES} صور
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
