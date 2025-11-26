"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { type Account } from "@/services/types";
import { authService } from "@/services";

interface AuthContextType {
  currentUser: Account | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    email: string,
    password: string,
    fullname: string
  ) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<Account>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to restore user:", e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock login: accept any password for existing users
      const user = await authService.getByEmail(email);
      if (user) {
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const signup = async (
    email: string,
    password: string,
    fullname: string
  ): Promise<boolean>  => {
    try {
      // Check if user exists
      const userExists = await authService.getByEmail(email).then(() => true).catch(() => false);
      if (userExists) {
        return false;
      }

      const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const newUser: Account = {
        phone_number: `09${Math.floor(Math.random() * 100000000)}`, // Mock phone
        email: email,
        password: password,
        fullname: fullname,
        birth_date: now,
        gender: "unknown",
        avatar: `https://avatar.vercel.sh/${email.split("@")[0]}`,
        membership_points: 0,
        registration_date: now,
      };

      // In a real implementation, this would call authService.register(newUser)
      // For now, we'll just set it locally
      setCurrentUser(newUser);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const updateProfile = async (updates: Partial<Account>) => {
    if (currentUser) {
      try {
        // In real implementation: await authService.updateProfile(updates)
        const updated = { ...currentUser, ...updates };
        setCurrentUser(updated);
        localStorage.setItem("currentUser", JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to update profile:', error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
