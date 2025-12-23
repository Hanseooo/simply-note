"use client";

import { motion } from "framer-motion";
import { FileText, ClipboardCheck, GitBranch, Share2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    icon: FileText,
    title: "Smart Note Summarization",
    description: (
      <>
        Convert long notes into concise, structured summaries.
        <br />
        Supports <span className="font-semibold">math formulas</span>,{" "}
        <span className="font-semibold">programming code blocks</span>, and{" "}
        <span className="font-semibold">tables</span>, making it suitable for
        technical and academic subjects.
      </>
    ),
  },
  {
    icon: ClipboardCheck,
    title: "Note-based Quizzes",
    description: (
      <>
        Test your understanding with quizzes generated directly from your
        summaries.
        Quiz results include{" "}
        <span className="font-semibold">
          topic-based performance breakdowns
        </span>{" "}
        and clear explanations based on the original notes.
      </>
    ),
  },
  {
    icon: GitBranch,
    title: "Visual Learning Roadmaps",
    description: (
      <>
        Turn complex topics into visual learning paths.
        <br />
        Roadmaps are presented with{" "}
        <span className="font-semibold">flowcharts</span> or{" "}
        <span className="font-semibold">timelines</span>, helping you see how
        concepts connect and where to focus next.
      </>
    ),
  },
  {
    icon: Share2,
    title: "Shareable Learning",
    description: (
      <>
        Share notes, quizzes, and roadmaps with others using a simple{" "}
        <span className="font-semibold">share code</span>.
        <br />
        No clutter. No unnecessary permissions.
      </>
    ),
  },
];

export default function FeatureHighlights() {
  return (
    <section className="relative py-24">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center px-4">
        <Badge variant="secondary" className="mb-4">
          Features
        </Badge>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground">
          Learn Smarter with <span className="text-primary">SimplyNote</span>
        </h2>
        <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
          Transform your notes into structured summaries, quizzes, and visual
          learning roadmaps. Share and study smarter, not just faster.
        </p>
        <Separator className="mx-auto my-8 w-24 bg-primary/40" />
      </div>

      {/* Feature Cards */}
      <motion.div
        className="mx-auto mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 px-4 max-w-7xl"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {features.map((feature, idx) => {
          const Icon = feature.icon;

          return (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Card className="h-full border border-border/30 bg-linear-to-tr from-background/75 to-primary/5 backdrop-blur-md hover:border-primary/50 transition-all">
                <CardContent className="p-6 space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
