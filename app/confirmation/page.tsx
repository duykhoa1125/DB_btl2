"use client"

import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Download, Share2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Breadcrumb } from "@/components/breadcrumb"

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const seats = searchParams.get("seats") || "0"
  const total = searchParams.get("total") || "0"
  const discount = searchParams.get("discount") || "0"

  // Generate booking reference
  const bookingRef = `CH${Date.now().toString(36).toUpperCase().slice(-8)}`
  const bookingTime = new Date().toLocaleString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })

  // Calculate show time (example: 30 minutes from now)
  const showTime = new Date(Date.now() + 30 * 60 * 1000).toLocaleString("vi-VN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Breadcrumb */}
      <div className="border-b border-border/40 bg-card/50">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <Breadcrumb 
            items={[
              { label: "Đặt vé", href: "/" },
              { label: "Xác nhận" }
            ]} 
          />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Success Header */}
        <div className="mb-10 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/50">
              <CheckCircle2 className="h-10 w-10 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="mb-3 text-4xl font-bold">Đặt vé thành công!</h1>
          <p className="text-lg text-muted-foreground">
            Cảm ơn bạn đã chọn CinemaHub. Chúc bạn có trải nghiệm tuyệt vời!
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Booking Details Card */}
            <div className="overflow-hidden rounded-2xl border-2 border-green-200 bg-card shadow-xl">
              {/* Header */}
              <div className="border-b border-border bg-gradient-to-r from-green-50 to-green-100/50 px-8 py-6">
                <div className="mb-3 text-center">
                  <p className="mb-1 text-sm font-medium text-muted-foreground">
                    Mã đặt vé
                  </p>
                  <p className="font-mono text-3xl font-bold tracking-tight text-green-600">
                    {bookingRef}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6 p-8">
                {/* Movie Info */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Thông tin phim
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phim:</span>
                      <span className="font-semibold">Avengers: Endgame</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rạp:</span>
                      <span className="font-semibold">CinemaHub - Tân Bình</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phòng:</span>
                      <span className="font-semibold">Room 1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Suất chiếu:</span>
                      <span className="font-semibold">{showTime}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border" />

                {/* Booking Details */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Chi tiết đặt vé
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                      <span className="text-muted-foreground">Số vé:</span>
                      <span className="font-bold">{seats} vé</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                      <span className="text-muted-foreground">Ghế:</span>
                      <span className="font-semibold">C5, C6</span>
                    </div>
                    {Number(discount) > 0 && (
                      <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                        <span className="text-green-700">Giảm giá:</span>
                        <span className="font-bold text-green-700">
                          −{Number(discount).toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
                      <span className="text-lg font-semibold">Tổng tiền:</span>
                      <span className="text-2xl font-bold text-primary">
                        {Number(total).toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border" />

                {/* Metadata */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thời gian đặt:</span>
                    <span className="font-medium">{bookingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trạng thái:</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
                      Đã xác nhận
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phương thức:</span>
                    <span className="font-medium">Thẻ tín dụng</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="rounded-2xl border border-border bg-gradient-to-br from-blue-50/50 to-card p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-blue-900">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white">
                  ℹ️
                </div>
                Hướng dẫn sử dụng vé
              </h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    1
                  </div>
                  <span className="text-sm leading-relaxed text-blue-900">
                    Email xác nhận đã được gửi đến địa chỉ email của bạn
                  </span>
                </li>
                <li className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    2
                  </div>
                  <span className="text-sm leading-relaxed text-blue-900">
                    Vui lòng đến rạp trước 15 phút để làm thủ tục
                  </span>
                </li>
                <li className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    3
                  </div>
                  <span className="text-sm leading-relaxed text-blue-900">
                    Xuất trình mã QR hoặc mã đặt vé tại quầy để nhận vé
                  </span>
                </li>
                <li className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    4
                  </div>
                  <span className="text-sm leading-relaxed text-blue-900">
                    Mang theo giấy tờ tùy thân nếu xem phim giới hạn độ tuổi
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            {/* QR Code */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
              <div className="border-b border-border bg-muted/30 px-6 py-4">
                <p className="text-center font-semibold">Mã QR vé điện tử</p>
              </div>
              <div className="p-6">
                <div className="mb-4 overflow-hidden rounded-xl bg-white p-4 shadow-inner">
                  <div className="flex aspect-square w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-sm font-medium text-gray-500">
                    [QR Code]
                  </div>
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  Quét mã QR này tại quầy bán vé
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 bg-card shadow-sm hover:shadow-md"
                onClick={() => window.print()}
              >
                <Download className="h-4 w-4" />
                <span>Tải vé PDF</span>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 bg-card shadow-sm hover:shadow-md"
              >
                <Share2 className="h-4 w-4" />
                <span>Chia sẻ</span>
              </Button>
            </div>

            {/* Help */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h4 className="mb-3 font-semibold">Cần hỗ trợ?</h4>
              <p className="mb-4 text-sm text-muted-foreground">
                Liên hệ với chúng tôi nếu bạn cần trợ giúp
              </p>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <span className="text-muted-foreground">Hotline:</span>
                  <span className="font-semibold">1900-1234</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-semibold">support@cinemahub.vn</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <ConfirmationContent />
    </Suspense>
  )
}
