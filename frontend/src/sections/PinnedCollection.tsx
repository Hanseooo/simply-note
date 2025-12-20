import SavedQuizCard from "@/components/cards/SavedQuizCard";
import SavedRoadmapCard from "@/components/cards/savedRoadmapCard";
import SavedSummaryCard from "@/components/cards/SavedSummaryCard";
import ShareCodeButtonCard from "@/components/cards/ShareCodeButtonCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFetchQuizByCode } from "@/hooks/useFetchQuizByCode";
import { useFetchRoadmapByCode } from "@/hooks/useFetchRoadmapByCode";
import { useFetchSummaryByCode } from "@/hooks/useFetchSummaryByCode";
import { usePinnedCollection } from "@/hooks/usePinnedCollection";
// import { useSummary } from "@/hooks/useSummary";
import { AnimatePresence } from "framer-motion";
import { Map, Notebook, SquarePen } from "lucide-react";
import { useState } from "react";

type PinnedOptions = "Notes" | "Quizzes" | "Roadmaps";

export default function PinnedCollection() {
  const [selectedTab, setSelectedTab] = useState<PinnedOptions>("Notes");
  const {data, isLoading} = usePinnedCollection(selectedTab)
//   const { unsaveSummary } = useSummary()

  const pinnedData = data?.filter((item) => item.is_pinned) ?? [];


  return (
    <section className="w-full min-h-screen bg-radial from-primary/5">
      <div className="mx-auto flex flex-col md:flex-row md:justify-between items-center max-w-7xl px-4  py-6 space-y-4">
        {/* Heading */}
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
          Pinned <span className="text-primary">{selectedTab}</span>
        </h2>

        {/* Tabs */}
        <Tabs
          value={selectedTab}
          onValueChange={(value) => setSelectedTab(value as PinnedOptions)}
        >
          <TabsList>
            <TabsTrigger value="Notes">Notes</TabsTrigger>
            <TabsTrigger value="Quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="Roadmaps">Roadmaps</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-8">
        {/* Loading overlay */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-56 w-full rounded-lg" />
            ))}
          </div>
        )}

        {/* Content */}
        {!isLoading &&
          data &&
          pinnedData.length > 0 &&
          selectedTab == "Notes" && (
            <AnimatePresence>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Add-by-share card */}
                <ShareCodeButtonCard
                  useFetchHook={useFetchSummaryByCode}
                  title="View Shared Note"
                  description="Enter a share code to view a note"
                  dialogTitle="View note via share code"
                  submitLabel="View Note"
                  icon={Notebook}
                />

                {pinnedData.map((item) => (
                  <SavedSummaryCard
                    key={item.id}
                    item={item}
                    // onDelete={}
                  />
                ))}
              </div>
            </AnimatePresence>
          )}
        {!isLoading &&
          data &&
          pinnedData.length > 0 &&
          selectedTab == "Roadmaps" && (
            <AnimatePresence>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Add-by-share card */}
                <ShareCodeButtonCard
                  useFetchHook={useFetchRoadmapByCode}
                  title="View Shared Roadmap"
                  description="Enter a share code to view a roadmap"
                  dialogTitle="View roadmap via share code"
                  submitLabel="View Roadmap"
                  icon={Map}
                />

                {pinnedData.map((item) => (
                  <SavedRoadmapCard key={item.id} item={item} />
                ))}
              </div>
            </AnimatePresence>
          )}
        {!isLoading &&
          data &&
          pinnedData.length > 0 &&
          selectedTab == "Quizzes" && (
            <AnimatePresence>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Add-by-share card */}
                <ShareCodeButtonCard
                  submitLabel="Answer Quiz"
                  title="Answer Quiz Via Share code"
                  useFetchHook={useFetchQuizByCode}
                  description="Enter a share code to automatically add them to saved Quiz"
                  dialogTitle="Answer Quiz via Share code"
                  icon={SquarePen}
                />

                {pinnedData.map((item) => (
                  <SavedQuizCard key={item.id} item={item} />
                ))}
              </div>
            </AnimatePresence>
          )}

        {/* Empty state */}
        {!isLoading && (!data || pinnedData.length === 0) && (
          <div className="flex min-h-[32vh] flex-col items-center justify-center rounded-lg border border-dashed text-center">
            <p className="text-sm text-muted-foreground">
              No pinned items found.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
