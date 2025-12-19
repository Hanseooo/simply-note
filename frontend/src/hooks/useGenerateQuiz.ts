// hooks/useGenerateQuiz.ts
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { generateQuizApi } from "@/services/quizApi";

export const useGenerateQuiz = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: generateQuizApi,

    onSuccess: ({ quiz_id }) => {
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
