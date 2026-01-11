"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Search, LayoutGrid, List, Loader2, FolderOpen, Clock, CheckCircle2, AlertCircle, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import * as projectService from "@/services/projectService";
import type { Project } from "@/services/projectService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProjectSettingsDialog } from "@/components/projects/ProjectSettingsDialog";
import { toast } from "react-hot-toast";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

const statusConfig = {
  active: { 
    label: "Active", 
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    icon: Clock 
  },
  completed: { 
    label: "Completed", 
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    icon: CheckCircle2 
  },
  archived: { 
    label: "Archived", 
    color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    icon: AlertCircle 
  },
};

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await projectService.listProjects();
        setProjects(data);
      } catch (error: any) {
        console.error("Failed to fetch projects:", error);
        toast.error("Failed to load projects");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Create new project
  const handleCreateProject = async () => {
    if (!newProjectTitle.trim()) {
      toast.error("Please enter a project title");
      return;
    }
    
    setIsCreating(true);
    try {
      const newProject = await projectService.createProject({
        title: newProjectTitle,
        description: newProjectDescription,
      });
      setProjects(prev => [newProject, ...prev]);
      setIsCreateDialogOpen(false);
      setNewProjectTitle("");
      setNewProjectDescription("");
      toast.success("Project created!");
      router.push(`/projects/${newProject.id}`);
    } catch (error: any) {
      console.error("Failed to create project:", error);
      toast.error("Failed to create project");
    } finally {
      setIsCreating(false);
    }
  };

  // Handle Project Update
  const handleProjectUpdate = async (data: Partial<Project>) => {
    if (!selectedProject) return;
    try {
      const updatedProject = await projectService.updateProject(selectedProject.id, data);
      setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, ...updatedProject } : p));
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Handle Project Delete
  const handleProjectDelete = async () => {
    if (!selectedProject) return;
    try {
      await projectService.deleteProject(selectedProject.id);
      setProjects(prev => prev.filter(p => p.id !== selectedProject.id));
      setIsSettingsOpen(false);
      toast.success("Project deleted");
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  );

  const activeCount = projects.filter(p => p.status === 'active').length;
  const completedCount = projects.filter(p => p.status === 'completed').length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="text-muted-foreground mt-1">Manage your projects and track progress with Kanban boards.</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span className="font-semibold">New Project</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Project Title</label>
                <input
                  id="title"
                  type="text"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="e.g., Website Redesign"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description (optional)</label>
                <textarea
                  id="description"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Brief description of the project"
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:outline-none resize-none"
                />
              </div>
              <Button 
                onClick={handleCreateProject} 
                disabled={isCreating}
                className="w-full"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="flex items-center gap-4 bg-gradient-to-br from-blue-500/10 to-transparent">
            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-500">
                <LayoutGrid className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{projects.length}</p>
            </div>
        </GlassCard>
         <GlassCard className="flex items-center gap-4 bg-gradient-to-br from-emerald-500/10 to-transparent">
            <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-500">
                <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedCount}</p>
            </div>
        </GlassCard>
         <GlassCard className="flex items-center gap-4 bg-gradient-to-br from-orange-500/10 to-transparent">
            <div className="p-3 bg-orange-500/20 rounded-lg text-orange-500">
                <Clock className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{activeCount}</p>
            </div>
        </GlassCard>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 bg-white/50 dark:bg-neutral-900/50 p-4 rounded-2xl border border-white/10 backdrop-blur-md shadow-sm">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
                type="text" 
                placeholder="Search projects..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 pl-10 text-sm placeholder:text-muted-foreground"
            />
        </div>
        <div className="h-6 w-px bg-border" />
        <div className="flex items-center gap-2">
            <Button 
                variant={view === 'grid' ? 'secondary' : 'ghost'} 
                size="icon" 
                onClick={() => setView('grid')}
                className="cursor-pointer"
            >
                <LayoutGrid className="w-4 h-4" />
            </Button>
             <Button 
                variant={view === 'list' ? 'secondary' : 'ghost'} 
                size="icon" 
                onClick={() => setView('list')}
                className="cursor-pointer"
            >
                <List className="w-4 h-4" />
            </Button>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 rounded-xl bg-muted/50 animate-pulse" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <GlassCard className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 bg-transparent">
          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
            <FolderOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Create your first project to start organizing your work with Kanban boards.
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create First Project
          </Button>
        </GlassCard>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className={cn(
            "gap-6",
            view === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "flex flex-col"
          )}
        >
          {filteredProjects.map(project => {
            const status = statusConfig[project.status] || statusConfig.active;
            const StatusIcon = status.icon;
            
            return (
              <motion.div key={project.id} variants={item}>
                <div className="relative h-full group">
                  <Link href={`/projects/${project.id}`} className="block h-full">
                    <GlassCard className="h-full flex flex-col justify-between hover:border-primary/50 transition-all duration-300">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className={cn("px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5", status.color)}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span>{status.label}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {project.taskCount || 0} tasks
                        </div>
                      </div>
                      
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 bg-background/50 backdrop-blur-sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProject(project);
                                setIsSettingsOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProject(project);
                                setIsSettingsOpen(true);
                                // We rely on the user clicking "Delete" in the modal, but maybe we want a direct delete?
                                // The modal supports delete, so opening it is fine.
                                // But ideally we want to default to delete view? 
                                // The generic dialog doesn't have "initialMode".
                                // Let's just open settings.
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        {project.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>

                      {/* Columns Preview */}
                      {project.columns && project.columns.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {project.columns.map(col => (
                            <div 
                              key={col.id}
                              className="text-xs px-2 py-1 bg-muted/50 rounded-md text-muted-foreground"
                            >
                              {col.title}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                    </div>
                    </GlassCard>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {selectedProject && (
        <ProjectSettingsDialog
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
          project={selectedProject}
          onUpdate={handleProjectUpdate}
          onDelete={handleProjectDelete}
        />
      )}
    </div>
  );
}
