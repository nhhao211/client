"use client";

import { FileText, ArrowLeft, Trash2, Folder, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Feature } from "@/hooks/useDocumentsManager";

interface DocumentsHeaderProps {
  activeFeature: Feature | null;
  setActiveFeature: (feature: Feature | null) => void;
  selectedIds: number[];
  setShowBulkDeleteConfirm: (show: boolean) => void;
  viewMode: "files" | "folders";
  setShowCreateFeature: (show: boolean) => void;
  handleCreateDoc: () => void;
  creating: boolean;
}

export function DocumentsHeader({
  activeFeature,
  setActiveFeature,
  selectedIds,
  setShowBulkDeleteConfirm,
  viewMode,
  setShowCreateFeature,
  handleCreateDoc,
  creating
}: DocumentsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-primary/10 rounded-full">
            {activeFeature ? (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setActiveFeature(null)} 
                className="h-8 w-8"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
            ) : (
              <FileText className="w-8 h-8 text-primary" />
            )}
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            {activeFeature ? activeFeature.title : "Documents"}
          </h1>
        </div>
        <p className="text-muted-foreground ml-1 text-lg font-medium">
          {activeFeature 
            ? activeFeature.description || "Manage documents in this feature" 
            : "Manage and organize your knowledge base."}
        </p>
      </div>
      
      <div className="flex gap-3">
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Button 
                variant="destructive"
                onClick={() => setShowBulkDeleteConfirm(true)} 
                className="clay-button bg-red-500 hover:bg-red-600 px-6 py-6 rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
              >
                <Trash2 className="mr-2 h-5 w-5" />
                <span>Delete ({selectedIds.length})</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {viewMode === "folders" && !activeFeature && (
          <Button 
            onClick={() => setShowCreateFeature(true)} 
            className="clay-button bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-6 rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
          >
            <Folder className="mr-2 h-5 w-5" />
            New Folder
          </Button>
        )}

        <Button 
          onClick={handleCreateDoc} 
          disabled={creating}
          className="clay-button bg-primary text-white hover:bg-primary/90 px-8 py-6 rounded-full font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {creating ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <Plus className="mr-2 h-5 w-5" />
          )}
          <span className="font-bold text-lg">New Document</span>
        </Button>
      </div>
    </div>
  );
}
