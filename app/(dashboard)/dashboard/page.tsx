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
    { 
      label: "Total Documents", 
      value: documents.length.toString(), 
      icon: FileText, 
      color: "text-sky-500 dark:text-sky-400", 
      valueColor: "text-sky-600 dark:text-sky-300",
      bg: "bg-sky-500/15", 
      border: "border-sky-500/30", 
      glow: "from-sky-500/20",
      cardBg: "bg-gradient-to-br from-sky-50/95 to-sky-100/70 dark:from-sky-950/50 dark:to-sky-900/40",
      cardBorder: "border-sky-200/90 dark:border-sky-500/50"
    },
    { 
      label: "Favorites", 
      value: favoriteCount.toString(), 
      icon: Star, 
      color: "text-orange-500 dark:text-orange-400", 
      valueColor: "text-orange-600 dark:text-orange-300",
      bg: "bg-orange-500/15", 
      border: "border-orange-500/30", 
      glow: "from-orange-500/20",
      cardBg: "bg-gradient-to-br from-orange-50/95 to-orange-100/70 dark:from-orange-950/50 dark:to-orange-900/40",
      cardBorder: "border-orange-200/90 dark:border-orange-500/50"
    },
    { 
      label: "Drafts", 
      value: draftCount.toString(), 
      icon: TrendingUp, 
      color: "text-emerald-500 dark:text-emerald-400", 
      valueColor: "text-emerald-600 dark:text-emerald-300",
      bg: "bg-emerald-500/15", 
      border: "border-emerald-500/30", 
      glow: "from-emerald-500/20",
      cardBg: "bg-gradient-to-br from-emerald-50/95 to-emerald-100/70 dark:from-emerald-950/50 dark:to-emerald-900/40",
      cardBorder: "border-emerald-200/90 dark:border-emerald-500/50"
    },
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
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
              Welcome back to your workspace.
            </p>
          </div>
          <Button 
              asChild
              className="clay-button bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-4 rounded-full font-bold shadow-xl transition-all hover:scale-105"
          >
            <Link href="/editor/new">
              <Plus className="mr-2 h-5 w-5" />
              <span className="font-bold">New Document</span>
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
              <GlassCard className="lg:col-span-1 p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 !rounded-[2rem]">
                  <div className="flex items-center justify-between relative z-10">
                      <div>
                          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                          <p className={`text-5xl font-black tracking-tight ${stat.valueColor} drop-shadow-sm`}>{stat.value}</p>
                      </div>
                      <div className={`flex h-16 w-16 items-center justify-center rounded-full ${stat.bg} shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                          <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                  </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

      {/* Error State */}
      {error && (
        <GlassCard className="border-red-200 bg-red-50 !rounded-[2rem]">
            <div className="flex items-center gap-4 text-red-600">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Oops! Something went wrong</h3>
                    <p className="font-medium opacity-90">{error}</p>
                </div>
            </div>
        </GlassCard>
      )}

      {/* Recent Documents Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black flex items-center gap-3 text-foreground">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                Recent Activity
            </h3>
            {documents.length > 0 && (
                <Link
                href="/documents"
                className="group flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors duration-200 cursor-pointer bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md"
                >
                View all
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
            )}
        </div>

        {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-48 rounded-[2rem] bg-indigo-50/50 animate-pulse" />
                ))}
            </div>
        ) : documents.length === 0 ? (
            <GlassCard className="flex flex-col items-center justify-center p-16 text-center border-dashed border-4 border-muted !rounded-[3rem] bg-white/50">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <FileText className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-black mb-3 text-foreground">No documents yet</h3>
                <p className="text-muted-foreground mb-8 max-w-md text-lg font-medium">
                    Your workspace is looking a bit empty. Create your first document to get started!
                </p>
                <Button asChild className="clay-button bg-primary text-white px-8 py-6 rounded-full font-bold shadow-lg hover:shadow-xl transition-all">
                    <Link href="/editor/new">
                        <Plus className="mr-2 h-5 w-5" />
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
