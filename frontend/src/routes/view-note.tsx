import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import ViewNotePage from "@/pages/ViewNotePage";
import { requireAuth } from "@/guards/authGuard";
import type { SummarizedNote } from "@/types/apiResponse";

export const Route = createFileRoute("/view-note")({
  component: ViewNoteRoute,
  beforeLoad: requireAuth(),
});

function ViewNoteRoute() {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<SummarizedNote>(["latest-summary"]);

  if (!data) {
    throw redirect({ to: "/notes" }); // If no cache, go back to notes
  }

  return <ViewNotePage data={data} isSaved={false} />;
}
