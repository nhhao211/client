"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { createProjectAction } from "@/app/serverActions";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import type { Project } from "@/services/projectService";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated: (project: Project) => void;
}

export function CreateProjectDialog({ open, onOpenChange, onProjectCreated }: CreateProjectDialogProps) {
  const router = useRouter();
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProject = async () => {
    if (!newProjectTitle.trim()) {
      toast.error("Please enter a project title");
      return;
    }
    
    setIsCreating(true);
    try {
      const newProject = await createProjectAction({
        title: newProjectTitle,
        description: newProjectDescription,
      });
      onProjectCreated(newProject);
      setNewProjectTitle("");
      setNewProjectDescription("");
      onOpenChange(false);
      toast.success("Project created!");
      router.push(`/projects/${newProject.id}`);
    } catch (error: any) {
      console.error("Failed to create project:", error);
      toast.error("Failed to create project");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button 
          className="clay-button bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="mr-2 h-5 w-5" />
          <span className="font-bold text-lg">New Project</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md !rounded-[2rem] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-center">Create New Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-bold ml-1 text-muted-foreground">Project Title</label>
            <input
              id="title"
              type="text"
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              placeholder="e.g., Website Redesign"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-gray-900 rounded-xl focus:outline-none transition-all font-medium text-foreground dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-bold ml-1 text-muted-foreground">Description (optional)</label>
            <textarea
              id="description"
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
              placeholder="Brief description of the project"
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-gray-900 rounded-xl focus:outline-none resize-none transition-all font-medium text-foreground dark:text-white"
            />
          </div>
          <Button 
            onClick={handleCreateProject} 
            disabled={isCreating}
            className="w-full clay-button py-6 text-lg font-bold"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
