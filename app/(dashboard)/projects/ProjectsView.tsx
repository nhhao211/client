"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderOpen, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { updateProjectAction, deleteProjectAction } from "@/app/serverActions";
import type { Project } from "@/services/projectService";
import { ProjectSettingsDialog } from "@/components/projects/ProjectSettingsDialog";
import { toast } from "react-hot-toast";

// New Components
import { ProjectsStats } from "@/components/projects/ProjectsStats";
import { ProjectsControls } from "@/components/projects/ProjectsControls";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { ProjectCard } from "@/components/projects/ProjectCard";

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

interface ProjectsViewProps {
  initialProjects: Project[];
}

export default function ProjectsView({ initialProjects }: ProjectsViewProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Handle Project Created
  const handleProjectCreated = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
  };

  // Handle Project Update
  const handleProjectUpdate = async (data: Partial<Project>) => {
    if (!selectedProject) return;
    try {
      const updatedProject = await updateProjectAction(selectedProject.id, data);
      setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, ...updatedProject } : p));
      setSelectedProject(prev => prev ? { ...prev, ...updatedProject } : null); // Update modal ref too
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Handle Project Delete
  const handleProjectDelete = async () => {
    if (!selectedProject) return;
    try {
      await deleteProjectAction(selectedProject.id);
      setProjects(prev => prev.filter(p => p.id !== selectedProject.id));
      setIsSettingsOpen(false);
      toast.success("Project deleted");
      router.refresh(); // Sync server state
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <AnimatedBackground />
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                 <div className="w-8 h-8 grid grid-cols-2 gap-0.5">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm opacity-50"></div>
                    <div className="bg-current rounded-sm opacity-50"></div>
                    <div className="bg-current rounded-sm"></div>
                 </div>
               </div>
              <h1 className="text-4xl font-black tracking-tight text-foreground">
                Projects
              </h1>
            </div>
            <p className="text-muted-foreground ml-1 text-lg font-medium">Manage your projects and track progress with Kanban boards.</p>
          </div>
          <CreateProjectDialog 
            open={isCreateDialogOpen} 
            onOpenChange={setIsCreateDialogOpen} 
            onProjectCreated={handleProjectCreated}
          />
        </div>

        {/* Stats Overview */}
        <ProjectsStats projects={projects} />

        {/* Controls */}
        <ProjectsControls 
          search={search}
          onSearchChange={setSearch}
          view={view}
          onViewChange={setView}
        />

        {/* Grid */}
        {filteredProjects.length === 0 ? (
          <GlassCard className="flex flex-col items-center justify-center p-16 text-center border-dashed border-4 border-muted !rounded-[3rem] bg-white/50">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <FolderOpen className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-black mb-3">No projects yet</h3>
            <p className="text-muted-foreground mb-8 max-w-md text-lg font-medium">
              Create your first project to start organizing your work with Kanban boards.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="clay-button bg-primary px-8 py-6 rounded-full font-bold text-lg shadow-lg">
              <Plus className="mr-2 h-5 w-5" />
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
            {filteredProjects.map(project => (
              <motion.div key={project.id} variants={item}>
                <ProjectCard 
                  project={project}
                  onEdit={(p) => {
                    setSelectedProject(p);
                    setIsSettingsOpen(true);
                  }}
                  onDelete={(p) => {
                    setSelectedProject(p);
                    setIsSettingsOpen(true);
                  }}
                />
              </motion.div>
            ))}
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
    </>
  );
}
