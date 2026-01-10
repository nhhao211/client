"use client";

import { useCallback, useEffect, useRef } from "react";

interface UseAutoSaveOptions {
  onSave: () => Promise<void>;
  delay?: number; // milliseconds
  enabled?: boolean;
}

/**
 * Hook to automatically save content after user stops typing
 * Calls onSave after `delay` ms of inactivity
 */
export function useAutoSave({
  onSave,
  delay = 2000,
  enabled = true,
}: UseAutoSaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Create the trigger function
  const trigger = useCallback(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(async () => {
      try {
        await onSave();
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, delay);
  }, [onSave, delay, enabled]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return trigger;
}
