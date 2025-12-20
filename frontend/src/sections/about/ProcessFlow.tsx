"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Upload, Sparkles, BarChart3 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    id: 1,
    title: "Input",
    icon: Upload,
    description:
      "Upload or create your notes. SimplyNote supports structured text, math formulas, programming code, and tables.",
  },
  {
    id: 2,
    title: "Process",
    icon: Sparkles,
    description:
      "AI analyzes your notes to generate summaries, quizzes, and roadmaps. Everything is strictly derived from your content.",
  },
  {
    id: 3,
    title: "Output",
    icon: BarChart3,
    description:
      "Review quizzes, explore visual roadmaps, and analyze results with topic-level insights and explanations.",
  },
];

export default function ProcessFlow() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative py-32 bg-background overflow-hidden"
    >
      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0 bg-radial from-primary/10 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12">
        {/* Sticky indicator */}
        <div className="hidden lg:block">
          <div className="sticky top-32 space-y-6">
            <Badge variant="secondary">How It Works</Badge>

            <div className="relative pl-4">
              {/* Vertical line */}
              <motion.div
                style={{ scaleY: lineScale }}
                className="absolute left-1 top-0 h-full w-px bg-primary/40 origin-top"
              />

              {steps.map((step) => (
                <div
                  key={step.id}
                  className="relative flex items-center gap-3 py-3"
                >
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Step {step.id}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-10">
          {steps.map((step, i) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                  delay: i * 0.05,
                }}
              >
                <Card className="group border-primary/20 bg-linear-to-tr from-background to-primary/5 shadow-sm transition-all hover:shadow-lg hover:border-primary/40">
                  <CardContent className="p-8 space-y-4">
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.08, rotate: 2 }}
                        transition={{ type: "spring", stiffness: 260 }}
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary"
                      >
                        <Icon className="h-6 w-6" />
                      </motion.div>

                      <h3 className="text-2xl font-semibold tracking-tight">
                        Step {step.id} –{" "}
                        <span className="text-primary">{step.title}</span>
                      </h3>
                    </div>

                    <p className="text-base leading-relaxed text-muted-foreground max-w-xl">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {/* Credit note */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="pt-10 max-w-xl"
          >
            <p className="text-sm text-muted-foreground leading-relaxed">
              SimplyNote uses a{" "}
              <span className="font-semibold text-foreground">
                transparent credit system
              </span>{" "}
              to keep the platform fast and free. Your remaining credits and
              reset time are always visible before generating content.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
