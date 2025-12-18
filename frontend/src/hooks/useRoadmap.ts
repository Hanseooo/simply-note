// hooks/useRoadmap.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  saveExistingRoadmapApi,
  unsaveRoadmapApi,
  pinRoadmapApi,
  unpinRoadmapApi,
} from "@/services/roadmapApi";
import { useNavigate } from "@tanstack/react-router";

export const useRoadmap = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate()

  /* =========================
     SAVE
  ========================= */

  const saveMutation = useMutation({
    mutationFn: (roadmapId: string) => saveExistingRoadmapApi(roadmapId),

    onSuccess: () => {
      toast.success(`Roadmap Saved!`);

      // Update latest roadmap cache if present
      queryClient.setQueryData(["latest-roadmap"], (old: any) =>
        old ? { ...old, is_saved: true } : old
      );

      queryClient.invalidateQueries({
        queryKey: ["saved-roadmaps"],
      });
      navigate({to : "/roadmaps"})
    },

    onError: () => toast.error("Unable to save roadmap"),
  });

  /* =========================
     UNSAVE
  ========================= */

  const unsaveMutation = useMutation({
    mutationFn: (roadmapId: string) => unsaveRoadmapApi(roadmapId),

    onSuccess: () => {
      toast.success("Removed from saved roadmaps");

      queryClient.invalidateQueries({
        queryKey: ["saved-roadmaps"],
      });
    },

    onError: () => toast.error("Unable to remove roadmap"),
  });

  /* =========================
     PIN
  ========================= */

  const pinMutation = useMutation({
    mutationFn: (roadmapId: string) => pinRoadmapApi(roadmapId),

    onSuccess: () => {
      toast.success("Pinned");
      queryClient.invalidateQueries({
        queryKey: ["saved-roadmaps"],
      });
    },
  });

  /* =========================
     UNPIN
  ========================= */

  const unpinMutation = useMutation({
    mutationFn: (roadmapId: string) => unpinRoadmapApi(roadmapId),

    onSuccess: () => {
      toast.success("Unpinned");
      queryClient.invalidateQueries({
        queryKey: ["saved-roadmaps"],
      });
    },
  });

  return {
    // actions
    saveRoadmap: saveMutation.mutate,
    unsaveRoadmap: unsaveMutation.mutate,
    pinRoadmap: pinMutation.mutate,
    unpinRoadmap: unpinMutation.mutate,

    // states
    isSaving: saveMutation.isPending,
    isUnsaving: unsaveMutation.isPending,
  };
};
