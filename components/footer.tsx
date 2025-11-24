import Link from "next/link";
import { Film, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-gradient-to-b from-muted/30 to-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md">
                <Film className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">CinemaHub</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Nền tảng đặt vé phim trực tuyến hàng đầu Việt Nam. Trải nghiệm điện ảnh tuyệt vời mọi lúc, mọi nơi.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold">Liên kết nhanh</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/account/order-history"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Vé của tôi
                </Link>
              </li>
              <li>
                <Link
                  href="/promotions"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Khuyến mãi
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Về chúng tôi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 font-semibold">Liên hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">1900-1234</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">support@cinemahub.vn</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">
                  123 Nguyễn Huệ, Q.1, TP.HCM
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4 font-semibold">Nhận thông tin mới</h4>
            <p className="mb-4 text-sm text-muted-foreground">
              Đăng ký để nhận tin về phim mới và ưu đãi đặc biệt
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Email của bạn"
                className="h-9"
              />
              <Button size="sm" className="shrink-0">
                Đăng ký
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
            <p>
              © {new Date().getFullYear()} CinemaHub. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="transition-colors hover:text-foreground">
                Điều khoản
              </Link>
              <Link href="#" className="transition-colors hover:text-foreground">
                Bảo mật
              </Link>
              <Link href="#" className="transition-colors hover:text-foreground">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
