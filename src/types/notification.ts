export interface INotification {
  _id: string;
  userId: string;
  type: string;
  refId: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface NotificationResponse {
  notifications: INotification[];
  unreadCount: number;
}

export interface MarkReadResponse {
  notification: INotification;
}

export interface MarkAllReadResponse {
  message: string;
}
