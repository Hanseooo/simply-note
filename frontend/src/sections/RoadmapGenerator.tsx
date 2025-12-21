import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { RoadmapDiagramType } from "@/types/apiResponse";
import { useGenerateRoadmap } from "@/hooks/useGenerateRoadmap";
import LoadingScreen from "@/components/layout/Loading";
import { getGeneralAIQuota, useAIQuota } from "@/hooks/useAiQuota";
import { AIQuotaProgress } from "@/components/progress/AIQuotaProgress";

const MIN_CHARS = 3;
const MAX_CHARS = 42;

const placeholders = [
  "Learn React from scratch",
  "Data Structures and Algorithms roadmap",
  "Become a Full Stack Developer",
  "Introduction to Machine Learning",
  "Backend development with Node.js",

  "Electrical Engineering fundamentals",
  "Mechanical Engineering core concepts",
  "Civil Engineering structural design",
  "Embedded systems learning path",

  "Basics of Financial Accounting",
  "Investment banking preparation roadmap",
  "Entrepreneurship for beginners",
  "Marketing fundamentals",

  "Physics for engineering students",
  "Organic chemistry study plan",
  "Biology fundamentals roadmap",
  "Mathematics for data science",

  "UI/UX design learning roadmap",
  "Graphic design fundamentals",
  "Product design from ideation to launch",

  "Research paper writing roadmap",
];


export default function RoadmapGenerator() {
  const [title, setTitle] = useState("");
  const [diagramType, setDiagramType] = useState<RoadmapDiagramType>("flowchart");

  const {data: roadmapQuota} = useAIQuota()

  const generateRoadmapQuota = getGeneralAIQuota(roadmapQuota)

  const ROADMAP_COST = 1

  const canGenerate = !!generateRoadmapQuota && generateRoadmapQuota.remaining_credits >= ROADMAP_COST

  const { generateRoadmap,isGenerating } = useGenerateRoadmap()

  const charCount = title.length;
  const isTooShort = charCount < MIN_CHARS;
  const isTooLong = charCount > MAX_CHARS;
  const isInvalid = isTooShort || isTooLong;

    const topicPlaceholder = useMemo(() => {
      const index = Math.floor(Math.random() * placeholders.length);
      return placeholders[index];
    }, []);

  return (
    <section className="relative w-full max-w-3xl mx-auto mt-10 px-4 mb-16">
      {isGenerating && (
        <LoadingScreen
          overlay
          title="Generating your Roadmap"
          description="This may take a few seconds"
        />
      )}
      {generateRoadmapQuota && (
        <AIQuotaProgress
          label="Remaining Credits"
          max={generateRoadmapQuota.max_credits}
          remaining={generateRoadmapQuota.remaining_credits}
          disabled={!canGenerate}
          className="mb-6 mx-auto"
          secondsUntilReset={generateRoadmapQuota.seconds_until_reset}
        />
      )}
      <div className="rounded-xl border bg-linear-to-tr from-background/25 via-card/25 to-primary/5 p-6 shadow-sm space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Roadmap Generator
          </h2>
          <p className="text-sm text-muted-foreground">
            Generate a structured learning roadmap based on your topic.
          </p>
        </div>

        <Separator />

        {/* Title Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="roadmap-title">Roadmap topic</Label>
            <span
              className={`text-xs ${
                isTooLong ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              {charCount}/{MAX_CHARS}
            </span>
          </div>

          <Input
            id="roadmap-title"
            placeholder={`${topicPlaceholder}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <p className="text-xs text-muted-foreground">
            Must be between{" "}
            <span className="font-medium text-primary">{MIN_CHARS}</span> and{" "}
            <span className="font-medium text-primary">{MAX_CHARS}</span>{" "}
            characters.
          </p>
        </div>

        {/* Diagram Type */}
        <div className="space-y-2">
          <Label>Diagram type</Label>
          <Select
            value={diagramType}
            onValueChange={(value) =>
              setDiagramType(value as RoadmapDiagramType)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select diagram type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flowchart">Flowchart</SelectItem>
              {/* <SelectItem value="gantt">Gantt</SelectItem> */}
              <SelectItem value="timeline">Timeline</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action */}
        <div className="flex justify-end">
          <Button
            disabled={isInvalid || isGenerating || !canGenerate}
            className="min-w-40"
            onClick={() =>
              generateRoadmap({
                topic: title,
                diagram_type: diagramType,
              })
            }
          >
            {canGenerate ? "Generate Roadmap" : "Insufficient Credits"}
          </Button>
        </div>
      </div>
    </section>
  );
}
