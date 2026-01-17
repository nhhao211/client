import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, Clock, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task } from "@/services/projectService";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Task;
  title?: string;
}

const priorityColors = {
  low: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  medium: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
};

export function TaskDialog({ open, onOpenChange, onSubmit, initialData, title = "Task Details" }: TaskDialogProps) {
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [dueDate, setDueDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [estimatedTime, setEstimatedTime] = useState<number | undefined>(undefined);
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setTaskTitle(initialData.title);
        setDescription(initialData.description || "");
        setPriority(initialData.priority);
        setDueDate(initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : "");
        setStartDate(initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : "");
        setEstimatedTime(initialData.estimatedTime);
        setTags(initialData.tags ? (typeof initialData.tags === 'string' ? JSON.parse(initialData.tags) : initialData.tags).join(", ") : "");
      } else {
        // Reset for new task
        setTaskTitle("");
        setDescription("");
        setPriority("medium");
        setDueDate("");
        setStartDate("");
        setEstimatedTime(undefined);
        setTags("");
      }
    }
  }, [open, initialData]);

  const handleSubmit = async () => {
    if (!taskTitle.trim()) return;

    setIsLoading(true);
    try {
      await onSubmit({
        title: taskTitle,
        description,
        priority,
        dueDate: dueDate || undefined,
        startDate: startDate || undefined,
        estimatedTime,
        tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      });
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium">Task Title</label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:outline-none text-foreground dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={3}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:outline-none resize-none text-foreground dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Priority</label>
            <div className="grid grid-cols-4 gap-2">
              {(["low", "medium", "high", "critical"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    "py-2 rounded-lg border text-xs font-medium capitalize transition-all",
                    priority === p
                      ? priorityColors[p]
                      : "border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:outline-none text-sm text-foreground dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:outline-none text-sm text-foreground dark:text-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" /> Estimated Time (minutes)
            </label>
            <input
              type="number"
              min="0"
              value={estimatedTime || ""}
              onChange={(e) => setEstimatedTime(e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="e.g., 60"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:outline-none text-foreground dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <Tag className="w-3 h-3" /> Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., frontend, bug, urgent"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:outline-none text-foreground dark:text-white"
            />
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Task"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
