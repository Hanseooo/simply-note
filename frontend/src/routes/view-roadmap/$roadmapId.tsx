import { createFileRoute } from "@tanstack/react-router";
import ViewRoadmapPage from "@/pages/ViewRoadmapPage";
import { requireAuth } from "@/guards/authGuard";

export const Route = createFileRoute("/view-roadmap/$roadmapId")({
  beforeLoad: requireAuth(),
  component: ViewRoadmapRoute,
});

function ViewRoadmapRoute() {
  const { roadmapId } = Route.useParams();
  return <ViewRoadmapPage roadmapId={roadmapId!} />;
}
