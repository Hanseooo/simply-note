import { useEffect, useMemo, useState } from "react";
import { useSavedSummaries } from "@/hooks/useSavedSummaries";
import { useSummary } from "@/hooks/useSummary";
import SavedSummaryCard from "@/components/cards/SavedSummaryCard";
import { useFetchSummaryByCode } from "@/hooks/useFetchSummaryByCode";
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
import { BookOpen, Notebook, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ShareCodeButtonCard from "@/components/cards/ShareCodeButtonCard";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";

const PAGE_SIZE_MOBILE = 2;
const PAGE_SIZE_TABLET = 5;
const PAGE_SIZE_DESKTOP = 8;

type SortOption = "recent" | "difficulty";

const difficultyRank = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

export default function SavedNotesSection() {
  const { savedSummaries, isLoading } = useSavedSummaries();
  const { unsaveSummary } = useSummary();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DESKTOP);
  const [sort] = useState<SortOption>("recent");
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 300);

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
     Filtering by search
  -------------------------------- */
  const filteredNotes = useMemo(() => {
    if (!debouncedSearch.trim()) return savedSummaries;

    const query = debouncedSearch.toLowerCase();
    return savedSummaries.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.created_by.username.toLowerCase().includes(query) ||
        note.difficulty.toLowerCase().includes(query)
    );
  }, [savedSummaries, debouncedSearch]);

  /* -------------------------------
     Sorting logic (PIN FIRST)
  -------------------------------- */
  const sortedNotes = useMemo(() => {
    return [...filteredNotes]
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
  }, [filteredNotes, sort]);

  /* -------------------------------
     Pagination
  -------------------------------- */
  const totalPages = Math.ceil(sortedNotes.length / pageSize);

  const paginatedNotes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedNotes.slice(start, start + pageSize);
  }, [sortedNotes, currentPage, pageSize]);

  /* Reset page when layout or search changes */
  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, sort, debouncedSearch]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {/* Header */}
      <div className="mb-6 space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Saved Notes
          </h2>
          <p className="text-sm text-muted-foreground">
            Your summarized notes, organized and ready to review.
          </p>
        </div>

        {/* Search Bar */}
        {!isLoading && savedSummaries.length > 0 && (
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes by title, author, or difficulty..."
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

      {/* Empty State - No Notes */}
      {!isLoading && savedSummaries.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center"
        >
          <BookOpen className="mb-3 h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No saved notes yet</h3>
          <p className="mt-1 mb-6 max-w-sm text-sm text-muted-foreground">
            Summarize a note and save it to build your study library.
          </p>
          <ShareCodeButtonCard
            useFetchHook={useFetchSummaryByCode}
            title="View Shared Note"
            description="Enter a share code to view a note"
            dialogTitle="View note via share code"
            submitLabel="View Note"
            icon={Notebook}
          />
        </motion.div>
      )}

      {/* Empty State - No Search Results */}
      {!isLoading &&
        savedSummaries.length > 0 &&
        sortedNotes.length === 0 &&
        debouncedSearch && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center"
          >
            <Search className="mb-3 h-10 w-10 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No notes found</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Try adjusting your search query or clear the search to see all
              notes.
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

      {/* Notes grid */}
      {!isLoading && paginatedNotes.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ShareCodeButtonCard
              useFetchHook={useFetchSummaryByCode}
              title="View Shared Note"
              description="Enter a share code to view a note"
              dialogTitle="View note via share code"
              submitLabel="View Note"
              icon={Notebook}
            />

            <AnimatePresence mode="popLayout">
              {paginatedNotes.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.05,
                  }}
                  layout
                >
                  <SavedSummaryCard item={item} onDelete={unsaveSummary} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Results Counter */}
          {debouncedSearch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center text-sm text-muted-foreground"
            >
              Found {sortedNotes.length}{" "}
              {sortedNotes.length === 1 ? "note" : "notes"}
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
