'use client';

import React from 'react';
import { useTetTheme } from './TetThemeProvider';
import { cn } from '@/lib/utils';

export function TetThemeToggle() {
  const { isTetTheme, toggleTetTheme } = useTetTheme();

  return (
    <button
      onClick={toggleTetTheme}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
        isTetTheme 
          ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50" 
          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
      )}
      title={isTetTheme ? "Tắt giao diện Tết" : "Bật giao diện Tết"}
    >
      <span className="text-base">{isTetTheme ? '🧧' : '🌙'}</span>
      <span className="hidden sm:inline">{isTetTheme ? 'Tết Mode' : 'Normal'}</span>
    </button>
  );
}
