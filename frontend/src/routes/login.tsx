import { requireGuest } from '@/guards/authGuard'
import LoginPage from '@/pages/LoginPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  beforeLoad: requireGuest(),
})

function RouteComponent() {
  return <LoginPage />
}
