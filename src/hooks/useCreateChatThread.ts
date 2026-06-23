"use client";

import { useCallback, useState } from "react";
import { chatService } from "../services/chat";
import { ChatThread } from "../types/chat";

export function useCreateChatThread() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createThread = useCallback(
    async (propertyId: string): Promise<ChatThread | null> => {
      try {
        setIsCreating(true);
        setError(null);
        return await chatService.createThread(propertyId);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "فشل بدء المحادثة";
        setError(message);
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    [],
  );

  return { createThread, isCreating, error };
}
