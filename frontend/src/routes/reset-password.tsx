import { requireGuest } from '@/guards/authGuard'
import ResetPasswordPage from '@/pages/ResetPasswordPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/reset-password')({
  component: RouteComponent,
  beforeLoad: requireGuest(),
  validateSearch: (search) => ({
    token: search.token as string
  })
})

function RouteComponent() {
  return <ResetPasswordPage />
}
