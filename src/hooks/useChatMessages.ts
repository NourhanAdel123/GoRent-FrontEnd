"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { chatService } from "@/services/chat";
import { useChatSocket } from "@/context/ChatSocketContext";
import {
  ChatMessage,
  MessageNewPayload,
  MessageStatusPayload,
  MessagesSeenPayload,
  TypingPayload,
} from "@/types/chat";
import { getMessageSenderId } from "@/lib/chatUtils";

interface UseChatMessagesOptions {
  threadId: string | null;
  currentUserId?: string;
  onThreadRead?: (threadId: string) => void;
}

export function useChatMessages({
  threadId,
  currentUserId,
  onThreadRead,
}: UseChatMessagesOptions) {
  const { socket } = useChatSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typingUserId, setTypingUserId] = useState<string | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const appendMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => {
      if (prev.some((item) => item._id === message._id)) {
        return prev;
      }
      return [...prev, message];
    });
  }, []);

  const updateMessageStatus = useCallback(
    (payload: MessageStatusPayload) => {
      setMessages((prev) =>
        prev.map((message) =>
          message._id === payload.messageId
            ? {
                ...message,
                status: payload.status,
                deliveredAt: payload.deliveredAt ?? message.deliveredAt,
              }
            : message,
        ),
      );
    },
    [],
  );

  const markMessagesSeenLocally = useCallback(
    (payload: MessagesSeenPayload) => {
      if (payload.seenBy === currentUserId) return;

      setMessages((prev) =>
        prev.map((message) => {
          const senderId = getMessageSenderId(message.senderId);
          if (senderId !== currentUserId && message.status !== "SEEN") {
            return {
              ...message,
              status: "SEEN" as const,
              seenAt: payload.seenAt,
            };
          }
          return message;
        }),
      );
    },
    [currentUserId],
  );

  const markThreadAsRead = useCallback(async () => {
    if (!threadId || !socket?.connected) return;

    try {
      await new Promise<void>((resolve, reject) => {
        socket.emit("thread:seen", { threadId }, (response: {
          message?: string;
          modifiedCount?: number;
        }) => {
          if (response?.message && response.modifiedCount === undefined) {
            reject(new Error(response.message));
            return;
          }
          resolve();
        });
      });

      onThreadRead?.(threadId);
    } catch {
      try {
        await chatService.markThreadAsRead(threadId);
        onThreadRead?.(threadId);
      } catch {
        // Ignore read failures silently
      }
    }
  }, [threadId, socket, onThreadRead]);

  useEffect(() => {
    if (!threadId) {
      const timer = setTimeout(() => {
        setMessages([]);
      }, 0);
      return () => clearTimeout(timer); // Cleanup timer just in case
    }

    let active = true;

    const loadMessages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await chatService.getMessages(threadId);
        if (active) {
          setMessages(data.messages);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "فشل تحميل الرسائل",
          );
          setMessages([]);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadMessages();

    return () => {
      active = false;
    };
  }, [threadId]);

  useEffect(() => {
    if (!threadId || !socket?.connected) return;

    socket.emit("thread:join", { threadId }, (response: {
      message?: string;
      joined?: boolean;
    }) => {
      if (response?.message && !response.joined) {
        setError(response.message);
      }
    });

    markThreadAsRead();

    const handleNewMessage = ({ message, threadId: incomingThreadId }: MessageNewPayload) => {
      if (incomingThreadId !== threadId) return;
      appendMessage(message);

      const senderId = getMessageSenderId(message.senderId);
      if (senderId !== currentUserId) {
        markThreadAsRead();
      }
    };

    const handleStatus = (payload: MessageStatusPayload) => {
      if (payload.threadId !== threadId) return;
      updateMessageStatus(payload);
    };

    const handleDelivered = ({
      messages: deliveredMessages,
    }: {
      messages: MessageStatusPayload[];
    }) => {
      for (const payload of deliveredMessages) {
        if (payload.threadId !== threadId) continue;
        updateMessageStatus(payload);
      }
    };

    const handleSeen = (payload: MessagesSeenPayload) => {
      if (payload.threadId !== threadId) return;
      markMessagesSeenLocally(payload);
    };

    const handleTypingStart = ({ threadId: typingThreadId, userId }: TypingPayload) => {
      if (typingThreadId !== threadId || userId === currentUserId) return;
      setTypingUserId(userId);
    };

    const handleTypingStop = ({ threadId: typingThreadId, userId }: TypingPayload) => {
      if (typingThreadId !== threadId || userId === currentUserId) return;
      setTypingUserId(null);
    };

    socket.on("message:new", handleNewMessage);
    socket.on("message:status", handleStatus);
    socket.on("message:delivered", handleDelivered);
    socket.on("messages:seen", handleSeen);
    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);

    return () => {
      socket.emit("thread:leave", { threadId });
      socket.off("message:new", handleNewMessage);
      socket.off("message:status", handleStatus);
      socket.off("message:delivered", handleDelivered);
      socket.off("messages:seen", handleSeen);
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
      setTypingUserId(null);
    };
  }, [
    threadId,
    socket,
    currentUserId,
    appendMessage,
    updateMessageStatus,
    markMessagesSeenLocally,
    markThreadAsRead,
  ]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!threadId || !text.trim()) return;

      if (!socket?.connected) {
        setIsSending(true);
        try {
          const message = await chatService.sendMessage(threadId, text.trim());
          appendMessage(message);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "فشل إرسال الرسالة",
          );
        } finally {
          setIsSending(false);
        }
        return;
      }

      setIsSending(true);
      setError(null);

      try {
        await new Promise<void>((resolve, reject) => {
          socket.emit(
            "message:send",
            { threadId, text: text.trim() },
            (response: { message?: ChatMessage | string; data?: ChatMessage }) => {
              const sentMessage =
                response &&
                typeof response.message === "object"
                  ? response.message
                  : response?.data;

              if (!sentMessage) {
                reject(
                  new Error(
                    typeof response?.message === "string"
                      ? response.message
                      : "فشل إرسال الرسالة",
                  ),
                );
                return;
              }

              appendMessage(sentMessage);
              resolve();
            },
          );
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "فشل إرسال الرسالة",
        );
      } finally {
        setIsSending(false);
      }
    },
    [threadId, socket, appendMessage],
  );

  const notifyTyping = useCallback(
    (isTyping: boolean) => {
      if (!threadId || !socket?.connected) return;

      if (isTyping) {
        socket.emit("typing:start", { threadId });

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          socket.emit("typing:stop", { threadId });
        }, 2000);
      } else {
        socket.emit("typing:stop", { threadId });
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    },
    [threadId, socket],
  );

  return {
    messages,
    isLoading,
    isSending,
    error,
    typingUserId,
    sendMessage,
    notifyTyping,
    markThreadAsRead,
  };
}
