"use client";

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Document } from "@/services/docService";
import { Toolbar, EditorHeader } from "@/components/editor";
import { useEditorController } from "@/hooks/useEditorController";

const PreviewPane = dynamic(
  () => import('@/components/editor/PreviewPane').then((mod) => mod.PreviewPane),
  {
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-white/30 dark:bg-black/30">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    ),
    ssr: false,
  }
);

const MarkdownEditor = dynamic(
  () => import('@/components/editor/MarkdownEditor').then((mod) => mod.MarkdownEditor),
  {
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 font-medium text-muted-foreground">Loading Editor...</span>
      </div>
    ),
    ssr: false,
  }
);

interface EditorViewProps {
  initialDoc?: Document; // Optional, null if new
  isNew?: boolean;
}

export default function EditorView({ initialDoc, isNew }: EditorViewProps) {
  const { state, actions } = useEditorController({ initialDoc, isNew });

  const {
    content,
    currentDoc,
    isModified,
    isSaving,
    isAutoSaveEnabled,
    showPreview,
    isFormatting,
  } = state;

  const {
      setContent,
      setTitle,
      setShowPreview,
      toggleAutoSave,
      handleSave,
      handleFormat,
      handleMagicFormat,
      handleExport,
      handleCopy,
  } = actions;

  return (
    <div className="flex h-screen flex-col bg-background/50 backdrop-blur-3xl">
      <EditorHeader
        title={currentDoc?.title || "Untitled"}
        onTitleChange={setTitle}
        isSaving={isSaving}
        isModified={isModified}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview(!showPreview)}
      />

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
            isAutoSaveEnabled={isAutoSaveEnabled}
            onToggleAutoSave={toggleAutoSave}
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
