import { api } from "@/lib/api";
import type { Roadmap, RoadmapDiagramType } from "@/types/apiResponse";

export const summarizeApi = async (payload: {
  text : string;
}) => {
  const { data } = await api.post("/api/ai/summarize/", payload);
  return data;
};

export const generateRoadmapApi = async (payload: {
  topic: string;
  diagram_type: RoadmapDiagramType;
}) => {
  const { data } = await api.post<Roadmap>(
    "/api/roadmaps/generate/",
    payload
  );
  return data;
};
