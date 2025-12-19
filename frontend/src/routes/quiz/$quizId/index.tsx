import { requireAuth } from '@/guards/authGuard'
import AnswerQuizPage from '@/pages/AnswerQuizPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/quiz/$quizId/')({
  component: RouteComponent,
  beforeLoad: requireAuth(),
})

function RouteComponent() {
  return <AnswerQuizPage />
}
