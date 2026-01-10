"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import * as authService from "@/services/authService";

interface User {
  id?: number;
  email: string;
  name: string;
  picture?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getAuthToken();
      if (token) {
        try {
          const profile = await authService.getProfile();
          setUser({
            id: profile.id,
            email: profile.email,
            name: profile.name,
            picture: profile.picture,
          });
        } catch (error) {
          console.error("Failed to load profile:", error);
          authService.logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (token: string) => {
    try {
      authService.setAuthToken(token);
      const result = await authService.login(token);
      const userData = result.data.user;
      setUser({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
      });
    } catch (error) {
      console.error("Login failed:", error);
      authService.logout();
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Logout from Firebase
      const { logoutFirebase } = await import("@/lib/firebase");
      await logoutFirebase();
    } catch (error) {
      console.error("Firebase logout error:", error);
    } finally {
      // Clear local state and token regardless of Firebase logout success
      authService.logout();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
