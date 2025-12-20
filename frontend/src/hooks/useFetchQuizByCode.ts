// hooks/useFetchQuizByCode.ts
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { getQuizByCodeApi } from "@/services/quizApi";

export const useFetchQuizByCode = () => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (code: string) => getQuizByCodeApi(code),

    onSuccess: ({ id }) => {
      navigate({
        to: "/quiz/$quizId",
        params: { quizId: id },
      });
    },

    onError: () => {
      toast.error("Invalid or inaccessible quiz code.");
    },
  });

  return {
    fetchByCode: mutation.mutate,
    isFetching: mutation.isPending,
  };
};

