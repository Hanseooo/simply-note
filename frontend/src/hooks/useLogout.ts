import { logoutApi } from "@/services/authApi";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";

export const useLogout = () => {
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      clearAuth();
      window.location.href = "/login";
    },
  });
};
