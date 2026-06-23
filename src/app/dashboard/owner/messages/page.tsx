import { Suspense } from "react";
import OwnerMessagesContent from "../../../../components/dashboard/owner/OwnerMessagesContent";

export default function OwnerMessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[560px] items-center justify-center text-sm text-gray-500">
          جاري تحميل الرسائل...
        </div>
      }
    >
      <OwnerMessagesContent />
    </Suspense>
  );
}
