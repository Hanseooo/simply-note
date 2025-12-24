"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuizStore } from "@/store/quizStore";
import { QuestionRenderer } from "./Quiz/QuestionRenderer";
import { Progress } from "@/components/ui/progress";
import { useQuizQuery } from "@/hooks/useQuizQuery";

export default function AnswerQuizPage() {
  const { quizId } = useParams({ strict: false });
  const navigate = useNavigate();

  const { data: quiz, isLoading } = useQuizQuery(quizId);
  const {
    setQuiz,
    quiz: storeQuiz,
    answers,
    answerQuestion,
    completeQuiz,
    completedAt,
  } = useQuizStore();

  const [index, setIndex] = useState(0);

  /* ---------- initialize quiz ---------- */
  useEffect(() => {
    if (quiz) {
      setQuiz(quiz.content);
    }
  }, [quiz, setQuiz]);

  /* ---------- completion redirect ---------- */
  useEffect(() => {
    if (completedAt && quizId) {
      navigate({
        to: "/quiz/$quizId/result",
        params: { quizId },
      });
    }
  }, [completedAt, navigate, quizId]);

  if (isLoading || !storeQuiz) {
    return <div className="p-6 text-muted-foreground">Loading quiz…</div>;
  }

  const question = storeQuiz.questions[index];
  const userAnswer = answers[question.id];
  const progress = ((index + 1) / storeQuiz.questions.length) * 100;
  const isLastQuestion = index === storeQuiz.questions.length - 1;

  const handleSubmit = () => {
    if (completeQuiz) {
      completeQuiz();
    }
  };

  return (
    <main className="min-h-[92vh] flex items-center justify-center bg-radial from-primary/5">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="max-w-3xl mx-auto px-4 py-6 space-y-6"
      >
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{storeQuiz.title}</h1>
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground">
            Question {index + 1} of {storeQuiz.questions.length}
          </p>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-sidebar">
              <CardContent className="p-6">
                <QuestionRenderer
                  question={question}
                  userAnswer={userAnswer}
                  onAnswer={(value) => answerQuestion(question.id, value)}
                />
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            disabled={index === 0}
            onClick={() => setIndex((i) => i - 1)}
          >
            Previous
          </Button>

          {isLastQuestion ? (
            <Button onClick={handleSubmit}>Submit Quiz</Button>
          ) : (
            <Button onClick={() => setIndex((i) => i + 1)}>Next</Button>
          )}
        </div>
      </motion.section>
    </main>
  );
}
