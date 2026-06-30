"use client";

import Image from "next/image";
import { Box, Typography, CircularProgress, List, ListItemButton, Badge } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { ChatThread } from "../../types/chat";
import ChatAvatar from "./ChatAvatar";
import {
  formatThreadPreviewTime,
  getOtherParticipant,
} from "../../lib/chatUtils";

interface ChatThreadListProps {
  threads: ChatThread[];
  activeThreadId: string | null;
  currentUserId?: string;
  isLoading?: boolean;
  onSelect: (threadId: string) => void;
  emptyMessage?: string;
  emptyHint?: string;
}

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect fill='%23e5e7eb' width='48' height='48'/%3E%3C/svg%3E";

export default function ChatThreadList({
  threads,
  activeThreadId,
  currentUserId,
  isLoading,
  onSelect,
  emptyMessage = "لا توجد محادثات بعد.",
  emptyHint,
}: ChatThreadListProps) {
  if (isLoading) {
    return (
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0, overflowY: "auto" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!threads.length) {
    return (
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1.5, minHeight: 0, overflowY: "auto", px: 3, textAlign: "center", color: "text.secondary" }}>
        <ChatIcon sx={{ fontSize: 40, color: "divider" }} />
        <Typography variant="body2">{emptyMessage}</Typography>
        {emptyHint && (
          <Typography variant="caption" color="text.disabled">{emptyHint}</Typography>
        )}
      </Box>
    );
  }

  return (
    <List sx={{ flex: 1, minHeight: 0, overflowY: "auto", p: 0 }}>
      {threads.map((thread) => {
        const participant = currentUserId
          ? getOtherParticipant(thread, currentUserId)
          : thread.tenantId;
        const isActive = thread._id === activeThreadId;
        const propertyImage = thread.propertyId?.images?.[0] || PLACEHOLDER_IMAGE;
        const unreadCount = thread.unreadCount ?? 0;

        return (
          <ListItemButton
            key={thread._id}
            onClick={() => onSelect(thread._id)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 2,
              py: 1.5,
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: isActive ? "primary.50" : "background.paper",
              "&:hover": { bgcolor: isActive ? "primary.50" : "action.hover" },
            }}
          >
            <ChatAvatar
              name={participant.name}
              profileImage={participant.profileImage}
              size="md"
            />

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }} color="text.primary">
                  {participant.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0, fontSize: "0.6875rem" }}>
                  {formatThreadPreviewTime(thread.lastMessageAt)}
                </Typography>
              </Box>

              <Box sx={{ mt: 0.5, display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ position: "relative", height: 20, width: 20, flexShrink: 0, overflow: "hidden", borderRadius: 1, bgcolor: "action.hover" }}>
                  <Image
                    src={propertyImage}
                    alt={thread.propertyId?.title || "عقار"}
                    fill
                    sizes="20px"
                    style={{ objectFit: "cover" }}
                    unoptimized={
                      propertyImage.startsWith("data:") ||
                      propertyImage.includes("cloudinary.com")
                    }
                  />
                </Box>
                <Typography variant="caption" noWrap color="text.secondary">
                  {thread.propertyId?.title}
                </Typography>
              </Box>
            </Box>

            {unreadCount > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 20, height: 20, borderRadius: 10, bgcolor: "primary.main", color: "primary.contrastText", px: 0.75, fontSize: "0.6875rem", fontWeight: 600, flexShrink: 0 }}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </Box>
            )}
          </ListItemButton>
        );
      })}
    </List>
  );
}
