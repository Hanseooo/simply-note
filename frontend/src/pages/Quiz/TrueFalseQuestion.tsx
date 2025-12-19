import { Button } from "@/components/ui/button";
import type { QuizQuestion } from "@/store/quizStore";
import MarkdownRenderer from "@/components/renderer/MarkdownRenderer";

type Props = {
  question: QuizQuestion;
  value: boolean | null;
  onChange: (v: boolean) => void;
};

export function TrueFalseQuestion({ question, value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium leading-relaxed">
        <MarkdownRenderer content={question.question} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant={value === true ? "default" : "outline"}
          onClick={() => onChange(true)}
          className="h-12 text-base font-medium transition-all duration-200 hover:scale-[1.02]"
        >
          True
        </Button>

        <Button
          variant={value === false ? "default" : "outline"}
          onClick={() => onChange(false)}
          className="h-12 text-base font-medium transition-all duration-200 hover:scale-[1.02]"
        >
          False
        </Button>
      </div>
    </div>
  );
}
