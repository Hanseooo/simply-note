// hooks/usePinnedCollection.ts
import { useQuery } from "@tanstack/react-query";
import { getMySavedSummariesApi } from "@/services/summaryApi";
import { getMySavedRoadmapsApi } from "@/services/roadmapApi";
import { getMySavedQuizzesApi } from "@/services/quizApi";

type PinnedType = "Notes" | "Quizzes" | "Roadmaps";

const getPinnedNotes = () => getMySavedSummariesApi({pinnedOnly : true})
const getPinnedRoadmaps = () => getMySavedRoadmapsApi({pinnedOnly : true})
const getPinnedQuizzes = () => getMySavedQuizzesApi({pinnedOnly : true})

const fetchers: Record<PinnedType, () => Promise<any[]>> = {
  Notes: getPinnedNotes,
  Quizzes: getPinnedQuizzes, 
  Roadmaps: getPinnedRoadmaps, 
};

export const usePinnedCollection = (type: PinnedType) => {
  return useQuery({
    queryKey: ["pinned", type],
    queryFn: fetchers[type],
    enabled: !!fetchers[type],
    staleTime: 1000 * 60 * 2,
  });
};
