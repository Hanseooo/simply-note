import { changePasswordApi } from "@/services/authApi";
import { useMutation } from "@tanstack/react-query";

export const useChangePassword = () =>
  useMutation({
    mutationFn: changePasswordApi,
    retry: false,
  });
