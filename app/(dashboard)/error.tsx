"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
      <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full text-red-600 dark:text-red-400">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold">Something went wrong!</h2>
      <p className="text-muted-foreground">{error.message || "Failed to load dashboard data"}</p>
      <Button
        onClick={() => reset()}
        variant="outline"
      >
        Try again
      </Button>
    </div>
  );
}
