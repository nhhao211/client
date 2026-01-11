"use client";

import { useEffect, useRef } from "react";
import Editor, { OnMount, OnChange } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";
import { toast } from "@/lib/toast";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  onImageUpload?: (url: string) => void;
}

export function MarkdownEditor({
  value,
  onChange,
  className = "",
  onImageUpload,
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

  // Handle image paste
  const handlePaste = async (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        event.preventDefault();
        const file = items[i].getAsFile();
        if (file && onImageUpload) {
          try {
            // Create a temporary URL for the image
            const tempUrl = URL.createObjectURL(file);
            
            // Insert markdown image syntax at cursor position
            if (editorRef.current) {
              const position = editorRef.current.getPosition();
              if (position) {
                const markdownImage = `![image](${tempUrl})`;
                editorRef.current.executeEdits("", [
                  {
                    range: new (require("@monaco-editor/react")).Monaco.Range(
                      position.lineNumber,
                      position.column,
                      position.lineNumber,
                      position.column
                    ),
                    text: markdownImage,
                  },
                ]);
              }
            }

            toast.info("Image pasted. Uploading to storage...");
            
            // Here you would upload to Firebase Storage
            // For now, we'll just use the temporary URL
            if (onImageUpload) {
              onImageUpload(tempUrl);
            }
          } catch (error) {
            toast.error("Failed to paste image");
            console.error("Image paste error:", error);
          }
        }
      }
    }
  };

  // Update Monaco theme when app theme changes
  useEffect(() => {
    if (editorRef.current) {
      // Monaco will automatically update with the new theme prop
    }
  }, [theme]);

  // Add paste event listener
  useEffect(() => {
    const editorContainer = document.querySelector(
      "[data-testid='monaco-editor']"
    ) as HTMLElement | null;

    if (editorContainer) {
      editorContainer.addEventListener("paste", handlePaste as any);
      return () => {
        editorContainer.removeEventListener("paste", handlePaste as any);
      };
    }
  }, []);

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
          minimap: { enabled: true, maxColumn: 120 },
          fontSize: 14,
          fontFamily: "var(--font-mono), JetBrains Mono, monospace",
          lineNumbers: "on",
          lineNumbersMinChars: 3,
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
