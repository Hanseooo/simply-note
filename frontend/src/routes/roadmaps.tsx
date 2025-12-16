import { requireAuth } from '@/guards/authGuard'
import RoadmapPage from '@/pages/RoadmapPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/roadmaps')({
  component: RouteComponent,
  beforeLoad: requireAuth(),
})

function RouteComponent() {
  return <RoadmapPage />
}
