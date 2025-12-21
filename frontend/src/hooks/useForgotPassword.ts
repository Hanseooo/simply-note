import { useMutation } from "@tanstack/react-query";
import { requestPasswordResetApi } from "@/services/authApi";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: requestPasswordResetApi,
    retry: false,
  });
};
