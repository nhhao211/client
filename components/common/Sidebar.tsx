"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  FolderOpen,
  Settings,
  Sparkles,
  Home,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Documents",
    href: "/documents",
    icon: FileText,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: FolderOpen,
  },
];

const bottomNavItems = [
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  isMobile?: boolean;
}

export function Sidebar({ isMobile }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn(
      "flex h-screen flex-col border-r border-blue-500/10 dark:border-blue-400/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl transition-all duration-300 shadow-xl",
      isMobile ? "w-full" : "fixed left-0 top-0 z-40 w-16 lg:w-64"
    )}>
      {/* Decorative gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
      
      {/* Logo */}
      <div className="relative flex h-16 items-center justify-start px-4 border-b border-blue-500/10 dark:border-blue-400/10">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-500/40 shrink-0">
            <Sparkles className="h-5 w-5 fill-current" />
          </div>
          <span className={cn("text-xl font-bold font-heading text-foreground tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent", isMobile ? "block" : "hidden lg:block")}>
            MarkFlow
          </span>
        </Link>
      </div>

      {/* New Document Button */}
      <div className="relative p-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                className={cn(
                  "w-full cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 transition-all font-medium border border-white/20 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35",
                  isMobile ? "justify-start px-4" : "justify-center lg:justify-start"
                )}
              >
                <Link href="/editor/new">
                  <Plus className="h-4 w-4" />
                  <span className={cn("inline-block ml-2 font-semibold", isMobile ? "block" : "hidden lg:inline-block")}>
                    New Document
                  </span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="lg:hidden">
              <p>New Document</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Separator className="bg-blue-500/10 dark:bg-blue-400/10" />

      {/* Main Navigation */}
      <nav className="relative flex-1 space-y-1 p-3">
        <TooltipProvider>
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer group",
                      isMobile ? "justify-start" : "justify-center lg:justify-start",
                      isActive
                        ? "bg-gradient-to-r from-blue-500/15 to-cyan-500/10 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-blue-500/25"
                        : "text-muted-foreground hover:bg-blue-500/5 dark:hover:bg-blue-500/10 hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 shrink-0 transition-colors",
                      isActive ? "text-blue-500" : "group-hover:text-blue-500"
                    )} />
                    <span className={cn(isMobile ? "block" : "hidden lg:inline-block")}>{item.title}</span>
                    {isActive && (
                      <div className="absolute left-0 w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-r-full" />
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="lg:hidden">
                  <p>{item.title}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>

      {/* Bottom Navigation */}
      <div className="relative border-t border-blue-500/10 dark:border-blue-400/10 p-3">
        <TooltipProvider>
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer group",
                      isMobile ? "justify-start" : "justify-center lg:justify-start",
                      isActive
                        ? "bg-gradient-to-r from-blue-500/15 to-cyan-500/10 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-blue-500/25"
                        : "text-muted-foreground hover:bg-blue-500/5 dark:hover:bg-blue-500/10 hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 shrink-0 transition-colors",
                      isActive ? "text-blue-500" : "group-hover:text-blue-500"
                    )} />
                    <span className={cn(isMobile ? "block" : "hidden lg:inline-block")}>{item.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="lg:hidden">
                  <p>{item.title}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </aside>
  );
}
