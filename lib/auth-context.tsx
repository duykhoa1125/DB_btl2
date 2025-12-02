"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type AuthenticatedUser, type Account } from "@/services/types";
import { authService } from "@/services";
import axiosClient from "@/lib/axiosClient";

interface AuthContextType {
  currentUser: AuthenticatedUser | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<boolean>;
  register: (
    phoneNumber: string,
    email: string,
    password: string,
    fullname: string,
    birthDate: string,
    gender: "male" | "female" | "unknown"
  ) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<Account>) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize user from token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Try to get current user from server using token
          const user = await authService.getCurrentUser();
          setCurrentUser(user);
        } catch (error) {
          // Token invalid or expired, clear storage
          console.error("Failed to restore session:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (
    identifier: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await authService.login({ identifier, password });
      const { token, user } = response;

      // Save token and user
      localStorage.setItem("token", token);
      localStorage.setItem("currentUser", JSON.stringify(user));

      // Set axios default authorization header
      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setCurrentUser(user);

      // Auto redirect based on role
      setTimeout(() => {
        if (user.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      }, 100);

      return true;
    } catch (error: any) {
      console.error("Login failed:", error);
      // Propagate the error message from backend if available
      const errorMessage =
        error?.response?.data?.error ||
        "Email/Số điện thoại hoặc mật khẩu không đúng";
      throw new Error(errorMessage);
    }
  };

  const register = async (
    phoneNumber: string,
    email: string,
    password: string,
    fullname: string,
    birthDate: string,
    gender: "male" | "female" | "unknown"
  ): Promise<boolean> => {
    try {
      await authService.register({
        phone_number: phoneNumber,
        email,
        password,
        fullname,
        birth_date: birthDate,
        gender,
      });

      // No auto-login, just return true
      return true;
    } catch (error: any) {
      console.error("Registration failed:", error);
      // Propagate the error message from backend if available
      const errorMessage =
        error?.response?.data?.error || "Đăng ký thất bại. Vui lòng thử lại.";
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");

    // Clear axios authorization header
    delete axiosClient.defaults.headers.common["Authorization"];

    // Redirect to login
    router.push("/account/login");
  };

  const updateProfile = async (updates: Partial<Account>) => {
    if (!currentUser || currentUser.role !== "user") {
      console.error("Can only update user profiles");
      return;
    }

    try {
      const updatedUser = await authService.updateProfile(updates);

      // Update local state
      const newUser: AuthenticatedUser = {
        ...updatedUser,
        role: "user",
      };

      setCurrentUser(newUser);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  const isAdmin = currentUser?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        isAdmin,
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
