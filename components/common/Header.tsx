"use client";

import { Menu, Search, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/components/providers/AuthProvider";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Dashboard" }: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 dark:border-white/10 bg-white/90 dark:bg-slate-950/80 backdrop-blur-xl px-6 supports-[backdrop-filter]:bg-white/85 dark:supports-[backdrop-filter]:bg-slate-950/70 lg:px-6 transition-colors duration-200">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.02] via-transparent to-cyan-500/[0.02] pointer-events-none" />
      
      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden cursor-pointer hover:bg-blue-500/10 transition-colors">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 border-r border-blue-500/10">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <Sidebar isMobile />
        </SheetContent>
      </Sheet>

      {/* Page Title */}
      <h1 className="relative text-lg font-semibold font-heading lg:text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">{title}</h1>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="relative flex items-center gap-2">
        {/* Search */}
        <Button variant="ghost" size="icon" className="hidden cursor-pointer sm:flex hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-200 group">
          <Search className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          <span className="sr-only">Search</span>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-200 group relative">
          <Bell className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          {/* Notification dot */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full ring-2 ring-background" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full cursor-pointer ring-2 ring-gray-200 dark:ring-white/20 hover:ring-blue-500/40 dark:hover:ring-blue-500/40 transition-all duration-200">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.picture || undefined} alt={user?.name || "User"} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-sm font-medium">
                  {user?.name ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 border-gray-200 dark:border-white/10 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || "Guest User"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || "guest@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-white/10" />
            <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 focus:bg-gray-100 dark:focus:bg-white/10 transition-colors duration-200">Profile</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 focus:bg-gray-100 dark:focus:bg-white/10 transition-colors duration-200">Settings</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-white/10" />
            <DropdownMenuItem 
              className="cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/10 transition-colors"
              onClick={handleLogout}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
