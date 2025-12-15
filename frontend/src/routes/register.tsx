import { requireGuest } from '@/guards/authGuard'
import RegisterPage from '@/pages/RegisterPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
  beforeLoad: requireGuest(),
})

function RouteComponent() {
  return <RegisterPage />
}
