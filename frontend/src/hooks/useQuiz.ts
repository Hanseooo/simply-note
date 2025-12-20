import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { pinQuizApi, unpinQuizApi, unsaveQuizApi } from "@/services/quizApi";

export const useQuiz = () => {
  const queryClient = useQueryClient();



  const unsaveMutation = useMutation({
    mutationFn: (quizId: string) => unsaveQuizApi(quizId),

    onSuccess: () => {
      toast.success("Removed from saved quizzes");

      queryClient.invalidateQueries({
        queryKey: ["saved-quizzes"],
      });
    },

    onError: () => toast.error("Unable to remove quiz"),
  });



  const pinMutation = useMutation({
    mutationFn: (quizId: string) => pinQuizApi(quizId),

    onSuccess: () => {
      toast.success("Pinned");

      queryClient.invalidateQueries({
        queryKey: ["saved-quizzes"],
      });
    },

    onError: () => toast.error("Unable to pin quiz"),
  });



  const unpinMutation = useMutation({
    mutationFn: (quizId: string) => unpinQuizApi(quizId),

    onSuccess: () => {
      toast.success("Unpinned");

      queryClient.invalidateQueries({
        queryKey: ["saved-quizzes"],
      });
    },

    onError: () => toast.error("Unable to unpin quiz"),
  });

  return {
    // actions
    unsaveQuiz: unsaveMutation.mutate,
    pinQuiz: pinMutation.mutate,
    unpinQuiz: unpinMutation.mutate,

    // states
    isUnsaving: unsaveMutation.isPending,
    isPinning: pinMutation.isPending,
    isUnpinning: unpinMutation.isPending,
  };
};
