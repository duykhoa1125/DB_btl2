"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Film, Ticket, Gift, Phone, User, LogOut, Home, MapPin, Calendar } from "lucide-react";

export function Header() {
  const { currentUser, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 transition-all"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 transition-all group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/30">
            <Film className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="bg-gradient-to-r from-primary via-foreground to-foreground/70 bg-clip-text text-2xl font-bold text-transparent">
            CinemaHub
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <Link
            href="/events"
            className="group relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            <Calendar className="h-4 w-4" />
            <span className="relative z-10">Sự kiện</span>
            <div className="absolute inset-0 rounded-lg bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>

          <Link
            href="/cinemas"
            className="group relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            <MapPin className="h-4 w-4" />
            <span className="relative z-10">Rạp chiếu</span>
            <div className="absolute inset-0 rounded-lg bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
          
          <Link
            href="/account/order-history"
            className="group relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            <Ticket className="h-4 w-4" />
            <span className="relative z-10">Vé của tôi</span>
            <div className="absolute inset-0 rounded-lg bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
          
          <Link
            href="/promotions"
            className="group relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            <Gift className="h-4 w-4" />
            <span className="relative z-10">Khuyến mãi</span>
            <div className="absolute inset-0 rounded-lg bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
          
          <Link
            href="/about"
            className="group relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            <Phone className="h-4 w-4" />
            <span className="relative z-10">Liên hệ</span>
            <div className="absolute inset-0 rounded-lg bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>

          {/* User Menu */}
          <div className="ml-4 flex items-center gap-2 border-l border-border/40 pl-4">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="group relative flex items-center gap-2 rounded-xl border-2 border-border bg-card px-3 py-2 transition-all hover:border-primary/50 hover:shadow-md">
                    <Avatar className="h-7 w-7">
                      <AvatarImage
                        src={currentUser.avatar || "/placeholder.svg"}
                        alt={currentUser.fullname || "User"}
                      />
                      <AvatarFallback className="text-xs">
                        {currentUser.fullname?.substring(0, 2) ||
                          currentUser.email?.substring(0, 2)?.toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm font-medium sm:inline">
                      {currentUser.fullname?.split(" ").slice(-1)[0] || "User"}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-2">
                    <p className="text-sm font-medium">{currentUser.fullname}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Hồ sơ</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/order-history" className="flex items-center gap-2">
                      <Ticket className="h-4 w-4" />
                      <span>Lịch sử đơn</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout} 
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/account/login">Đăng nhập</Link>
                </Button>
                <Button size="sm" asChild className="shadow-md">
                  <Link href="/account/register">Đăng ký</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
