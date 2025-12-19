import { Button } from "@/components/ui/button";
import type { QuizQuestion } from "@/store/quizStore";
import MarkdownRenderer from "@/components/renderer/MarkdownRenderer";

type Props = {
  question: QuizQuestion;
  value: string | null;
  onChange: (v: string) => void;
};

export function MultipleChoiceQuestion({ question, value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium leading-relaxed">
        <MarkdownRenderer content={question.question} />
      </div>

      <div className="grid gap-3">
        {question.choices?.map((choice) => (
          <Button
            key={choice}
            variant={value === choice ? "default" : "outline"}
            className="w-full justify-start text-left h-auto py-3 px-4 transition-all duration-200 hover:scale-[1.01] whitespace-normal wrap-break-word leading-relaxed"
            onClick={() => onChange(choice)}
          >
            <MarkdownRenderer content={choice} />
          </Button>
        ))}
      </div>
    </div>
  );
}
