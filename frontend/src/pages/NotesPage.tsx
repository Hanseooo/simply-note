import TitleHeader from "@/components/headers/TitleHeader";
import { Separator } from "@/components/ui/separator";
import NoteSummarizer from "@/sections/NoteSummarizer";
import SavedNotes from "@/sections/SavedNotes";


export default function NotesPage() {

    return (
      <main className="bg-linear-to-b from-primary/5 to-background ">
        <TitleHeader
          titleWord1="Notes"
          titleWord2="Summarizer"
          desc="Summarize your notes by pasting text or uploading PDFs!"
        />
        <NoteSummarizer />
        <Separator />
        <TitleHeader
          titleWord1="Your"
          titleWord2="Saved Notes"
          desc="A list of summarized notes you saved"
        />
        <SavedNotes />
      </main>
    );
}