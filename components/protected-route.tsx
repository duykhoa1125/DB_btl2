"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { currentUser, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      // Redirect to login
      router.push("/account/login");
    }
  }, [currentUser, isLoading, router]);

  // Don't render content if not authenticated
  if (!currentUser) {
    return null;
  }

  // Render children for authenticated users
  return <>{children}</>;
}
