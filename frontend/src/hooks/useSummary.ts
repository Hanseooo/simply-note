import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  saveExistingSummaryApi,
  saveNewSummaryApi,
  unsaveSummaryApi,
  pinSummaryApi,
  unpinSummaryApi,
} from "@/services/summaryApi";
import type { SummarizedNote } from "@/types/apiResponse";

export const useSummary = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // SAVE (new or existing)
  const saveMutation = useMutation({
    mutationFn: async (note: SummarizedNote) => {
      if (note.id) {
        return saveExistingSummaryApi(note.id);
      }
      return saveNewSummaryApi(note);
    },

    onSuccess: (data) => {
      toast.success(`saved: ${data.title}`); // previous param: _

      queryClient.setQueryData<SummarizedNote>(["latest-summary"], (old) =>
        old ? { ...old, is_saved: true } : old
      );

      navigate({ to: "/notes" });
    },
    onError: () => toast.error("Unable to save summary"),
  });

  // UNSAVE
  const unsaveMutation = useMutation({
    mutationFn: (summaryId: string) => unsaveSummaryApi(summaryId),
    onSuccess: () => {
      toast.success("Summary removed");

      queryClient.invalidateQueries({ queryKey: ["saved-summaries"] });
    },
    onError: () => toast.error("Unable to remove summary"),
  });

  // PIN
  const pinMutation = useMutation({
    mutationFn: (summaryId: string) => pinSummaryApi(summaryId),
    onSuccess: () => {
      toast.success("Pinned");
      queryClient.invalidateQueries({ queryKey: ["saved-summaries"] });
    },
  });

  // UNPIN
  const unpinMutation = useMutation({
    mutationFn: (summaryId: string) => unpinSummaryApi(summaryId),
    onSuccess: () => {
      toast.success("Unpinned");
      queryClient.invalidateQueries({ queryKey: ["saved-summaries"] });
    },
  });



  

  return {
    saveSummary: saveMutation.mutate,
    unsaveSummary: unsaveMutation.mutate,
    pinSummary: pinMutation.mutate,
    unpinSummary: unpinMutation.mutate,

    isSaving: saveMutation.isPending,
    isUnsaving: unsaveMutation.isPending,
  };
};
