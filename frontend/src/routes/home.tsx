import { requireAuth } from '@/guards/authGuard'
import Home from '@/pages/Home'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home')({
  component: RouteComponent,
  beforeLoad: requireAuth(),
  
})

function RouteComponent() {
  return <Home />
}
