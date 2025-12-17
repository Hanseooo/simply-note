import { createFileRoute } from "@tanstack/react-router";
import NotesPage from "@/pages/NotesPage";
import { requireAuth } from "@/guards/authGuard";

export const Route = createFileRoute("/notes")({
  component: NotesRouteComponent,
  beforeLoad: requireAuth(),
});

function NotesRouteComponent() {
  return <NotesPage />;
}
