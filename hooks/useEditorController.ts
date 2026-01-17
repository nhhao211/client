import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDocStore } from "@/store";
import { useAutoSave } from "@/hooks";
import { formatMarkdown } from "@/lib/markdown";
import { toast } from "@/lib/toast";
import * as docService from "@/services/docService";
import { createDocumentAction, updateDocumentAction } from "@/app/serverActions";
import * as aiService from "@/services/aiService";
import { Document } from "@/services/docService";

interface UseEditorControllerProps {
  initialDoc?: Document;
  isNew?: boolean;
}

export const useEditorController = ({ initialDoc, isNew }: UseEditorControllerProps) => {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(true);
  const [isFormatting, setIsFormatting] = useState(false);

  const {
    content,
    currentDoc,
    isModified,
    isSaving,
    isAutoSaveEnabled,
    setContent,
    setTitle,
    setIsSaving,
    markAsSaved,
    createNewDoc,
    setCurrentDoc,
    setIsLoading,
    toggleAutoSave,
  } = useDocStore();

  // Initialize document on mount
  useEffect(() => {
    const initDoc = async () => {
      setIsLoading(true);
      try {
        if (isNew) {
          createNewDoc();
        } else if (initialDoc) {
          setCurrentDoc({
            id: initialDoc.id,
            title: initialDoc.title,
            content: initialDoc.content,
            isFavorite: initialDoc.isFavorite,
            status: initialDoc.status,
            createdAt: new Date(initialDoc.createdAt),
            updatedAt: new Date(initialDoc.updatedAt),
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
  }, [isNew, initialDoc, createNewDoc, setCurrentDoc, setIsLoading]);

  const handleSave = useCallback(async () => {
    if (!currentDoc || !isModified) return;

    setIsSaving(true);
    try {
      if (typeof currentDoc.id === "string" && currentDoc.id.startsWith("temp-")) {
        const newDoc = await createDocumentAction({
          title: currentDoc.title,
          content,
        });
        setCurrentDoc({
          ...currentDoc,
          id: newDoc.id,
        });
        window.history.replaceState(null, "", `/editor/${newDoc.id}`);
        toast.success("Document created successfully");
      } else {
        await updateDocumentAction(currentDoc.id, {
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
  }, [currentDoc, isModified, content, setIsSaving, setCurrentDoc, markAsSaved]);

  // Auto-save hook
  const triggerAutoSave = useAutoSave({
    onSave: async () => {
        // Re-implement simplified save logic for auto-save to avoid toast spam if desired,
        // or just reuse handleSave logic but without toasts?
        // Original code had specific auto-save logic.
        if (!currentDoc || !isModified) return;

        setIsSaving(true);
        try {
            if (typeof currentDoc.id === "string" && currentDoc.id.startsWith("temp-")) {
            // Create new document on first save
            const newDoc = await createDocumentAction({
                title: currentDoc.title,
                content,
            });
            setCurrentDoc({
                ...currentDoc,
                id: newDoc.id,
            });
            // Update URL without full reload
            window.history.replaceState(null, "", `/editor/${newDoc.id}`);
            } else {
            // Update existing document
            await updateDocumentAction(currentDoc.id, {
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
    enabled: isModified && currentDoc !== null && isAutoSaveEnabled,
  });

  // Trigger auto-save when content changes
  useEffect(() => {
    triggerAutoSave();
  }, [content, triggerAutoSave]);

  const handleFormat = useCallback(() => {
    const formatted = formatMarkdown(content);
    setContent(formatted);
  }, [content, setContent]);

  const handleMagicFormat = useCallback(async () => {
    if (!content.trim()) return;

    setIsFormatting(true);
    try {
      const refined = await aiService.refine(content);
      setContent(refined);
      toast.success("Document formatted with AI!");
    } catch (error) {
      console.error("Magic format failed:", error);
      toast.error("Failed to format document");
    } finally {
      setIsFormatting(false);
    }
  }, [content, setContent]);

  const handleExport = useCallback(async () => {
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
  }, [currentDoc]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(content);
    toast.success("Content copied to clipboard"); 
  }, [content]);

  return {
    state: {
        content,
        currentDoc,
        isModified,
        isSaving,
        isAutoSaveEnabled,
        showPreview,
        isFormatting,
    },
    actions: {
        setContent,
        setTitle,
        setShowPreview,
        toggleAutoSave,
        handleSave,
        handleFormat,
        handleMagicFormat,
        handleExport,
        handleCopy,
    }
  };
};
