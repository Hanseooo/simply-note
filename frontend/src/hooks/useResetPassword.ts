import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (payload: {
      uid: string;
      token: string;
      new_password1: string;
      new_password2: string;
    }) => api.post("/api/auth/password/reset/confirm/", payload),
  });
};
