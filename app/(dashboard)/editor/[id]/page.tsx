"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, PanelLeftClose, PanelLeft, Check, Cloud } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MarkdownEditor, PreviewPane, Toolbar } from "@/components/editor";
import { ThemeToggle } from "@/components/common";
import { useDocStore } from "@/store";
import { useAutoSave } from "@/hooks";
import { formatMarkdown } from "@/lib/markdown";
import { toast } from "@/lib/toast";
import * as docService from "@/services/docService";
import * as aiService from "@/services/aiService";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface EditorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditorPage({ params }: EditorPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(true);
  const [isFormatting, setIsFormatting] = useState(false);

  const {
    content,
    currentDoc,
    isModified,
    isSaving,
    setContent,
    setTitle,
    setIsSaving,
    markAsSaved,
    createNewDoc,
    setCurrentDoc,
    setIsLoading,
  } = useDocStore();

  // Initialize document on mount
  useEffect(() => {
    const initDoc = async () => {
      setIsLoading(true);
      try {
        if (id === "new") {
          createNewDoc();
        } else {
          const doc = await docService.getDocument(id);
          setCurrentDoc({
            id: doc.id,
            title: doc.title,
            content: doc.content,
            isFavorite: doc.isFavorite,
            status: doc.status,
            createdAt: new Date(doc.createdAt),
            updatedAt: new Date(doc.updatedAt),
          });
        }
      } catch (error) {
        console.error("Failed to load document:", error);
        createNewDoc();
      } finally {
        setIsLoading(false);
      }
    };

    initDoc();
  }, [id, createNewDoc, setCurrentDoc, setIsLoading]);

  // Auto-save hook
  const triggerAutoSave = useAutoSave({
    onSave: async () => {
      if (!currentDoc || !isModified) return;

      setIsSaving(true);
      try {
        if (typeof currentDoc.id === "string" && currentDoc.id.startsWith("temp-")) {
          // Create new document on first save
          const newDoc = await docService.createDocument({
            title: currentDoc.title,
            content,
          });
          setCurrentDoc({
            ...currentDoc,
            id: newDoc.id,
          });
        } else {
          // Update existing document
          await docService.updateDocument(currentDoc.id, {
            title: currentDoc.title,
            content,
          });
        }
        markAsSaved();
      } catch (error) {
        console.error("Auto-save failed:", error);
      } finally {
        setIsSaving(false);
      }
    },
    delay: 2000,
    enabled: isModified && currentDoc !== null,
  });

  // Trigger auto-save when content changes
  useEffect(() => {
    triggerAutoSave();
  }, [content, triggerAutoSave]);

  const handleFormat = () => {
    const formatted = formatMarkdown(content);
    setContent(formatted);
  };

  const handleMagicFormat = async () => {
    if (!content.trim()) return;

    setIsFormatting(true);
    try {
      // Call AI refine endpoint
      const refined = await aiService.refine(content);
      setContent(refined);
      toast.success("Document formatted with AI!");
    } catch (error) {
      console.error("Magic format failed:", error);
      toast.error("Failed to format document");
    } finally {
      setIsFormatting(false);
    }
  };

  const handleSave = async () => {
    if (!currentDoc || !isModified) return;

    setIsSaving(true);
    try {
      if (typeof currentDoc.id === "string" && currentDoc.id.startsWith("temp-")) {
        const newDoc = await docService.createDocument({
          title: currentDoc.title,
          content,
        });
        setCurrentDoc({
          ...currentDoc,
          id: newDoc.id,
        });
        toast.success("Document created successfully");
      } else {
        await docService.updateDocument(currentDoc.id, {
          title: currentDoc.title,
          content,
        });
        toast.success("Document saved successfully");
      }
      markAsSaved();
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to save document");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    if (!currentDoc) {
      toast.error("No document to export");
      return;
    }

    try {
      toast.info("Exporting document...");
      await docService.exportDocumentAsDocx(
        currentDoc.id,
        `${currentDoc.title || "document"}.docx`
      );
      toast.success("Document exported successfully");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export document");
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
  };

  return (
    <div className="flex h-screen flex-col bg-background/50 backdrop-blur-3xl">
      {/* Editor Header */}
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
                value={currentDoc?.title || "Untitled"}
                onChange={(e) => setTitle(e.target.value)}
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
            onClick={() => setShowPreview(!showPreview)}
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

      {/* Toolbar */}
      <div className="border-b border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-md">
        <Toolbar
            onFormat={handleFormat}
            onMagicFormat={handleMagicFormat}
            onSave={handleSave}
            onExport={handleExport}
            onCopy={handleCopy}
            isFormatting={isFormatting}
            isSaving={isSaving}
            isModified={isModified}
        />
      </div>

      {/* Editor Content */}
      <div className="flex flex-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        
        {/* Editor Panel */}
        <div
          className={cn(
            "flex-1 overflow-hidden transition-all duration-300 ease-in-out relative z-10",
            showPreview ? "w-1/2" : "w-full mx-auto max-w-5xl"
          )}
        >
          <MarkdownEditor value={content} onChange={setContent} />
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 border-l border-white/10 bg-white/30 dark:bg-black/30 backdrop-blur-sm overflow-hidden relative z-10"
          >
            <PreviewPane content={content} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
