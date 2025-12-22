"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { User, Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DeveloperNote() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 20%"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3], [24, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-background py-24">
      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0 bg-radial from-primary/10 via-transparent to-transparent" />

      <motion.div
        style={{ opacity, y }}
        className="relative mx-auto max-w-4xl px-4"
      >
        <Card className="border-border/50 bg-card/70 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-6 sm:p-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <Avatar className="h-14 w-14">
                {/* Replace src later if you add an image */}
                <AvatarImage src="" alt="Hans" />
                <AvatarFallback className="bg-primary/10 text-primary">
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>

              <div>
                <Badge
                  variant="secondary"
                  className="mb-2 inline-flex items-center gap-2"
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Developer’s Note
                </Badge>

                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  A note from <span className="text-primary">Hans</span>
                </h3>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Content */}
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Hi, I’m{" "}
                <span className="font-semibold text-foreground">Hans</span>, the
                developer behind SimplyNote.
              </p>

              <p>
                This started as a fun{" "}
                <span className="font-semibold text-foreground">
                  hobby project
                </span>{" "}
                that I built over the course of about a week. It’s my first
                AI-powered web application, and seeing everything come together
                from idea to a working product has been incredibly rewarding.
              </p>

              <p>
                I built SimplyNote because I personally dislike reading{" "}
                <span className="font-semibold">long, unstructured notes</span>.
                When I study, I just want the main ideas, clear explanations,
                and a way to truly understand a topic. That’s why SimplyNote
                turns your notes into summaries, quizzes, and learning roadmaps.
              </p>

              <p>
                Quizzes are designed to help with{" "}
                <span className="font-semibold">memory retention</span>, not
                random testing. Every question and explanation is strictly based
                on your summarized notes. The learning roadmaps exist for those
                moments when self-study feels overwhelming and you’re not sure
                where to start next.
              </p>

              {/* Highlight box */}
              <div className="rounded-xl border border-border/60 bg-background/60 p-5">
                <p className="text-sm">
                  SimplyNote is{" "}
                  <span className="font-semibold text-foreground">
                    free for everyone
                  </span>
                  . AI features use a{" "}
                  <span className="font-semibold text-foreground">
                    credit-based system
                  </span>{" "}
                  that resets after few hours. This keeps the platform fast,
                  fair, and sustainable without hidden costs.
                </p>
              </div>

              <p>
                All of the core features are already here, and more
                improvements will come over time. Thank you for trying
                SimplyNote. Please use it responsibly, and I hope it genuinely
                helps your learning.
              </p>

              <p className="text-sm text-muted-foreground">
                I’m planning to add a feedback system soon, and I’d love to hear
                your thoughts.
              </p>

              <p className="pt-4 font-medium text-foreground">— Hans</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
