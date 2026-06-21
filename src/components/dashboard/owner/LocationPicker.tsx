"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { Loader2, MapPin, Navigation, Search } from "lucide-react";
import type { MapCoordinates } from "./LocationPickerMap";

const LocationPickerMap = dynamic(() => import("./LocationPickerMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-500">
      جاري تحميل الخريطة...
    </div>
  ),
});

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

interface LocationPickerProps {
  value: MapCoordinates | null;
  onChange: (coords: MapCoordinates) => void;
  error?: string;
}

export default function LocationPicker({
  value,
  onChange,
  error,
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("المتصفح لا يدعم تحديد الموقع");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      () => {
        setLocationError("تعذر الحصول على موقعك. تأكد من السماح بالوصول للموقع.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }, [onChange]);

  const handleSearch = async () => {
    const query = searchQuery.trim();
    if (!query) return;

    setIsSearching(true);
    setLocationError(null);

    try {
      const params = new URLSearchParams({
        q: query,
        format: "json",
        limit: "5",
        countrycodes: "sa",
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params}`,
        { headers: { "Accept-Language": "ar" } },
      );

      if (!response.ok) throw new Error("فشل البحث");

      const results = (await response.json()) as NominatimResult[];
      setSearchResults(results);

      if (results.length === 0) {
        setLocationError("لم يتم العثور على نتائج لهذا العنوان");
      }
    } catch {
      setLocationError("فشل البحث عن العنوان");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (result: NominatimResult) => {
    onChange({ lat: Number(result.lat), lng: Number(result.lon) });
    setSearchResults([]);
    setSearchQuery(result.display_name);
    setLocationError(null);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        موقع العقار
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
            placeholder="ابحث عن عنوان أو حي..."
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-4 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
        >
          {isSearching ? "جاري البحث..." : "بحث"}
        </button>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {isLocating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
          موقعي الحالي
        </button>
      </div>

      {searchResults.length > 0 && (
        <ul className="max-h-40 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          {searchResults.map((result) => (
            <li key={`${result.lat}-${result.lon}`}>
              <button
                type="button"
                onClick={() => selectSearchResult(result)}
                className="w-full px-4 py-2.5 text-right text-sm text-gray-700 hover:bg-gray-50"
              >
                {result.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="h-64 overflow-hidden rounded-xl border border-gray-200 sm:h-72">
        <LocationPickerMap value={value} onChange={onChange} />
      </div>

      <p className="text-xs text-gray-500">
        انقر على الخريطة لتحديد موقع العقار، أو استخدم GPS / البحث بالعنوان
      </p>

      {value && (
        <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
          <MapPin className="h-3.5 w-3.5" />
          تم تحديد الموقع
        </div>
      )}

      {(error || locationError) && (
        <p className="text-xs text-red-600">{error || locationError}</p>
      )}
    </div>
  );
}

export type { MapCoordinates };
