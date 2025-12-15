import { requireGuest } from '@/guards/authGuard'
import LandingPage from '@/pages/LandingPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
    beforeLoad: requireGuest(),
  
})

function RouteComponent() {
  return <LandingPage />
}
