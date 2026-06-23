"use client";

import { useMemo } from "react";
import { useChatThreads } from "../../hooks/useChatThreads";

interface ChatNavBadgeProps {
  currentUserId?: string;
}

export default function ChatNavBadge({ currentUserId }: ChatNavBadgeProps) {
  const { threads } = useChatThreads(currentUserId, null);

  const totalUnread = useMemo(
    () => threads.reduce((sum, thread) => sum + (thread.unreadCount ?? 0), 0),
    [threads],
  );

  if (totalUnread <= 0) {
    return null;
  }

  return (
    <span className="mr-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
      {totalUnread > 99 ? "99+" : totalUnread}
    </span>
  );
}
