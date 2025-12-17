import { api } from "@/lib/api";

export const summarizeApi = async (payload: {
  text : string;
}) => {
  const { data } = await api.post("/api/ai/summarize/", payload);
  return data;
};

export const generateRoadmapApi = async (payload: {
  topic: string;
  diagram_type: "flowchart" | "gantt" | "timeline";
}) => {
  const { data } = await api.post("/api/roadmaps/generate/", payload);
  return data;
};
