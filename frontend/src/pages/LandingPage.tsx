import { HeroGeometric } from "@/components/ui/shadcn-io/shape-landing-hero";
import AboutSection from "@/sections/AboutSection";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";


export default function LandingPage() {

        const [isDark, setIsDark] = useState(true)

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
    
    return (
      <div className="min-h-screen relative">
        <HeroGeometric
          badge="AI-Powered Productivity Tool"
          title1="SimplyNote"
          title2="Elevate Your Studies"
          description="Elevate your study sessions with this AI-powered study tool designed to enhance productivity and learning experience."
        />
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
        <AboutSection />
      </div>
    );
}