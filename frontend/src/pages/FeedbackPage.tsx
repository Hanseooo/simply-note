import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert } from "@/components/ui/alert";
import { Star, Bug, Lightbulb } from "lucide-react";
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
    <div className="max-w-xl mb-16 flex flex-col">
      <Tabs value={tab} onValueChange={(v) => setTab(v as FeedbackType)}>
        <TabsList className="grid grid-cols-3 mb-2">
          <TabsTrigger value="rating">
            <Star className="h-4 w-4 mr-2" />
            Rating
          </TabsTrigger>
          <TabsTrigger value="bug">
            <Bug className="h-4 w-4 mr-2" />
            Bug
          </TabsTrigger>
          <TabsTrigger value="suggestion">
            <Lightbulb className="h-4 w-4 mr-2" />
            Suggestion
          </TabsTrigger>
        </TabsList>

        {/* ---------- RATING ---------- */}
        <TabsContent value="rating">
          <Card className="bg-linear-to-tr from-background/50 to-primary/10 border-primary/50">
            <CardHeader className="mb-0">
              <CardTitle className="text-center text-xl text-primary">
                Rate SimplyNote
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-col items-center">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={cn(
                      "h-7 w-7 cursor-pointer transition",
                      rating && n <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    )}
                    onClick={() => setRating(n)}
                  />
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={isAnonymous}
                  onCheckedChange={(v) => setIsAnonymous(Boolean(v))}
                />
                <span className="text-sm text-muted-foreground">
                  Submit anonymously
                </span>
              </div>

              {cooldownError && (
                <Alert variant="destructive">
                  You can only send feedback once every 3 days.
                </Alert>
              )}

              <Button className="" disabled={!rating || isSubmitting} onClick={submit}>
                Submit Rating
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------- BUG & SUGGESTION ---------- */}
        {(["bug", "suggestion"] as FeedbackType[]).map((type) => (
          <TabsContent value={type} key={type}>
            <Card className="bg-linear-to-tr from-background/50 to-primary/10 border-primary/50">
              <CardHeader>
                <CardTitle className="text-primary">
                  {type === "bug" ? "Report a Bug" : "Send a Suggestion"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder={
                    type === "bug"
                      ? "Describe the issue you encountered..."
                      : "Share your idea or suggestion..."
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={isAnonymous}
                    onCheckedChange={(v) => setIsAnonymous(Boolean(v))}
                  />
                  <span className="text-sm text-muted-foreground">
                    Submit anonymously
                  </span>
                </div>

                {cooldownError && (
                  <Alert variant="destructive">
                    You can only send feedback once every 3 days.
                  </Alert>
                )}

                <Button
                  disabled={!message.trim() || isSubmitting}
                  onClick={submit}
                >
                  Submit
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
