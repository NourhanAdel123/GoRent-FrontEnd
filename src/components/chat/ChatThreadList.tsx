"use client";

import Image from "next/image";
import { Loader2, MessageSquare } from "lucide-react";
import { ChatThread } from "../../types/chat";
import ChatAvatar from "./ChatAvatar";
import {
  formatThreadPreviewTime,
  getOtherParticipant,
} from "../../lib/chatUtils";

interface ChatThreadListProps {
  threads: ChatThread[];
  activeThreadId: string | null;
  currentUserId?: string;
  isLoading?: boolean;
  onSelect: (threadId: string) => void;
  emptyMessage?: string;
  emptyHint?: string;
}

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect fill='%23e5e7eb' width='48' height='48'/%3E%3C/svg%3E";

export default function ChatThreadList({
  threads,
  activeThreadId,
  currentUserId,
  isLoading,
  onSelect,
  emptyMessage = "لا توجد محادثات بعد.",
  emptyHint,
}: ChatThreadListProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!threads.length) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 overflow-y-auto px-6 text-center text-sm text-gray-500">
        <MessageSquare className="h-10 w-10 text-gray-300" />
        <p>{emptyMessage}</p>
        {emptyHint && (
          <p className="text-xs text-gray-400">{emptyHint}</p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      {threads.map((thread) => {
        const participant = currentUserId
          ? getOtherParticipant(thread, currentUserId)
          : thread.tenantId;
        const isActive = thread._id === activeThreadId;
        const propertyImage = thread.propertyId?.images?.[0] || PLACEHOLDER_IMAGE;
        const unreadCount = thread.unreadCount ?? 0;

        return (
          <button
            key={thread._id}
            type="button"
            onClick={() => onSelect(thread._id)}
            className={`flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-right transition hover:bg-gray-50 ${
              isActive ? "bg-primary/5" : "bg-white"
            }`}
          >
            <ChatAvatar
              name={participant.name}
              profileImage={participant.profileImage}
              size="md"
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {participant.name}
                </p>
                <span className="shrink-0 text-[11px] text-gray-400">
                  {formatThreadPreviewTime(thread.lastMessageAt)}
                </span>
              </div>

              <div className="mt-1 flex items-center gap-2">
                <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded bg-gray-100">
                  <Image
                    src={propertyImage}
                    alt={thread.propertyId?.title || "عقار"}
                    fill
                    sizes="20px"
                    className="object-cover"
                    unoptimized={
                      propertyImage.startsWith("data:") ||
                      propertyImage.includes("cloudinary.com")
                    }
                  />
                </div>
                <p className="truncate text-xs text-gray-500">
                  {thread.propertyId?.title}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
