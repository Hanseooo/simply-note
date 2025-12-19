// hooks/useSavedQuizzes.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMySavedQuizzesApi } from "@/services/quizApi";
import type { SavedQuizListItem } from "@/types/apiResponse";

export const useSavedQuizzes = (opts?: { pinnedOnly?: boolean }) => {
  const queryClient = useQueryClient();

  const queryKey = ["saved-quizzes", opts?.pinnedOnly ? "pinned" : "all"];

  const query = useQuery<SavedQuizListItem[]>({
    queryKey,
    queryFn: () => getMySavedQuizzesApi(opts),
  });

  return {
    quizzes: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: () => queryClient.invalidateQueries({ queryKey }),
  };
};
