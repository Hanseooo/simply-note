import { useQuizStore } from "@/store/quizStore";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const greetings = [
  // Gentle motivation
  "Let’s continue your study session and make some progress today.",
  "Ready to focus and move one step closer to your goals?",
  "Small steps today lead to big results over time.",
  "Progress does not have to be perfect. Just stay consistent.",
  "A focused session can make a real difference.",

  // Focus and productivity
  "Let’s clear distractions and focus on what matters right now.",
  "One concept at a time. Stay focused and keep going.",
  "This is a good moment to dive back into learning.",
  "Let’s make the most of this study session.",
  "Your future self will appreciate the effort you put in today.",

  // Encouragement
  "You are building knowledge one step at a time.",
  "Every study session adds up over time.",
  "Even a short study session counts as progress.",
  "You have already started, and that matters.",
  "Learning is a process. Be patient with yourself.",

  // Reflection and continuity
  "Let’s pick up where you left off and keep the momentum going.",
  "This is a great time to review and strengthen what you have learned.",
  "Revisiting concepts helps reinforce understanding.",
  "Now is a good moment to connect what you have learned so far.",
  "Let’s reinforce the progress you have already made.",

  // Calm and supportive
  "Take a breath and focus on learning at your own pace.",
  "Studying does not need to feel rushed.",
  "It is okay to take things one step at a time.",
  "Focus on understanding instead of just finishing.",
  "You are exactly where you need to be right now.",
];



export default function UserHeader() {
  const user = useAuthStore((s) => s.user);
  const [isDark, setIsDark] = useState(true);

    const resetQuiz = useQuizStore().resetQuiz;

    useEffect(() => {
      resetQuiz();
    }, []);

    useEffect(() => {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme === "light") {
        setIsDark(false);
        document.documentElement.classList.remove("dark");
      } else {
        setIsDark(true);
        document.documentElement.classList.add("dark");
      }
    }, []);

      const toggleTheme = () => {
        const newMode = !isDark;
        setIsDark(newMode);
        if (newMode) {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
        }
      };

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
      className="w-full relative border-b py-10 px-4 bg-linear-to-tr from-background to-primary/5"
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

      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 md:right-12 text-primary p-2 sm:p-3 rounded-lg hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors flex items-center justify-center"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <Moon className="w-5 h-5 sm:w-6 sm:h-6" />
        )}
      </button>

      {/* Bold accent divider */}
      <div className="mt-6 h-1 w-2/3 mx-auto rounded-full bg-linear-to-r from-transparent via-primary/60 to-transparent" />
    </motion.section>
  );
}
