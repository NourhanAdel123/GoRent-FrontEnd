"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { useChatThreads } from "../../hooks/useChatThreads";
import { useChatMessages } from "../../hooks/useChatMessages";
import { useChatSocket } from "../../context/ChatSocketContext";
import ChatThreadList from "./ChatThreadList";
import ChatPanel from "./ChatPanel";

export interface ChatWorkspaceProps {
  currentUserId?: string;
  initialThreadId?: string | null;
  title: string;
  description: string;
  threadListLabel?: string;
  emptyThreadListMessage?: string;
  emptyThreadListHint?: string;
  emptyPanelHint?: string;
}

export default function ChatWorkspace({
  currentUserId,
  initialThreadId = null,
  title,
  description,
  threadListLabel = "المحادثات",
  emptyThreadListMessage,
  emptyThreadListHint,
  emptyPanelHint,
}: ChatWorkspaceProps) {
  const { isConnected, error: socketError } = useChatSocket();
  const [activeThreadId, setActiveThreadId] = useState<string | null>(
    initialThreadId,
  );

  const {
    threads,
    isLoading: threadsLoading,
    error: threadsError,
    clearUnread,
  } = useChatThreads(currentUserId, activeThreadId);

  useEffect(() => {
    if (initialThreadId) {
      setActiveThreadId(initialThreadId);
    }
  }, [initialThreadId]);

  const activeThread = useMemo(
    () => threads.find((thread) => thread._id === activeThreadId) ?? null,
    [threads, activeThreadId],
  );

  const {
    messages,
    isLoading: messagesLoading,
    isSending,
    error: messagesError,
    typingUserId,
    sendMessage,
    notifyTyping,
  } = useChatMessages({
    threadId: activeThreadId,
    currentUserId,
    onThreadRead: clearUnread,
  });

  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId);
    clearUnread(threadId);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      {(threadsError || socketError) && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{threadsError || socketError}</span>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* MODIFIED: Increased workspace height & streamlined limits to prevent unexpected expansion */}
        <div className="flex h-[550px] flex-col overflow-hidden lg:grid lg:h-[650px] lg:grid-cols-[320px_1fr]">
          
          {/* MODIFIED: Cleaned up constraints here so it fills height natively and behaves as a flex box */}
          <div className="flex h-1/2 shrink-0 flex-col overflow-hidden border-b border-gray-200 lg:h-full lg:shrink lg:border-b-0 lg:border-l">
            <div className="shrink-0 border-b border-gray-200 px-4 py-3">
              <p className="text-sm font-semibold text-gray-900">
                {threadListLabel}
              </p>
              <p className="text-xs text-gray-500">
                {threads.length} محادثة
              </p>
            </div>
            <ChatThreadList
              threads={threads}
              activeThreadId={activeThreadId}
              currentUserId={currentUserId}
              isLoading={threadsLoading}
              onSelect={handleSelectThread}
              emptyMessage={emptyThreadListMessage}
              emptyHint={emptyThreadListHint}
              />
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <ChatPanel
              thread={activeThread}
              currentUserId={currentUserId}
              messages={messages}
              isLoading={messagesLoading}
              isSending={isSending}
              error={messagesError}
              isConnected={isConnected}
              typingUserId={typingUserId}
              onSend={sendMessage}
              onTyping={notifyTyping}
              emptyPanelHint={emptyPanelHint}
            />
          </div>
        </div>
      </div>
    </div>
  );
}