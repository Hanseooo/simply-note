import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { VerifyEmailPayload } from "@/types/apiPayloads";
import type { VerifyEmailResponse } from "@/types/apiResponse";

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: async (payload: VerifyEmailPayload) => {
      const { data } = await api.post<VerifyEmailResponse>(
        "/api/users/verify-email/",
        payload
      );
      return data;
    },
  });
};

//usage:
// verifyEmail.mutate(params.key, {
//   onSuccess: () => navigate({ to: "/login" }),
// });
