import React from "react";

interface BookingModalHeaderProps {
  onClose: () => void;
}

export default function BookingModalHeader({ onClose }: BookingModalHeaderProps) {
  return (
    <div className="bg-zinc-900 px-6 py-5 flex items-center justify-between">
      <div>
        <h2 className="text-white font-bold text-xl">طلب معاينة</h2>
        <p className="text-zinc-400 text-sm mt-0.5">حدد مدة الإيجار المطلوبة</p>
      </div>
      <button
        onClick={onClose}
        className="text-zinc-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-700"
        aria-label="إغلاق"
      >
        ✕
      </button>
    </div>
  );
}
