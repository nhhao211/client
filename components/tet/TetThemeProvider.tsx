'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type TetThemeContextType = {
  isTetTheme: boolean;
  toggleTetTheme: () => void;
};

const TetThemeContext = createContext<TetThemeContextType | undefined>(undefined);

export function TetThemeProvider({ children }: { children: React.ReactNode }) {
  const [isTetTheme, setIsTetTheme] = useState(true); // Default ON for Tet season
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load from localStorage
    const stored = localStorage.getItem('tet-theme');
    if (stored !== null) {
      setIsTetTheme(stored === 'true');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Apply/remove .tet class to html element
    const html = document.documentElement;
    if (isTetTheme) {
      html.classList.add('tet');
    } else {
      html.classList.remove('tet');
    }
    
    // Persist to localStorage
    localStorage.setItem('tet-theme', String(isTetTheme));
  }, [isTetTheme, mounted]);

  const toggleTetTheme = () => {
    setIsTetTheme(prev => !prev);
  };

  return (
    <TetThemeContext.Provider value={{ isTetTheme, toggleTetTheme }}>
      {children}
    </TetThemeContext.Provider>
  );
}

export function useTetTheme() {
  const context = useContext(TetThemeContext);
  if (context === undefined) {
    throw new Error('useTetTheme must be used within a TetThemeProvider');
  }
  return context;
}
