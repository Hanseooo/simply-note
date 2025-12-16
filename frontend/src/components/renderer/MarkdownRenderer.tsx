import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/tokyo-night-dark.css"; // You can pick any highlight.js theme

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-[95vw] m-auto  px-4 sm:px-6 py-4">
      <ReactMarkdown children={content} rehypePlugins={[rehypeHighlight]} />
    </article>
  );
}
