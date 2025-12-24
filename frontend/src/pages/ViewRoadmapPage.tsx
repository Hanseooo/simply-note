import TitleHeader from "@/components/headers/TitleHeader";
import LoadingScreen from "@/components/layout/Loading";
import MarkdownRenderer from "@/components/renderer/MarkdownRenderer";
import MermaidRenderer from "@/components/renderer/MermaidRenderer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRoadmap } from "@/hooks/useRoadmap";
import { useRoadmapQuery } from "@/hooks/useRoadmapQuery";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Bookmark } from "lucide-react";
import { useEffect } from "react";

type ViewRoadmapPageProps = {
  roadmapId: string;
};

export default function ViewRoadmapPage({ roadmapId }: ViewRoadmapPageProps) {
  const navigate = useNavigate();
  const { saveRoadmap, isSaving } = useRoadmap();

  const { data, isLoading, isError} = useRoadmapQuery(roadmapId)

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

    if (isLoading) {
      return <div className="min-h-[64vh] flex w-full items-center justify-between">
        <LoadingScreen overlay title="Loading Roadmap" />
      </div>;
    }

if (isError || !data) {
  return (
    <div className="text-center flex flex-col items-center justify-center min-h-screen p-8">
      <p className="text-primary font-bold text-4xl mb-6">Roadmap not found.</p>
      <Button onClick={() => navigate({ to: "/roadmaps" })}>
        Back to Roadmaps
      </Button>
    </div>
  );
}

  const canSave = data.is_saved !== true;

  return (
    <section className="mx-auto w-full py-6 space-y-6 bg-radial from-primary/10">
      <TitleHeader
        titleWord1=""
        titleWord2={data.title}
        desc={data.description}
      />

      <div className="px-4 sm:px-6">
        <Card className="mt-6 max-w-4xl mx-auto bg-sidebar">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-4xl border-b pb-6 font-bold text-primary text-center">
              Learning Roadmap
            </CardTitle>
          </CardHeader>

          {/* Markdown */}
          <CardContent className="prose dark:prose-invert max-w-none">
            <MarkdownRenderer content={data.markdown} />
          </CardContent>

          {/* Diagram */}
          <Separator />
          <CardContent className="p-0 w-full overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Roadmap Diagram
            </h3>
            <MermaidRenderer
              code={data.diagram_code}
              chartType={data.diagram_type}
            />
          </CardContent>

          {/* Milestones */}
          {data.milestones.length > 0 && (
            <>
              <Separator />
              <CardContent className="space-y-3">
                <h3 className="text-lg font-semibold">Milestones</h3>
                <ul className="space-y-2 text-sm">
                  {data.milestones.map((m, i) => (
                    <li key={i}>
                      <strong>{m.title}</strong> — {m.description}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </>
          )}

          {/* Actions */}
          <CardFooter className="flex justify-between gap-2 text-primary">
            <Button
              variant="ghost"
              onClick={() => navigate({ to: "/roadmaps" })}
              className="gap-2 font-bold"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="flex gap-2">
              {canSave && data.id && (
                <Button
                  disabled={isSaving}
                  onClick={() => saveRoadmap(data.id)}
                  className="gap-2"
                >
                  <Bookmark className="h-4 w-4" />
                  Save
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
