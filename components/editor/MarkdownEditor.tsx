"use client";

import { useEffect, useRef, useState } from "react";
import Editor, { OnMount, OnChange } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";
import { toast } from "@/lib/toast";
import dynamic from "next/dynamic";

// Lazy load modals/menus - only loaded on interaction
const SlashCommandMenu = dynamic(() => import("./SlashCommandMenu"), { ssr: false });
const AiDiagramDialog = dynamic(() => import("./AiDiagramDialog").then(mod => mod.AiDiagramDialog), { ssr: false });

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
  const monacoRef = useRef<any>(null); // To access monaco instance
  const [slashMenuPosition, setSlashMenuPosition] = useState<{
    top: number;
    left: number;
    placement: "top" | "bottom";
    height: number;
  } | null>(null);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [savedCursorPos, setSavedCursorPos] = useState<any>(null);

  // Determine Monaco theme based on app theme
  const monacoTheme = resolvedTheme === "dark" ? "vs-dark" : "vs";

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    // Focus editor on mount
    editor.focus();

    // Add keydown listener to close menu on Escape or space (if menu open)
    editor.onKeyDown((e: any) => {
      if (e.code === "Escape") {
        setSlashMenuPosition(null);
      }
    });

    // Detect cursor position change to close menu if moved away from '/'
    editor.onDidChangeCursorPosition((e: any) => {
       // Optional: Add logic here if you want stricter control
    });
  };

  const handleEditorChange: OnChange = (value, event) => {
    onChange(value ?? "");

    // Check if the last typed character is '/'
    if (event.changes.length > 0) {
      const change = event.changes[0];
      if (change.text === "/") {
        const position = editorRef.current?.getPosition();
        if (position) {
          const scrolledPos = editorRef.current?.getScrolledVisiblePosition(position);
          if (scrolledPos) {
            // Adjust position based on editor container
            const editorDom = editorRef.current?.getDomNode();
            const rect = editorDom?.getBoundingClientRect();
            const layoutInfo = editorRef.current?.getLayoutInfo();
            
            if (rect && layoutInfo) {
              const editorHeight = layoutInfo.height;
              const MENU_ESTIMATED_HEIGHT = 320;
              // Check if there is enough space below
              const spaceBelow = editorHeight - scrolledPos.top;
              const placement = spaceBelow < MENU_ESTIMATED_HEIGHT ? "top" : "bottom";

               setSlashMenuPosition({
                top: scrolledPos.top,
                left: scrolledPos.left + 20, // Offset a bit right
                placement,
                height: editorHeight
              });
            }
          }
        }
      } else {
        // If user continues typing, close menu (basic behavior, can be improved to filter)
        // For now, we close it to keep it simple unless we implement filtering
        if(slashMenuPosition) {
            setSlashMenuPosition(null);
        }
      }
    }
  };

  const handleSlashSelect = (item: string) => {
    if (!editorRef.current || !monacoRef.current) return;

    const position = editorRef.current.getPosition();
    if (!position) return;

    // Save cursor position for AI dialog insertion
    if (item === "ai-diagram") {
        // We first remove the slash
        const range = new monacoRef.current.Range(
            position.lineNumber,
            position.column - 1,
            position.lineNumber,
            position.column
        );
        editorRef.current.executeEdits("slash-command", [
            { range: range, text: "", forceMoveMarkers: true },
        ]);
        
        setSavedCursorPos(editorRef.current.getPosition());
        setSlashMenuPosition(null);
        setAiDialogOpen(true);
        return;
    }

    // Remove the '/' character and insert template
    const range = new monacoRef.current.Range(
      position.lineNumber,
      position.column - 1,
      position.lineNumber,
      position.column
    );

    let insertText = "";
    
    switch (item) {
      case "h1":
        insertText = "# ";
        break;
      case "h2":
        insertText = "## ";
        break;
      case "h3":
        insertText = "### ";
        break;
      case "ul":
        insertText = "- ";
        break;
      case "todo":
        insertText = "- [ ] ";
        break;
      case "code":
        insertText = "```\n\n```";
        break;
      case "mermaid-flow":
        insertText = "```mermaid\ngraph TD\n    A[Start] --> B{Is it working?}\n    B -- Yes --> C[Great!]\n    B -- No --> D[Debug]\n```";
        break;
      case "mermaid-sequence":
        insertText = "```mermaid\nsequenceDiagram\n    Alice->>John: Hello John, how are you?\n    John-->>Alice: Great!\n```";
        break;
      case "mermaid-gantt":
        insertText = "```mermaid\ngantt\n    title A Gantt Diagram\n    dateFormat  YYYY-MM-DD\n    section Section\n    A task           :a1, 2014-01-01, 30d\n    Another task     :after a1  , 20d\n```";
        break;
      default:
        insertText = "";
    }

    editorRef.current.executeEdits("slash-command", [
      {
        range: range,
        text: insertText,
        forceMoveMarkers: true
      },
    ]);

    // Move cursor to appropriate position (e.g. inside code block)
    if (item === "code" || item.startsWith("mermaid")) {
         // Logic to move cursor inside block could be added here
         // For now, it stays at the end of inserted text
    }

    setSlashMenuPosition(null);
    editorRef.current.focus();
  };

  const handleAiInsert = (code: string) => {
    if (!editorRef.current || !monacoRef.current || !savedCursorPos) return;

    editorRef.current.executeEdits("ai-insert", [
      {
        range: new monacoRef.current.Range(
            savedCursorPos.lineNumber,
            savedCursorPos.column,
            savedCursorPos.lineNumber,
            savedCursorPos.column
        ),
        text: code,
        forceMoveMarkers: true
      },
    ]);
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
      {slashMenuPosition && (
        <SlashCommandMenu
          position={slashMenuPosition}
          placement={slashMenuPosition.placement}
          parentHeight={slashMenuPosition.height}
          onSelect={handleSlashSelect}
          onClose={() => setSlashMenuPosition(null)}
        />
      )}
      
      <AiDiagramDialog
        open={aiDialogOpen}
        onOpenChange={setAiDialogOpen}
        onInsert={handleAiInsert}
      />
    </div>
  );
}
