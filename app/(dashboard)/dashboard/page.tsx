"use client";

import Link from "next/link";
import { FileText, Plus, Clock, Star, TrendingUp, Loader2, AlertCircle, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import * as docService from "@/services/docService";
import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { motion } from "framer-motion";
import { Document } from "@/services/docService";
import { toast } from "react-hot-toast";
import { AnimatedBackground } from "@/components/ui/animated-background";

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

export default function DashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch documents on mount
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const docs = await docService.listDocuments();
        setDocuments(docs);
      } catch (err: any) {
        console.error("Failed to fetch documents:", err);
        setError(err.message || "Failed to load documents");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  async function handleDelete(id: number) {
    setDeleteId(id);
  }

  async function handleConfirmDelete() {
    if (deleteId === null) return;
    try {
      setIsDeleting(true);
      await docService.deleteDocument(deleteId);
      setDocuments(documents.filter(d => d.id !== deleteId));
      toast.success("Document deleted");
    } catch (error) {
      console.error("Failed to delete document", error);
      toast.error("Failed to delete document");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  }

  async function handleToggleFavorite(id: number) {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;
    try {
      const updated = await docService.updateDocument(id, { isFavorite: !doc.isFavorite });
      setDocuments(documents.map(d => d.id === id ? updated : d));
    } catch (error) {
       console.error("Failed to update favorite status", error);
       toast.error("Failed to update favorite status");
    }
  }

  const recentDocuments = documents.slice(0, 4);
  const favoriteCount = documents.filter((doc) => doc.isFavorite).length;
  const draftCount = documents.filter((doc) => doc.status === "draft").length;
  
  const stats = [
    { label: "Total Documents", value: documents.length.toString(), icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "from-blue-500/20" },
    { label: "Favorites", value: favoriteCount.toString(), icon: Star, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", glow: "from-amber-500/20" },
    { label: "Drafts", value: draftCount.toString(), icon: TrendingUp, color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/20", glow: "from-cyan-500/20" },
  ];

  return (
    <>
      {/* Animated Background */}
      <AnimatedBackground />
      
      <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-foreground bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-400 bg-clip-text text-transparent">
              Dashboard
            </h2>
            <p className="text-muted-foreground mt-2 text-lg">
              Welcome back to your workspace.
            </p>
          </div>
          <Button 
              asChild
              className="cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 transition-all font-medium border border-white/10 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
          >
            <Link href="/editor/new">
              <Plus className="mr-2 h-4 w-4" />
              <span className="font-semibold">New Document</span>
            </Link>
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={item}>
              <GlassCard className={`lg:col-span-1 p-6 relative overflow-hidden bg-gradient-to-br ${stat.glow} to-transparent backdrop-blur-xl ${stat.border} group hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl`}>
                  <div className="flex items-start justify-between relative z-10">
                      <div>
                          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-2">{stat.label}</p>
                          <p className="text-4xl font-bold tracking-tight">{stat.value}</p>
                      </div>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-inner ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                  </div>
                  {/* Decorative blob with specific color */}
                  <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-20 blur-2xl ${stat.bg.replace('/10', '')} group-hover:opacity-30 transition-opacity duration-300`} />
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

      {/* Error State */}
      {error && (
        <GlassCard className="border-red-500/20 bg-red-500/5">
            <div className="flex items-start gap-3 text-red-500">
                <AlertCircle className="h-5 w-5 mt-0.5" />
                <div>
                    <h3 className="font-semibold">Error</h3>
                    <p className="text-sm opacity-90">{error}</p>
                </div>
            </div>
        </GlassCard>
      )}

      {/* Recent Documents Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                Recent Activity
            </h3>
            {documents.length > 0 && (
                <Link
                href="/documents"
                className="group flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                View all
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
            )}
        </div>

        {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-48 rounded-xl bg-muted/50 animate-pulse" />
                ))}
            </div>
        ) : documents.length === 0 ? (
            <GlassCard className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 bg-transparent">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                    Your workspace is looking a bit empty. Create your first document to get started!
                </p>
                <Button asChild>
                    <Link href="/editor/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create First Document
                    </Link>
                </Button>
            </GlassCard>
        ) : (
            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {recentDocuments.map((doc) => (
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
      </div>

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
    </>
  );
}
