"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { generateDiagram } from "@/services/aiService";
import { toast } from "@/lib/toast";

interface AiDiagramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (code: string) => void;
}

const DIAGRAM_TYPES = [
  { value: "flowchart", label: "Flowchart (Process)" },
  { value: "sequence", label: "Sequence Diagram (Interaction)" },
  { value: "gantt", label: "Gantt Chart (Timeline)" },
  { value: "class", label: "Class Diagram (Structure)" },
  { value: "state", label: "State Diagram (Status)" },
  { value: "mindmap", label: "Mindmap (Ideas)" },
];

export function AiDiagramDialog({ open, onOpenChange, onInsert }: AiDiagramDialogProps) {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState("flowchart");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const code = await generateDiagram(prompt, type);
      
      // Wrap code in markdown block if not already
      const formattedCode = code.startsWith("```") 
        ? code 
        : "```mermaid\n" + code + "\n```";
        
      onInsert(formattedCode);
      onOpenChange(false);
      setPrompt(""); // Reset form
      toast.success("Diagram generated successfully!");
    } catch (error) {
      console.error("Failed to generate diagram:", error);
      toast.error("Failed to generate diagram. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            AI Diagram Generator
          </DialogTitle>
          <DialogDescription>
            Describe what you want to visualize, and AI will draw it for you.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="type" className="text-sm font-medium">
              Diagram Type
            </label>
            <select
              id="type"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {DIAGRAM_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="prompt" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="prompt"
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              placeholder="E.g., A user login process where the system checks credentials. If valid, redirect to dashboard. If invalid, show error."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
