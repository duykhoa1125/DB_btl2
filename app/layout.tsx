import type React from "react";
import type { Metadata } from "next";
import { Montserrat, Be_Vietnam_Pro } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  weight: ["700", "800"],
  variable: "--font-heading",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "CinemaHub - Đặt vé phim trực tuyến",
  description:
    "Đặt vé phim online dễ dàng, nhanh chóng tại CinemaHub. Chọn ghế, đồ ăn và thanh toán trong vài phút.",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${beVietnamPro.variable} font-sans antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
