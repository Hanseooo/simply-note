import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Bug, Lightbulb, User, UserX } from "lucide-react";

import { useFeedback } from "@/hooks/useFeedback";
import type { FeedbackType } from "@/types/apiPayloads";

const PAGE_SIZE = 20;

export default function AdminFeedbackPage() {
  const [page, setPage] = useState(1);
  const [feedbackType, setFeedbackType] = useState<FeedbackType | "all">("all");
  const [rating, setRating] = useState<string>("all");

  const { feedbackQuery } = useFeedback({
    page,
    pageSize: PAGE_SIZE,
    filters: {
      feedback_type: feedbackType === "all" ? undefined : feedbackType,
      rating: rating === "all" ? undefined : Number(rating),
    },
  });

  const data = feedbackQuery.data;
  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 1;

const loadedRatings =
  data?.results.filter(
    (f) => f.feedback_type === "rating" && typeof f.rating === "number"
  ) ?? [];

const loadedBugs = data?.results.filter((f) => f.feedback_type === "bug") ?? [];

const loadedSuggestions =
  data?.results.filter((f) => f.feedback_type === "suggestion") ?? [];

const averageRating =
  loadedRatings.length > 0
    ? (
        loadedRatings.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
        loadedRatings.length
      ).toFixed(1)
    : null;


  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* ---------- HEADER ---------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-primary">User Feedback</h1>
        <div className="flex flex-wrap gap-2 text-sm">
          <Badge variant="outline">
            <Star className="text-primary" /> Ratings: {loadedRatings.length}
          </Badge>
          <Badge variant="outline">
            {" "}
            <Bug className="text-primary" /> Bugs: {loadedBugs.length}
          </Badge>
          <Badge variant="outline">
            <Lightbulb className="text-primary" /> Suggestions:{" "}
            {loadedSuggestions.length}
          </Badge>

          {averageRating && (
            <Badge variant="secondary">
              <Star className="text-primary" /> Avg: {averageRating}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Select
            value={feedbackType}
            onValueChange={(v) => {
              setPage(1);
              setFeedbackType(v as any);

              if (v !== "rating") {
                setRating("all");
              }
            }}
          >
            <SelectTrigger className="w-37.5">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="bug">Bug</SelectItem>
              <SelectItem value="suggestion">Suggestion</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={rating}
            onValueChange={(v) => {
              setPage(1);
              setRating(v);
            }}
          >
            <SelectTrigger
              className="w-37.5"
              disabled={feedbackType !== "rating"}
            >
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              {[1, 2, 3, 4, 5].map((r) => (
                <SelectItem key={r} value={String(r)}>
                  {r} Stars
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ---------- LIST ---------- */}
      {feedbackQuery.isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      )}

      {!feedbackQuery.isLoading && data?.results.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No feedback found.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {data?.results.map((f) => (
          <Card key={f.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                {f.feedback_type === "rating" && (
                  <Star className="h-5 w-5 text-yellow-500" />
                )}
                {f.feedback_type === "bug" && (
                  <Bug className="h-5 w-5 text-red-500" />
                )}
                {f.feedback_type === "suggestion" && (
                  <Lightbulb className="h-5 w-5 text-blue-500" />
                )}

                <CardTitle className="capitalize text-base">
                  {f.feedback_type}
                </CardTitle>

                <Badge variant="secondary">
                  {f.feedback_type === "rating" ? `${f.rating} ★` : "Text"}
                </Badge>
              </div>

              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                {f.username === "Anonymous" ? (
                  <UserX className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
                {f.username}
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              {f.message && (
                <p className="text-sm whitespace-pre-wrap">{f.message}</p>
              )}

              <div className="text-xs text-muted-foreground">
                {new Date(f.created_at).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ---------- PAGINATION ---------- */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-disabled={page === 1}
              />
            </PaginationItem>

            <PaginationItem>
              <span className="text-sm text-muted-foreground px-2">
                Page {page} of {totalPages}
              </span>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-disabled={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
