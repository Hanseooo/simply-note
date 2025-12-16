import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) =>
      api.post("/api/auth/password/reset/", { email }),
  });
};
