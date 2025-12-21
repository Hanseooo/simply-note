"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export default function AboutIntro() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 20%"],
  });

  // Scroll-synced animations
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3], [24, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.98, 1]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-background  py-24">
      {/* Subtle background accent */}
      <div className="pointer-events-none absolute inset-0 bg-radial from-primary/10 via-transparent to-transparent" />

      <motion.div
        style={{ opacity, y, scale }}
        className="relative mx-auto max-w-4xl px-4 text-center"
      >
        <Badge
          variant="secondary"
          className="mb-6 inline-flex items-center gap-2"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          What is SimplyNote
        </Badge>

        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Learn from <span className="text-primary">your own content</span>
        </h2>

        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          SimplyNote is an{" "}
          <span className="font-semibold text-foreground">
            AI-powered learning productivity web application
          </span>{" "}
          designed to help students and self-learners study more effectively.
          Instead of generating random content, SimplyNote works directly with{" "}
          <span className="font-semibold">your own notes</span>, transforming
          them into clear summaries, structured roadmaps, and meaningful quizzes
          that reinforce understanding.
        </p>

        <p className="mt-6 text-base leading-relaxed text-muted-foreground">
          Every quiz, roadmap, and explanation is{" "}
          <span className="font-semibold">
            grounded in the source material you provide
          </span>
          . This ensures accuracy, relevance, and a learning experience that
          focuses on understanding rather than memorization.
        </p>
      </motion.div>
    </section>
  );
}
