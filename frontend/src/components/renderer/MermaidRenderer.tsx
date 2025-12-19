import { useEffect, useRef } from "react";
import mermaid from "mermaid";

type MermaidRendererProps = {
  code: string;
  chartType : string
};

export default function MermaidRenderer({ code, chartType }: MermaidRendererProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "strict",
    });

    if (!ref.current) return;

    ref.current.innerHTML = "";

    mermaid
      .render(`mermaid-${crypto.randomUUID()}`, code)
      .then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      })
      .catch((err) => {
        console.error("Mermaid render error:", err);
      });
  }, [code]);

  return (
    <div
      ref={ref}
      className={`overflow-x-auto flex justify-center ${chartType != "flowchart" ? "w-[300vw] sm:w-[200vw]" : "w-[125vw] sm:w-[70vw]"} `}
    />
  );
}
