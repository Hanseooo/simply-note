import { api } from "@/lib/api";

export const summarizeApi = async (payload: {
  text : string;
}) => {
  const { data } = await api.post("/api/ai/summarize/", payload);
  return data;
};