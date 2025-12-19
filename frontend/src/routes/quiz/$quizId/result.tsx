import { requireAuth } from '@/guards/authGuard'
import QuizResultPage from '@/pages/Quiz/QuizResultsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/quiz/$quizId/result')({
  component: RouteComponent,
  beforeLoad: requireAuth(),
})

function RouteComponent() {
  return <QuizResultPage />
}
