import { fetchApi } from "./auth";
import { NotificationResponse, MarkReadResponse, MarkAllReadResponse } from "../types/notification";

export const notificationService = {
  getNotifications: async (): Promise<NotificationResponse> => {
    return fetchApi<NotificationResponse>("/api/notifications");
  },
  markAsRead: async (id: string): Promise<MarkReadResponse> => {
    return fetchApi<MarkReadResponse>(`/api/notifications/${id}/read`, {
      method: "PATCH",
    });
  },
  markAllAsRead: async (): Promise<MarkAllReadResponse> => {
    return fetchApi<MarkAllReadResponse>("/api/notifications/read-all", {
      method: "PATCH",
    });
  },
};
