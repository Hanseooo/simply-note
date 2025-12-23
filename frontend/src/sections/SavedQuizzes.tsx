"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useSavedQuizzes } from "@/hooks/useSavedQuizzes";
import SavedQuizCard from "@/components/cards/SavedQuizCard";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Search, X, BookOpen, SquarePen } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import ShareCodeButtonCard from "@/components/cards/ShareCodeButtonCard";
import { useFetchQuizByCode } from "@/hooks/useFetchQuizByCode";
import { useQuizStore } from "@/store/quizStore";

/* --------------------------------
   Pagination sizes
-------------------------------- */
const PAGE_SIZE_MOBILE = 2;
const PAGE_SIZE_TABLET = 5;
const PAGE_SIZE_DESKTOP = 8;

const difficultyRank = {
  easy: 1,
  medium: 2,
  hard: 3,
};

export default function SavedQuizzes() {
  const { quizzes, isLoading } = useSavedQuizzes();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DESKTOP);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 300);

  const resetQuiz = useQuizStore().resetQuiz

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
    resetQuiz()
    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, []);

  /* -------------------------------
     Filtering
  -------------------------------- */
  const filteredQuizzes = useMemo(() => {
    if (!debouncedSearch.trim()) return quizzes;

    const query = debouncedSearch.toLowerCase();
    return quizzes.filter(
      (quiz) =>
        quiz.title.toLowerCase().includes(query) ||
        quiz.created_by.toLowerCase().includes(query) ||
        quiz.difficulty.toLowerCase().includes(query)
    );
  }, [quizzes, debouncedSearch]);

  /* -------------------------------
     Sorting (PIN FIRST)
  -------------------------------- */
  const sortedQuizzes = useMemo(() => {
    return [...filteredQuizzes]
      .sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned))
      .sort(
        (a, b) => difficultyRank[b.difficulty] - difficultyRank[a.difficulty]
      );
  }, [filteredQuizzes]);

  /* -------------------------------
     Pagination
  -------------------------------- */
  const totalPages = Math.ceil(sortedQuizzes.length / pageSize);

  const paginatedQuizzes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedQuizzes.slice(start, start + pageSize);
  }, [sortedQuizzes, currentPage, pageSize]);

  /* Reset page on layout/search change */
  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, debouncedSearch]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {/* Header */}
      <div className="mb-6 space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Saved Quizzes
          </h2>
          <p className="text-sm text-muted-foreground">
            Your saved quizzes, organized and ready to take.
          </p>
        </div>

        {/* Search */}
        {!isLoading && quizzes.length > 0 && (
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search quizzes by title, author, or difficulty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-10"
            />

            <AnimatePresence>
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Separator className="mb-6" />

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: pageSize }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && quizzes.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center"
        >
          <BookOpen className="mb-3 h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No saved quizzes yet</h3>
          <p className="mt-1 max-w-sm mb-8 text-sm text-muted-foreground">
            Save a quiz to keep track of what you want to practice next.
          </p>
          <ShareCodeButtonCard
            submitLabel="Answer Quiz"
            title="Answer Quiz Via Share code"
            useFetchHook={useFetchQuizByCode}
            description="Enter a share code to automatically add them to saved Quiz"
            dialogTitle="Answer Quiz via Share code"
            icon={SquarePen}
          />
        </motion.div>
      )}

      {/* Empty Search */}
      {!isLoading &&
        quizzes.length > 0 &&
        sortedQuizzes.length === 0 &&
        debouncedSearch && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center"
          >
            <Search className="mb-3 h-10 w-10 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No quizzes found</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Try adjusting your search or clear it to see all quizzes.
            </p>
            <Button
              variant="outline"
              onClick={() => setSearchQuery("")}
              className="mt-4"
            >
              Clear Search
            </Button>
          </motion.div>
        )}

      {/* Grid */}
      {!isLoading && paginatedQuizzes.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ShareCodeButtonCard
              submitLabel="Answer Quiz"
              title="Answer Quiz Via Share code"
              useFetchHook={useFetchQuizByCode}
              description="Enter a share code to automatically add them to saved Quiz"
              dialogTitle="Answer Quiz via Share code"
              icon={SquarePen}
            />
            <AnimatePresence mode="popLayout">
              {paginatedQuizzes.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.05,
                  }}
                >
                  <SavedQuizCard item={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Result count */}
          {debouncedSearch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center text-sm text-muted-foreground"
            >
              Found {sortedQuizzes.length}{" "}
              {sortedQuizzes.length === 1 ? "quiz" : "quizzes"}
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 flex justify-center"
            >
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
            </motion.div>
          )}
        </>
      )}
    </main>
  );
}
