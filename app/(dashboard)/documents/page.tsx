"use client";

import { useEffect, useState } from "react";
import { Document, listDocuments, updateDocument, deleteDocument, createDocument } from "@/services/docService";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { Plus, Search, Filter, Loader2, FileText, Trash2, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
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

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadDocs();
  }, []);

  async function loadDocs() {
    try {
      const data = await listDocuments();
      setDocs(data);
    } catch (error) {
      console.error("Failed to load documents", error);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    try {
      setCreating(true);
      const newDoc = await createDocument({ title: "Untitled Document", content: "" });
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
      await deleteDocument(deleteId);
      setDocs(docs.filter(d => d.id !== deleteId));
      toast.success("Document deleted");
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
      const updated = await updateDocument(id, { isFavorite: !doc.isFavorite });
      setDocs(docs.map(d => d.id === id ? updated : d));
    } catch (error) {
      toast.error("Failed to update favorite status");
    }
  }

  const filteredDocs = docs.filter(doc => 
    doc.title.toLowerCase().includes(search.toLowerCase()) ||
    doc.content?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Documents
          </h1>
          <p className="text-muted-foreground mt-1">Manage and organize your knowledge base.</p>
        </div>
        <Button 
            onClick={handleCreate} 
            disabled={creating}
            className="cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="mr-2 h-4 w-4" />}
            <span className="font-semibold">New Document</span>
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4 bg-white/50 dark:bg-neutral-900/50 p-4 rounded-2xl border border-white/10 backdrop-blur-md shadow-sm">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
                type="text" 
                placeholder="Search documents..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 pl-10 text-sm placeholder:text-muted-foreground"
            />
        </div>
        <div className="h-6 w-px bg-border" />
        <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Filter className="w-4 h-4 mr-2" />
            Filter
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-48 rounded-xl bg-muted/50 animate-pulse" />
            ))}
        </div>
      ) : filteredDocs.length === 0 ? (
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
    </div>
  );
}
