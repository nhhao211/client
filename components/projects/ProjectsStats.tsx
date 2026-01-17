"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { LayoutGrid, CheckCircle2, Clock } from "lucide-react";
import type { Project } from "@/services/projectService";

interface ProjectsStatsProps {
  projects: Project[];
}

export function ProjectsStats({ projects }: ProjectsStatsProps) {
  const activeCount = projects.filter(p => p.status === 'active').length;
  const completedCount = projects.filter(p => p.status === 'completed').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <GlassCard className="p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 !rounded-[2rem]">
          <div className="flex items-center justify-between relative z-10">
              <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Projects</p>
                  <p className="text-5xl font-black tracking-tight text-blue-600 drop-shadow-sm">{projects.length}</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <LayoutGrid className="w-8 h-8" />
              </div>
          </div>
      </GlassCard>
       <GlassCard className="p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 !rounded-[2rem]">
          <div className="flex items-center justify-between relative z-10">
              <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Completed</p>
                  <p className="text-5xl font-black tracking-tight text-emerald-600 drop-shadow-sm">{completedCount}</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="w-8 h-8" />
              </div>
          </div>
      </GlassCard>
       <GlassCard className="p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 !rounded-[2rem]">
           <div className="flex items-center justify-between relative z-10">
              <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">In Progress</p>
                  <p className="text-5xl font-black tracking-tight text-orange-600 drop-shadow-sm">{activeCount}</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8" />
              </div>
          </div>
      </GlassCard>
    </div>
  );
}
