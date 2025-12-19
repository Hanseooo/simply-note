// hooks/useFetchRoadmapByCode.ts
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { getRoadmapByCodeApi } from "@/services/roadmapApi";

export const useFetchRoadmapByCode = () => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (code: string) => getRoadmapByCodeApi(code),

    onSuccess: ({ id }) => {
      navigate({
        to: "/view-roadmap/$roadmapId",
        params: { roadmapId: id.toString() },
      });
    },

    onError: () => {
      toast.error("Invalid or inaccessible share code.");
    },
  });

  return {
    fetchByCode: mutation.mutate,
    isFetching: mutation.isPending,
  };
};
