"use client";

import { Document } from "@/services/docService";
import { GlassCard } from "@/components/ui/glass-card";
import { FileText, MoreVertical, Calendar, Clock, Star } from "lucide-react";
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
        <GlassCard className="h-full flex flex-col justify-between group cursor-pointer hover:border-blue-500/40 dark:hover:border-blue-400/40 transition-all duration-300">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  doc.isFavorite 
                      ? "bg-amber-500/10 text-amber-500" 
                      : "bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20"
              )}>
                {doc.isFavorite ? <Star className="w-6 h-6 fill-current" /> : <FileText className="w-6 h-6" />}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-blue-500/10 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 backdrop-blur-xl bg-white/90 dark:bg-slate-950/90 border-blue-500/15">
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-blue-500/10 focus:bg-blue-500/10 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite?.(doc.id);
                  }}>
                    {doc.isFavorite ? "Unfavorite" : "Favorite"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-blue-500/10" />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10 transition-colors" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(doc.id);
                  }}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg text-foreground line-clamp-1 mb-2 group-hover:text-blue-500 transition-colors">
                {doc.title || "Untitled Document"}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3 h-[4.5em]">
                {doc.content 
                  ? doc.content.replace(/[#*`]/g, '').substring(0, 100) 
                  : "No content preview available..."}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-blue-500/10 dark:border-blue-400/10 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
              </div>
               <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(doc.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
          </div>
        </GlassCard>
      </Link>
    </DocumentPreviewTooltip>
  );
}
