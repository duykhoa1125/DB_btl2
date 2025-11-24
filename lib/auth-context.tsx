"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { type User, mockUsers } from "./mock-data";

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
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
    const user = mockUsers.find((u) => u.email === email);
    if (user && user.passwordHash === password) {
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return true;
    }
    return false;
  };

  const signup = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<boolean> => {
    const userExists = mockUsers.some((u) => u.email === email);
    if (userExists) {
      return false;
    }

    const newUser: User = {
      userId: `user_${Date.now()}`,
      email: email,
      passwordHash: password,
      fullName: fullName,
      phoneNumber: "",
      avatar: `https://avatar.vercel.sh/${email.split("@")[0]}`,
      birthDate: "",
      createdDate: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    setCurrentUser(newUser);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const updateProfile = (updates: Partial<User>) => {
    if (currentUser) {
      const updated = { ...currentUser, ...updates };
      setCurrentUser(updated);
      localStorage.setItem("currentUser", JSON.stringify(updated));
      const index = mockUsers.findIndex((u) => u.userId === currentUser.userId);
      if (index !== -1) {
        mockUsers[index] = updated;
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
