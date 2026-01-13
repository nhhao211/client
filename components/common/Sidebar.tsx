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
      "flex h-screen flex-col bg-[#fffbf5] dark:bg-slate-900 transition-all duration-200 shadow-xl z-50",
      isMobile ? "w-full" : "fixed left-0 top-0 w-16 lg:w-64"
    )}>
      
      {/* Logo */}
      <div className="relative flex h-20 items-center justify-start px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform duration-200 group-hover:scale-110 shrink-0">
            <Sparkles className="h-5 w-5 fill-current" />
          </div>
          <span className={cn("text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight", isMobile ? "block" : "hidden lg:block")}>
            MemMart
          </span>
        </Link>
      </div>

      {/* New Document Button */}
      <div className="relative p-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                className={cn(
                  "w-full cursor-pointer clay-button bg-primary hover:bg-primary/90 text-white rounded-[2rem] py-6 font-bold shadow-xl transition-all duration-200 hover:scale-105",
                  isMobile ? "justify-start px-4" : "justify-center lg:justify-start"
                )}
              >
                <Link href="/editor/new">
                  <Plus className="h-5 w-5" />
                  <span className={cn("inline-block ml-2 font-bold", isMobile ? "block" : "hidden lg:inline-block")}>
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

      {/* Main Navigation */}
      <nav className="relative flex-1 space-y-2 p-4">
        <TooltipProvider>
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-full px-4 py-3.5 text-sm font-bold transition-all duration-200 cursor-pointer group",
                      isMobile ? "justify-start" : "justify-center lg:justify-start",
                      isActive
                        ? "bg-white dark:bg-slate-800 text-primary shadow-md translate-x-2" // Active: White pill with colored text (or reverse if preferred)
                        : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground hover:translate-x-1"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 shrink-0 transition-colors duration-200",
                      isActive ? "text-primary fill-current" : "text-gray-400 group-hover:text-primary"
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
      </nav>

      {/* Bottom Navigation */}
      <div className="relative p-4 mb-4">
        <TooltipProvider>
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-full px-4 py-3.5 text-sm font-bold transition-all duration-200 cursor-pointer group",
                      isMobile ? "justify-start" : "justify-center lg:justify-start",
                      isActive
                        ? "bg-white dark:bg-slate-800 text-primary shadow-md translate-x-2"
                        : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground hover:translate-x-1"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 shrink-0 transition-colors duration-200",
                      isActive ? "text-primary fill-current" : "text-gray-400 group-hover:text-primary"
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
