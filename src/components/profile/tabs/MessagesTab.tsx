"use client";

import { useSearchParams } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import ChatWorkspace from "../../chat/ChatWorkspace";

export default function MessagesTab() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialThreadId = searchParams.get("thread");

  return (
    <ChatWorkspace
      currentUserId={user?._id}
      initialThreadId={initialThreadId}
      title="رسائلي"
      description="تواصل مع ملاك العقارات والرد على استفساراتك في الوقت الفعلي."
      emptyThreadListHint="لم تبدأ أي محادثة بعد. يمكنك بدء محادثة من صفحة العقار."
      emptyPanelHint="اختر محادثة من القائمة لعرض رسائلها."
    />
  );
}
