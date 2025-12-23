export type LoginPayload = {
  username: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password1: string;
  password2: string;
};

export type VerifyEmailPayload = {
  key: string;
  code: string;
};

export type FeedbackType = "rating" | "bug" | "suggestion";

export interface FeedbackPayload {
  feedback_type: FeedbackType;
  rating?: number;
  message?: string;
  context?: string;
  is_anonymous: boolean;
}