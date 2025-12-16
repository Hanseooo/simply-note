import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // You can pick any highlight.js theme

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none px-6 py-2">
      <ReactMarkdown children={content} rehypePlugins={[rehypeHighlight]} />
    </article>
  );
}
