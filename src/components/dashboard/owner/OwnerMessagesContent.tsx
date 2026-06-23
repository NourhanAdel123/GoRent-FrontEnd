"use client";

import { useSearchParams } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import ChatWorkspace from "../../chat/ChatWorkspace";

export default function OwnerMessagesContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialThreadId = searchParams.get("thread");

  return (
    <ChatWorkspace
      currentUserId={user?._id}
      initialThreadId={initialThreadId}
      title="الرسائل"
      description="تواصل مع المستأجرين في الوقت الفعلي حول عقاراتك."
      emptyThreadListHint="ستظهر هنا رسائل المستأجرين عند بدء محادثة حول عقاراتك."
      emptyPanelHint="اختر أحد المستأجرين من القائمة للرد على استفساراته."
    />
  );
}
