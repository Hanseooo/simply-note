import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import { useMemo } from "react";

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const greetings = [
  "Let’s continue your study session and make some progress today.",
  "Ready to focus and move one step closer to your goals?",
  "A great time to review and strengthen what you’ve learned.",
  "Let’s pick up where you left off and keep the momentum going.",
  "Small steps today lead to big results over time.",
];

export default function GreetingSection() {
  const user = useAuthStore((s) => s.user);

  // Random greeting, stable per render
  const greetingMessage = useMemo(() => {
    const index = Math.floor(Math.random() * greetings.length);
    return greetings[index];
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full border-b bg-linear-to-tr from-background to-primary/5"
    >
      <div className="mx-auto max-w-7xl px-4 py-10">
        <p className="text-sm text-muted-foreground">{getTimeGreeting()},</p>

        <h1 className="mt-1 text-2xl font-semibold text-primary tracking-tight sm:text-3xl">
          {user?.username}
        </h1>

        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          {greetingMessage}
        </p>
      </div>

      {/* Subtle accent divider */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-primary/30 to-transparent" />
    </motion.section>
  );
}
