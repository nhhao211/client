"use client";

import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getDocument } from "@/services/docService";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface DocumentPreviewTooltipProps {
  children: React.ReactNode;
  docId: number;
  // If we already have content (e.g. form a comprehensive list), use it.
  // But currently list endpoint returns empty content.
  initialContent?: string; 
}

export function DocumentPreviewTooltip({ children, docId, initialContent }: DocumentPreviewTooltipProps) {
  const [content, setContent] = useState<string | null>(initialContent || null);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && !content && !loading && !hasFetched) {
      const fetchContent = async () => {
        setLoading(true);
        try {
          const doc = await getDocument(docId);
          // If content is empty or null, we still mark as fetched so we don't retry endlessly
          setContent(doc.content || "");
        } catch (error) {
          console.error("Failed to fetch document content preview", error);
          setContent("Failed to load preview.");
        } finally {
          setLoading(false);
          setHasFetched(true);
        }
      };
      fetchContent();
    }
  }, [isOpen, content, docId, loading, hasFetched]);

  return (
    <Tooltip open={isOpen} onOpenChange={setIsOpen} delayDuration={700}>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent 
        side="right" 
        align="start" 
        sideOffset={10}
        className={cn(
            "w-[20rem] h-[16rem] overflow-hidden flex flex-col p-0", 
            "bg-background/80 backdrop-blur-xl border-border/50",
            "shadow-2xl dark:shadow-blue-900/10"
        )}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 bg-muted/20">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Preview</span>
             {loading && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {loading && !content ? (
                 <div className="flex flex-col items-center justify-center h-full space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    <p className="text-xs text-muted-foreground">Loading content...</p>
                </div>
            ) : !content && hasFetched ? (
                 <div className="flex items-center justify-center h-full text-muted-foreground text-sm italic">
                    No content available
                </div>
            ) : (
                <div className="prose prose-xs dark:prose-invert max-w-none prose-headings:mt-2 prose-headings:mb-1 prose-p:my-1 prose-ul:my-1">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content?.substring(0, 500) /* Safety cap for rendering large blobs */}
                    </ReactMarkdown>
                    {content && content.length > 500 && (
                        <p className="text-xs text-muted-foreground italic mt-2">...content truncated</p>
                    )}
                </div>
            )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
