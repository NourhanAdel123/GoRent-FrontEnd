import React from "react";
import BookingErrorAlert from "./BookingErrorAlert";

interface BookingFormStepProps {
  today: string;
  startDate: string;
  endDate: string;
  pricePerMonth: number;
  estimatedMonths: number;
  estimatedTotal: number;
  loading: boolean;
  error: string | null;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function BookingFormStep({
  today,
  startDate,
  endDate,
  pricePerMonth,
  estimatedMonths,
  estimatedTotal,
  loading,
  error,
  onStartDateChange,
  onEndDateChange,
  onSubmit,
  onCancel,
}: BookingFormStepProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Price info */}
      <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 rounded-xl p-4">
        <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          ج.م
        </div>
        <div>
          <p className="text-xs text-gray-500">السعر الشهري</p>
          <p className="text-lg font-bold text-gray-900">
            {pricePerMonth.toLocaleString("ar-EG")} ج.م / شهر
          </p>
        </div>
      </div>

      {/* Date pickers */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="booking-start-date"
            className="block text-sm font-semibold text-gray-700 mb-1.5"
          >
            تاريخ البداية
          </label>
          <input
            id="booking-start-date"
            type="date"
            min={today}
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-transparent transition"
            required
          />
        </div>
        <div>
          <label
            htmlFor="booking-end-date"
            className="block text-sm font-semibold text-gray-700 mb-1.5"
          >
            تاريخ النهاية
          </label>
          <input
            id="booking-end-date"
            type="date"
            min={startDate || today}
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-transparent transition"
            required
          />
        </div>
      </div>

      {/* Estimated cost */}
      {estimatedMonths > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex justify-between items-center">
          <p className="text-sm text-blue-700 font-medium">
            التكلفة التقديرية ({estimatedMonths} شهر)
          </p>
          <p className="text-lg font-bold text-blue-900">
            {estimatedTotal.toLocaleString("ar-EG")} ج.م
          </p>
        </div>
      )}

      {/* Error */}
      {error && <BookingErrorAlert message={error} />}

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-zinc-800 hover:bg-zinc-900 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              جارٍ الإرسال...
            </>
          ) : (
            "تأكيد الطلب"
          )}
        </button>
      </div>
    </form>
  );
}
