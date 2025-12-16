import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { summarizeApi } from "@/services/aiApi";
import { toast } from "sonner";

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
    onError: () => toast.error("Unable to summarize"),
  });
};
