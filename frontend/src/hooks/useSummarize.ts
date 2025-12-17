import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { summarizeApi } from "@/services/aiApi";
import { toast } from "sonner";
import axios from "axios";

export const useSummarize = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: summarizeApi,
    onSuccess: (data) => {
      // Cache it
      queryClient.setQueryData(["latest-summary"], data);
      toast.success(`Summarized ${data.title}`);

      // Navigate
      navigate({ to: "/view-note" });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        // Case 1: Proper HTTP 503
        if (error.response?.status === 503) {
          toast.error(
            "Service is unavailable at the moment. Please try again later."
          );
          return;
        }

        // Case 2: Server crashed / exception (no response)
        if (!error.response) {
          toast.error(
            "Service is unavailable at the moment. Please try again later."
          );
          return;
        }
      }

      toast.error("Unable to summarize");
    },
  });
};
