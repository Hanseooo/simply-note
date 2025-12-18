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

