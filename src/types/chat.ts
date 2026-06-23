export type MessageStatus = "SENT" | "DELIVERED" | "SEEN";

export interface ChatParticipant {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export interface ChatProperty {
  _id: string;
  title: string;
  images?: string[];
}

export interface ChatThread {
  _id: string;
  tenantId: ChatParticipant;
  ownerId: ChatParticipant;
  propertyId: ChatProperty;
  lastMessageAt: string;
  unreadCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatMessage {
  _id: string;
  threadId: string;
  senderId: ChatParticipant | string;
  text: string;
  attachmentUrl?: string | null;
  status: MessageStatus;
  deliveredAt?: string | null;
  seenAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface ChatThreadsResponse {
  threads: ChatThread[];
}

export interface ChatMessagesResponse {
  messages: ChatMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MessageNewPayload {
  message: ChatMessage;
  threadId: string;
}

export interface MessageStatusPayload {
  threadId: string;
  messageId: string;
  status: MessageStatus;
  deliveredAt?: string | null;
}

export interface MessagesSeenPayload {
  threadId: string;
  seenAt: string;
  seenBy: string;
}

export interface TypingPayload {
  threadId: string;
  userId: string;
}
