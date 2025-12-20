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
