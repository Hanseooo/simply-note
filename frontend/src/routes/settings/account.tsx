import { requireAuth } from '@/guards/authGuard'
import AccountSettingsPage from '@/pages/settings/AccountSettingsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/account')({
  component: RouteComponent,
  beforeLoad: requireAuth(),
})

function RouteComponent() {
  return (
    <div className=" bg-radial from-primary/10 min-h-screen">
      <AccountSettingsPage />
    </div>
  );
}
