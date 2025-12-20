// hooks/useGenerateQuiz.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { generateQuizApi } from "@/services/quizApi";
import { useQuizStore } from "@/store/quizStore";
import { AI_QUOTA_QUERY_KEY } from "./useAiQuota";

export const useGenerateQuiz = () => {
  const navigate = useNavigate();
  const resetQuiz = useQuizStore().resetQuiz

  const qc = useQueryClient()

  return useMutation({
    mutationFn: generateQuizApi,

    onSuccess: ({ quiz_id }) => {
        qc.invalidateQueries({queryKey : AI_QUOTA_QUERY_KEY})
        resetQuiz()
      navigate({
        to: "/quiz/$quizId",
        params: { quizId: quiz_id },
      });
    },

    onError: () => {
      toast.error("Failed to generate quiz.");
    },
  });
};
