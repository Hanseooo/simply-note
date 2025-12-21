"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Upload, Sparkles, BarChart3 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    title: "Input",
    icon: Upload,
    description: (
      <>
        Start by uploading or creating your notes. SimplyNote supports{" "}
        <span className="font-semibold text-foreground">
          plain text, structured content, math, code, and tables
        </span>
        .
      </>
    ),
  },
  {
    title: "Process",
    icon: Sparkles,
    description: (
      <>
        The system analyzes your content and generates summaries, quizzes, and
        roadmaps.{" "}
        <span className="font-semibold text-foreground">
          All generated content is strictly based on your notes
        </span>
        .
      </>
    ),
  },
  {
    title: "Output",
    icon: BarChart3,
    description: (
      <>
        Review quizzes, explore visual roadmaps, and track quiz results with{" "}
        <span className="font-semibold text-foreground">
          detailed topic-level insights and explanations
        </span>
        .
      </>
    ),
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 20%"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.2], [32, 0]);

  return (
    <section ref={ref} className="relative py-28 bg-background">
      {/* background accent */}
      <div className="pointer-events-none absolute inset-0 bg-radial from-primary/10 via-transparent to-transparent" />

      <motion.div
        style={{ opacity, y }}
        className="relative mx-auto max-w-6xl px-4"
      >
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Workflow
          </Badge>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            How <span className="text-primary">SimplyNote</span> Works
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            A simple, structured flow that turns your notes into meaningful
            learning tools.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="h-full border-primary/20 bg-linear-to-tr from-background to-primary/5 shadow-sm hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-xl font-semibold">
                        Step {i + 1} – {step.title}
                      </h3>
                    </div>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Quota explanation */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-16 max-w-3xl mx-auto text-center"
        >
          <p className="text-sm leading-relaxed text-muted-foreground">
            SimplyNote uses a{" "}
            <span className="font-semibold text-foreground">
              credit-based system
            </span>{" "}
            to keep the platform fast, reliable, and free for everyone. Each
            generative feature consumes a small number of credits within a
            rolling time window.{" "}
            <span className="font-semibold">
              Your remaining credits and reset time are always visible
            </span>{" "}
            before you generate content.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
