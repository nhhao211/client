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
import { TetThemeToggle } from "@/components/tet/TetThemeToggle";
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
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-[#fffbf5]/80 dark:bg-[#0f0f0f]/80 backdrop-blur-md px-6 transition-colors duration-200 border-b border-border">
      
      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden cursor-pointer hover:bg-muted transition-colors">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 border-r border-border">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <Sidebar isMobile />
        </SheetContent>
      </Sheet>

      {/* Page Title */}
      <h1 className="relative text-lg font-bold lg:text-xl text-foreground bg-clip-text animate-in fade-in zoom-in-95 duration-300">{title}</h1>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="relative flex items-center gap-2">
        {/* Search */}
        <Button variant="ghost" size="icon" className="hidden cursor-pointer sm:flex hover:bg-muted transition-colors duration-200 group rounded-lg">
          <Search className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="sr-only">Search</span>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="cursor-pointer hover:bg-muted transition-colors duration-200 group relative rounded-lg">
          <Bell className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          {/* Notification dot */}
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background animate-pulse" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* Tet Theme Toggle */}
        <TetThemeToggle />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all duration-200">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src={user?.picture || undefined} alt={user?.name || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                  {user?.name ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 border-border bg-card/95 backdrop-blur-xl" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || "Guest User"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || "guest@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="cursor-pointer hover:bg-muted focus:bg-muted transition-colors duration-200">Profile</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-muted focus:bg-muted transition-colors duration-200">Settings</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
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
