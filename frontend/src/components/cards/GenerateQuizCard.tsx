import { useState } from "react";
import { motion } from "framer-motion";
import { User, Wand2, AlertCircle } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Toggle } from "@/components/ui/toggle";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { useGenerateQuiz } from "@/hooks/useGenerateQuiz";
import { toast } from "sonner";

export type SavedSummaryMinimal = {
  id: string;
  title: string;
  created_by: string;
};

export type QuizQuestionTypeOption =
  | "multiple_choice"
  | "true_false"
  | "identification"
  | "fill_blank";

export type QuizOptions = {
  question_types: QuizQuestionTypeOption[];
  difficulty: "easy" | "medium" | "hard";
  short_quiz: boolean;
};

type Props = {
  summary: SavedSummaryMinimal;
  canGenerate: boolean;
};

const QUESTION_TYPES: {
  label: string;
  value: QuizQuestionTypeOption;
}[] = [
  { label: "Multiple Choice", value: "multiple_choice" },
  { label: "True / False", value: "true_false" },
  { label: "Identification", value: "identification" },
  { label: "Fill in the Blank", value: "fill_blank" },
];

export function GenerateQuizCard({ summary, canGenerate }: Props) {
  const { mutate, isPending } = useGenerateQuiz();
  const [isOpen, setIsOpen] = useState(false);

  const [options, setOptions] = useState<QuizOptions>({
    question_types: ["multiple_choice"],
    difficulty: "medium",
    short_quiz: false,
  });


  const [error, setError] = useState<string | null>(null);

  const isValid =
    options.question_types.length > 0 &&
    options.difficulty !== null &&
    typeof options.short_quiz === "boolean";

  const handleToggleType = (type: QuizQuestionTypeOption) => {
    setOptions((prev) => {
      const exists = prev.question_types.includes(type);

      const nextTypes = exists
        ? prev.question_types.filter((t) => t !== type)
        : [...prev.question_types, type];

      return { ...prev, question_types: nextTypes };
    });
  };

  const handleGenerate = () => {
    if (!isValid) {
      const errorMsg = "Please select at least one question type.";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setError(null);

    mutate({
      summary_id: summary.id,
      options,
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="h-full"
    >
      <Card className="h-full bg-card/40 border-primary/20 hover:border-primary transition-colors hover:text-primary">
        <CardContent className="pt-6 space-y-3">
          <h3 className="text-lg font-semibold leading-tight line-clamp-2">
            {summary.title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Created by {summary.created_by}</span>
          </div>
        </CardContent>

        <CardFooter>
          <Dialog
            open={isOpen}
            onOpenChange={(open) => !isPending && setIsOpen(open)}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full gap-2 hover:border-primary/50"
                disabled={isPending}
              >
                <Wand2 className="h-4 w-4 text-primary" />
                {isPending ? "Generating Quiz..." : "Create Quiz"}
              </Button>
            </DialogTrigger>

            <DialogContent
              className="sm:max-w-lg bg-linear-to-tr from-background via-background to-primary/5"
              onPointerDownOutside={(e) => isPending && e.preventDefault()}
              onEscapeKeyDown={(e) => isPending && e.preventDefault()}
              onInteractOutside={(e) => isPending && e.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle className="text-primary mb-1 text-xl">
                  {summary.title}
                </DialogTitle>
              </DialogHeader>

              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className="space-y-6"
              >
                {/* Question Types */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Question Types</p>
                    <Badge variant="secondary">
                      {options.question_types.length} selected
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {QUESTION_TYPES.map((type) => (
                      <Toggle
                        key={type.value}
                        pressed={options.question_types.includes(type.value)}
                        onPressedChange={() => handleToggleType(type.value)}
                        disabled={isPending}
                        className="data-[state=on]:border-primary data-[state=on]:bg-secondary data-[state=on]:text-primary"
                      >
                        {type.label}
                      </Toggle>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Difficulty */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Difficulty</p>
                  <Select
                    value={options.difficulty}
                    onValueChange={(value) =>
                      setOptions((prev) => ({
                        ...prev,
                        difficulty: value as QuizOptions["difficulty"],
                      }))
                    }
                    disabled={isPending}
                  >
                    <SelectTrigger className="focus:ring-primary">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Short Quiz */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Short Quiz</p>
                    <p className="text-xs text-muted-foreground">
                      Faster quiz with fewer questions
                    </p>
                  </div>
                  <Switch
                    checked={options.short_quiz}
                    onCheckedChange={(checked) =>
                      setOptions((prev) => ({
                        ...prev,
                        short_quiz: checked,
                      }))
                    }
                    disabled={isPending}
                  />
                </div>

                {/* Validation Error */}
                {error && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                {/* Loading State */}
                {isPending && (
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Wand2 className="h-4 w-4" />
                    </motion.div>
                    <span>Generating your quiz, please wait...</span>
                  </div>
                )}
              </motion.div>

              <DialogFooter>
                <Button
                  onClick={handleGenerate}
                  disabled={!isValid || isPending || !canGenerate}
                  className="w-full"
                >
                  {isPending
                    ? "Generating Quiz..."
                    : canGenerate
                      ? "Generate Quiz"
                      : "Insufficient Credits"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
