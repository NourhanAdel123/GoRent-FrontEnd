import { fetchApi } from "./auth";
import {
  ReviewsResponse,
  FetchReviewsParams,
  CreateReviewPayload,
  CreateReviewResponse,
  DeleteReviewResponse,
  UpdateReviewPayload,
  UpdateReviewResponse,
} from "../types/review";

export const reviewService = {
  fetchReviews: async (params?: FetchReviewsParams): Promise<ReviewsResponse> => {
    let url = "/api/reviews";
    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          queryParams.append(key, String(value));
        }
      });
      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    return fetchApi<ReviewsResponse>(url);
  },

  createReview: async (payload: CreateReviewPayload): Promise<CreateReviewResponse> => {
    return fetchApi<CreateReviewResponse>("/api/reviews", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  deleteReview: async (reviewId: string): Promise<DeleteReviewResponse> => {
    return fetchApi<DeleteReviewResponse>(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });
  },

  updateReview: async (reviewId: string, payload: UpdateReviewPayload): Promise<UpdateReviewResponse> => {
    return fetchApi<UpdateReviewResponse>(`/api/reviews/${reviewId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
};
