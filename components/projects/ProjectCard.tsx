"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/services/projectService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

const statusConfig = {
  active: { 
    label: "Active", 
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    icon: Clock 
  },
  completed: { 
    label: "Completed", 
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    icon: CheckCircle2 
  },
  archived: { 
    label: "Archived", 
    color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    icon: AlertCircle 
  },
};

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const status = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.active;
  const StatusIcon = status.icon;

  return (
    <div className="relative h-full group">
      <Link href={`/projects/${project.id}`} className="block h-full">
        <GlassCard className="h-full flex flex-col justify-between hover:border-primary/50 transition-all duration-300 !rounded-[2rem] hover:scale-[1.02]">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className={cn("px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5", status.color)}>
              <StatusIcon className="w-3.5 h-3.5" />
              <span>{status.label}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {project.taskCount || 0} tasks
            </div>
          </div>
          
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 bg-background/50 backdrop-blur-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(project);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(project);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            {project.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>
            )}
          </div>

          {/* Columns Preview */}
          {project.columns && project.columns.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {project.columns.map(col => (
                <div 
                  key={col.id}
                  className="text-xs px-2 py-1 bg-muted/50 rounded-md text-muted-foreground"
                >
                  {col.title}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-muted-foreground">
          <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
        </div>
        </GlassCard>
      </Link>
    </div>
  );
}
