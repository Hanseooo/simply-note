import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-linear-to-tr from-background/20 via-card/5 to-primary/5 animate-pulse border border-primary/10 rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
