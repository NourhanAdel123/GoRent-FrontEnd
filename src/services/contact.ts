import { fetchApi } from "./auth";
import { ContactPayload, ContactResponse } from "../types/contact";

export const contactService = {
  sendMessage: async (payload: ContactPayload): Promise<ContactResponse> => {
    return fetchApi<ContactResponse>("/api/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
