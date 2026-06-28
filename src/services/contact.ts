import { fetchApi } from "./auth";
import {
  ContactPayload,
  ContactResponse,
  ContactListResponse,
  FetchContactsParams,
  UpdateContactStatusResponse,
  DeleteContactResponse,
  ContactStatus,
} from "../types/contact";

export const contactService = {
  /** Public: send a contact message */
  sendMessage: async (payload: ContactPayload): Promise<ContactResponse> => {
    return fetchApi<ContactResponse>("/api/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /** Admin: fetch contact messages with optional filters */
  getMessages: async (
    params?: FetchContactsParams
  ): Promise<ContactListResponse> => {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return fetchApi<ContactListResponse>(
      `/api/contact${qs ? `?${qs}` : ""}`
    );
  },

  /** Admin: update a contact message status (READ / REPLIED) */
  updateStatus: async (
    contactId: string,
    status: ContactStatus
  ): Promise<UpdateContactStatusResponse> => {
    return fetchApi<UpdateContactStatusResponse>(
      `/api/contact/${contactId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }
    );
  },

  /** Admin: delete a contact message */
  deleteMessage: async (contactId: string): Promise<DeleteContactResponse> => {
    return fetchApi<DeleteContactResponse>(`/api/contact/${contactId}`, {
      method: "DELETE",
    });
  },
};
