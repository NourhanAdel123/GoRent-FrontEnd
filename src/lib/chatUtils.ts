import type { ChatParticipant } from "../types/chat";

export function getMessageSenderId(
  senderId: { _id: string } | string,
): string {
  return typeof senderId === "string" ? senderId : senderId._id;
}

export function getOtherParticipant(
  thread: { tenantId: ChatParticipant; ownerId: ChatParticipant },
  currentUserId: string,
): ChatParticipant {
  return thread.tenantId._id === currentUserId
    ? thread.ownerId
    : thread.tenantId;
}

export function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString("ar-SA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatThreadPreviewTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "الآن";
  if (diffMinutes < 60) return `منذ ${diffMinutes} د`;
  if (diffHours < 24) return `منذ ${diffHours} س`;
  if (diffDays === 1) return "أمس";
  if (diffDays < 7) return `منذ ${diffDays} أيام`;

  return date.toLocaleDateString("ar-SA", {
    day: "numeric",
    month: "short",
  });
}

export function getParticipantAvatar(participant?: {
  profileImage?: string;
}): string | null {
  return participant?.profileImage || null;
}

export function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
}
