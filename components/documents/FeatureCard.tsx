"use client";

import { Folder, MoreVertical, Edit2, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Feature {
  id: number;
  title: string;
  description?: string;
  status: string;
  _count?: {
    documents: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface FeatureCardProps {
  feature: Feature;
  onClick: () => void;
  onEdit: (feature: Feature) => void;
  onDelete: (id: number) => void;
}

export function FeatureCard({ feature, onClick, onEdit, onDelete }: FeatureCardProps) {
  return (
    <div 
      className="clay-card group relative p-5 hover:scale-[1.02] transition-all cursor-pointer bg-white dark:bg-card border-l-4 border-l-primary"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
          <Folder className="w-8 h-8 text-primary fill-primary/20" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(feature); }}>
              <Edit2 className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); onDelete(feature.id); }}
              className="text-red-500 focus:text-red-500 bg-red-50/0 focus:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-1">
        <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
          {feature.title}
        </h3>
        {feature.description && (
          <p className="text-sm text-muted-foreground line-clamp-1">{feature.description}</p>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md">
            <FileText className="w-3 h-3" />
            {feature._count?.documents || 0} docs
        </span>
        <span className="ml-auto text-[10px] opacity-70">
            {new Date(feature.updatedAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
