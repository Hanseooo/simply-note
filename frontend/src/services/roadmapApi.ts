// services/roadmapApi.ts
import { api } from "@/lib/api";
import type { Roadmap, SavedRoadmapListItem } from "@/types/apiResponse";

export const saveExistingRoadmapApi = async (roadmapId: string) => {
  const { data } = await api.post(`/api/roadmaps/${roadmapId}/save/`);
  return data;
};

export const unsaveRoadmapApi = async (roadmapId: string) => {
  const { data } = await api.delete(`/api/roadmaps/${roadmapId}/unsave/`);
  return data;
};

export const pinRoadmapApi = async (roadmapId: string) => {
  const { data } = await api.post(`/api/roadmaps/${roadmapId}/pin/`);
  return data;
};

export const unpinRoadmapApi = async (roadmapId: string) => {
  const { data } = await api.post(`/api/roadmaps/${roadmapId}/unpin/`);
  return data;
};

// services/roadmapApi.ts
export const getRoadmapByCodeApi = async (code: string) => {
  const { data } = await api.get<{ id: string }>(
    `/api/roadmaps/share/${code}/`
  );
  return data;
};


export const getMySavedRoadmapsApi = async (opts?: {
  pinnedOnly?: boolean;
}) => {
  const params = opts?.pinnedOnly ? { pinned: "true" } : undefined;

  const { data } = await api.get<SavedRoadmapListItem[]>(
    "/api/roadmaps/saved/",
    { params }
  );

  return data;
};

export const getRoadmapByIdApi = async (roadmapId: string) => {
  const { data } = await api.get<Roadmap>(`/api/roadmaps/${roadmapId}/`);
  return data;
};