// hooks/useAIQuota.ts
import { useQuery } from "@tanstack/react-query";
import { getAIQuotaStatusApi } from "@/services/quotaStatusApi";
import type { AIQuotaStatusItem } from "@/types/apiResponse";

export const AI_QUOTA_QUERY_KEY = ["ai-quota"];

export const useAIQuota = () => {
  return useQuery<AIQuotaStatusItem[]>({
    queryKey: AI_QUOTA_QUERY_KEY,
    queryFn: getAIQuotaStatusApi,
    staleTime: 30_000, 
    refetchOnWindowFocus: true,
    retry: false, 
  });
};

export const getGeneralAIQuota = (data?: AIQuotaStatusItem[]) =>
  data?.find((q) => q.bucket === "general");

export const getQuizAIQuota = (data?: AIQuotaStatusItem[]) =>
  data?.find((q) => q.bucket === "quiz");
