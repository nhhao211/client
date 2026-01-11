import api from "@/lib/axios";

// Types
export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: number;
  columnId: number;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high" | "critical";
  order: number;
  dueDate?: string;
  startDate?: string;
  estimatedTime?: number; // in minutes
  actualTime?: number;    // in minutes
  tags: string[];         // parsed from JSON
  checklist: ChecklistItem[]; // parsed from JSON
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: number;
  projectId: number;
  title: string;
  order: number;
  tasks: Task[];
}

export interface Project {
  id: number;
  userId: number;
  title: string;
  description?: string;
  status: "active" | "completed" | "archived";
  createdAt: string;
  updatedAt: string;
  columns: Column[];
  taskCount?: number;
}

// Project CRUD
export async function createProject(data: { title: string; description?: string }): Promise<Project> {
  const response = await api.post("/v1/projects", data);
  return response.data.data.project;
}

export async function listProjects(): Promise<Project[]> {
  const response = await api.get("/v1/projects");
  return response.data.data.projects;
}

export async function getProject(id: number | string): Promise<Project> {
  const response = await api.get(`/v1/projects/${id}`);
  return response.data.data.project;
}

export async function updateProject(
  id: number | string,
  data: { title?: string; description?: string; status?: string }
): Promise<Project> {
  const response = await api.put(`/v1/projects/${id}`, data);
  return response.data.data.project;
}

export async function deleteProject(id: number | string): Promise<void> {
  await api.delete(`/v1/projects/${id}`);
}

// Column CRUD
export async function createColumn(
  projectId: number | string,
  data: { title: string }
): Promise<Column> {
  const response = await api.post(`/v1/projects/${projectId}/columns`, data);
  return response.data.data.column;
}

export async function updateColumn(
  columnId: number | string,
  data: { title?: string; order?: number }
): Promise<Column> {
  const response = await api.put(`/v1/projects/columns/${columnId}`, data);
  return response.data.data.column;
}

export async function deleteColumn(columnId: number | string): Promise<void> {
  await api.delete(`/v1/projects/columns/${columnId}`);
}

// Task CRUD
export async function createTask(
  columnId: number | string,
  data: { 
    title: string; 
    description?: string; 
    priority?: string; 
    dueDate?: string;
    startDate?: string;
    estimatedTime?: number;
    actualTime?: number;
    tags?: string[];
    checklist?: ChecklistItem[];
  }
): Promise<Task> {
  const response = await api.post(`/v1/projects/columns/${columnId}/tasks`, data);
  return response.data.data.task;
}

export async function updateTask(
  taskId: number | string,
  data: { 
    title?: string; 
    description?: string; 
    priority?: string; 
    dueDate?: string;
    startDate?: string;
    estimatedTime?: number;
    actualTime?: number;
    tags?: string[];
    checklist?: ChecklistItem[];
    columnId?: number;
    order?: number;
  }
): Promise<Task> {
  const response = await api.put(`/v1/projects/tasks/${taskId}`, data);
  return response.data.data.task;
}

export async function batchUpdateTasks(
  tasks: { id: number; columnId: number; order: number }[]
): Promise<void> {
  await api.put("/v1/projects/tasks/batch", { tasks });
}

export async function deleteTask(taskId: number | string): Promise<void> {
  await api.delete(`/v1/projects/tasks/${taskId}`);
}
