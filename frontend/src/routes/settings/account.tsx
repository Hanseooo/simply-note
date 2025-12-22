import { requireAuth } from '@/guards/authGuard'
import AccountSettingsPage from '@/pages/settings/AccountSettingsPage'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/settings/account')({
  component: RouteComponent,
  beforeLoad: requireAuth(),
})

function RouteComponent() {

  useEffect(() => {
    window.scrollTo(0,0)
  })

  return (
    <div className=" bg-radial from-primary/10 min-h-screen">
      <AccountSettingsPage />
    </div>
  );
}
