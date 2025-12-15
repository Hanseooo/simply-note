import { requireAuth } from '@/guards/authGuard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home')({
  component: RouteComponent,
  beforeLoad: requireAuth(),
  
})

function RouteComponent() {
  return <div>Hello "/home"!</div>
}
