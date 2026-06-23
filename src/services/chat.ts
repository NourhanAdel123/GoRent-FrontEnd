import {
  ChatMessagesResponse,
  ChatMessage,
  ChatThread,
  ChatThreadsResponse,
} from "../types/chat";

async function fetchJson<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(endpoint, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "حدث خطأ أثناء تنفيذ الطلب");
  }

  return data as T;
}

export const chatService = {
  getThreads: async (): Promise<ChatThread[]> => {
    const data = await fetchJson<ChatThreadsResponse>("/api/chat/threads");
    return data.threads ?? [];
  },

  getMessages: async (
    threadId: string,
    page = 1,
    limit = 50,
  ): Promise<ChatMessagesResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    return fetchJson<ChatMessagesResponse>(
      `/api/chat/threads/${threadId}/messages?${params.toString()}`,
    );
  },

  sendMessage: async (
    threadId: string,
    text: string,
    attachment?: File,
  ): Promise<ChatMessage> => {
    const formData = new FormData();
    formData.append("text", text);
    if (attachment) {
      formData.append("attachment", attachment);
    }

    const response = await fetch(`/api/chat/threads/${threadId}/messages`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "فشل إرسال الرسالة");
    }

    return data.data as ChatMessage;
  },

  markThreadAsRead: async (threadId: string) => {
    return fetchJson<{ message: string; modifiedCount: number; seenAt: string }>(
      `/api/chat/threads/${threadId}/read`,
      { method: "PATCH" },
    );
  },

  createThread: async (propertyId: string): Promise<ChatThread> => {
    const data = await fetchJson<{ thread: ChatThread }>("/api/chat/threads", {
      method: "POST",
      body: JSON.stringify({ propertyId }),
    });

    return data.thread;
  },
};
