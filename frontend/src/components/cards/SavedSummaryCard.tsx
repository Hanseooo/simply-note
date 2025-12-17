import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Pin, Share2, Trash2, Copy, User, Calendar } from "lucide-react";
import { toast } from "sonner";
import type { SavedSummaryListItem } from "@/types/apiResponse";
import { useFetchSummaryByCode } from "@/hooks/useFetchSummaryByCode";

type Props = {
  item: SavedSummaryListItem;
  onTogglePin?: (id: string) => void;
  onDelete?: (id: string) => void
};

const difficultyColor = {
  beginner: "bg-emerald-500/15 text-emerald-600",
  intermediate: "bg-amber-500/15 text-amber-600",
  advanced: "bg-rose-500/15 text-rose-600",
};

export default function SavedSummaryCard({ item, onTogglePin, onDelete }: Props) {

    const { fetchByCode, isFetching } = useFetchSummaryByCode()

  function copyShareCode() {
    navigator.clipboard.writeText(item.share_code);
    toast.success("Share code copied");
  }

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Card className="relative border-primary/20 bg-linear-to-tr from-background/75 to-background shadow-sm transition-all hover:shadow-lg">
        {/* Pin button */}
        <div className="absolute right-3 top-3 z-10">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onTogglePin?.(item.id)}
                className={`transition ${
                  item.is_pinned
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <motion.div
                  animate={{ rotate: item.is_pinned ? 0 : -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Pin className="h-4 w-4" />
                </motion.div>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {item.is_pinned ? "Unpin note" : "Pin note"}
            </TooltipContent>
          </Tooltip>
        </div>

        <CardHeader className="space-y-3">
          <h3 className="text-xl font-bold leading-tight tracking-tight">
            {item.title}
          </h3>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {item.created_by.username}
            </div>

            <Separator orientation="vertical" className="h-3" />

            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(item.created_at).toLocaleDateString()}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {item.topics.map((topic) => (
              <Badge
                key={topic}
                variant="secondary"
                className="bg-primary/10 text-primary"
              >
                {topic}
              </Badge>
            ))}

            <Badge
              variant="secondary"
              className={difficultyColor[item.difficulty]}
            >
              {item.difficulty}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Share */}
            <Dialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Share note</TooltipContent>
              </Tooltip>

              <DialogContent className="border-primary bg-linear-to-tr from-background to-primary/5">
                <DialogHeader>
                  <DialogTitle>Share Code</DialogTitle>
                </DialogHeader>

                <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2">
                  <code className="flex-1 font-mono text-sm">
                    {item.share_code}
                  </code>
                  <Button size="icon" variant="ghost" onClick={copyShareCode}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Delete */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={() => onDelete?.(item.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete note</TooltipContent>
            </Tooltip>
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full font-medium"
          onClick={() => fetchByCode(item.share_code)}
          disabled = {isFetching}
          >Open note</Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
