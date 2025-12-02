import type React from "react";
import type { Metadata } from "next";
import { Be_Vietnam_Pro, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ConditionalLayout } from "@/components/conditional-layout";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CinemaHub - Đặt vé phim trực tuyến",
    template: "%s | CinemaHub",
  },
  description:
    "Đặt vé phim online dễ dàng, nhanh chóng tại CinemaHub. Chọn ghế, đồ ăn và thanh toán trong vài phút. Trải nghiệm điện ảnh đỉnh cao với hệ thống rạp chiếu phim hiện đại.",
  keywords: [
    "đặt vé phim",
    "rạp chiếu phim",
    "cinema online",
    "booking phim",
    "đặt vé online",
    "xem phim",
    "lịch chiếu phim",
    "CinemaHub",
  ],
  authors: [{ name: "CinemaHub Team" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "CinemaHub",
    title: "CinemaHub - Đặt vé phim trực tuyến",
    description:
      "Đặt vé phim online dễ dàng, nhanh chóng tại CinemaHub. Chọn ghế, đồ ăn và thanh toán trong vài phút.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CinemaHub - Đặt vé phim trực tuyến",
    description:
      "Đặt vé phim online dễ dàng, nhanh chóng. Trải nghiệm điện ảnh đỉnh cao.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: "Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${beVietnamPro.variable} font-sans antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
          <Toaster />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
