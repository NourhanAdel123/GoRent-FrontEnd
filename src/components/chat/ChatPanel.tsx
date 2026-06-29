"use client";

import { AlertCircle, Wifi, WifiOff } from "lucide-react";
import { ChatThread } from "../../types/chat";
import ChatAvatar from "./ChatAvatar";
import ChatInput from "./ChatInput";
import ChatMessageList from "./ChatMessageList";
import { ChatMessage } from "../../types/chat";
import { getOtherParticipant } from "../../lib/chatUtils";

interface ChatPanelProps {
  thread: ChatThread | null;
  currentUserId?: string;
  messages: ChatMessage[];
  isLoading?: boolean;
  isSending?: boolean;
  error?: string | null;
  isConnected?: boolean;
  typingUserId?: string | null;
  onSend: (text: string) => Promise<void>;
  onTyping?: (isTyping: boolean) => void;
  emptyPanelHint?: string;
}

export default function ChatPanel({
  thread,
  currentUserId,
  messages,
  isLoading,
  isSending,
  error,
  isConnected,
  typingUserId,
  onSend,
  onTyping,
  emptyPanelHint = "اختر أحد المشاركين من القائمة لعرض الرسائل.",
}: ChatPanelProps) {
  if (!thread || !currentUserId) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 overflow-hidden bg-gray-50 px-6 text-center">
        <div className="rounded-full bg-white p-4 shadow-sm">
          <Wifi className="h-8 w-8 text-gray-300" />
        </div>
        <p className="text-sm font-medium text-gray-700">
          اختر محادثة لعرض الرسائل
        </p>
        <p className="text-xs text-gray-400">{emptyPanelHint}</p>
      </div>
    );
  }

  const participant = getOtherParticipant(thread, currentUserId);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-gray-50">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <ChatAvatar
            name={participant.name}
            profileImage={participant.profileImage}
            size="md"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              {participant.name}
            </p>
            <p className="truncate text-xs text-gray-500">
              {thread.propertyId?.title}
            </p>
          </div>
        </div>

        <div
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${
            isConnected
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {isConnected ? (
            <Wifi className="h-3.5 w-3.5" />
          ) : (
            <WifiOff className="h-3.5 w-3.5" />
          )}
          {isConnected ? "متصل" : "غير متصل"}
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-3 flex shrink-0 items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <ChatMessageList
        messages={messages}
        currentUserId={currentUserId}
        isLoading={isLoading}
        typingUserId={typingUserId}
        typingUserName={participant.name}
      />

      <ChatInput
        onSend={onSend}
        onTyping={onTyping}
        disabled={isSending}
        placeholder="اكتب رسالتك..."
      />
    </div>
  );
}
