import { useState, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { extractPdfText } from "@/lib/extractPdfText";
import { useSummarize } from "@/hooks/useSummarize";
import LoadingScreen from "@/components/layout/Loading";

const MIN_CHARS = 512;
const MAX_CHARS = 7680;


export default function NoteSummarizer() {
  const [selectedTab, setSelectedTab] = useState("text");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState("");
  const [loading, setLoading] = useState(false);
  const [textInput, setTextInput] = useState("")

  const summarize = useSummarize();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handlePdf(file: File) {
    if (file.type !== "application/pdf") return;

    setPdfFile(file);
    setLoading(true);

    try {
      const text = await extractPdfText(file);
      setPdfText(text);
    //   console.log(text)
    } catch (err) {
      console.error("PDF extraction failed", err);
    } finally {
      setLoading(false);
    }
  }

  const charCount = textInput.length;
  const isTooShort = charCount < MIN_CHARS;
  const isTooLong = charCount > MAX_CHARS;
  const isInvalid = isTooShort || isTooLong;


  return (
    <section className="relative min-h-[62vh] mb-12 w-full max-w-3xl mx-auto mt-10 px-4">
      {summarize.isPending && (
        <LoadingScreen
          overlay
          title="Summarizing your notes"
          description="This usually takes a few seconds."
        />
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mx-auto mb-6">
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="pdf">PDF</TabsTrigger>
        </TabsList>

        {/* TEXT TAB */}
        <TabsContent value="text" className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="noteText" className="text-sm font-medium">
                Paste your notes
              </Label>

              {/* Character counter */}
              <span
                className={`text-xs ${
                  isTooLong ? "text-destructive" : "text-muted-foreground"
                }`}
              >
                {charCount}/{MAX_CHARS}
              </span>
            </div>

            <Textarea
              id="noteText"
              placeholder="Paste your notes here…"
              className="min-h-45 resize-none max-h-80"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />

            {/* Helper text */}
            <p className="text-xs text-muted-foreground">
              Text must be between{" "}
              <span className="font-medium text-primary">{MIN_CHARS}</span> and{" "}
              <span className="font-medium text-primary">{MAX_CHARS}</span> characters.
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              disabled={isInvalid || summarize.isPending}
              onClick={() =>
                summarize.mutate(
                  {
                    text: textInput,
                  },
                )
              }
            >
              {summarize.isPending ? "Summarizing…" : "Summarize Text"}
            </Button>
          </div>
        </TabsContent>

        {/* PDF TAB */}
        <TabsContent value="pdf" className="space-y-4">
          <Label>Upload PDF</Label>

          {/* Drop Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) handlePdf(file);
            }}
            className="flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-muted p-8 text-center cursor-pointer transition hover:border-primary/60"
          >
            <Upload className="h-6 w-6 text-muted-foreground" />

            <p className="text-sm">
              <span className="font-medium text-primary">Click to upload</span>{" "}
              or drag and drop
            </p>

            <p className="text-xs text-muted-foreground">
              PDF only · Text will be extracted
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePdf(file);
              }}
            />
          </div>

          {pdfFile && (
            <p className="text-sm text-muted-foreground">
              Selected: {pdfFile.name}
            </p>
          )}

          <div className="flex justify-end">
            <Button
              disabled={!pdfText || loading || summarize.isPending}
              onClick={() =>
                summarize.mutate(
                  {
                    text: pdfText,
                  },
                )
              }
            >
              {summarize.isPending ? "Summarizing…" : "Summarize PDF"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
