import Link from "next/link";
import {
  Film,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-background relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/20 to-background" />
      <div className="absolute bottom-0 left-0 w-full h-[500px] bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
                <Film className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                CinemaHub
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Nền tảng đặt vé phim trực tuyến hàng đầu Việt Nam. Trải nghiệm
              điện ảnh tuyệt vời mọi lúc, mọi nơi.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 border border-border/50 transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 font-bold text-lg">Liên kết nhanh</h4>
            <ul className="space-y-4 text-sm">
              {[
                { label: "Trang chủ", href: "/" },
                { label: "Lịch sử đơn", href: "/account/order-history" },
                { label: "Khuyến mãi", href: "/promotions" },
                { label: "Về chúng tôi", href: "/about" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-all hover:text-primary hover:translate-x-1 flex items-center gap-2 group"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary opacity-0 transition-all group-hover:opacity-100 group-hover:scale-125" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-6 font-bold text-lg">Liên hệ</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 group">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">Hotline</p>
                  <span className="text-muted-foreground">1900-1234</span>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">Email</p>
                  <span className="text-muted-foreground">
                    support@cinemahub.vn
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">Địa chỉ</p>
                  <span className="text-muted-foreground">
                    123 Nguyễn Huệ, Q.1, TP.HCM
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-6 font-bold text-lg">Nhận thông tin mới</h4>
            <p className="mb-4 text-sm text-muted-foreground">
              Đăng ký để nhận tin về phim mới và ưu đãi đặc biệt
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Email của bạn"
                className="h-10 bg-background/50 border-border/50 focus:border-primary/50"
              />
              <Button
                size="sm"
                className="shrink-0 h-10 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                Đăng ký
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-border/40 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
            <p>© {new Date().getFullYear()} CinemaHub. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="#" className="transition-colors hover:text-primary">
                Điều khoản
              </Link>
              <Link href="#" className="transition-colors hover:text-primary">
                Bảo mật
              </Link>
              <Link href="#" className="transition-colors hover:text-primary">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
