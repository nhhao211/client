"use client";

import Link from "next/link";
import { FileText, Plus, Clock, Star, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import { Header } from "@/components/common";
import { Button } from "@/components/ui/button";
import * as docService from "@/services/docService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Document {
  id: number;
  title: string;
  content: string;
  status: "draft" | "archived";
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Create new document
  const handleCreateDocument = async () => {
    try {
      const newDoc = await docService.createDocument({
        title: "Untitled Document",
        content: "",
      });
      router.push(`/editor/${newDoc.id}`);
    } catch (err: any) {
      console.error("Failed to create document:", err);
      setError("Failed to create new document");
    }
  };

  // Format date to relative time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const recentDocuments = documents.slice(0, 3);
  const favoriteCount = documents.filter((doc) => doc.isFavorite).length;
  const stats = [
    { label: "Total Documents", value: documents.length.toString(), icon: FileText },
    { label: "Favorites", value: favoriteCount.toString(), icon: Star },
    { label: "Drafts", value: documents.filter((doc) => doc.status === "draft").length.toString(), icon: TrendingUp },
  ];

  return (
    <>
      <Header title="Dashboard" />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold font-heading tracking-tight">
              Welcome back!
            </h2>
            <p className="text-muted-foreground">
              Create, edit, and manage your Markdown documents with AI-powered
              formatting.
            </p>
          </div>
          <Button asChild className="cursor-pointer w-full sm:w-auto">
            <Link href="/editor/new">
              <Plus className="mr-2 h-4 w-4" />
              New Document
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-6 transition-colors duration-200 hover:bg-accent/50 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-heading">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <h3 className="font-semibold text-destructive">Error</h3>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading documents...</span>
          </div>
        ) : (
          <>
            {/* Recent Documents */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold font-heading flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  Recent Documents
                </h3>
                {documents.length > 3 && (
                  <Link
                    href="/dashboard/documents"
                    className="text-sm text-primary hover:underline cursor-pointer"
                  >
                    View all ({documents.length})
                  </Link>
                )}
              </div>

              {documents.length === 0 ? (
                // Empty State
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first document to get started
                  </p>
                  <Button onClick={handleCreateDocument} className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Document
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {recentDocuments.map((doc) => (
                    <Link
                      key={doc.id}
                      href={`/editor/${doc.id}`}
                      className="group relative rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/50 hover:shadow-lg cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted shrink-0">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium group-hover:text-primary transition-colors duration-200 truncate">
                              {doc.title || "Untitled"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(doc.updatedAt)}
                            </p>
                          </div>
                        </div>
                        {doc.isFavorite && (
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 shrink-0" />
                        )}
                      </div>
                    </Link>
                  ))}

                  {/* Create New Card */}
                  <button
                    onClick={handleCreateDocument}
                    className="flex min-h-30 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-5 text-muted-foreground transition-colors duration-200 hover:border-primary hover:text-primary hover:bg-accent/50"
                  >
                    <Plus className="h-8 w-8" />
                    <span className="text-sm font-medium">Create New</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
