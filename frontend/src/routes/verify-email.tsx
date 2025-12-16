import { requireGuest } from "@/guards/authGuard";
import EmailVerificationPage from "@/pages/EmailVerificationPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/verify-email")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      key: search.key as string,
    };
  },
  component: RouteComponent,
  beforeLoad: requireGuest(),
  
});

function RouteComponent() {
  return <EmailVerificationPage />;
}
