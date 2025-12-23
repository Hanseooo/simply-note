import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFeedback } from "@/hooks/useFeedback";
import type { FeedbackType } from "@/types/apiPayloads";
import { toast } from "sonner";


export default function FeedbackPage() {
  const { ratingQuery, submitMutation } = useFeedback();

  const [tab, setTab] = useState<FeedbackType>("rating");
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    if (ratingQuery.data?.rating) {
      setRating(ratingQuery.data.rating);
    }
  }, [ratingQuery.data]);

  const isSubmitting = submitMutation.isPending;
  const cooldownError =
    submitMutation.error &&
    // @ts-expect-error axios
    submitMutation.error.response?.status === 429;

const submit = () => {
  submitMutation.mutate(
    {
      feedback_type: tab,
      rating: tab === "rating" ? rating! : undefined,
      message: tab !== "rating" ? message.trim() : undefined,
      is_anonymous: isAnonymous,
    },
    {
      onSuccess: () => {
        toast.success("Feedback Sent", {description: "This feedback will surely help improve SimplyNote"});

        if (tab !== "rating") {
          setMessage("");
        }
      },
    }
  );
};


return (
  <main className="mx-auto min-h-screen max-w-md px-4 pt-20 flex flex-col gap-10 text-foreground">
    {/* Header */}
    <header className="space-y-2 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-primary">Feedback</h1>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Help improve SimplyNote by rating the experience, reporting bugs, or sharing feedback.
      </p>
    </header>

    <Tabs value={tab} onValueChange={(v) => setTab(v as FeedbackType)}>
      {/* Tabs */}
      <TabsList className="grid mx-auto grid-cols-3 border-b border-border bg-transparent p-0">
        <TabsTrigger
          value="rating"
          className="border-b-2 border-transparent data-[state=active]:border-primary"
        >
          Rating
        </TabsTrigger>
        <TabsTrigger
          value="bug"
          className="border-b-2 border-transparent data-[state=active]:border-primary"
        >
          Bug
        </TabsTrigger>
        <TabsTrigger
          value="suggestion"
          className="border-b-2 border-transparent data-[state=active]:border-primary"
        >
          Feedback
        </TabsTrigger>
      </TabsList>

      {/* -------- RATING -------- */}
      <TabsContent value="rating" className="pt-8">
        <section className="flex flex-col items-center gap-8">
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                onClick={() => setRating(n)}
                className={cn(
                  "h-8 w-8 cursor-pointer transition",
                  rating && n <= rating
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                )}
              />
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox
              checked={isAnonymous}
              onCheckedChange={(v) => setIsAnonymous(Boolean(v))}
              className=""
            />
            Submit anonymously
          </label>

          {cooldownError && (
            <p className="text-sm text-destructive">
              You can only send feedback once every 3 days.
            </p>
          )}

          <Button
            onClick={submit}
            disabled={!rating || isSubmitting}
            className="w-3/5 font-medium"
          >
            Submit rating
          </Button>
        </section>
      </TabsContent>

      {/* -------- BUG / SUGGESTION -------- */}
      {(["bug", "suggestion"] as FeedbackType[]).map((type) => (
        <TabsContent key={type} value={type} className="pt-8">
          <section className="flex flex-col gap-6">
            <div className="space-y-1">
              <h2 className="text-lg font-medium">
                {type === "bug" ? "Report a bug" : "Share a suggestion"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {type === "bug"
                  ? "Describe what went wrong or what you encountered."
                  : "Tell us how SimplyNote could be better."}
              </p>
            </div>

            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                type === "bug"
                  ? "What happened?"
                  : "What would you like to see improved?"
              }
              className="min-h-30"
            />

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox
                checked={isAnonymous}
                onCheckedChange={(v) => setIsAnonymous(Boolean(v))}
              />
              Submit anonymously
            </label>

            {cooldownError && (
              <p className="text-sm text-destructive">
                You can only send feedback once every 5 minutes.
              </p>
            )}

            <Button
              onClick={submit}
              disabled={!message.trim() || isSubmitting}
              className="w-full font-medium"
            >
              Submit feedback
            </Button>
          </section>
        </TabsContent>
      ))}
    </Tabs>
  </main>
);

}
