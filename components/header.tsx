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
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { currentUser, logout } = useAuth();

  return (
    <header className="border-b border-border bg-card shadow-sm sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-2xl font-bold text-red-600 hover:text-red-700 transition-colors"
        >
          🎬 CinemaHub
        </Link>
        <nav className="flex gap-6 items-center">
          <Link
            href="/"
            className="text-sm font-medium text-foreground hover:text-red-600 transition-colors"
          >
            Trang chủ
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-foreground hover:text-red-600 transition-colors"
          >
            Khám phá
          </Link>
          <Link
            href="/promotions"
            className="text-sm font-medium text-foreground hover:text-red-600 transition-colors"
          >
            Khuyến mãi
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-foreground hover:text-red-600 transition-colors"
          >
            Liên hệ
          </Link>

          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer h-8 w-8">
                  <AvatarImage
                    src={currentUser.avatar || "/placeholder.svg"}
                    alt={currentUser.fullName || "User"}
                  />
                  <AvatarFallback>
                    {currentUser.fullName?.substring(0, 2) ||
                      currentUser.email?.substring(0, 2)?.toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/account/profile">Hồ sơ</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/order-history">Lịch sử đơn</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/account/login">Đăng nhập</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/account/register">Đăng ký</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
