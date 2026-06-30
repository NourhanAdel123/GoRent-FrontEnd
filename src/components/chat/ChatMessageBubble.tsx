"use client";

import { Box, Typography, Paper, Link } from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import { alpha } from "@mui/material/styles";
import { ChatMessage } from "../../types/chat";
import { formatMessageTime } from "../../lib/chatUtils";

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

function MessageStatusIcon({ status }: { status: ChatMessage["status"] }) {
  if (status === "SEEN") {
    return <DoneAllIcon sx={{ fontSize: 16, color: "info.light" }} />;
  }

  if (status === "DELIVERED") {
    return <DoneAllIcon sx={{ fontSize: 16, color: "inherit" }} />;
  }

  return <DoneIcon sx={{ fontSize: 16, color: "inherit" }} />;
}

export default function ChatMessageBubble({
  message,
  isOwn,
}: ChatMessageBubbleProps) {
  const senderName =
    typeof message.senderId === "object" ? message.senderId.name : undefined;

  return (
    <Box sx={{ display: "flex", justifyContent: isOwn ? "flex-start" : "flex-end" }}>
      <Paper
        elevation={0}
        sx={{
          maxWidth: "78%",
          px: 2,
          py: 1.5,
          borderRadius: 4,
          ...(isOwn
            ? {
                borderBottomRightRadius: 8,
                bgcolor: "primary.main",
                color: "primary.contrastText",
              }
            : {
                borderBottomLeftRadius: 8,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                color: "text.primary",
              }),
        }}
      >
        {!isOwn && senderName && (
          <Typography
            variant="caption"
            sx={{ mb: 0.5, display: "block", fontWeight: 600, color: "primary.main" }}
          >
            {senderName}
          </Typography>
        )}

        <Typography variant="body2" sx={{ wordBreak: "break-word", lineHeight: 1.6 }}>
          {message.text}
        </Typography>

        {message.attachmentUrl && (
          <Link
            href={message.attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              mt: 1,
              display: "block",
              typography: "caption",
              color: isOwn ? "primary.contrastText" : "primary.main",
              textDecoration: "underline",
              opacity: 0.9,
              "&:hover": { opacity: 1 },
            }}
          >
            عرض المرفق
          </Link>
        )}

        <Box
          sx={{
            mt: 1,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            justifyContent: isOwn ? "flex-start" : "flex-end",
            color: isOwn ? alpha("#fff", 0.7) : "text.secondary",
          }}
        >
          <Typography variant="caption" sx={{ fontSize: "0.6875rem" }}>
            {formatMessageTime(message.createdAt)}
          </Typography>
          {isOwn && <MessageStatusIcon status={message.status} />}
        </Box>
      </Paper>
    </Box>
  );
}
