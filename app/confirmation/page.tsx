"use client"

import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Download, Share2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const seats = searchParams.get("seats") || "0"
  const total = searchParams.get("total") || "0"

  // Generate booking reference
  const bookingRef = `BK${Math.random().toString(36).substring(2, 9).toUpperCase()}`
  const bookingTime = new Date().toLocaleString("vi-VN")

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-background py-8">
      <div className="mx-auto max-w-2xl px-6">
        {/* Success Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Đặt vé thành công!</h1>
          <p className="text-lg text-muted-foreground">Cảm ơn bạn đã chọn CinemaHub</p>
        </div>

        {/* Booking Details */}
        <div className="mb-8 rounded-lg bg-card border-2 border-green-200 p-8 space-y-6">
          {/* Booking Reference */}
          <div className="text-center">
            <p className="mb-2 text-sm text-muted-foreground">Mã đặt vé</p>
            <p className="font-mono text-2xl font-bold text-green-600">{bookingRef}</p>
          </div>

          <div className="border-t border-b border-border py-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Số vé:</span>
              <span className="font-semibold">{seats} vé</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tổng tiền:</span>
              <span className="font-semibold text-lg text-red-600">{Number(total).toLocaleString("vi-VN")}₫</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Thời gian đặt:</span>
              <span className="font-semibold">{bookingTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trạng thái:</span>
              <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                Đã xác nhận
              </span>
            </div>
          </div>

          {/* Next Steps */}
          <div className="rounded-lg bg-blue-50 p-4">
            <h3 className="mb-2 font-semibold text-blue-900">Bước tiếp theo:</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>✓ Bạn sẽ nhận được email xác nhận trong vài phút</li>
              <li>✓ Vui lòng đến rạp 15 phút trước giờ chiếu</li>
              <li>✓ Xuất trình mã QR hoặc mã đặt vé tại quầy</li>
            </ul>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="mb-8 rounded-lg bg-card border border-border p-6 text-center">
          <p className="mb-4 font-semibold">Mã QR của bạn</p>
          <div className="mb-4 inline-block rounded-lg bg-gray-100 p-4">
            <div
              className="h-48 w-48 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-sm text-gray-600"
              title="QR Code placeholder"
            >
              QR Code
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Quét mã QR này tại quầy bán vé</p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 bg-transparent"
            onClick={() => window.print()}
          >
            <Download className="h-4 w-4" />
            <span>Tải vé</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2 bg-transparent">
            <Share2 className="h-4 w-4" />
            <span>Chia sẻ</span>
          </Button>
          <Link href="/" className="flex">
            <Button className="w-full flex-1 bg-red-600 hover:bg-red-700">Về trang chủ</Button>
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-8 rounded-lg bg-gray-50 p-6 text-center">
          <p className="mb-2 text-sm text-muted-foreground">Cần giúp đỡ?</p>
          <p className="mb-4 font-semibold">Liên hệ với chúng tôi: 1900-1234 hoặc support@cinemahub.vn</p>
          <Link href="/">
            <Button variant="outline">Về trang chủ</Button>
          </Link>
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
