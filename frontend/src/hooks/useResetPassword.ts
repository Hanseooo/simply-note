// hooks/useResetPassword.ts
import { useMutation } from "@tanstack/react-query";
import { resetPasswordApi } from "@/services/authApi";

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPasswordApi,
    retry: false,
  });
};
