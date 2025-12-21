import { useMutation } from "@tanstack/react-query";
import { requestEmailChangeApi } from "@/services/authApi";

export const useRequestEmailChange = () => {
  return useMutation({
    mutationFn: requestEmailChangeApi,
    retry: false,
  });
};
