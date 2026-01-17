"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, MoreHorizontal, Loader2, Trash2, Edit, GripVertical, Clock, Tag, Calendar, Settings } from "lucide-react";
import { TaskDialog } from "@/components/projects/TaskDialog";
import { ProjectSettingsDialog } from "@/components/projects/ProjectSettingsDialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  createTaskAction,
  updateTaskAction,
  deleteTaskAction,
  updateProjectAction,
  deleteProjectAction
} from "@/app/serverActions";
import type { Project, Task } from "@/services/projectService";
import { toast } from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectBoardViewProps {
  initialProject: Project | null; // Can be null if not found
}

const priorityColors = {
  low: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  medium: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function ProjectBoardView({ initialProject }: ProjectBoardViewProps) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(initialProject);
  
  // New Task Dialog
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isProjectSettingsOpen, setIsProjectSettingsOpen] = useState(false);
  
  // Task state
  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Drag and Drop state
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<number | null>(null);

  useEffect(() => {
    // Sync state if initialProject changes (e.g. revalidation)
    setProject(initialProject);
  }, [initialProject]);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  // Handle Task Submit (Create or Update)
  const handleTaskSubmit = async (data: any) => {
    if (editingTask) {
      // Update existing task
      const updatedTask = await updateTaskAction(editingTask.id, data);
      setProject(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          columns: prev.columns.map(col => ({
            ...col,
            tasks: col.tasks.map(t => t.id === editingTask.id ? updatedTask : t)
          }))
        };
      });
      toast.success("Task updated");
      router.refresh();
    } else if (selectedColumnId) {
      // Create new task
      const newTask = await createTaskAction(selectedColumnId, data);
      setProject(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          columns: prev.columns.map(col => 
            col.id === selectedColumnId 
              ? { ...col, tasks: [...col.tasks, newTask] }
              : col
          )
        };
      });
      toast.success("Task created");
      router.refresh();
    }
  };

  // Open Edit Task Modal
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskDialogOpen(true);
  };

  // Open Create Task Modal
  const handleCreateTaskClick = (columnId: number) => {
    setEditingTask(null);
    setSelectedColumnId(columnId);
    setIsTaskDialogOpen(true);
  };

  // Handle Project Update
  const handleProjectUpdate = async (data: Partial<Project>) => {
    if (!project) return;
    const updatedProject = await updateProjectAction(project.id, data);
    setProject(prev => prev ? { ...prev, ...updatedProject } : null);
    router.refresh();
  };

  // Handle Project Delete
  const handleProjectDelete = async () => {
    if (!project) return;
    await deleteProjectAction(project.id);
    toast.success("Project deleted");
    router.push("/projects");
  };

  // Delete Task
  const handleDeleteTask = async (taskId: number, columnId: number) => {
    try {
      await deleteTaskAction(taskId);
      setProject(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          columns: prev.columns.map(col => 
            col.id === columnId 
              ? { ...col, tasks: col.tasks.filter(t => t.id !== taskId) }
              : col
          ),
        };
      });
      toast.success("Task deleted");
      router.refresh();
    } catch (error: any) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task");
    }
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, columnId: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumnId(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumnId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetColumnId: number) => {
    e.preventDefault();
    setDragOverColumnId(null);
    
    if (!draggedTask || draggedTask.columnId === targetColumnId) {
      setDraggedTask(null);
      return;
    }

    const sourceColumnId = draggedTask.columnId;
    const taskId = draggedTask.id;

    // Optimistic update
    setProject(prev => {
      if (!prev) return prev;
      
      const updatedColumns = prev.columns.map(col => {
        if (col.id === sourceColumnId) {
          return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
        }
        if (col.id === targetColumnId) {
          return { 
            ...col, 
            tasks: [...col.tasks, { ...draggedTask, columnId: targetColumnId, order: col.tasks.length }] 
          };
        }
        return col;
      });
      
      return { ...prev, columns: updatedColumns };
    });

    setDraggedTask(null);

    // API call
    try {
      await updateTaskAction(taskId, {
        columnId: targetColumnId,
        order: project?.columns.find(c => c.id === targetColumnId)?.tasks.length || 0,
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to move task:", error);
      toast.error("Failed to move task");
      // Revert on error - In a real app we might want to refetch or undo state
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
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
        <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => setIsProjectSettingsOpen(true)}>
          <Settings className="h-5 w-5" />
        </Button>
      </header>

      {/* Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-6 h-full min-w-max">
          {project.columns.map((column) => (
            <div
              key={column.id}
              className={cn(
                "w-80 flex flex-col rounded-xl border border-white/10 bg-white/30 dark:bg-neutral-900/30 backdrop-blur-md transition-all",
                dragOverColumnId === column.id && "ring-2 ring-primary/50"
              )}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{column.title}</h3>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {column.tasks.length}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer"
                  onClick={() => {
                    handleCreateTaskClick(column.id);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Tasks */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                <AnimatePresence>
                  {column.tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, task)}
                      className={cn(
                        "p-3 rounded-lg border border-white/10 bg-white/50 dark:bg-neutral-800/50 cursor-grab active:cursor-grabbing group",
                        draggedTask?.id === task.id && "opacity-50"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1">
                          <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{task.title}</p>
                            {task.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent drag start interference if any
                              }}
                            >
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => handleEditTask(task)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive cursor-pointer"
                              onClick={() => handleDeleteTask(task.id, column.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase",
                          priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium
                        )}>
                          {task.priority}
                        </span>
                        {task.estimatedTime && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {task.estimatedTime}m
                          </span>
                        )}
                        {task.dueDate && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            <Calendar className="w-3 h-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(typeof task.tags === 'string' ? JSON.parse(task.tags) : task.tags).slice(0, 3).map((tag: string, i: number) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Add Task Button */}
              <div className="p-3 border-t border-white/10">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={() => {
                    handleCreateTaskClick(column.id);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </div>
          ))}

          {/* Add Column Placeholder - Could implement create column later */}
          <div className="w-80 flex items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-white/10 dark:bg-neutral-900/10">
            <Button variant="ghost" className="text-muted-foreground cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Add Column
            </Button>
          </div>
        </div>
      </div>

      {/* Task Dialog */}
      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        onSubmit={handleTaskSubmit}
        initialData={editingTask || undefined}
        title={editingTask ? "Edit Task" : "Add New Task"}
      />

      {/* Project Settings Dialog */}
      {project && (
        <ProjectSettingsDialog
          open={isProjectSettingsOpen}
          onOpenChange={setIsProjectSettingsOpen}
          project={project}
          onUpdate={handleProjectUpdate}
          onDelete={handleProjectDelete}
        />
      )}
    </div>
  );
}
