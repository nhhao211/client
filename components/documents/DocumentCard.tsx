"use client";

import { Document } from "@/services/docService";
import { GlassCard } from "@/components/ui/glass-card";
import { FileText, MoreVertical, Calendar, Clock, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DocumentPreviewTooltip } from "@/components/documents/DocumentPreviewTooltip";

interface DocumentCardProps {
  doc: Document;
  onDelete?: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
}

export function DocumentCard({ doc, onDelete, onToggleFavorite }: DocumentCardProps) {
  return (
    <DocumentPreviewTooltip docId={doc.id} initialContent={doc.content}>
      <Link href={`/editor/${doc.id}`} passHref className="block h-full">
        <GlassCard className="h-full flex flex-col justify-between group cursor-pointer !rounded-[2.5rem] hover:scale-[1.02] transition-transform duration-300 bg-white dark:bg-card">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className={cn(
                  "p-3 rounded-full transition-colors shadow-sm",
                  doc.isFavorite 
                      ? "bg-amber-100 text-amber-500" 
                      : "bg-blue-50 text-blue-500 group-hover:bg-blue-100"
              )}>
                {doc.isFavorite ? <Star className="w-5 h-5 fill-current" /> : <FileText className="w-5 h-5" />}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-muted-foreground hover:text-white hover:bg-primary transition-all shadow-sm group-hover:shadow-md">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border-none shadow-xl rounded-2xl p-2">
                  <DropdownMenuItem 
                    className="cursor-pointer rounded-xl py-2 px-3 hover:bg-primary/10 hover:text-primary transition-colors font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite?.(doc.id);
                  }}>
                    {doc.isFavorite ? <><Star className="mr-2 w-4 h-4" /> Unfavorite</> : <><Star className="mr-2 w-4 h-4" /> Favorite</>}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50 my-1" />
                  <DropdownMenuItem 
                    className="text-red-500 focus:text-red-600 cursor-pointer rounded-xl py-2 px-3 hover:bg-red-50 focus:bg-red-50 transition-colors font-medium" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(doc.id);
                  }}>
                    <Trash2 className="mr-2 w-4 h-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div>
              <h3 className="font-bold text-xl text-foreground line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                {doc.title || "Untitled Document"}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3 h-[4.5em] font-medium leading-relaxed">
                {doc.content 
                  ? doc.content.replace(/[#*`]/g, '').substring(0, 100) 
                  : "No content preview available..."}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-dashed border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs font-bold text-muted-foreground/70">
              <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
              </div>
          </div>
        </GlassCard>
      </Link>
    </DocumentPreviewTooltip>
  );
}
