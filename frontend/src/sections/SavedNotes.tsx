import { useEffect, useMemo, useState } from "react";
import { useSavedSummaries } from "@/hooks/useSavedSummaries";
import { useSummary } from "@/hooks/useSummary";
import SavedSummaryCard from "@/components/cards/SavedSummaryCard";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { BookOpen } from "lucide-react";
import { AnimatePresence } from "framer-motion";

const PAGE_SIZE_MOBILE = 3;
const PAGE_SIZE_TABLET = 6;
const PAGE_SIZE_DESKTOP = 9;

type SortOption = "recent" | "difficulty";

const difficultyRank = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

export default function SavedNotesSection() {
  const { savedSummaries, isLoading } = useSavedSummaries();
  const { pinSummary, unpinSummary } = useSummary();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DESKTOP);
  const [sort, ] = useState<SortOption>("recent");

  /* -------------------------------
     Responsive page size
  -------------------------------- */
  useEffect(() => {
    function updatePageSize() {
      const width = window.innerWidth;
      if (width < 640) setPageSize(PAGE_SIZE_MOBILE);
      else if (width < 1024) setPageSize(PAGE_SIZE_TABLET);
      else setPageSize(PAGE_SIZE_DESKTOP);
    }

    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, []);

  /* -------------------------------
     Sorting logic (PIN FIRST)
  -------------------------------- */
  const sortedNotes = useMemo(() => {
    return [...savedSummaries]
      .sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned))
      .sort((a, b) => {
        if (sort === "recent") {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        }

        if (sort === "difficulty") {
          return difficultyRank[b.difficulty] - difficultyRank[a.difficulty];
        }

        return 0;
      });
  }, [savedSummaries, sort]);

  /* -------------------------------
     Pagination
  -------------------------------- */
  const totalPages = Math.ceil(sortedNotes.length / pageSize);

  const paginatedNotes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedNotes.slice(start, start + pageSize);
  }, [sortedNotes, currentPage, pageSize]);

  /* Reset page when layout changes */
  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, sort]);

  /* -------------------------------
     Pin toggle handler
  -------------------------------- */
  function handleTogglePin(id: string) {
    const note = savedSummaries.find((n) => n.id === id);
    if (!note) return;

    if (note.is_pinned) {
      unpinSummary(id);
    } else {
      pinSummary(id);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Saved Notes
        </h2>
        <p className="text-sm text-muted-foreground">
          Your summarized notes, organized and ready to review.
        </p>
      </div>

      <Separator className="mb-6" />

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: pageSize }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full rounded-lg" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && sortedNotes.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center">
          <BookOpen className="mb-3 h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No saved notes yet</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Summarize a note and save it to build your study library.
          </p>
        </div>
      )}

      {/* Notes grid */}
      {!isLoading && paginatedNotes.length > 0 && (
        <>
          <AnimatePresence>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedNotes.map((item) => (
                <SavedSummaryCard
                  key={item.id}
                  item={item}
                  onTogglePin={handleTogglePin}
                />
              ))}
            </div>
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </main>
  );
}
