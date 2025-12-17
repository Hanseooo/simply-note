// hooks/usePinnedCollection.ts
import { useQuery } from "@tanstack/react-query";
import { getMySavedSummariesApi } from "@/services/summaryApi";

type PinnedType = "Notes" | "Quizzes" | "Roadmaps";

const getPinnedNotes = () => getMySavedSummariesApi({pinnedOnly : true})

const fetchers: Record<PinnedType, () => Promise<any[]>> = {
  Notes: getPinnedNotes,
  Quizzes: getMySavedSummariesApi, // can be stubbed
  Roadmaps: getMySavedSummariesApi, // can be stubbed
};

export const usePinnedCollection = (type: PinnedType) => {
  return useQuery({
    queryKey: ["pinned", type],
    queryFn: fetchers[type],
    enabled: !!fetchers[type],
  });
};
