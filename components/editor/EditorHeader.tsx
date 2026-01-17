import Link from "next/link";
import { ArrowLeft, PanelLeftClose, PanelLeft, Check, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common";

interface EditorHeaderProps {
  title: string;
  onTitleChange: (value: string) => void;
  isSaving: boolean;
  isModified: boolean;
  showPreview: boolean;
  onTogglePreview: () => void;
}

export function EditorHeader({
  title,
  onTitleChange,
  isSaving,
  isModified,
  showPreview,
  onTogglePreview,
}: EditorHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl px-4 sticky top-0 z-50 transition-all duration-300">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="hover:bg-white/20 dark:hover:bg-white/10 transition-colors">
          <Link href="/dashboard">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to dashboard</span>
          </Link>
        </Button>
        
        <div className="h-6 w-px bg-white/20 dark:bg-white/10" />

        {/* Document Title (Editable) */}
        <div className="group relative">
          <input
            type="text"
            value={title || "Untitled"}
            onChange={(e) => onTitleChange(e.target.value)}
            className="bg-transparent text-lg font-bold font-heading outline-none focus:ring-0 rounded-lg px-2 py-1 w-64 md:w-96 transition-all hover:bg-white/20 dark:hover:bg-white/5 focus:bg-white/30 dark:focus:bg-white/10"
            placeholder="Document title"
          />
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-white/10 dark:bg-white/5 border border-white/10">
           {isSaving ? (
              <>
                  <Cloud className="w-3 h-3 animate-bounce text-blue-500" />
                  <span className="text-blue-500">Saving...</span>
              </>
           ) : isModified ? (
              <>
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-muted-foreground">Unsaved</span>
              </>
           ) : (
              <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="text-muted-foreground">Saved</span>
              </>
           )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Toggle Preview */}
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-white/20 dark:hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
          onClick={onTogglePreview}
        >
          {showPreview ? (
            <>
              <PanelLeftClose className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Hide Preview</span>
            </>
          ) : (
            <>
              <PanelLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Show Preview</span>
            </>
          )}
        </Button>

        <div className="h-6 w-px bg-white/20 dark:bg-white/10 mx-2" />

        <ThemeToggle />
      </div>
    </header>
  );
}
