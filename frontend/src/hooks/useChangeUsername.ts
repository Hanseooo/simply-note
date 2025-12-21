import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeUsernameApi } from "@/services/authApi";

export const useChangeUsername = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeUsernameApi,
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], (prev: any) => ({
        ...prev,
        username: data.username,
      }));
    },
  });
};

