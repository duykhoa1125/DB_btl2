"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Film,
  MapPin,
  Clock,
  Users,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Movies",
    href: "/admin/movies",
    icon: Film,
  },
  {
    label: "Cinemas",
    href: "/admin/cinemas",
    icon: MapPin,
  },
  {
    label: "Showtimes",
    href: "/admin/showtimes",
    icon: Clock,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isLoading, isAdmin } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Protect admin routes - redirect if not admin
  useEffect(() => {
    if (!isLoading && (!currentUser || !isAdmin)) {
      router.push("/account/login");
    }
  }, [currentUser, isLoading, isAdmin, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render admin content if not authorized
  if (!currentUser || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed left-4 top-4 z-50 rounded-xl bg-card/50 backdrop-blur-md p-2.5 shadow-lg lg:hidden border border-border/50 hover:bg-primary/10 transition-colors"
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-72 transform border-r border-border/40 bg-card/30 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo Section */}
        <div className="p-8 pb-6">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
              <Film className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-primary via-foreground to-foreground/70 bg-clip-text text-xl font-bold text-transparent">
                CinemaHub
              </h1>
              <p className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
                Admin Panel
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-300 overflow-hidden",
                  isActive
                    ? "text-primary shadow-md shadow-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-100" />
                )}

                <Icon
                  className={cn(
                    "h-5 w-5 transition-all duration-300 group-hover:scale-110",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-primary"
                  )}
                />
                <span className="relative z-10">{item.label}</span>

                {isActive && (
                  <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-72 transition-all duration-300">
        <div className="mx-auto max-w-[1600px] p-6 lg:p-10 animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
