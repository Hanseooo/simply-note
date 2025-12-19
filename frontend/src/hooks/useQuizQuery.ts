// hooks/useQuizQuery.ts
import { useQuery } from "@tanstack/react-query";
import { getQuizByIdApi } from "@/services/quizApi";
import type { QuizContentResponse } from "@/types/apiResponse";

export const useQuizQuery = (quizId?: string) => {
  return useQuery<QuizContentResponse>({
    queryKey: ["quiz", quizId],
    queryFn: () => getQuizByIdApi(quizId!),
    enabled: !!quizId,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });
};
