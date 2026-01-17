"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Column, Task } from "@/services/projectService";
import { TaskCard } from "./TaskCard";

interface BoardColumnProps {
  column: Column;
  dragOverColumnId: number | null;
  draggedTaskId: number | null;
  onDragOver: (e: React.DragEvent, columnId: number) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, columnId: number) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onCreateTask: (columnId: number) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number, columnId: number) => void;
}

export function BoardColumn({
  column,
  dragOverColumnId,
  draggedTaskId,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStart,
  onCreateTask,
  onEditTask,
  onDeleteTask
}: BoardColumnProps) {
  return (
    <div
      className={cn(
        "w-80 flex flex-col rounded-xl border border-white/10 bg-white/30 dark:bg-neutral-900/30 backdrop-blur-md transition-all",
        dragOverColumnId === column.id && "ring-2 ring-primary/50"
      )}
      onDragOver={(e) => onDragOver(e, column.id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, column.id)}
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
          onClick={() => onCreateTask(column.id)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Tasks */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <AnimatePresence>
          {column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isDragging={draggedTaskId === task.id}
              onDragStart={onDragStart}
              onEdit={onEditTask}
              onDelete={(taskId) => onDeleteTask(taskId, column.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Add Task Button */}
      <div className="p-3 border-t border-white/10">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground cursor-pointer"
          onClick={() => onCreateTask(column.id)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
    </div>
  );
}
