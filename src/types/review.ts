export interface ReviewAuthor {
  _id: string;
  name: string;
}

export interface ReviewTargetUser {
  _id: string;
  name: string;
}

export interface Review {
  _id: string;
  authorId: ReviewAuthor;
  propertyId: string | null;
  targetUserId: ReviewTargetUser;
  targetType: "OWNER" | "PROPERTY" | "TENANT";
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ReviewPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ReviewsResponse {
  message: string;
  reviews: Review[];
  pagination: ReviewPagination;
}

export interface FetchReviewsParams {
  targetUserId?: string;
  targetType?: string;
  propertyId?: string;
  page?: number;
  limit?: number;
}

export interface CreateReviewPayload {
  targetType: "PROPERTY" | "OWNER" | "TENANT";
  propertyId?: string;
  targetUserId?: string;
  rating: number;
  comment: string;
}

export interface CreateReviewResponse {
  message: string;
  review: Review;
}

export interface DeleteReviewResponse {
  message: string;
}

export interface UpdateReviewPayload {
  rating: number;
  comment: string;
}

export interface UpdateReviewResponse {
  message: string;
  review: Review;
}
