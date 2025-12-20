import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { generateRoadmapApi } from "@/services/aiApi";
import type { Roadmap } from "@/types/apiResponse";
import axios from "axios";
import { AI_QUOTA_QUERY_KEY } from "./useAiQuota";

export const useGenerateRoadmap = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const qc = useQueryClient()

  const mutation = useMutation({
    mutationFn: generateRoadmapApi,

    onSuccess: (data: Roadmap) => {

      qc.invalidateQueries({queryKey : AI_QUOTA_QUERY_KEY})

      toast.success(`Roadmap Generated: ${data.title}`);

      queryClient.setQueryData(["roadmap", data.id], data);

      navigate({
        to: "/view-roadmap/$roadmapId",
        params: { roadmapId: data.id },
      });
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        // Case 1: Proper HTTP 503
        if (error.response?.status === 503) {
          toast.error(
            "Service is unavailable at the moment. Please try again later."
          );
          return;
        }

        // Case 2: Server crashed / exception (no response)
        if (!error.response) {
          toast.error(
            "Service is unavailable at the moment. Please try again later."
          );
          return;
        }
      }

    //   toast.error("Unable to generate roadmap");
        toast.error(
            "Service is unavailable at the moment. Please try again later."
        );
    },
  });

  return {
    generateRoadmap: mutation.mutate,
    isGenerating: mutation.isPending,
  };
};
