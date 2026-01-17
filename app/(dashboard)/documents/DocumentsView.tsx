"use client";

import { useState } from "react";
import { Document } from "@/services/docService";
import { createDocumentAction, updateDocumentAction, deleteDocumentAction, bulkDeleteDocumentsAction } from "@/app/serverActions";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { Plus, Search, Filter, Loader2, FileText, Trash2, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

interface DocumentsViewProps {
  initialDocs: Document[];
}

export default function DocumentsView({ initialDocs }: DocumentsViewProps) {
  const [docs, setDocs] = useState<Document[]>(initialDocs);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const router = useRouter();

  async function handleCreate() {
    try {
      setCreating(true);
      const newDoc = await createDocumentAction({ title: "Untitled Document", content: "" });
      router.push(`/editor/${newDoc.id}`);
    } catch (error) {
      toast.error("Failed to create document");
      setCreating(false);
    }
  }

  function handleDelete(id: number) {
    setDeleteId(id);
  }

  async function handleConfirmDelete() {
    if (deleteId === null) return;
    
    try {
      setIsDeleting(true);
      await deleteDocumentAction(deleteId);
      setDocs(docs.filter(d => d.id !== deleteId));
      if (selectedIds.includes(deleteId)) {
          setSelectedIds(selectedIds.filter(id => id !== deleteId));
      }
      toast.success("Document deleted");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete document");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  }

  async function handleToggleFavorite(id: number) {
    const doc = docs.find(d => d.id === id);
    if (!doc) return;
    try {
      const updated = await updateDocumentAction(id, { isFavorite: !doc.isFavorite });
      setDocs(docs.map(d => d.id === id ? updated : d));
    } catch (error) {
      toast.error("Failed to update favorite status");
    }
  }

  const filteredDocs = docs.filter(doc => 
    doc.title.toLowerCase().includes(search.toLowerCase()) ||
    doc.content?.toLowerCase().includes(search.toLowerCase())
  );

  function handleSelect(id: number) {
      if (selectedIds.includes(id)) {
          setSelectedIds(selectedIds.filter(i => i !== id));
      } else {
          setSelectedIds([...selectedIds, id]);
      }
  }

  function handleSelectAll() {
      if (selectedIds.length === filteredDocs.length && filteredDocs.length > 0) {
          setSelectedIds([]);
      } else {
          setSelectedIds(filteredDocs.map(d => d.id));
      }
  }

  async function handleBulkDelete() {
      if (selectedIds.length === 0) return;
      try {
          setIsDeleting(true);
          await bulkDeleteDocumentsAction(selectedIds);
          setDocs(docs.filter(d => !selectedIds.includes(d.id)));
          setSelectedIds([]);
          toast.success("Documents deleted");
          router.refresh();
      } catch (error) {
          toast.error("Failed to delete selected documents");
      } finally {
          setIsDeleting(false);
          setShowBulkDeleteConfirm(false);
      }
  }

  const isAllSelected = filteredDocs.length > 0 && selectedIds.length === filteredDocs.length;
  const isSelectionMode = selectedIds.length > 0;

  return (
    <>
      <AnimatedBackground />
      <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
        {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-primary/10 rounded-full">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">
              Documents
            </h1>
          </div>
          <p className="text-muted-foreground ml-1 text-lg font-medium">Manage and organize your knowledge base.</p>
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
            
            <Button 
                onClick={handleCreate} 
                disabled={creating}
                className="clay-button bg-primary text-white hover:bg-primary/90 px-8 py-6 rounded-full font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {creating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Plus className="mr-2 h-5 w-5" />}
                <span className="font-bold text-lg">New Document</span>
            </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="clay-card !rounded-[2rem] p-4 flex items-center gap-4 bg-white dark:bg-card">
         <Button 
            variant="ghost" 
            size="icon"
            onClick={handleSelectAll}
            className={cn(
                "h-12 w-12 rounded-xl transition-all border-2 ml-1",
                isAllSelected 
                ? "bg-primary border-primary text-white hover:bg-primary/90 hover:text-white" 
                : "border-muted-foreground/20 hover:border-primary/50 text-muted-foreground bg-transparent"
            )}
            title={isAllSelected ? "Deselect All" : "Select All"}
        >
             {isAllSelected ? <Check className="w-6 h-6 stroke-[3]" /> : <div className="w-4 h-4 rounded-sm border-2 border-current opacity-50" />}
        </Button>
        
        <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <input 
                type="text" 
                placeholder="Search documents..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary/20 rounded-full py-4 pl-12 text-base font-medium placeholder:text-muted-foreground transition-all"
            />
        </div>
        <div className="h-8 w-px bg-border hidden sm:block" />
        <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full px-6 font-bold hidden sm:flex">
            <Filter className="w-5 h-5 mr-2" />
            Filter
        </Button>
      </div>

      {/* Grid */}
      {filteredDocs.length === 0 ? (
        <div className="text-center py-20">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No documents found</h3>
            <p className="text-muted-foreground">Get started by creating your first document.</p>
        </div>
      ) : (
        <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
            {filteredDocs.map(doc => (
                <motion.div key={doc.id} variants={item}>
                    <DocumentCard 
                        doc={doc} 
                        onDelete={handleDelete}
                        onToggleFavorite={handleToggleFavorite}
                        selected={selectedIds.includes(doc.id)}
                        onSelect={handleSelect}
                        selectionMode={isSelectionMode}
                    />
                </motion.div>
            ))}
        </motion.div>
      )}

      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showBulkDeleteConfirm} onOpenChange={(open) => !open && setShowBulkDeleteConfirm(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedIds.length} documents?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete these {selectedIds.length} documents? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkDeleteConfirm(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Delete All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
}
