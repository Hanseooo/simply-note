import type { FeedbackType } from "./apiPayloads";

export type RegisterResponse = {
  key: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  is_email_verified: boolean;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export type VerifyEmailResponse = {
  access: string;
  refresh: string;
  user: User;
};

export interface SummarizedNote {
  id: string;
  share_code: string | null;

  title: string;
  description: string;
  markdown: string;
  key_points: string[];
  topics: string[];

  difficulty: "beginner" | "intermediate" | "advanced";
  word_count: number;

  created_by: {
    username: string;
  } | null;

  is_saved?: boolean | null;
  is_pinned?: boolean | null;
}

export interface SavedSummaryListItem {
  id: string;
  share_code: string;

  title: string;
  topics: string[];
  difficulty: "beginner" | "intermediate" | "advanced";

  created_at: string;

  created_by: {
    username: string;
  };

  is_pinned: boolean;
}

export type RoadmapDiagramType = "flowchart" | "gantt" | "timeline";

export interface RoadmapDiagram {
  type: RoadmapDiagramType;
  code: string;
}

export interface RoadmapMilestone {
  title: string;
  description: string;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  markdown: string;

  diagram_type: RoadmapDiagramType;
  diagram_code: string;

  milestones: RoadmapMilestone[];

  created_by: string;
  created_at: string;

  share_code: string;

  is_saved: boolean;
  is_pinned: boolean;
}

export interface SavedRoadmapListItem {
  id: string;
  title: string;
  diagram_type: RoadmapDiagramType;
  created_by: string;
  created_at: string;
  share_code: string;
  is_pinned: boolean;
}

export type SavedQuizListItem = {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  created_by: string;
  is_pinned: boolean;
  linked_at: string;
  share_code: string;
  topics: QuizTopic[];
};

export type SavedSummaryMinimal = {
  id: string;
  title: string;
  created_by: string;
};

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
  type: QuizQuestionType;
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

export type QuizApiResponse = {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  topics: {
    id: string;
    label: string;
  }[];
  questions: QuizQuestion[];
};

export type QuizContentResponse = {
  id: string;
  title: string;
  difficulty: QuizDifficulty;
  content: {
    title: string;
    difficulty: QuizDifficulty;
    topics: QuizTopic[];
    questions: QuizQuestion[];
  };
  topics: QuizTopic[];
  created_at: string;
};

export type AIQuotaBucketType = "general" | "quiz";

export type AIQuotaStatusItem = {
  bucket: AIQuotaBucketType;

  used_credits: number;
  max_credits: number;
  remaining_credits: number;

  window_ends_at: string;
  seconds_until_reset: number;
};

export type AIQuotaStatusResponse = AIQuotaStatusItem[];

export interface Feedback {
  id: number;
  feedback_type: FeedbackType;
  rating: number | null;
  message: string | null;
  context: string | null;
  username: string; 
  created_at: string;
}


export interface PaginatedFeedbackResponse {
  count: number;
  results: Feedback[];
}

export interface MyRatingResponse {
  rating: number | null;
  updated_at?: string;
}
