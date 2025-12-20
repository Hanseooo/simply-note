"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
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

import { Pin, Trash2, User, Share2, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

import type { SavedQuizListItem } from "@/types/apiResponse";
import { useQuiz } from "@/hooks/useQuiz";
import { useNavigate } from "@tanstack/react-router";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";

type Props = {
  item: SavedQuizListItem;
};

const difficultyColor = {
  easy: "bg-emerald-500/15 text-emerald-600",
  medium: "bg-amber-500/15 text-amber-600",
  hard: "bg-rose-500/15 text-rose-600",
};

export default function SavedQuizCard({ item }: Props) {
  const navigate = useNavigate()
  const { pinQuiz, unpinQuiz, unsaveQuiz } = useQuiz();

  /* -------------------------------
     Optimistic UI states
  -------------------------------- */
  const [isPinned, setIsPinned] = useState(item.is_pinned);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [topicsOpen, setTopicsOpen] = useState(false);


  function handleTogglePin() {
    const next = !isPinned;
    setIsPinned(next);

    try {
      next ? pinQuiz(item.id) : unpinQuiz(item.id);
    } catch {
      setIsPinned(!next);
      toast.error("Unable to update pin");
    }
  }

  function copyShareCode() {
    navigator.clipboard.writeText(item.share_code);
    setIsCopied(true);
    toast.success("Share code copied");

    setTimeout(() => setIsCopied(false), 1500);
  }

    function answerQuiz() {
      navigate({
        to: "/quiz/$quizId",
        params: { quizId: item.id },
      });
    }

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="h-full"
    >
      <Card className="relative flex h-full flex-col justify-between border-primary/20 bg-linear-to-tr from-background/75 to-background shadow-sm transition-all hover:shadow-lg">
        {/* Pin */}
        <div className="absolute right-3 top-3 z-10">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleTogglePin}
                className={
                  isPinned
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }
              >
                <motion.div
                  animate={{
                    rotate: isPinned ? 0 : -20,
                    scale: isPinned ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Pin className="h-4 w-4" />
                </motion.div>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isPinned ? "Unpin quiz" : "Pin quiz"}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Header */}
        <CardHeader className="space-y-3">
          <h3 className="text-xl font-bold leading-tight tracking-tight">
            {item.title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span>{item.created_by}</span>
          </div>

          <Separator />

          {/* Topics + Difficulty */}
          <div className="flex flex-wrap gap-2">
            {item.topics.slice(0, 3).map((topic) => (
              <Badge
                key={topic.label}
                variant="secondary"
                className="bg-primary/10 text-primary"
              >
                {topic.label}
              </Badge>
            ))}

            {item.topics.length > 3 && (
              <Collapsible open={topicsOpen} onOpenChange={setTopicsOpen}>
                <CollapsibleTrigger asChild>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer bg-primary/5 text-primary flex items-center gap-1"
                  >
                    {topicsOpen ? (
                      <>
                        Show less
                        <ChevronUp className="h-3 w-3" />
                      </>
                    ) : (
                      <>
                        +{item.topics.length - 3} more
                        <ChevronDown className="h-3 w-3" />
                      </>
                    )}
                  </Badge>
                </CollapsibleTrigger>

                <CollapsibleContent className="flex flex-wrap gap-2 mt-2">
                  {item.topics.slice(3).map((topic) => (
                    <Badge
                      key={topic.label}
                      variant="secondary"
                      className="bg-primary/10 text-primary"
                    >
                      {topic.label}
                    </Badge>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )}

            <Badge
              variant="secondary"
              className={difficultyColor[item.difficulty]}
            >
              {item.difficulty}
            </Badge>
          </div>
        </CardHeader>

        {/* Actions */}
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
                <TooltipContent>Share quiz</TooltipContent>
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
                    {isCopied ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Delete */}
            <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Remove quiz</TooltipContent>
              </Tooltip>

              <DialogContent className="border border-primary bg-linear-to-tr from-background to-primary/5">
                <DialogHeader>
                  <DialogTitle className="text-primary">
                    Remove this quiz?
                  </DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground">
                  This will remove the quiz from your saved list.
                </p>

                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setConfirmDelete(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      unsaveQuiz(item.id);
                      setConfirmDelete(false);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter>
          <Button className="w-full font-medium" onClick={() => answerQuiz()}>
            Answer quiz
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
