import { Input } from "@/components/ui/input";
import type { QuizQuestion } from "@/store/quizStore";
import MarkdownRenderer from "@/components/renderer/MarkdownRenderer";

type Props = {
  question: QuizQuestion;
  value: string;
  onChange: (v: string) => void;
};

export function IdentificationQuestion({ question, value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium leading-relaxed">
        <MarkdownRenderer content={question.question} />
      </div>

      <Input
        value={value}
        placeholder="Type your answer here..."
        onChange={(e) => onChange(e.target.value)}
        className="h-11 text-base"
      />
    </div>
  );
}
