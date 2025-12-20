// services/quizApi.ts
import { api } from "@/lib/api";
import type { QuizContentResponse, SavedQuizListItem } from "@/types/apiResponse";

/* ---------- generation ---------- */

export const generateQuizApi = async (payload: {
  summary_id: string;
  options: Record<string, unknown>;
}) => {
  const { data } = await api.post<{
    quiz_id: string;
    share_code: string;
  }>("/api/quizzes/generate/", payload);

  return data;
};

/* ---------- saved quizzes ---------- */

export const getMySavedQuizzesApi = async (opts?: { pinnedOnly?: boolean }) => {
  const params = opts?.pinnedOnly ? { pinned: "true" } : undefined;

  const { data } = await api.get<SavedQuizListItem[]>("/api/quizzes/saved/", {
    params,
  });

  return data;
};

/* ---------- quiz content ---------- */

export const getQuizByIdApi = async (quizId: string) => {
  const { data } = await api.get<QuizContentResponse>(
    `/api/quizzes/${quizId}/`
  );
  return data;
};

export const getQuizByCodeApi = async (code: string) => {
  const { data } = await api.get<{ id: string }>(`/api/quizzes/share/${code}/`);
  return data;
};

/* ---------- actions ---------- */

export const pinQuizApi = async (quizId: string) =>
  api.post(`/api/quizzes/${quizId}/pin/`);

export const unpinQuizApi = async (quizId: string) =>
  api.post(`/api/quizzes/${quizId}/unpin/`);

export const unsaveQuizApi = async (quizId: string) =>
  api.delete(`/api/quizzes/${quizId}/unsave/`);

