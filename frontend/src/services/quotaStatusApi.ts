import { api } from "@/lib/api";
import type { AIQuotaStatusResponse } from "@/types/apiResponse";

export const getAIQuotaStatusApi = async () => {
  const { data } = await api.get<AIQuotaStatusResponse>("/api/ai/quota/");
  return data;
};
