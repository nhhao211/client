"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredAuth?: boolean;
}

/**
 * HOC to protect routes that require authentication
 * Redirects to login if not authenticated
 */
export function ProtectedRoute({ children, requiredAuth = true }: ProtectedRouteProps) {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && requiredAuth && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, requiredAuth, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (requiredAuth && !isAuthenticated) {
    return null; // Will redirect above
  }

  return <>{children}</>;
}
