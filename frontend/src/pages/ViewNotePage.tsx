import TitleHeader from "@/components/headers/TitleHeader";
import MarkdownRenderer from "@/components/renderer/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { SummarizedNote } from "@/types/apiResponse";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Bookmark } from "lucide-react";

type ViewNotePageProps = {
  data: SummarizedNote;
  isSaved?: boolean;
};

export default function ViewNotePage({
  data,
  isSaved = true,
}: ViewNotePageProps) {
  const navigate = useNavigate();

  return (
    <section className="mx-auto w-full py-6 space-y-6">
      {/* Page title */}
      <TitleHeader
        titleWord1=""
        titleWord2={data.title}
        desc={data.description}
      />

      {/* Main content */}
      <div className="px-4 sm:px-6">
        <Card className="mt-6 max-w-4xl mx-auto bg-linear-to-tr from-card/20 via-primary/10 to card/5">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-4xl border-b pb-6 font-bold text-primary text-center">Note Summary</CardTitle>
          </CardHeader>

          <CardContent className="prose prose-neutral dark:prose-invert max-w-none px-2 sm:px-6">
            <MarkdownRenderer content={data.markdown} />
          </CardContent>

          {data.key_points.length > 0 && (
            <>
              <Separator />
              <CardContent className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Key Points
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {data.key_points.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </CardContent>
            </>
          )}

          <CardFooter className="flex flex-wrap items-center justify-between gap-2">
            <Button
              variant="ghost"
              onClick={() => navigate({ to: "/notes" })}
              className="gap-2 text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to notes
            </Button>

            {!isSaved && (
              <Button className="gap-2">
                <Bookmark className="h-4 w-4" />
                Save note
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
