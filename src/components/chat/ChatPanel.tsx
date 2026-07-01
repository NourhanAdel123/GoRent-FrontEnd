"use client";

import { Box, Typography, Paper, Alert, Chip, Divider, Avatar } from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import ChatAvatar from "./ChatAvatar";
import ChatInput from "./ChatInput";
import ChatMessageList from "./ChatMessageList";
import { ChatThread, ChatMessage } from "../../types/chat";
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
  onBack?: () => void;
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
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          bgcolor: "background.default",
          p: 3,
          textAlign: "center",
        }}
      >
        <Avatar sx={{ width: 64, height: 64, bgcolor: "background.paper", boxShadow: 1 }}>
          <WifiIcon sx={{ fontSize: 32, color: "text.disabled" }} />
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }} color="text.primary">
          اختر محادثة لعرض الرسائل
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {emptyPanelHint}
        </Typography>
      </Box>
    );
  }

  const participant = getOtherParticipant(thread, currentUserId);

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, bgcolor: "background.default" }}>
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          borderRadius: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
          <ChatAvatar
            name={participant.name}
            profileImage={participant.profileImage}
            size="md"
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
              {participant.name}
            </Typography>
            <Typography variant="caption" noWrap color="text.secondary" sx={{ display: "block" }}>
              {thread.propertyId?.title}
            </Typography>
          </Box>
        </Box>

        <Chip
          icon={isConnected ? <WifiIcon fontSize="small" /> : <WifiOffIcon fontSize="small" />}
          label={isConnected ? "متصل" : "غير متصل"}
          size="small"
          color={isConnected ? "success" : "warning"}
          variant="outlined"
          sx={{ fontWeight: 600, border: "none", bgcolor: isConnected ? "success.light" : "warning.light", color: isConnected ? "success.dark" : "warning.dark", "& .MuiChip-icon": { color: "inherit" } }}
        />
      </Paper>

      {error && (
        <Box sx={{ px: 2, pt: 2 }}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        </Box>
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
    </Box>
  );
}
