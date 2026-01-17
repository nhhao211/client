"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { Document } from "@/services/docService";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { Feature } from "@/hooks/useDocumentsManager";
import { container, item } from "./animations";

interface DocumentGridProps {
  docs: Document[];
  viewMode: "files" | "folders";
  activeFeature: Feature | null;
  featuresCount: number;
  search: string;
  handleDelete: (id: number) => void;
  handleToggleFavorite: (id: number) => void;
  selectedIds: number[];
  handleSelect: (id: number) => void;
  isSelectionMode: boolean;
  handleMove: (id: number) => void;
}

export function DocumentGrid({
  docs,
  viewMode,
  activeFeature,
  featuresCount,
  search,
  handleDelete,
  handleToggleFavorite,
  selectedIds,
  handleSelect,
  isSelectionMode,
  handleMove
}: DocumentGridProps) {
  const showUncategorizedHeader = viewMode === "folders" && !activeFeature && docs.length > 0;
  const noDocs = docs.length === 0;
  
  // Logic to determine if we should show "No documents found"
  const shouldShowEmptyState = noDocs && (viewMode !== "folders" || (activeFeature || featuresCount === 0));

  return (
    <div className="space-y-4">
      {showUncategorizedHeader && (
        <h3 className="text-xl font-bold text-muted-foreground flex items-center gap-2">
          <FileText className="w-5 h-5" /> Uncategorized Documents
        </h3>
      )}
      
      {shouldShowEmptyState ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No documents found</h3>
          <p className="text-muted-foreground">Get started by creating your first document.</p>
        </div>
      ) : (
        <motion.div 
          key={`${viewMode}-${activeFeature?.id || 'root'}-${search}`}
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {docs.map(doc => (
            <motion.div key={doc.id} variants={item}>
              <DocumentCard 
                doc={doc} 
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
                selected={selectedIds.includes(doc.id)}
                onSelect={handleSelect}
                selectionMode={isSelectionMode}
                onMove={handleMove}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
