import { create } from "zustand";

export interface Document {
  id: string | number;
  title: string;
  content: string;
  isFavorite: boolean;
  status: "draft" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

interface DocState {
  // Current document being edited
  currentDoc: Document | null;
  
  // Editor state
  content: string;
  isModified: boolean;
  isLoading: boolean;
  isSaving: boolean;
  
  // Actions
  setCurrentDoc: (doc: Document | null) => void;
  setContent: (content: string) => void;
  setTitle: (title: string) => void;
  setIsLoading: (loading: boolean) => void;
  setIsSaving: (saving: boolean) => void;
  markAsSaved: () => void;
  resetEditor: () => void;
  
  // Create new document
  createNewDoc: () => void;

  // Auto-save
  isAutoSaveEnabled: boolean;
  toggleAutoSave: () => void;
}

const defaultContent = `# Welcome to MarkFlow AI

Start writing your Markdown here. Use the **Magic Format** button to let AI enhance your content.

## Features

- 📝 **Live Preview** - See your changes instantly
- ✨ **AI Formatting** - Auto-format with one click
- 💾 **Auto-save** - Never lose your work
- 📤 **Export** - Download as .md or .docx

## Quick Tips

\`\`\`javascript
// Code blocks are supported with syntax highlighting
const greeting = "Hello, MarkFlow!";
console.log(greeting);
\`\`\`

> Blockquotes look great too!

Happy writing! 🎉
`;

export const useDocStore = create<DocState>((set, get) => ({
  currentDoc: null,
  content: defaultContent,
  isModified: false,
  isLoading: false,
  isSaving: false,
  isAutoSaveEnabled: true,

  toggleAutoSave: () => set((state) => ({ isAutoSaveEnabled: !state.isAutoSaveEnabled })),

  setCurrentDoc: (doc) => {
    set({
      currentDoc: doc,
      content: doc?.content ?? defaultContent,
      isModified: false,
    });
  },

  setContent: (content) => {
    set({
      content,
      isModified: true,
    });
  },

  setTitle: (title) => {
    const { currentDoc } = get();
    if (currentDoc) {
      set({
        currentDoc: { ...currentDoc, title },
        isModified: true,
      });
    }
  },

  setIsLoading: (isLoading) => set({ isLoading }),
  
  setIsSaving: (isSaving) => set({ isSaving }),

  markAsSaved: () => {
    set({
      isModified: false,
      isSaving: false,
    });
  },

  resetEditor: () => {
    set({
      currentDoc: null,
      content: defaultContent,
      isModified: false,
      isLoading: false,
      isSaving: false,
      isAutoSaveEnabled: true,
    });
  },

  createNewDoc: () => {
    const newDoc: Document = {
      id: `temp-${Date.now()}`,
      title: "Untitled",
      content: defaultContent,
      isFavorite: false,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set({
      currentDoc: newDoc,
      content: newDoc.content,
      isModified: false,
    });
  },
}));
