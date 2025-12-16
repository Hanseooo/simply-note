import { requireAuth } from '@/guards/authGuard'
import NotesPage from '@/pages/NotesPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/notes')({
  component: RouteComponent,
  beforeLoad: requireAuth(),
})

function RouteComponent() {
  return <NotesPage />
}
