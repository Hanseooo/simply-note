// hooks/useVerifyEmailChange.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyEmailChangeApi } from "@/services/authApi";

export const useVerifyEmailChange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyEmailChangeApi,
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], (prev: any) => ({
        ...prev,
        email: data.email,
      }));
    },
  });
};
