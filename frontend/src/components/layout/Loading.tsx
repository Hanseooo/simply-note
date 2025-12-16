import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type LoadingScreenProps = {
  title?: string;
  description?: string;
  overlay?: boolean;
  className?: string;
};

export default function LoadingScreen({
  title = "Working on it…",
  description = "This may take a few seconds.",
  overlay = false,
  className,
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 text-center",
        overlay && "absolute inset-0 z-50 bg-background/80 backdrop-blur-sm",
        className
      )}
    >
      {/* Icon */}
      <div className="relative">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <Sparkles className="absolute -right-2 -top-2 h-4 w-4 text-primary/70" />
      </div>

      {/* Text */}
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
