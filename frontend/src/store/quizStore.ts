// stores/quizStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { normalizeAnswer } from "@/utils/normalizeAnswer";

export type QuizDifficulty = "easy" | "medium" | "hard";

export type QuizTopic = {
  id: string;
  label: string;
};

export type QuizQuestionType =
  | "multiple_choice"
  | "true_false"
  | "identification"
  | "fill_blank";

export type QuizQuestion = {
  id: string;
  type: "multiple_choice" | "true_false" | "identification" | "fill_blank";
  topic_id: string;
  question: string;
  choices: string[] | null;
  answer: string | boolean;
  explanation: string;
};

export type QuizContent = {
  title: string;
  difficulty: QuizDifficulty;
  topics: QuizTopic[];
  questions: QuizQuestion[];
};

export type UserAnswer = {
  questionId: string;
  value: string | boolean | null;
  normalizedValue: string | boolean | null;
  isCorrect: boolean | null;
};

type QuizState = {
  // immutable
  quiz: QuizContent | null;

  // mutable
  answers: Record<string, UserAnswer>;

  // lifecycle
  startedAt: number | null;
  completedAt: number | null;

  // actions
  setQuiz: (quiz: QuizContent) => void;
  answerQuestion: (questionId: string, value: string | boolean) => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
};

export const selectAnsweredCount = (state: QuizState) =>
  Object.values(state.answers).filter((a): a is UserAnswer => a.value !== null)
    .length;

function isUserAnswer(answer: UserAnswer | undefined): answer is UserAnswer {
  return answer !== undefined;
}

export const useQuizStore = create<QuizState>()(
  immer((set) => ({
    quiz: null,
    answers: {},
    startedAt: null,
    completedAt: null,

    setQuiz: (quiz) =>
      set((state) => {
        state.quiz = quiz;
        state.answers = {};
        state.startedAt = Date.now();
        state.completedAt = null;
      }),

    answerQuestion: (questionId, value) =>
      set((state) => {
        if (!state.quiz) return;

        const question: QuizQuestion | undefined = state.quiz.questions.find(
          (q: QuizQuestion) => q.id === questionId
        );

        if (!question) return;

        // Allow empty strings for text inputs (user can clear their answer)
        // Only prevent submission if completely empty AND it's a text question
        // const isTextQuestion =
        //   question.type === "identification" || question.type === "fill_blank";

        // Store the answer even if empty (allows deletion/clearing)
        const normalizedUser = normalizeAnswer(value);
        const normalizedCorrect = normalizeAnswer(question.answer);

        const isCorrect =
          normalizedUser !== null &&
          normalizedCorrect !== null &&
          normalizedUser === normalizedCorrect;

        state.answers[questionId] = {
          questionId,
          value,
          normalizedValue: normalizedUser,
          isCorrect,
        };
      }),

    completeQuiz: () =>
      set((state) => {
        state.completedAt = Date.now();
      }),

    resetQuiz: () =>
      set((state) => {
        state.quiz = null;
        state.answers = {};
        state.startedAt = null;
        state.completedAt = null;
      }),
  }))
);

export const selectOverallScore = (state: QuizState) => {
  const answers = Object.values(state.answers);
  if (answers.length === 0) return 0;

  const correct = answers.filter((a) => a.isCorrect).length;
  return Math.round((correct / answers.length) * 100);
};

export const selectTopicScores = (state: QuizState) => {
  if (!state.quiz) return [];

  return state.quiz.topics.map((topic) => {
    const questions = state.quiz!.questions.filter(
      (q) => q.topic_id === topic.id
    );

    const answers = questions
      .map((q) => state.answers[q.id])
      .filter(isUserAnswer);

    const correct = answers.filter((a) => a.isCorrect === true).length;

    return {
      topicId: topic.id,
      label: topic.label,
      total: questions.length,
      correct,
      percentage:
        questions.length === 0
          ? 0
          : Math.round((correct / questions.length) * 100),
    };
  });
};

export const selectQuestionReview =
  (questionId: string) => (state: QuizState) => {
    if (!state.quiz) return null;

    const question = state.quiz.questions.find((q) => q.id === questionId);
    if (!question) return null;

    const answer = state.answers[questionId];

    return {
      question,
      userAnswer: answer?.value ?? null,
      isCorrect: answer?.isCorrect ?? null,
      explanation: question.explanation,
    };
  };
