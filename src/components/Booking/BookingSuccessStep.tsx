import React from "react";
import { CreatedBooking } from "@/types/booking";

interface BookingSuccessStepProps {
  booking: CreatedBooking;
  message: string;
  onClose: () => void;
}

export default function BookingSuccessStep({
  booking,
  message,
  onClose,
}: BookingSuccessStepProps) {
  return (
    <div className="text-center py-4">
      {/* Check icon */}
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">{message}</h3>

      <p className="text-gray-500 text-sm mb-1">
        رقم الحجز:{" "}
        <span className="font-mono text-gray-800 text-xs">{booking._id}</span>
      </p>

      <p className="text-gray-500 text-sm mb-1">
        المبلغ المدفوع:{" "}
        <span className="font-bold text-gray-800">
          {booking.amountPaid.toLocaleString("ar-EG")} ج.م
        </span>
      </p>

      <div className="inline-block mt-3 px-3 py-1 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold rounded-full">
        في انتظار الدفع
      </div>

      <button
        onClick={onClose}
        className="mt-6 w-full bg-zinc-800 hover:bg-zinc-900 text-white font-bold py-3 rounded-xl transition-colors"
      >
        حسناً
      </button>
    </div>
  );
}
