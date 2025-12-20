import { useState } from "react";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Pin,
  Share2,
  Trash2,
  Copy,
  Check,
  Calendar,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useRoadmap } from "@/hooks/useRoadmap";
import type { SavedRoadmapListItem } from "@/types/apiResponse";

type Props = {
  item: SavedRoadmapListItem;
};

const diagramTypeLabel: Record<string, string> = {
  gantt: "Gantt",
  timeline: "Timeline",
  flowchart: "Flowchart",
};

export default function SavedRoadmapCard({ item }: Props) {
  const navigate = useNavigate();
  const { unsaveRoadmap, pinRoadmap, unpinRoadmap, isUnsaving } = useRoadmap();

  const [copied, setCopied] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function togglePin() {
    item.is_pinned ? unpinRoadmap(item.id) : pinRoadmap(item.id);
  }

  function copyShareCode() {
    navigator.clipboard.writeText(item.share_code);
    setCopied(true);
    toast.success("Share code copied");

    setTimeout(() => setCopied(false), 1500);
  }

  function openRoadmap() {
    navigate({
      to: "/view-roadmap/$roadmapId",
      params: { roadmapId: item.id },
    });
  }

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="h-full"
    >
      <Card className="relative flex flex-col justify-between h-full border-primary/20 bg-linear-to-tr from-background/80 to-background shadow-sm transition-all hover:shadow-lg">
        {/* Pin */}
        <div className="absolute right-3 top-3 z-10">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={togglePin}
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
              {item.is_pinned ? "Unpin roadmap" : "Pin roadmap"}
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
              {item.created_by}
            </div>

            <Separator orientation="vertical" className="h-3" />

            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(item.created_at).toLocaleDateString()}
            </div>
          </div>

          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {diagramTypeLabel[item.diagram_type]}
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
                <TooltipContent>Share roadmap</TooltipContent>
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
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Delete */}
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Remove roadmap</TooltipContent>
              </Tooltip>

              <DialogContent className="border border-primary bg-linear-to-tr from-background to-primary/5">
                <DialogHeader className="text-primary">
                  <DialogTitle>Remove Roadmap?</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground">
                  This will remove the roadmap from your saved list.
                </p>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setConfirmOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      unsaveRoadmap(item.id);
                      setConfirmOpen(false);
                    }}
                    disabled={isUnsaving}
                  >
                    Remove
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>

        <CardFooter className="">
          <Button className="w-full font-medium" onClick={openRoadmap}>
            Open Roadmap
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
