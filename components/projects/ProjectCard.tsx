"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MoreHorizontal, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface Member {
  id: string;
  name: string;
  avatar?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: "active" | "completed" | "on_hold";
  dueDate: string;
  members: Member[];
  taskCount: number;
  completedTaskCount: number;
}

const statusColor = {
  active: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  completed: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  on_hold: "text-orange-500 bg-orange-500/10 border-orange-500/20",
};

const statusIcon = {
  active: Clock,
  completed: CheckCircle2,
  on_hold: AlertCircle,
};

export function ProjectCard({ project }: { project: Project }) {
  const StatusIcon = statusIcon[project.status];

  return (
    <Link href={`/projects/${project.id}`} passHref>
      <GlassCard className="h-full flex flex-col justify-between group cursor-pointer hover:border-purple-500/50 transition-all duration-300">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className={cn("px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5", statusColor[project.status])}>
                <StatusIcon className="w-3.5 h-3.5" />
                <span className="capitalize">{project.status.replace('_', ' ')}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground -mr-2">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-purple-500 transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{project.progress}%</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500" 
                    style={{ width: `${project.progress}%` }}
                />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex -space-x-2">
                {project.members.slice(0, 3).map((member) => (
                    <Avatar key={member.id} className="w-8 h-8 border-2 border-background ring-1 ring-white/20">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                            {member.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                ))}
                {project.members.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-medium text-muted-foreground ring-1 ring-white/20">
                        +{project.members.length - 3}
                    </div>
                )}
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(project.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
        </div>
      </GlassCard>
    </Link>
  );
}
