import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { Project } from "@/services/projectService";
import { toast } from "react-hot-toast";

interface ProjectSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  onUpdate: (data: Partial<Project>) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function ProjectSettingsDialog({ 
  open, 
  onOpenChange, 
  project, 
  onUpdate, 
  onDelete 
}: ProjectSettingsDialogProps) {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description || "");
  const [status, setStatus] = useState(project.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(project.title);
      setDescription(project.description || "");
      setStatus(project.status);
      setConfirmDelete(false);
    }
  }, [open, project]);

  const handleUpdate = async () => {
    if (!title.trim()) return;
    setIsUpdating(true);
    try {
      await onUpdate({ title, description, status });
      onOpenChange(false);
      toast.success("Project updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update project");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      // Dialog will close due to parent unmounting or navigation
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete project");
      setIsDeleting(false);
    }
  };

  if (confirmDelete) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Delete Project?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{project.title}</strong>? This action cannot be undone and will delete all columns and tasks within this project.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setConfirmDelete(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Project Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:outline-none text-foreground dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:outline-none resize-none text-foreground dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:outline-none text-foreground dark:text-white"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          <div className="pt-4 border-t border-border flex justify-between items-center">
            <Button 
              type="button" 
              variant="outline"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
              onClick={() => setConfirmDelete(true)}
            >
              Delete Project
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={handleUpdate} disabled={isUpdating}>
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
