"use client";

import { motion } from "framer-motion";
import { useQuizStore } from "@/store/quizStore";
import { scoreQuiz } from "@/lib/quizScoring";
import { Card, CardContent } from "@/components/ui/card";
import { TopicRadarChart } from "@/components/charts/TopicRadarChart"; 
import { TopicBarChart } from "@/components/charts/TopicBarChart"; 
import MarkdownRenderer from "@/components/renderer/MarkdownRenderer"; 
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { getRouteApi, useNavigate, } from "@tanstack/react-router";
import { useEffect } from "react";

export default function QuizResultPage() {
  const { quiz, answers, resetQuiz } = useQuizStore();

  const quizRoute = getRouteApi("/quiz/$quizId/result")

  const navigate = useNavigate()
  const quizId = quizRoute.useParams().quizId

  useEffect(() => {
    window.scrollTo(0,0)
  }, [])

  if (!quiz) {
    return <div className="p-6 min-h-[80vh] flex flex-col items-center justify-center text-center w-full">
      <h4 className="text-primary font-bold text-4xl mb-4">No Results Found</h4>
      <Button onClick={() => navigate({ to: "/quizzes"})} variant={"link"}>Back to Quizzes</Button>
    </div>;
  }

  const { totalCorrect, totalQuestions, perTopic } = scoreQuiz(quiz, answers);

  const topicMap = Object.fromEntries(quiz.topics.map((t) => [t.id, t.label]));

  const chartData = Object.entries(perTopic).map(([topicId, stats]) => ({
    topic: topicMap[topicId],
    score: Math.round((stats.correct / stats.total) * 100),
  }));

  return (
    <main className="bg-radial from-primary/10 w-full">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 py-6 space-y-8"
      >
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold">
            Quiz <span className="text-primary">Results</span>
          </h1>
          <p className="text-muted-foreground">
            {totalCorrect} / {totalQuestions} correct
          </p>
        </div>

        {/* Charts */}
        <div className="grid gap-6">
          <Card className="border-primary bg-sidebar h-72 sm:h-80 md:h-96">
            <CardContent className="p-4 h-full">
              <h2 className="font-medium mb-2 text-primary">Topic Mastery</h2>
              <div className="h-full">
                <TopicRadarChart data={chartData} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary bg-sidebar h-72 sm:h-80 md:h-96">
            <CardContent className="p-4 h-full">
              <h2 className="font-medium mb-2 text-primary">Score Breakdown</h2>
              <div className="h-full">
                <TopicBarChart data={chartData} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Answer Review */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">
            Answer <span className="text-primary">Review</span>
          </h2>

          {quiz.questions.map((q, idx) => {
            const userAnswer = answers[q.id];
            const isCorrect =
              userAnswer &&
              String(userAnswer.value).toLowerCase() ===
                String(q.answer).toLowerCase();

            return (
              <Card className="border-primary/25 bg-sidebar" key={q.id}>
                <CardContent className="p-5 space-y-4">
                  {/* Question */}
                  <div className="text-lg font-medium whitespace-normal wrap-break-words">
                    <MarkdownRenderer content={`${idx + 1}. ${q.question}`} />
                  </div>

                  {/* User Answer */}
                  <div
                    className={`text-sm whitespace-normal wrap-break-words ${
                      isCorrect ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <span className="font-medium">Your answer:</span>
                    <div className="mt-1">
                      <MarkdownRenderer
                        content={String(userAnswer?.value ?? "—")}
                      />
                    </div>
                  </div>

                  {/* Correct Answer (only if wrong) */}
                  {!isCorrect && (
                    <div className="text-sm text-muted-foreground whitespace-normal wrap-break-words">
                      <span className="font-medium">Correct answer:</span>
                      <div className="mt-1">
                        <MarkdownRenderer content={String(q.answer)} />
                      </div>
                    </div>
                  )}

                  {/* Explanation */}
                  <div className="prose prose-sm dark:prose-invert max-w-none bg-primary/10 rounded-2xl">
                    <MarkdownRenderer content={q.explanation} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
          <div className="w-full flex justify-between">
            <Button
              variant={"ghost"}
              onClick={() => {
                navigate({ to: "/quizzes" });
              }}
              className="text-primary font-bold"
            >
              <ArrowLeft className="h-4 w-4 text-primary" />
              back
            </Button>
            <Button
              variant={"outline"}
              onClick={() => {
                resetQuiz();
                navigate({ to: "/quiz/$quizId", params: { quizId: quizId } });
              }}
              className="text-primary font-bold"
            >
              <RotateCcw className="h-4 w-4 text-primary" />
              retry
            </Button>
          </div>
        </div>
      </motion.section>
    </main>

    //todo: put overflow-x-auto if contains code block
  );
}
