import type { QuizContent, UserAnswer } from "@/store/quizStore";

const normalize = (v: string | boolean) =>
  typeof v === "string" ? v.trim().toLowerCase() : v;

export function scoreQuiz(
  quiz: QuizContent,
  answers: Record<string, UserAnswer>
) {
  let correct = 0;

  const perTopic: Record<string, { correct: number; total: number }> = {};

  for (const q of quiz.questions) {
    const userAnswer = answers[q.id];

    if (!perTopic[q.topic_id]) {
      perTopic[q.topic_id] = { correct: 0, total: 0 };
    }

    perTopic[q.topic_id].total += 1;

    // ⛔ unanswered → skip correctness
    if (userAnswer?.value == null) continue;

    const isCorrect = normalize(userAnswer.value) === normalize(q.answer);

    if (isCorrect) {
      correct += 1;
      perTopic[q.topic_id].correct += 1;
    }
  }

  return {
    totalCorrect: correct,
    totalQuestions: quiz.questions.length,
    perTopic,
  };
}
