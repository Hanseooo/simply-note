import { api } from "@/lib/api";
import type { FeedbackPayload } from "@/types/apiPayloads";
import type { MyRatingResponse, PaginatedFeedbackResponse } from "@/types/apiResponse";


export const submitFeedback = (payload: FeedbackPayload) =>
  api.post("/api/feedback/", payload);

export const getMyRating = () =>
  api.get<MyRatingResponse>("/api/feedback/my-rating/");


export function getAdminFeedbacks(params: Record<string, any>) {
  return api.get<PaginatedFeedbackResponse>("/api/feedback/", {
    params,
  });
}
