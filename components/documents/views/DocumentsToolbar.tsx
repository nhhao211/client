"use client";

import { Check, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface DocumentsToolbarProps {
  viewMode: "files" | "folders";
  setViewMode: (mode: "files" | "folders") => void;
  handleSelectAll: () => void;
  isAllSelected: boolean;
  search: string;
  setSearch: (value: string) => void;
}

export function DocumentsToolbar({
  viewMode,
  setViewMode,
  handleSelectAll,
  isAllSelected,
  search,
  setSearch
}: DocumentsToolbarProps) {
  return (
    <div className="clay-card !rounded-[2rem] p-4 flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-card">
      <Tabs 
        value={viewMode} 
        onValueChange={(v: string) => setViewMode(v as "files" | "folders")} 
        className="w-full sm:w-auto"
      >
        <TabsList className="grid w-full grid-cols-2 rounded-xl h-12 p-1">
          <TabsTrigger value="folders" className="rounded-[10px] text-base font-medium">Folders</TabsTrigger>
          <TabsTrigger value="files" className="rounded-[10px] text-base font-medium">All Files</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="h-8 w-px bg-border hidden sm:block" />
      
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleSelectAll}
        className={cn(
          "h-12 w-12 rounded-xl transition-all border-2 ml-1",
          isAllSelected 
            ? "bg-primary border-primary text-white hover:bg-primary/90 hover:text-white" 
            : "border-muted-foreground/20 hover:border-primary/50 text-muted-foreground bg-transparent"
        )}
        title={isAllSelected ? "Deselect All" : "Select All"}
      >
        {isAllSelected ? (
          <Check className="w-6 h-6 stroke-[3]" />
        ) : (
          <div className="w-4 h-4 rounded-sm border-2 border-current opacity-50" />
        )}
      </Button>
      
      <div className="relative flex-1 w-full sm:w-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
        <input 
          type="text" 
          placeholder="Search documents or folders..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary/20 rounded-full py-4 pl-12 text-base font-medium placeholder:text-muted-foreground transition-all"
        />
      </div>
    </div>
  );
}
