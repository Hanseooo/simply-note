import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  submitFeedback,
  getAdminFeedbacks,
  getMyRating,
} from "@/services/feedbackApi";
import type { FeedbackType } from "@/types/apiPayloads";

export interface FeedbackFilters {
  feedback_type?: FeedbackType;
  rating?: number;
  context?: string;
}

export function useFeedback({
  page,
  pageSize = 20,
  filters = {},
}: {
  page?: number;
  pageSize?: number;
  filters?: FeedbackFilters;
} = {}) {
  const qc = useQueryClient();

  /* ---------- MY RATING ---------- */
  const ratingQuery = useQuery({
    queryKey: ["my-rating"],
    queryFn: async () => {
      const res = await getMyRating();
      return res.data;
    },
  });

  /* ---------- ADMIN FEEDBACK LIST ---------- */
  const feedbackQuery = useQuery({
    enabled: typeof page === "number", // only runs for admin usage
    queryKey: ["feedback", page, pageSize, filters],
    queryFn: async () => {
      const res = await getAdminFeedbacks({
        page,
        page_size: pageSize,
        ...filters,
      });
      return res.data;
    },
  });

  /* ---------- SUBMIT FEEDBACK ---------- */
  const submitMutation = useMutation({
    mutationFn: submitFeedback,
    onMutate: async (payload) => {
      if (payload.feedback_type === "rating") {
        await qc.cancelQueries({ queryKey: ["my-rating"] });

        const prev = qc.getQueryData(["my-rating"]);

        qc.setQueryData(["my-rating"], {
          rating: payload.rating,
          updated_at: new Date().toISOString(),
        });

        return { prev };
      }
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(["my-rating"], ctx.prev);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-rating"] });
      qc.invalidateQueries({ queryKey: ["feedback"] });
    },
  });

  return {
    ratingQuery,
    feedbackQuery,
    submitMutation,
  };
}
