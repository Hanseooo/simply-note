import { useQuery } from "@tanstack/react-query";
import { checkUsernameAvailabilityApi } from "@/services/authApi";

export const useUsernameAvailability = (username: string) => {
  return useQuery({
    queryKey: ["username-availability", username],
    queryFn: () => checkUsernameAvailabilityApi(username),
    enabled: username.length >= 3,
    staleTime: 60_000,
    retry: false,
  });
};
