import SavedSummaryCard from "@/components/cards/SavedSummaryCard";
import ShareCodeButtonCard from "@/components/cards/ShareCodeButtonCard";
import LoadingScreen from "@/components/layout/Loading";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePinnedCollection } from "@/hooks/usePinnedCollection";
import { useSummary } from "@/hooks/useSummary";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

type PinnedOptions = "Notes" | "Quizzes" | "Roadmaps";

export default function PinnedCollection() {
  const [selectedTab, setSelectedTab] = useState<PinnedOptions>("Notes");
  const {data, isLoading} = usePinnedCollection(selectedTab)
  const { pinSummary, unpinSummary, unsaveSummary } = useSummary()

  function handleToggleNotePin(id: string) {
    if (!data) return;
    const note = data.find((n) => n.id === id);
    if (!note) return;

    if (note.is_pinned) {
      unpinSummary(id);
    } else {
      pinSummary(id);
    }
  }

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
          <LoadingScreen
            overlay
            title="Retrieving pinned collection"
            description="Fetching your pinned items..."
          />
        )}

        {/* Content */}
        {!isLoading &&
          data &&
          pinnedData.length > 0 &&
          selectedTab == "Notes" && (
            <AnimatePresence>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Add-by-share card */}
                <ShareCodeButtonCard />

                {pinnedData.map((item) => (
                  <SavedSummaryCard
                    key={item.id}
                    item={item}
                    onTogglePin={handleToggleNotePin}
                    onDelete={unsaveSummary}
                  />
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
