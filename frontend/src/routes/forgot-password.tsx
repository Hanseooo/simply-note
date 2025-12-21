import { requireGuest } from '@/guards/authGuard'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/forgot-password')({
  component: RouteComponent,
  beforeLoad: requireGuest()
})

function RouteComponent() {
  return <ForgotPasswordPage />
}
