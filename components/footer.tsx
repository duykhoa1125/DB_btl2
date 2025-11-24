import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h4 className="mb-4 font-bold text-foreground">Về CinemaHub</h4>
            <p className="text-sm text-muted-foreground">
              Nền tảng đặt vé phim trực tuyến hàng đầu Việt Nam.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-bold text-foreground">Liên kết nhanh</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="hover:text-foreground transition-colors"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/promotions"
                  className="hover:text-foreground transition-colors"
                >
                  Khuyến mãi
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-foreground transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-bold text-foreground">
              Theo dõi chúng tôi
            </h4>
            <p className="text-sm text-muted-foreground">
              Facebook • Instagram • Twitter
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CinemaHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
