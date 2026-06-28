import { fetchApi } from "./auth";
import { ViewingRequestPayload, ViewingResponse } from "@/types/viewing";

export const viewingService = {
  createViewing: async (payload: ViewingRequestPayload): Promise<ViewingResponse> => {
    return fetchApi<ViewingResponse>("/api/viewing", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
