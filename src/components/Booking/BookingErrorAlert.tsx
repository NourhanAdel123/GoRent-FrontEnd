import React from "react";

interface BookingErrorAlertProps {
  message: string;
}

export default function BookingErrorAlert({ message }: BookingErrorAlertProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
      <span className="text-red-500 mt-0.5 flex-shrink-0">⚠</span>
      <p className="text-sm text-red-700">{message}</p>
    </div>
  );
}
