// hooks/useSavedRoadmaps.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMySavedRoadmapsApi } from "@/services/roadmapApi";
import type { SavedRoadmapListItem } from "@/types/apiResponse";

type UseSavedRoadmapsOptions = {
  pinnedOnly?: boolean;
};

export const useSavedRoadmaps = (opts?: UseSavedRoadmapsOptions) => {
  const queryClient = useQueryClient();

  const queryKey = ["saved-roadmaps", opts?.pinnedOnly ? "pinned" : "all"];

  const savedRoadmapsQuery = useQuery<SavedRoadmapListItem[]>({
    queryKey,
    queryFn: () => getMySavedRoadmapsApi(opts),
  });

  /**
   * Manual refetch helper
   * (matches summaries hook behavior)
   */
  const refetchSavedRoadmaps = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  return {
    // data
    savedRoadmaps: savedRoadmapsQuery.data ?? [],

    // states
    isLoading: savedRoadmapsQuery.isLoading,
    isFetching: savedRoadmapsQuery.isFetching,
    isError: savedRoadmapsQuery.isError,

    // actions
    refetchSavedRoadmaps,
  };
};
