import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { generateRoadmapApi } from "@/services/aiApi";
import type { Roadmap } from "@/types/apiResponse";

export const useGenerateRoadmap = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: generateRoadmapApi,

    onSuccess: (data: Roadmap) => {
      // Store latest generated roadmap
      queryClient.setQueryData<Roadmap>(["latest-roadmap"], data);

      toast.success("Roadmap generated");

      navigate({ to: "/view-roadmap" });
    },

    onError: () => {
      toast.error("Failed to generate roadmap");
    },
  });

  return {
    generateRoadmap: mutation.mutate,
    isGenerating: mutation.isPending,
  };
};
