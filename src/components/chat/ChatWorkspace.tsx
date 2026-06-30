"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Typography, Alert, Paper, Divider } from "@mui/material";
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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h5" component="h1" sx={{ fontWeight: "bold" }} color="text.primary">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {description}
        </Typography>
      </Box>

      {(threadsError || socketError) && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {threadsError || socketError}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            height: { xs: 550, lg: 650 },
            overflow: "hidden",
          }}
        >
          {/* Thread List Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
              width: { xs: "100%", lg: 320 },
              height: { xs: "50%", lg: "100%" },
              borderBottom: { xs: 1, lg: 0 },
              borderLeft: { xs: 0, lg: 1 },
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", flexShrink: 0 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }} color="text.primary">
                {threadListLabel}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {threads.length} محادثة
              </Typography>
            </Box>
            <ChatThreadList
              threads={threads}
              activeThreadId={activeThreadId}
              currentUserId={currentUserId}
              isLoading={threadsLoading}
              onSelect={handleSelectThread}
              emptyMessage={emptyThreadListMessage}
              emptyHint={emptyThreadListHint}
            />
          </Box>

          {/* Chat Panel Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minWidth: 0,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
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
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}