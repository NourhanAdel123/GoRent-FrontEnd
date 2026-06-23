"use client";

import { useCallback, useEffect, useState } from "react";
import { chatService } from "../services/chat";
import { useChatSocket } from "../context/ChatSocketContext";
import {
  ChatMessage,
  ChatThread,
  MessageNewPayload,
} from "../types/chat";
import { getMessageSenderId } from "../lib/chatUtils";

function sortThreads(threads: ChatThread[]) {
  return [...threads].sort(
    (a, b) =>
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
  );
}

export function useChatThreads(
  currentUserId?: string,
  activeThreadId?: string | null,
) {
  const { socket } = useChatSocket();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchThreads = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await chatService.getThreads();
      setThreads(sortThreads(data));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "فشل تحميل المحادثات",
      );
      setThreads([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = ({ message, threadId }: MessageNewPayload) => {
      setThreads((prev) => {
        const existing = prev.find((thread) => thread._id === threadId);
        if (!existing) {
          fetchThreads();
          return prev;
        }

        const isOwnMessage =
          currentUserId &&
          getMessageSenderId(message.senderId) === currentUserId;
        const isActiveThread = threadId === activeThreadId;

        const updated: ChatThread = {
          ...existing,
          lastMessageAt: message.createdAt,
          unreadCount:
            isOwnMessage || isActiveThread
              ? 0
              : (existing.unreadCount ?? 0) + 1,
        };

        const rest = prev.filter((thread) => thread._id !== threadId);
        return sortThreads([updated, ...rest]);
      });
    };

    socket.on("message:new", handleNewMessage);

    return () => {
      socket.off("message:new", handleNewMessage);
    };
  }, [socket, currentUserId, activeThreadId, fetchThreads]);

  const clearUnread = useCallback((threadId: string) => {
    setThreads((prev) =>
      prev.map((thread) =>
        thread._id === threadId ? { ...thread, unreadCount: 0 } : thread,
      ),
    );
  }, []);

  return {
    threads,
    isLoading,
    error,
    refetch: fetchThreads,
    clearUnread,
  };
}
