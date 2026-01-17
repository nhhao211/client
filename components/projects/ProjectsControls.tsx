"use client";

import { Search, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProjectsControlsProps {
  search: string;
  onSearchChange: (value: string) => void;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

export function ProjectsControls({ search, onSearchChange, view, onViewChange }: ProjectsControlsProps) {
  return (
    <div className="clay-card !rounded-[2rem] p-4 flex items-center gap-4 bg-white dark:bg-card">
      <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          <input 
              type="text" 
              placeholder="Search projects by title..." 
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary/20 rounded-full py-4 pl-12 text-base font-medium placeholder:text-muted-foreground transition-all text-foreground dark:text-white"
          />
      </div>
      <div className="h-8 w-px bg-border" />
      <div className="flex items-center gap-2">
          <Button 
              variant={view === 'grid' ? 'secondary' : 'ghost'} 
              size="icon" 
              onClick={() => onViewChange('grid')}
              className={cn(
                "cursor-pointer rounded-full h-12 w-12 transition-all hover:scale-105", 
                view === 'grid' ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:bg-gray-100"
              )}
          >
              <LayoutGrid className="w-5 h-5" />
          </Button>
           <Button 
              variant={view === 'list' ? 'secondary' : 'ghost'} 
              size="icon" 
              onClick={() => onViewChange('list')}
              className={cn(
                "cursor-pointer rounded-full h-12 w-12 transition-all hover:scale-105", 
                view === 'list' ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:bg-gray-100"
              )}
          >
              <List className="w-5 h-5" />
          </Button>
      </div>
    </div>
  );
}
