"use client";

import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@/services/projectService";

interface BoardHeaderProps {
  project: Project;
  onOpenSettings: () => void;
}

export function BoardHeader({ project, onOpenSettings }: BoardHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-background/50 backdrop-blur-xl shrink-0">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="cursor-pointer">
          <Link href="/projects">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold">{project.title}</h1>
          {project.description && (
            <p className="text-sm text-muted-foreground">{project.description}</p>
          )}
        </div>
      </div>
      <Button variant="ghost" size="icon" className="cursor-pointer" onClick={onOpenSettings}>
        <Settings className="h-5 w-5" />
      </Button>
    </header>
  );
}
