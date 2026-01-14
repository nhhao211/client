"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { useTheme } from "next-themes";

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    // Cấu hình mermaid theo theme của hệ thống
    mermaid.initialize({
      startOnLoad: true,
      theme: theme === "dark" ? "dark" : "default",
      securityLevel: "loose",
      fontFamily: "inherit",
    });

    const renderChart = async () => {
      if (containerRef.current && chart) {
        try {
          setError(false);
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          
          // Sanitize input: Remove potential markdown fences or trailing artifacts
          // This fixes the "Parse error" when slash command artifacts remain
          const cleanChart = chart
            .replace(/```mermaid/g, "") // Remove header if leaked
            .replace(/```/g, "")        // Remove closing backticks if leaked
            .trim();

          const { svg } = await mermaid.render(id, cleanChart);
          setSvg(svg);
        } catch (err) {
          console.error("Mermaid parsing error:", err);
          setError(true);
        }
      }
    };

    renderChart();
  }, [chart, theme]);

  if (error) {
    return (
      <div className="p-4 mb-4 border border-red-500/50 bg-red-500/10 rounded-md text-red-500 text-sm">
        <p className="font-bold">Mermaid Error:</p>
        <pre className="mt-2 whitespace-pre-wrap">{chart}</pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex justify-center my-6 overflow-x-auto bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-sm"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default Mermaid;
