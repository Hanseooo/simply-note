import type { QuizQuestion, UserAnswer } from "@/store/quizStore";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { TrueFalseQuestion } from "./TrueFalseQuestion";
import { IdentificationQuestion } from "./IdentificationQuestion";

type QuestionRendererProps = {
  question: QuizQuestion;
  userAnswer: UserAnswer | undefined;
  onAnswer: (value: string | boolean) => void;
};

export function QuestionRenderer({
  question,
  userAnswer,
  onAnswer,
}: QuestionRendererProps) {
  switch (question.type) {
    case "multiple_choice": {
      const value =
        typeof userAnswer?.value === "string" ? userAnswer.value : null;

      return (
        <MultipleChoiceQuestion
          question={question}
          value={value}
          onChange={(v) => onAnswer(v)}
        />
      );
    }

    case "true_false":
      return (
        <TrueFalseQuestion
          question={question}
          value={
            typeof userAnswer?.value === "boolean" ? userAnswer.value : null
          }
          onChange={onAnswer}
        />
      );

    case "identification":
    case "fill_blank":
      return (
        <IdentificationQuestion
          question={question}
          value={typeof userAnswer?.value === "string" ? userAnswer.value : ""}
          onChange={onAnswer}
        />
      );

    default:
      return null;
  }
}
