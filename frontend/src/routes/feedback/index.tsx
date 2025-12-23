import { requireAuth } from '@/guards/authGuard'
import FeedbackPage from '@/pages/FeedbackPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/feedback/')({
  component: RouteComponent,
  beforeLoad: requireAuth()
})

function RouteComponent() {
  return (
    <main className='min-h-screen w-full bg-radial from-primary/10 flex items-center justify-center'>
      <FeedbackPage />
    </main>
  )
}
