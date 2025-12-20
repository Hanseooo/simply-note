import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMySavedSummariesApi, getMySavedSummariesMinimalApi } from "@/services/summaryApi";
import type { SavedSummaryListItem, SavedSummaryMinimal } from "@/types/apiResponse";

type UseSavedSummariesOptions = {
  pinnedOnly?: boolean;
};

export const useSavedSummaries = (opts?: UseSavedSummariesOptions) => {
  const queryClient = useQueryClient();

  const queryKey = ["saved-summaries", opts?.pinnedOnly ? "pinned" : "all"];

  const savedSummariesQuery = useQuery<SavedSummaryListItem[]>({
    queryKey,
    queryFn: () => getMySavedSummariesApi(opts),
  });

  /**
   * Manual refetch helper
   * (matches the "action" style of useSummary)
   */
  const refetchSavedSummaries = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  return {
    // data
    savedSummaries: savedSummariesQuery.data ?? [],

    // states
    isLoading: savedSummariesQuery.isLoading,
    isFetching: savedSummariesQuery.isFetching,
    isError: savedSummariesQuery.isError,

    // actions
    refetchSavedSummaries,
  };
};

export const useSavedSummariesMinimal = () => {
  const query = useQuery<SavedSummaryMinimal[]>({
    queryKey: ["saved-summaries-minimal"],
    queryFn: getMySavedSummariesMinimalApi,
  });

  return {
    summaries: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
  };
}

