"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { SeatSelection } from "@/components/seat-selection"
import { FoodSelection } from "@/components/food-selection"
import { VoucherInput } from "@/components/voucher-input"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import type { Ghe, Do_an, Khuyen_mai } from "@/lib/mock-data"
import { mockSuat_chieu, mockPhim } from "@/lib/mock-data"
import { useSearchParams } from "next/navigation"

interface BookingPageProps {
  params: {
    id: string
  }
}

export default function BookingPage({ params }: BookingPageProps) {
  const searchParams = useSearchParams()
  const [selectedSeats, setSelectedSeats] = useState<Ghe[]>([])
  const [selectedFoods, setSelectedFoods] = useState<(Do_an & { quantity: number })[]>([])
  const [bookingStep, setBookingStep] = useState<"seats" | "food" | "payment">("seats")
  const [appliedVoucher, setAppliedVoucher] = useState<Khuyen_mai | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)

  const showtime = mockSuat_chieu.find((s) => s.Id_suat_chieu === params.id)
  const movie = showtime ? mockPhim.find((p) => p.Id_phim === showtime.Id_phim) : null

  useEffect(() => {
    const voucherCode = searchParams.get("voucher")
    if (voucherCode) {
      console.log("[v0] Voucher code from URL:", voucherCode)
    }
  }, [searchParams])

  if (!showtime || !movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="text-2xl font-bold mb-4">Lịch chiếu không tìm thấy</h1>
        <Link href="/">
          <Button>Quay lại trang chủ</Button>
        </Link>
      </div>
    )
  }

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime)
    return date.toLocaleString("vi-VN", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const ticketTotal = selectedSeats.length * showtime.Gia_ve
  const foodTotal = selectedFoods.reduce((sum, food) => sum + food.Gia * food.quantity, 0)
  const subtotal = ticketTotal + foodTotal
  const finalTotal = Math.max(0, subtotal - discountAmount)

  const handleVoucherApply = (voucher: Khuyen_mai | null, discount: number) => {
    setAppliedVoucher(voucher)
    if (voucher === null) {
      setDiscountAmount(0)
    } else {
      setDiscountAmount(discount)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
          <Link href={`/phim/${movie.Id_phim}`}>
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-red-600">CinemaHub</h1>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 rounded-lg bg-card border border-border p-6">
          <h2 className="text-2xl font-bold mb-2">{movie.Ten_phim}</h2>
          <p className="text-muted-foreground mb-4">
            {showtime.Phong_chieu} • {formatDateTime(showtime.Thoi_gian_bat_dau)}
          </p>
        </div>

        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { id: "seats", label: "Ghế" },
            { id: "food", label: "Đồ ăn" },
            { id: "payment", label: "Thanh toán" },
          ].map((step, index) => (
            <div key={step.id} className="flex items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-bold transition-all ${
                  bookingStep === step.id
                    ? "bg-red-600 text-white"
                    : bookingStep > step.id
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-600"
                }`}
              >
                {index + 1}
              </div>
              <span className="hidden text-sm font-medium md:inline">{step.label}</span>
              {index < 2 && <div className="mx-2 hidden h-1 flex-1 bg-gray-300 md:block" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {bookingStep === "seats" && (
              <div>
                <SeatSelection onSeatsChange={setSelectedSeats} />
                <div className="mt-6 flex gap-4">
                  <Button
                    onClick={() => {
                      if (selectedSeats.length > 0) {
                        setBookingStep("food")
                      }
                    }}
                    disabled={selectedSeats.length === 0}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Tiếp tục ({selectedSeats.length} ghế)
                  </Button>
                </div>
              </div>
            )}

            {bookingStep === "food" && (
              <div>
                <FoodSelection onFoodChange={setSelectedFoods} />
                <div className="mt-6 flex gap-4">
                  <Button onClick={() => setBookingStep("seats")} variant="outline" className="flex-1">
                    Quay lại
                  </Button>
                  <Button onClick={() => setBookingStep("payment")} className="flex-1 bg-red-600 hover:bg-red-700">
                    Tiếp tục
                  </Button>
                </div>
              </div>
            )}

            {bookingStep === "payment" && (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-bold">Mã khuyến mại</h3>
                  <VoucherInput
                    onVoucherApply={handleVoucherApply}
                    appliedVoucher={appliedVoucher}
                    appliedDiscount={discountAmount}
                  />
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-bold">Phương thức thanh toán</h3>
                  <div className="space-y-3">
                    {[
                      { id: "card", label: "Thẻ tín dụng/ghi nợ", icon: "💳" },
                      { id: "cash", label: "Tiền mặt", icon: "💵" },
                      { id: "wallet", label: "Ví điện tử", icon: "📱" },
                    ].map((method) => (
                      <button
                        key={method.id}
                        className="flex w-full items-center gap-3 rounded-lg border-2 border-border p-4 transition-all hover:border-red-600"
                      >
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-medium">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex gap-4">
                  <Button onClick={() => setBookingStep("food")} variant="outline" className="flex-1">
                    Quay lại
                  </Button>
                  <Button
                    onClick={() => {
                      window.location.href = `/xac-nhan?seats=${selectedSeats.length}&total=${finalTotal}&discount=${discountAmount}`
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Hoàn thành đặt vé
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4 rounded-lg bg-card border border-border p-6">
              <h3 className="text-lg font-bold">Tóm tắt</h3>

              <div className="space-y-3 border-t border-b border-border py-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vé ({selectedSeats.length}):</span>
                  <span className="font-semibold">{ticketTotal.toLocaleString("vi-VN")}₫</span>
                </div>
                {selectedFoods.length > 0 && (
                  <div className="space-y-1">
                    {selectedFoods.map((food) => (
                      <div key={food.Id_do_an} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {food.Ten_do_an} x{food.quantity}:
                        </span>
                        <span>{(food.Gia * food.quantity).toLocaleString("vi-VN")}₫</span>
                      </div>
                    ))}
                  </div>
                )}
                {selectedFoods.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Đồ ăn:</span>
                    <span className="font-semibold">{foodTotal.toLocaleString("vi-VN")}₫</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính:</span>
                  <span>{subtotal.toLocaleString("vi-VN")}₫</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá:</span>
                    <span>-{discountAmount.toLocaleString("vi-VN")}₫</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold text-red-600">
                <span>Tổng cộng:</span>
                <span>{finalTotal.toLocaleString("vi-VN")}₫</span>
              </div>

              <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                <p>
                  Bạn đã chọn {selectedSeats.length} ghế
                  {selectedFoods.length > 0 && ` và ${selectedFoods.length} mục đồ ăn`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
