"use client";

import { useEffect, useRef } from "react";
import Editor, { OnMount, OnChange } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  className = "",
}: MarkdownEditorProps) {
  const { theme, resolvedTheme } = useTheme();
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  // Determine Monaco theme based on app theme
  const monacoTheme = resolvedTheme === "dark" ? "vs-dark" : "vs";

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    // Focus editor on mount
    editor.focus();
  };

  const handleEditorChange: OnChange = (value) => {
    onChange(value ?? "");
  };

  // Update Monaco theme when app theme changes
  useEffect(() => {
    if (editorRef.current) {
      // Monaco will automatically update with the new theme prop
    }
  }, [theme]);

  return (
    <div className={`h-full w-full ${className}`}>
      <Editor
        height="100%"
        defaultLanguage="markdown"
        value={value}
        theme={monacoTheme}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "var(--font-mono), JetBrains Mono, monospace",
          lineNumbers: "on",
          wordWrap: "on",
          wrappingStrategy: "advanced",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          padding: { top: 16, bottom: 16 },
          renderLineHighlight: "line",
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          folding: true,
          foldingStrategy: "indentation",
          links: true,
          contextmenu: true,
          quickSuggestions: false,
          suggestOnTriggerCharacters: false,
          acceptSuggestionOnEnter: "off",
          accessibilitySupport: "auto",
          bracketPairColorization: {
            enabled: true,
          },
        }}
      />
    </div>
  );
}
