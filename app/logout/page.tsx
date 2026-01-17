"use client";

import { useEffect } from "react";
import { deleteSession } from "@/app/actions";
import { logout } from "@/services/authService";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      try {
        // Clear local storage
        logout();
        // Clear server-side cookie
        await deleteSession();
        // Force hard reload/navigation to login to ensure fresh state
         // Use router.replace to replace history entry
         router.replace("/login");
      } catch (error) {
        console.error("Logout failed", error);
        router.replace("/login");
      }
    };
    doLogout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Logging out...</p>
      </div>
    </div>
  );
}
