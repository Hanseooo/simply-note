import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/tokyo-night-dark.css"; // You can pick any highlight.js theme
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import "katex/dist/katex.min.css";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-[95vw] m-auto  px-2 sm:px-6 py-4">
      <ReactMarkdown children={content} rehypePlugins={[rehypeHighlight, rehypeKatex]} remarkPlugins={[remarkGfm, remarkMath]} />
    </article>
  );
}
