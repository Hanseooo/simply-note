import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Map } from "lucide-react";
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
import ShareCodeButtonCard from "@/components/cards/ShareCodeButtonCard";
import SavedRoadmapCard from "@/components/cards/savedRoadmapCard";

const PAGE_SIZE_MOBILE = 2;
const PAGE_SIZE_TABLET = 5;
const PAGE_SIZE_DESKTOP = 8;

type SortOption = "recent";

export default function SavedRoadmaps() {
  const { savedRoadmaps, isLoading } = useSavedRoadmaps();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DESKTOP);
  const [sort] = useState<SortOption>("recent");

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
     Sorting (PIN FIRST)
  -------------------------------- */
  const sortedRoadmaps = useMemo(() => {
    return [...savedRoadmaps]
      .sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned))
      .sort((a, b) => {
        if (sort === "recent") {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        }
        return 0;
      });
  }, [savedRoadmaps, sort]);

  /* -------------------------------
     Pagination
  -------------------------------- */
  const totalPages = Math.ceil(sortedRoadmaps.length / pageSize);

  const paginatedRoadmaps = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRoadmaps.slice(start, start + pageSize);
  }, [sortedRoadmaps, currentPage, pageSize]);

  /* Reset page on layout change */
  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, sort]);


  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Saved Roadmaps
        </h2>
        <p className="text-sm text-muted-foreground">
          Your saved learning roadmaps, organized for easy access.
        </p>
      </div>

      <Separator className="mb-6" />

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: pageSize }).map((_, i) => (
            <Skeleton key={i} className="h-60 w-full rounded-lg" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && sortedRoadmaps.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center">
          <Map className="mb-3 h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No saved roadmaps yet</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Save a roadmap to keep track of your learning plans.
          </p>
        </div>
      )}

      {/* Grid */}
      {!isLoading && paginatedRoadmaps.length > 0 && (
        <>
          <AnimatePresence>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <ShareCodeButtonCard
                useFetchHook={useFetchRoadmapByCode}
                title="View Shared Roadmap"
                description="Enter a share code to view a roadmap"
                dialogTitle="View roadmap via share code"
                submitLabel="View Roadmap"
                icon={Map}
              />

              {paginatedRoadmaps.map((item) => (
                <SavedRoadmapCard key={item.id} item={item} />
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
