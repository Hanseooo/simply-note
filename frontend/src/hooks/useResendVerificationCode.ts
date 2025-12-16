import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useResendVerificationCode = () => {
  return useMutation({
    mutationFn: async (key: string) => {
      await api.post("/api/users/auth/registration/resend-verification/", { key });
    },
  });
};
