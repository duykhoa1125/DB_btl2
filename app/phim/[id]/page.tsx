"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShowtimeSelector } from "@/components/showtime-selector"
import { RatingSummary } from "@/components/rating-summary"
import { ReviewList } from "@/components/review-list"
import { ReviewEditor } from "@/components/review-editor"
import { VoucherList } from "@/components/voucher-list"
import { mockPhim, mockSuat_chieu, mockDanh_gia } from "@/lib/mock-data"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface MovieDetailPageProps {
  params: {
    id: string
  }
}

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  const [reviews, setReviews] = useState(mockDanh_gia.filter((r) => r.Id_phim === params.id))
  const movie = mockPhim.find((p) => p.Id_phim === params.id)
  const showtimes = mockSuat_chieu.filter((s) => s.Id_phim === params.id)

  const handleAddReview = (newReview: any) => {
    setReviews([newReview, ...reviews])
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="text-2xl font-bold mb-4">Phim không tìm thấy</h1>
        <Link href="/">
          <Button>Quay lại trang chủ</Button>
        </Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-red-600">CinemaHub</h1>
        </div>
      </header>

      {/* Hero Section with Poster and Details */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Poster and Rating */}
          <div className="md:col-span-1 space-y-4">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img src={movie.Hinh_anh || "/placeholder.svg"} alt={movie.Ten_phim} className="w-full h-auto" />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {movie.The_loai.map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
              <Badge variant={movie.Trang_thai === "Đang chiếu" ? "default" : "outline"}>{movie.Trang_thai}</Badge>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <RatingSummary movie={movie} reviewCount={reviews.length} />
            </div>
          </div>

          {/* Movie Details and Trailer */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-balance mb-2">{movie.Ten_phim}</h1>
              <p className="text-lg text-muted-foreground mb-4">{movie.Mota}</p>
            </div>

            {/* Movie Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-card border border-border p-4">
                <p className="text-sm text-muted-foreground mb-1">Đạo diễn</p>
                <p className="font-semibold">{movie.Dao_dien}</p>
              </div>
              <div className="rounded-lg bg-card border border-border p-4">
                <p className="text-sm text-muted-foreground mb-1">Thời lượng</p>
                <p className="font-semibold">{movie.Thoi_luong} phút</p>
              </div>
              <div className="rounded-lg bg-card border border-border p-4">
                <p className="text-sm text-muted-foreground mb-1">Năm phát hành</p>
                <p className="font-semibold">{movie.Nam_phat_hanh}</p>
              </div>
              <div className="rounded-lg bg-card border border-border p-4">
                <p className="text-sm text-muted-foreground mb-1">Nhà sản xuất</p>
                <p className="font-semibold">{movie.Nha_san_xuat}</p>
              </div>
            </div>

            {/* Trailer */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Trailer</h3>
              <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src={movie.Trailer_url.replace("youtube.com/embed/", "youtube.com/embed/") || ""}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>

            {/* Cast */}
            <div>
              <h3 className="mb-2 text-lg font-bold">Diễn viên</h3>
              <p className="text-muted-foreground">{movie.Dien_vien.join(", ")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Showtimes Section */}
      <section className="border-t border-border bg-card py-8">
        <div className="mx-auto max-w-7xl px-6">
          {showtimes.length > 0 ? (
            <ShowtimeSelector showtimes={showtimes} movieId={movie.Id_phim} />
          ) : (
            <div className="py-12 text-center">
              <p className="text-lg text-muted-foreground mb-4">Không có lịch chiếu cho phim này</p>
              <Link href="/">
                <Button>Quay lại trang chủ</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Reviews and Vouchers Section */}
      <section className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Reviews (left side - wider) */}
            <div className="lg:col-span-2">
              <h2 className="mb-6 text-2xl font-bold">Đánh giá từ khán giả</h2>
              <ReviewEditor movieId={movie.Id_phim} movieTitle={movie.Ten_phim} onSubmit={handleAddReview} />
              <div className="mt-8">
                <ReviewList reviews={reviews} />
              </div>
            </div>

            {/* Vouchers (sidebar) */}
            <div className="lg:col-span-1">
              <VoucherList />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 mt-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 CinemaHub. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
