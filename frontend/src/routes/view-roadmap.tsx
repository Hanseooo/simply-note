import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import ViewRoadmapPage from "@/pages/ViewRoadmapPage";
import { requireAuth } from "@/guards/authGuard";
import type { Roadmap } from "@/types/apiResponse";

export const Route = createFileRoute("/view-roadmap")({
  component: ViewRoadmapRoute,
  beforeLoad: requireAuth(),
});

function ViewRoadmapRoute() {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<Roadmap>(["latest-roadmap"]);

  if (!data) {
    throw redirect({ to: "/roadmaps" });
  }

  return <ViewRoadmapPage data={data} />;
}
