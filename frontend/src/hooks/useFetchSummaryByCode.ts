import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { getSummaryByCodeApi } from "@/services/summaryApi";
import type { SummarizedNote } from "@/types/apiResponse";

export const useFetchSummaryByCode = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (code: string) => getSummaryByCodeApi(code),
    onSuccess: (data) => {
      // Cache it so /view-note can use the same cache
      queryClient.setQueryData<SummarizedNote>(["latest-summary"], data);

      navigate({ to: "/view-note" });
    },
    onError: (err: any) => {
      toast.error("Unable to fetch Note. Make sure the code is correct.");
      console.error(err);
    },
  });

  return {
    fetchByCode: mutation.mutate,
    isFetching: mutation.isPending,
  };
};
