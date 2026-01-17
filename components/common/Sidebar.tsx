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
      "flex h-screen flex-col bg-[#fffbf5] dark:bg-[#121212] transition-colors duration-200 border-r border-border z-50",
      isMobile ? "w-full" : "fixed left-0 top-0 w-16 lg:w-64"
    )}>
      
      {/* Logo */}
      <div className="relative flex h-20 items-center justify-start px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition-transform duration-200 group-hover:scale-105 shrink-0">
            <Sparkles className="h-5 w-5 fill-current" />
          </div>
          <span className={cn("text-xl font-bold text-foreground tracking-tight", isMobile ? "block" : "hidden lg:block")}>
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
                  "w-full cursor-pointer bg-primary hover:bg-primary/90 text-white rounded-xl py-6 font-bold shadow-sm transition-all duration-200 hover:translate-y-[-1px]",
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
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer group",
                      isMobile ? "justify-start" : "justify-center lg:justify-start",
                      isActive
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 shrink-0 transition-colors duration-200",
                      isActive ? "text-primary fill-none" : "text-muted-foreground group-hover:text-foreground"
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
      <div className="relative p-3 mb-4">
        <TooltipProvider>
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer group",
                      isMobile ? "justify-start" : "justify-center lg:justify-start",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 shrink-0 transition-colors duration-200",
                      isActive ? "text-primary fill-none" : "text-muted-foreground group-hover:text-foreground"
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
