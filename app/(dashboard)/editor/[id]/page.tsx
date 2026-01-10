"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, PanelLeftClose, PanelLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MarkdownEditor, PreviewPane, Toolbar } from "@/components/editor";
import { ThemeToggle } from "@/components/common";
import { useDocStore } from "@/store";
import { useAutoSave } from "@/hooks";
import { formatMarkdown } from "@/lib/markdown";
import * as docService from "@/services/docService";
import * as aiService from "@/services/aiService";

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
    } catch (error) {
      console.error("Magic format failed:", error);
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
      } else {
        await docService.updateDocument(currentDoc.id, {
          title: currentDoc.title,
          content,
        });
      }
      markAsSaved();
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentDoc?.title || "document"}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Editor Header */}
      <header className="flex h-14 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="cursor-pointer">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to dashboard</span>
            </Link>
          </Button>

          {/* Document Title (Editable) */}
          <input
            type="text"
            value={currentDoc?.title || "Untitled"}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent text-lg font-semibold font-heading outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded px-2 py-1 max-w-50 sm:max-w-none"
            placeholder="Document title"
          />

          {/* Modified indicator */}
          {isModified && (
            <span className="text-xs text-muted-foreground">• Unsaved</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Preview */}
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeft className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle preview</span>
          </Button>

          <ThemeToggle />
        </div>
      </header>

      {/* Toolbar */}
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

      {/* Editor Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Panel */}
        <div
          className={`flex-1 overflow-hidden transition-all duration-200 ${
            showPreview ? "w-1/2" : "w-full"
          }`}
        >
          <MarkdownEditor value={content} onChange={setContent} />
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <>
            <div className="w-px bg-border" />
            <div className="w-1/2 overflow-hidden">
              <PreviewPane content={content} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
