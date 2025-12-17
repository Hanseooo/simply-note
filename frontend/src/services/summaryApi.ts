import { api } from "@/lib/api";
import type { SavedSummaryListItem, SummarizedNote } from "@/types/apiResponse";

export const saveNewSummaryApi = (note: SummarizedNote) => {
  return api.post("/api/summaries/save/", {
    title: note.title,
    description: note.description,
    markdown: note.markdown,
    difficulty: note.difficulty,
    word_count: note.word_count,
    key_points: note.key_points,
    topics: note.topics,
  });
};


export const saveExistingSummaryApi = async (summaryId: string) => {
  const { data } = await api.post(`/api/summaries/save/${summaryId}/save/`);
  return data;
};


export const unsaveSummaryApi = async (summaryId: string) => {
  const { data } = await api.delete(
    `/api/summaries/modify/${summaryId}/unsave/`
  );
  return data;
};

export const pinSummaryApi = async (summaryId: string) => {
  const { data } = await api.post(`/api/summaries/modify/${summaryId}/pin/`);
  return data;
};

export const unpinSummaryApi = async (summaryId: string) => {
  const { data } = await api.post(`/api/summaries/modify/${summaryId}/unpin/`);
  return data;
};



export const getSummaryByCodeApi = async (code: string) => {
  const { data } = await api.get(`/api/summaries/search/by-code/${code}/`);
  return data;
};

export const getMySavedSummariesApi = async (opts?: {
  pinnedOnly?: boolean;
}) => {
  const params = opts?.pinnedOnly ? { pinned: "true" } : undefined;

  const { data } = await api.get<SavedSummaryListItem[]>(
    "/api/summaries/me/saved/",
    { params }
  );

  return data;
};


