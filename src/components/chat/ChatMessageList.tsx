"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { ChatMessage } from "../../types/chat";
import ChatMessageBubble from "./ChatMessageBubble";
import { getMessageSenderId } from "../../lib/chatUtils";

interface ChatMessageListProps {
  messages: ChatMessage[];
  currentUserId?: string;
  isLoading?: boolean;
  typingUserId?: string | null;
  typingUserName?: string;
}

export default function ChatMessageList({
  messages,
  currentUserId,
  isLoading,
  typingUserId,
  typingUserName,
}: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUserId]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-gray-500">
        لا توجد رسائل بعد. ابدأ المحادثة الآن.
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
      {messages.map((message) => {
        const senderId = getMessageSenderId(message.senderId);
        const isOwn = senderId === currentUserId;

        return (
          <ChatMessageBubble
            key={message._id}
            message={message}
            isOwn={isOwn}
          />
        );
      })}

      {typingUserId && (
        <div className="flex justify-end">
          <div className="rounded-2xl rounded-bl-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-500">
            {typingUserName ? `${typingUserName} يكتب...` : "يكتب..."}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
