import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useChangeEmail = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      await api.post("/api/users/change-email/", { email });
    },
  });
};
