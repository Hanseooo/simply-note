import MarkdownRenderer from "@/components/renderer/MarkdownRenderer";


export default function SavedNotes() {

      const summaryMarkdown = `
# Summary of Notes
---

Here’s the main idea of your notes:

\`\`\`js
function helloWorld() {
  console.log("Hello World!");
}
\`\`\`

- Key point 1
- Key point 2

---


  `;

    return(
        <main className="min-h-[64vh] mb-12 py-4">
            <MarkdownRenderer content={summaryMarkdown} />
        </main>
    )
}