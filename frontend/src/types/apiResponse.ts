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
  user: User
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

export interface Roadmap {
  title: string;
  description: string;
  markdown: string;
  diagram: {
    type: "flowchart" | "gantt" | "timeline";
    code: string;
  };
  milestones: [
    {
      title: string;
      description: string;
    },
  ];
}
