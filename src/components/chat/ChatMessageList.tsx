"use client";

import { useEffect, useRef } from "react";
import { Box, Typography, CircularProgress, Paper } from "@mui/material";
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
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflowY: "auto" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!messages.length) {
    return (
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflowY: "auto", px: 3, textAlign: "center", color: "text.secondary", typography: "body2" }}>
        لا توجد رسائل بعد. ابدأ المحادثة الآن.
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, overflowY: "auto", px: 2, py: 2 }}>
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
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Paper elevation={0} sx={{ borderRadius: 4, borderBottomLeftRadius: 8, border: "1px solid", borderColor: "divider", bgcolor: "background.paper", px: 2, py: 1, typography: "body2", color: "text.secondary" }}>
            {typingUserName ? `${typingUserName} يكتب...` : "يكتب..."}
          </Paper>
        </Box>
      )}

      <div ref={bottomRef} />
    </Box>
  );
}
