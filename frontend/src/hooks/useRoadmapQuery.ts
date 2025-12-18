import { useQuery } from "@tanstack/react-query";
import { getRoadmapByIdApi } from "@/services/roadmapApi";
import type { Roadmap } from "@/types/apiResponse";

export const useRoadmapQuery = (roadmapId?: string) => {
  return useQuery<Roadmap>({
    queryKey: ["roadmap", Number(roadmapId)], // normalize key
    queryFn: () => getRoadmapByIdApi(roadmapId!),
    enabled: !!roadmapId,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });
};


