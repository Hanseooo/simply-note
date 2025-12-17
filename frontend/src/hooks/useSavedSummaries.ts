import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMySavedSummariesApi } from "@/services/summaryApi";
import type { SavedSummaryListItem } from "@/types/apiResponse";

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

// const { savedSummaries, isLoading, refetchSavedSummaries } = useSavedSummaries({
//   pinnedOnly: false,
// });

