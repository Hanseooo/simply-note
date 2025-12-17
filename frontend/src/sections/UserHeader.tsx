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

export default function UserHeader() {
  const user = useAuthStore((s) => s.user);

  // Random greeting, stable per render
  const greetingMessage = useMemo(() => {
    const index = Math.floor(Math.random() * greetings.length);
    return greetings[index];
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full border-b py-10 px-4 bg-linear-to-tr from-background to-primary/5"
    >
      <div className="mx-auto max-w-7xl text-center">
        <p className="text-lg font-medium text-muted-foreground">
          {getTimeGreeting()},
        </p>

        <h1 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-primary">
          {user?.username}
        </h1>

        <p className="mt-4 max-w-3xl mx-auto text-lg sm:text-xl font-semibold text-muted-foreground">
          {greetingMessage}
        </p>
      </div>

      {/* Bold accent divider */}
      <div className="mt-6 h-1 w-2/3 mx-auto rounded-full bg-linear-to-r from-transparent via-primary/60 to-transparent" />
    </motion.section>
  );
}
