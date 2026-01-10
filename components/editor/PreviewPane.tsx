"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { cn } from "@/lib/utils";

interface PreviewPaneProps {
  content: string;
  className?: string;
}

export function PreviewPane({ content, className = "" }: PreviewPaneProps) {
  return (
    <div
      className={cn(
        "h-full w-full overflow-auto bg-background p-6",
        className
      )}
    >
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
          components={{
            // Custom heading styles
            h1: ({ children }) => (
              <h1 className="scroll-m-20 text-3xl font-bold tracking-tight font-heading border-b pb-2 mb-4">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight font-heading border-b pb-2 mb-3 mt-8">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="scroll-m-20 text-xl font-semibold tracking-tight font-heading mt-6 mb-2">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="scroll-m-20 text-lg font-semibold tracking-tight font-heading mt-4 mb-2">
                {children}
              </h4>
            ),
            // Custom paragraph
            p: ({ children }) => (
              <p className="leading-7 [&:not(:first-child)]:mt-4">{children}</p>
            ),
            // Custom list styles
            ul: ({ children }) => (
              <ul className="my-4 ml-6 list-disc [&>li]:mt-2">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="my-4 ml-6 list-decimal [&>li]:mt-2">{children}</ol>
            ),
            // Custom blockquote
            blockquote: ({ children }) => (
              <blockquote className="mt-4 border-l-4 border-primary/50 pl-4 italic text-muted-foreground">
                {children}
              </blockquote>
            ),
            // Custom code blocks
            code: ({ className, children, ...props }) => {
              const isInline = !className;
              if (isInline) {
                return (
                  <code
                    className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-medium"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }
              return (
                <code className={cn("font-mono text-sm", className)} {...props}>
                  {children}
                </code>
              );
            },
            pre: ({ children }) => (
              <pre className="mt-4 mb-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
                {children}
              </pre>
            ),
            // Custom table
            table: ({ children }) => (
              <div className="my-4 w-full overflow-auto">
                <table className="w-full border-collapse border border-border">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-border px-4 py-2">{children}</td>
            ),
            // Custom link
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors cursor-pointer"
              >
                {children}
              </a>
            ),
            // Custom horizontal rule
            hr: () => <hr className="my-6 border-border" />,
            // Custom image
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt || ""}
                className="rounded-lg border border-border my-4 max-w-full h-auto"
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
