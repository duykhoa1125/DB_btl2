"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Download, Home, Share2, Printer, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface BookingData {
  phim: any
  caChieu: any
  phong: any
  rap: any
  gheDaChon: Array<{ So_hang: string; So_cot: number }>
  doAnDaChon: Array<{ id: number; tenDoAn: string; soLuong: number; gia: number }>
  totalPrice: number
  discount?: number
}

export default function SuccessPage() {
  const router = useRouter()
  const [bookingData, setBookingData] = useState<BookingData | null>(null)

  useEffect(() => {
    const data = localStorage.getItem("lastBooking")
    if (data) {
      setBookingData(JSON.parse(data))
    }
  }, [])

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Không tìm thấy thông tin đặt vé</p>
      </div>
    )
  }

  const bookingCode = `BC${Date.now().toString().slice(-8)}`
  const seatsList = bookingData.gheDaChon.map((g) => `${g.So_hang}${g.So_cot}`).join(", ")
  const subtotal =
    bookingData.doAnDaChon.reduce((sum, d) => sum + d.gia * d.soLuong, 0) + bookingData.gheDaChon.length * 100000 // Base seat price
  const discount = bookingData.discount || 0
  const finalPrice = bookingData.totalPrice

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <h1 className="text-2xl font-bold text-red-600">🎬 CinemaHub</h1>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-8">
        {/* Success Message */}
        <div className="mb-8 text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-600 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold">Đặt vé thành công!</h1>
          <p className="text-muted-foreground text-lg">Vé của bạn đã được xác nhận. Vui lòng lưu mã đặt vé của bạn.</p>
        </div>

        {/* Main Booking Information Card */}
        <Card className="mb-8 border-2 border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-900">Chi tiết vé xem phim</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            {/* Booking Code - Highlighted */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg p-6 text-center space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">MÃ ĐẶT VÉ</p>
              <p className="text-4xl font-bold text-red-600 font-mono">{bookingCode}</p>
              <p className="text-xs text-muted-foreground">Lưu mã này để kiểm tra hoặc hoàn vé</p>
            </div>

            {/* Movie & Cinema Information */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Movie Poster */}
              <div>
                <img
                  src={bookingData.phim.Hinh_anh || "/placeholder.svg"}
                  alt={bookingData.phim.Ten_phim}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
              </div>

              {/* Movie Details */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Phim</p>
                  <p className="text-2xl font-bold">{bookingData.phim.Ten_phim}</p>
                  <Badge variant="outline" className="mt-2">
                    {bookingData.phim.Trang_thai}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Rạp chiếu</p>
                    <p className="font-semibold text-lg">{bookingData.rap.Ten_rap}</p>
                    <p className="text-sm text-muted-foreground">{bookingData.rap.Dia_chi}</p>
                    <p className="text-sm text-muted-foreground">Điện thoại: {bookingData.rap.So_dien_thoai}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Phòng chiếu</p>
                    <p className="text-2xl font-bold">{bookingData.phong.Ten_phong}</p>
                    <Badge className="mt-2">{bookingData.phong.Suc_chua} chỗ</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Showtime Information */}
            <div className="border-t pt-6 grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-blue-900 uppercase mb-2">Ngày chiếu</p>
                <p className="text-xl font-bold text-blue-900">
                  {new Date(bookingData.caChieu.Ngay_chieu).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-purple-900 uppercase mb-2">Giờ chiếu</p>
                <p className="text-xl font-bold text-purple-900">{bookingData.caChieu.Thoi_gian_bat_dau}</p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-indigo-900 uppercase mb-2">Thời lượng</p>
                <p className="text-xl font-bold text-indigo-900">{bookingData.phim.Thoi_luong} phút</p>
              </div>
            </div>

            {/* Seats Selection */}
            <div className="border-t pt-6">
              <p className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                Ghế đã chọn ({bookingData.gheDaChon.length})
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {bookingData.gheDaChon.map((g) => (
                  <Badge key={`${g.So_hang}-${g.So_cot}`} className="px-4 py-2 text-base bg-blue-600 hover:bg-blue-700">
                    {g.So_hang}
                    {g.So_cot}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>Vị trí:</strong> {seatsList}
              </p>
            </div>

            {/* Food & Beverages */}
            {bookingData.doAnDaChon.length > 0 && (
              <div className="border-t pt-6">
                <p className="text-sm font-semibold text-muted-foreground uppercase mb-3">Đồ ăn & Thức uống</p>
                <div className="bg-amber-50 rounded-lg p-4 space-y-3">
                  {bookingData.doAnDaChon.map((d, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-semibold">{d.tenDoAn}</p>
                        <p className="text-sm text-muted-foreground">Số lượng: {d.soLuong}</p>
                      </div>
                      <span className="font-bold text-lg">{(d.gia * d.soLuong).toLocaleString("vi-VN")} đ</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="border-t pt-6 bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Giá vé ({bookingData.gheDaChon.length} ghế):</span>
                <span className="text-lg">{(bookingData.gheDaChon.length * 100000).toLocaleString("vi-VN")} đ</span>
              </div>
              {bookingData.doAnDaChon.length > 0 && (
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Đồ ăn & Thức uống:</span>
                  <span className="text-lg">
                    {bookingData.doAnDaChon.reduce((sum, d) => sum + d.gia * d.soLuong, 0).toLocaleString("vi-VN")} đ
                  </span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span className="font-semibold">Khuyến mãi:</span>
                  <span className="text-lg">-{discount.toLocaleString("vi-VN")} đ</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="text-lg font-bold">TỔNG TIỀN:</span>
                <span className="text-3xl font-bold text-red-600">{finalPrice.toLocaleString("vi-VN")} đ</span>
              </div>
              <p className="text-sm text-green-600 font-semibold">✓ Thanh toán thành công</p>
            </div>

            {/* QR Code */}
            <div className="border-t pt-6 text-center space-y-4">
              <p className="text-sm font-semibold text-muted-foreground uppercase">Mã QR - Xuất trình tại rạp</p>
              <div className="bg-white border-2 border-gray-300 p-4 rounded-lg inline-flex">
                <svg viewBox="0 0 100 100" className="h-40 w-40">
                  <rect width="100" height="100" fill="white" />
                  <g fill="black">
                    <rect x="10" y="10" width="20" height="20" />
                    <rect x="70" y="10" width="20" height="20" />
                    <rect x="10" y="70" width="20" height="20" />
                    <circle cx="50" cy="50" r="8" />
                    <rect x="20" y="20" width="10" height="10" />
                    <rect x="80" y="20" width="10" height="10" />
                    <rect x="20" y="80" width="10" height="10" />
                  </g>
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">Quét mã QR này khi đến rạp để nhận vé</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-4 gap-3 mb-8">
          <Link href="/">
            <Button variant="outline" className="w-full gap-2 bg-transparent">
              <Home className="h-4 w-4" />
              Trang chủ
            </Button>
          </Link>
          <Button className="gap-2 bg-red-600 hover:bg-red-700 w-full">
            <Download className="h-4 w-4" />
            Tải vé
          </Button>
          <Button variant="outline" className="w-full gap-2 bg-transparent">
            <Share2 className="h-4 w-4" />
            Chia sẻ
          </Button>
          <Button variant="outline" className="w-full gap-2 bg-transparent">
            <Printer className="h-4 w-4" />
            In vé
          </Button>
        </div>

        {/* Important Notes */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6 space-y-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="font-semibold text-blue-900">⏰ Lưu ý quan trọng:</p>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Vui lòng đến rạp ít nhất 15 phút trước giờ chiếu</li>
                  <li>• Mang theo mã đặt vé hoặc quét mã QR tại quầy vé</li>
                  <li>• Bạn có thể sử dụng vé điện tử này hoặc in ra để sử dụng</li>
                  <li>• Có thể huỷ vé trước 2 giờ chiếu để hoàn tiền</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guest Signup Encouragement */}
        <Card className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-900">Tạo tài khoản để quản lý vé dễ hơn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Lưu toàn bộ vé của bạn, theo dõi lịch sử đặt vé, nhận khuyến mãi độc quyền và tích điểm thưởng.
            </p>
            <div className="flex gap-3">
              <Link href="/tai-khoan/dang-ky" className="flex-1">
                <Button className="w-full bg-red-600 hover:bg-red-700">Đăng ký tài khoản</Button>
              </Link>
              <Link href="/tai-khoan/dang-nhap" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Đăng nhập
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
