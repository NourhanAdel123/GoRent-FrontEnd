export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  message: string;
  contactId: string;
}

// --- Admin contact message types ---

export type ContactStatus = "UNREAD" | "READ" | "REPLIED";

export interface ContactUser {
  _id: string;
  name: string;
  email: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  userId: ContactUser | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ContactListResponse {
  contacts: ContactMessage[];
  unreadCount: number;
  pagination: ContactPagination;
}

export interface FetchContactsParams {
  status?: ContactStatus | "";
  page?: number;
  limit?: number;
}

export interface UpdateContactStatusResponse {
  message: string;
  contact: ContactMessage;
}

export interface DeleteContactResponse {
  message: string;
}
