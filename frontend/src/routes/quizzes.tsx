import { requireAuth } from '@/guards/authGuard'
import QuizPage from '@/pages/QuizPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/quizzes')({
  component: RouteComponent,
  beforeLoad: requireAuth(),
})

function RouteComponent() {
  return <QuizPage />
}
