import { requireAuth } from '@/guards/authGuard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/notes')({
  component: RouteComponent,
  beforeLoad: requireAuth(),
})

function RouteComponent() {
  return <div>Hello "/notes"!</div>
}
