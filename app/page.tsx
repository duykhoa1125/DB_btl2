"use client"

import { useState } from "react"
import { Carousel } from "@/components/carousel"
import { MovieCard } from "@/components/movie-card"
import { mockPhim } from "@/lib/mock-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dang-chieu")

  const phimDangChieu = mockPhim.filter((p) => p.Trang_thai === "Đang chiếu")
  const phimSapChieu = mockPhim.filter((p) => p.Trang_thai === "Sắp chiếu")

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="mx-auto max-w-7xl px-6 py-8">
        <Carousel items={phimDangChieu.length > 0 ? phimDangChieu : mockPhim} />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-balance mb-2">Danh sách phim</h2>
          <p className="text-muted-foreground">Khám phá những bộ phim hay nhất hiện nay</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="dang-chieu">Đang chiếu ({phimDangChieu.length})</TabsTrigger>
            <TabsTrigger value="sap-chieu">Sắp chiếu ({phimSapChieu.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="dang-chieu" className="mt-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {phimDangChieu.length > 0 ? (
                phimDangChieu.map((phim) => <MovieCard key={phim.Id_phim} phim={phim} />)
              ) : (
                <p className="col-span-full py-12 text-center text-muted-foreground">Không có phim đang chiếu</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sap-chieu" className="mt-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {phimSapChieu.length > 0 ? (
                phimSapChieu.map((phim) => <MovieCard key={phim.Id_phim} phim={phim} />)
              ) : (
                <p className="col-span-full py-12 text-center text-muted-foreground">Không có phim sắp chiếu</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <section className="bg-card border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-lg bg-gradient-to-r from-red-600 to-red-700 p-8 text-white">
            <h3 className="mb-2 text-2xl font-bold">Ưu đãi đặc biệt</h3>
            <p className="mb-4 max-w-2xl">Đặt vé ngay hôm nay và nhận giảm giá 20% cho hộp bỏng ngô và nước uống!</p>
            <button className="rounded-lg bg-white px-6 py-2 font-semibold text-red-600 hover:bg-gray-100 transition-colors">
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h4 className="mb-4 font-bold text-foreground">Về CinemaHub</h4>
              <p className="text-sm text-muted-foreground">Nền tảng đặt vé phim trực tuyến hàng đầu Việt Nam.</p>
            </div>
            <div>
              <h4 className="mb-4 font-bold text-foreground">Liên kết nhanh</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Trang chủ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Khám phá
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Liên hệ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-bold text-foreground">Theo dõi chúng tôi</h4>
              <p className="text-sm text-muted-foreground">Facebook • Instagram • Twitter</p>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 CinemaHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
