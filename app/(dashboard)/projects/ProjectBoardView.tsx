"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { TaskDialog } from "@/components/projects/TaskDialog";
import { ProjectSettingsDialog } from "@/components/projects/ProjectSettingsDialog";
import { Button } from "@/components/ui/button";
import { BoardHeader } from "@/components/projects/board/BoardHeader";
import { BoardColumn } from "@/components/projects/board/BoardColumn";
import {
  createTaskAction,
  updateTaskAction,
  deleteTaskAction,
  updateProjectAction,
  deleteProjectAction
} from "@/app/serverActions";
import type { Project, Task } from "@/services/projectService";
import { toast } from "react-hot-toast";

interface ProjectBoardViewProps {
  initialProject: Project | null; // Can be null if not found
}

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
      <BoardHeader 
        project={project} 
        onOpenSettings={() => setIsProjectSettingsOpen(true)} 
      />

      {/* Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-6 h-full min-w-max">
          {project.columns.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              dragOverColumnId={dragOverColumnId}
              draggedTaskId={draggedTask?.id || null}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onDragStart={handleDragStart}
              onCreateTask={handleCreateTaskClick}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}

          {/* Add Column Placeholder */}
          <div className="w-80 flex items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-white/10 dark:bg-neutral-900/10">
            <Button variant="ghost" className="text-muted-foreground cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Add Column
            </Button>
          </div>
        </div>
      </div>

      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        onSubmit={handleTaskSubmit}
        initialData={editingTask || undefined}
        title={editingTask ? "Edit Task" : "Add New Task"}
      />

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
