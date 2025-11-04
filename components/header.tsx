"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Header() {
  const { currentUser, logout } = useAuth()

  return (
    <header className="border-b border-border bg-card shadow-sm sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-red-600 hover:text-red-700 transition-colors">
          🎬 CinemaHub
        </Link>
        <nav className="flex gap-6 items-center">
          <Link href="/" className="text-sm font-medium text-foreground hover:text-red-600 transition-colors">
            Trang chủ
          </Link>
          <Link href="#" className="text-sm font-medium text-foreground hover:text-red-600 transition-colors">
            Khám phá
          </Link>
          <Link href="#" className="text-sm font-medium text-foreground hover:text-red-600 transition-colors">
            Liên hệ
          </Link>

          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer h-8 w-8">
                  <AvatarImage src={currentUser.Avatar || "/placeholder.svg"} alt={currentUser.Ho_ten} />
                  <AvatarFallback>{currentUser.Ho_ten.substring(0, 2)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/tai-khoan/ho-so">Hồ sơ</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/tai-khoan/lich-su-don">Lịch sử đơn</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/tai-khoan/dang-nhap">Đăng nhập</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/tai-khoan/dang-ky">Đăng ký</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
