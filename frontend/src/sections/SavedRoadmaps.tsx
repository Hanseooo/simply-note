import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Map, Search, X } from "lucide-react";
import { useFetchRoadmapByCode } from "@/hooks/useFetchRoadmapByCode";
import { useSavedRoadmaps } from "@/hooks/useSavedRoadmaps";

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
import ShareCodeButtonCard from "@/components/cards/ShareCodeButtonCard";
import SavedRoadmapCard from "@/components/cards/savedRoadmapCard";
import { useDebounce } from "@/hooks/useDebounce";

const PAGE_SIZE_MOBILE = 2;
const PAGE_SIZE_TABLET = 5;
const PAGE_SIZE_DESKTOP = 8;

type SortOption = "recent";

export default function SavedRoadmaps() {
  const { savedRoadmaps, isLoading } = useSavedRoadmaps();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DESKTOP);
  const [sort] = useState<SortOption>("recent");
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 300);


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


  const filteredRoadmaps = useMemo(() => {
    if (!debouncedSearch.trim()) return savedRoadmaps;

    const query = debouncedSearch.toLowerCase();
    return savedRoadmaps.filter(
      (roadmap) =>
        roadmap.title.toLowerCase().includes(query) ||
        roadmap.created_by.toLowerCase().includes(query)
    );
  }, [savedRoadmaps, debouncedSearch]);

  /* -------------------------------
     Sorting (PIN FIRST)
  -------------------------------- */
  const sortedRoadmaps = useMemo(() => {
    return [...filteredRoadmaps]
      .sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned))
      .sort((a, b) => {
        if (sort === "recent") {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        }
        return 0;
      });
  }, [filteredRoadmaps, sort]);

  /* -------------------------------
     Pagination
  -------------------------------- */
  const totalPages = Math.ceil(sortedRoadmaps.length / pageSize);

  const paginatedRoadmaps = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRoadmaps.slice(start, start + pageSize);
  }, [sortedRoadmaps, currentPage, pageSize]);

  /* Reset page on layout or search change */
  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, sort, debouncedSearch]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {/* Header */}
      <div className="mb-6 space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Saved Roadmaps
          </h2>
          <p className="text-sm text-muted-foreground">
            Your saved learning roadmaps, organized for easy access.
          </p>
        </div>

        {/* Search Bar */}
        {!isLoading && savedRoadmaps.length > 0 && (
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roadmaps by title, author, or difficulty..."
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

      {/* Empty State - No Roadmaps */}
      {!isLoading && savedRoadmaps.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center"
        >
          <Map className="mb-3 h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No saved roadmaps yet</h3>
          <p className="mt-1 mb-6 max-w-sm text-sm text-muted-foreground">
            Save a roadmap to keep track of your learning plans.
          </p>
          <ShareCodeButtonCard
            useFetchHook={useFetchRoadmapByCode}
            title="View Shared Roadmap"
            description="Enter a share code to view a roadmap"
            dialogTitle="View roadmap via share code"
            submitLabel="View Roadmap"
            icon={Map}
          />
        </motion.div>
      )}

      {/* Empty State - No Search Results */}
      {!isLoading &&
        savedRoadmaps.length > 0 &&
        sortedRoadmaps.length === 0 &&
        debouncedSearch && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center"
          >
            <Search className="mb-3 h-10 w-10 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No roadmaps found</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Try adjusting your search query or clear the search to see all
              roadmaps.
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
      {!isLoading && paginatedRoadmaps.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ShareCodeButtonCard
              useFetchHook={useFetchRoadmapByCode}
              title="View Shared Roadmap"
              description="Enter a share code to view a roadmap"
              dialogTitle="View roadmap via share code"
              submitLabel="View Roadmap"
              icon={Map}
            />

            <AnimatePresence mode="popLayout">
              {paginatedRoadmaps.map((item, index) => (
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
                  <SavedRoadmapCard item={item} />
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
              Found {sortedRoadmaps.length}{" "}
              {sortedRoadmaps.length === 1 ? "roadmap" : "roadmaps"}
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
