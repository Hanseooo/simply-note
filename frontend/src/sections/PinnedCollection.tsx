import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function PinnedCollection() {
  const [selectedTab, setSelectedTab] = useState("Notes");

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
          onValueChange={setSelectedTab}
          className=""
        >
          <TabsList>
            <TabsTrigger value="Notes">Notes</TabsTrigger>
            <TabsTrigger value="Quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="Roadmaps">Roadmaps</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </section>
  );
}
