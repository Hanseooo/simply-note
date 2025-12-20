// hooks/useGenerateQuiz.ts
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { generateQuizApi } from "@/services/quizApi";
import { useQuizStore } from "@/store/quizStore";

export const useGenerateQuiz = () => {
  const navigate = useNavigate();
  const resetQuiz = useQuizStore().resetQuiz

  return useMutation({
    mutationFn: generateQuizApi,

    onSuccess: ({ quiz_id }) => {
        resetQuiz()
      navigate({
        to: "/quiz/$quizId",
        params: { quizId: quiz_id },
      });
    },

    onError: () => {
      toast.error("Failed to generate quiz.");
    },
  });
};
