"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useSavedSummariesMinimal } from "@/hooks/useSavedSummaries";
import { GenerateQuizCard } from "@/components/cards/GenerateQuizCard";
import type { SavedSummaryMinimal } from "@/types/apiResponse";


  function useResponsivePageSize() {
    const [pageSize, setPageSize] = useState(6);

    useEffect(() => {
      const update = () => {
        setPageSize(window.innerWidth < 640 ? 3 : 6);
      };

      update();
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }, []);

    

    return pageSize;
  }


/* ---------- constants ---------- */

const SEARCH_DEBOUNCE_MS = 300;

/* ---------- debounce hook (local & simple) ---------- */
import { useEffect } from "react";
import { getQuizAIQuota, useAIQuota } from "@/hooks/useAiQuota";
import { AIQuotaProgress } from "@/components/progress/AIQuotaProgress";

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}


/* ---------- component ---------- */

export default function GenerateQuiz() {
  const { summaries, isLoading } = useSavedSummariesMinimal();
  const PAGE_SIZE = useResponsivePageSize();

  const {data: quotaData} = useAIQuota()
  const quizQuota = getQuizAIQuota(quotaData)

  const QUIZ_COST = 2

  const canGenerateQuiz = !!quizQuota && quizQuota.remaining_credits >= QUIZ_COST

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(
    search.toLowerCase(),
    SEARCH_DEBOUNCE_MS
  );

  useEffect(() => {
    setPage(1);
  }, [PAGE_SIZE]);


  /* ---------- filtering ---------- */
const filtered = useMemo(() => {
  if (!debouncedSearch) return summaries;

  return summaries.filter((s) => {
    const term = debouncedSearch.toLowerCase();

    return (
      s.title.toLowerCase().includes(term) ||
      s.created_by.toLowerCase().includes(term)
    );
  });
}, [summaries, debouncedSearch]);


  /* ---------- pagination ---------- */

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  /* ---------- handlers ---------- */
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  /* ---------- animations ---------- */
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 min-h-[64vh] px-4 mt-4 mb-8 sm:px-8 mx-auto max-w-7xl"
    >
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-primary">Generate a Quiz</h2>
        <p className="text-sm text-muted-foreground">
          Select a summary and generate a quiz to test your retention
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search summaries..."
            className="pl-9"
          />
        </div>

        {/* Quota */}
        {quizQuota && (
          <div className="mb-6">
            <AIQuotaProgress
              label="Remaining Quiz Credits"
              remaining={quizQuota.remaining_credits/2}
              max={quizQuota.max_credits/2}
              secondsUntilReset={quizQuota.seconds_until_reset}
              disabled={!canGenerateQuiz}
            />
          </div>
        )}
      </div>

      <Separator />

      {/* Grid */}
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading summaries…</div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {paginated.map((summary: SavedSummaryMinimal) => (
              <motion.div
                key={summary.id}
                variants={itemVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                layout
              >
                <GenerateQuizCard
                  canGenerate={canGenerateQuiz}
                  summary={summary}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Empty State */}
      {!isLoading && filtered.length === 0 && (
        <div className="min-h-[24vh] flex items-center justify-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground max-w-full text-center"
          >
            No summaries found.
          </motion.p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </motion.section>
  );
}
