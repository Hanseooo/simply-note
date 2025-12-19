import TitleHeader from "@/components/headers/TitleHeader";
import RoadmapGenerator from "@/sections/RoadmapGenerator";
import SavedRoadmaps from "@/sections/SavedRoadmaps";


export default function RoadmapPage() {

    return (
      <main className="bg-linear-to-b from-primary/5 to-background ">
        <TitleHeader
          titleWord1="Topic"
          titleWord2="Roadmap"
          desc="Feeling lost? Generate a roadmap for a better learning experience!"
        />
        <RoadmapGenerator />
        <TitleHeader
          titleWord1="Your"
          titleWord2="Saved Roadmaps"
          desc="a list of saved Roadmaps you saved"
        />
        <SavedRoadmaps />
      </main>
    );
}