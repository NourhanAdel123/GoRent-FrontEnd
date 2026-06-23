"use client";

import { Check, CheckCheck } from "lucide-react";
import { ChatMessage } from "../../types/chat";
import {
  formatMessageTime,
} from "../../lib/chatUtils";

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

function MessageStatusIcon({ status }: { status: ChatMessage["status"] }) {
  if (status === "SEEN") {
    return <CheckCheck className="h-3.5 w-3.5 text-blue-500" />;
  }

  if (status === "DELIVERED") {
    return <CheckCheck className="h-3.5 w-3.5 text-gray-400" />;
  }

  return <Check className="h-3.5 w-3.5 text-gray-400" />;
}

export default function ChatMessageBubble({
  message,
  isOwn,
}: ChatMessageBubbleProps) {
  const senderName =
    typeof message.senderId === "object" ? message.senderId.name : undefined;

  return (
    <div className={`flex ${isOwn ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-2.5 shadow-sm ${
          isOwn
            ? "rounded-br-md bg-primary text-white"
            : "rounded-bl-md border border-gray-200 bg-white text-gray-900"
        }`}
      >
        {!isOwn && senderName && (
          <p className="mb-1 text-xs font-semibold text-primary">{senderName}</p>
        )}

        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
          {message.text}
        </p>

        {message.attachmentUrl && (
          <a
            href={message.attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-2 block text-xs underline ${
              isOwn ? "text-blue-100" : "text-primary"
            }`}
          >
            عرض المرفق
          </a>
        )}

        <div
          className={`mt-1.5 flex items-center gap-1.5 ${
            isOwn ? "justify-start text-blue-100" : "justify-end text-gray-400"
          }`}
        >
          <span className="text-[11px]">
            {formatMessageTime(message.createdAt)}
          </span>
          {isOwn && <MessageStatusIcon status={message.status} />}
        </div>
      </div>
    </div>
  );
}
