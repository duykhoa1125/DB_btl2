"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SeatSelection } from "@/components/seat-selection";
import { FoodSelection } from "@/components/food-selection";
import { VoucherInput } from "@/components/voucher-input";
import { Separator } from "@/components/ui/separator";
import type { Seat, Food } from "@/services/types";
import type { Showtime, MovieDetail } from "@/services/types";
import { type FoodMenuItem } from "@/services";
import bookingService from "@/services/bookingService";
import { calculateSeatsTotal } from "@/lib/pricing";
import { useSearchParams } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Wallet,
  Banknote,
  Building2,
  CheckCircle2,
} from "lucide-react";

// VoucherDetail type definition (from mock-data)
interface VoucherDetail {
  code: string;
  promotional_id: string;
  start_date: string;
  end_date: string;
  state: "active" | "used" | "expired";
  phone_number: string;
  promotional?: any;
  discount?: {
    promotional_id: string;
    percent_reduce: number;
    max_price_can_reduce: number;
  };
  gift?: {
    promotional_id: string;
    name: string;
    quantity: number;
  };
}

interface BookingContentProps {
  showtime: Showtime;
  movie: MovieDetail;
}

export function BookingContent({ showtime, movie }: BookingContentProps) {
  const searchParams = useSearchParams();
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<
    (FoodMenuItem & { quantity: number })[]
  >([]);
  const [bookingStep, setBookingStep] = useState<"seats" | "food">("seats");
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherDetail | null>(
    null
  );
  const [discountAmount, setDiscountAmount] = useState(0);

  const [prefilledVoucherCode, setPrefilledVoucherCode] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCompleteBooking = async () => {
    try {
      setIsProcessing(true);

      const bookingPayload = {
        showtime_id: showtime.showtime_id,
        seats: selectedSeats.map((s) => ({
          row: s.seat_row,
          col: s.seat_column,
          price: calculateSeatsTotal([s]), // Calculate individual seat price
        })),
        foods: selectedFoods.map((f) => ({
          name: f.name,
          price: f.price,
          quantity: f.quantity,
        })),
        voucher_code: appliedVoucher?.code || undefined,
        phone_number: "", // Will be handled by backend via token
      };

      const response = await bookingService.createBooking(bookingPayload);

      // Lưu thông tin đặt vé vào localStorage để trang confirmation hiển thị
      const confirmationData = {
        movie_name: movie.name,
        movie_image: movie.image,
        cinema_name: showtime.cinema_name || "",
        room_name: showtime.room_name || showtime.room_id,
        start_date: showtime.start_date,
        start_time: showtime.start_time,
        seats: selectedSeats.map((s) => `${s.seat_row}${s.seat_column}`),
        foods: selectedFoods.map((f) => ({
          name: f.name,
          quantity: f.quantity,
          price: f.price,
        })),
        total: finalTotal,
        discount: discountAmount,
      };
      localStorage.setItem(
        "confirmationData",
        JSON.stringify(confirmationData)
      );

      // Redirect to confirmation with bill_id
      window.location.href = `/confirmation?bill_id=${response.bill.bill_id}&seats=${selectedSeats.length}&total=${finalTotal}&discount=${discountAmount}`;
    } catch (error: any) {
      console.error("Booking failed:", error);
      alert(`Đặt vé thất bại: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const voucherCodeUrl = searchParams.get("voucher");
    if (voucherCodeUrl) {
      setPrefilledVoucherCode(voucherCodeUrl);
    } else {
      // Check session storage
      const voucherCodeSession = sessionStorage.getItem("selectedVoucher");
      if (voucherCodeSession) {
        setPrefilledVoucherCode(voucherCodeSession);
        sessionStorage.removeItem("selectedVoucher");
      }
    }
  }, [searchParams]);

  // Format date and time from separate fields
  const formatDateTime = () => {
    const dateObj = new Date(showtime.start_date);
    const [hours, minutes] = showtime.start_time.split(":");

    return {
      date: dateObj.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
      time: `${hours}:${minutes}`,
    };
  };

  const { date, time } = formatDateTime();

  // Get room name from showtime (đã có sẵn từ API)
  const roomName = showtime.room_name || showtime.room_id;

  // Calculate ticket price based on seat types (from lib/pricing.ts)
  const ticketTotal = calculateSeatsTotal(selectedSeats);
  const foodTotal = selectedFoods.reduce(
    (sum, food) => sum + food.price * food.quantity,
    0
  );
  const subtotal = ticketTotal + foodTotal;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleVoucherApply = (
    voucher: VoucherDetail | null,
    discount: number
  ) => {
    setAppliedVoucher(voucher);
    if (voucher === null) {
      setDiscountAmount(0);
    } else {
      // Calculate discount amount based on percentage
      if (voucher.discount) {
        const calculatedDiscount = (subtotal * discount) / 100;
        // Apply max reduction cap if exists
        const finalDiscount = voucher.discount.max_price_can_reduce
          ? Math.min(calculatedDiscount, voucher.discount.max_price_can_reduce)
          : calculatedDiscount;
        setDiscountAmount(finalDiscount);
      } else {
        setDiscountAmount(0);
      }
    }
  };

  const steps = [
    { id: "seats", label: "Chọn ghế" },
    { id: "food", label: "Bắp nước & Thanh toán" },
  ];

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Breadcrumb */}
      <div className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Breadcrumb
            items={[
              { label: "Phim", href: "/" },
              { label: movie.name, href: `/movie/${movie.movie_id}` },
              { label: "Đặt vé" },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1800px] px-4 md:px-8 py-8">
        {/* Movie Header Card */}
        <div className="mb-8 rounded-3xl bg-gradient-to-br from-card to-card/50 border border-border/50 p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
            <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-xl shadow-lg ring-1 ring-white/10">
              <img
                src={movie.image}
                alt={movie.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                {movie.name}
              </h2>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">
                    {roomName}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground capitalize">
                    {date}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">{time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Indicator */}
        <div className="mb-12">
          <div className="relative flex justify-between max-w-2xl mx-auto">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-500 ease-out"
              style={{
                width: bookingStep === "seats" ? "0%" : "100%",
              }}
            />

            {steps.map((step, index) => {
              const isActive = bookingStep === step.id;
              const isCompleted = bookingStep === "food" && index === 0;

              return (
                <div
                  key={step.id}
                  className="relative z-10 flex flex-col items-center gap-2"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-bold transition-all duration-300 border-4 ${
                      isActive
                        ? "bg-primary border-background text-primary-foreground shadow-lg shadow-primary/30 scale-110"
                        : isCompleted
                        ? "bg-primary border-background text-primary-foreground"
                        : "bg-muted border-background text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors duration-300 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3 space-y-8">
            {bookingStep === "seats" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
                <SeatSelection
                  onSeatsChange={setSelectedSeats}
                  showtimeId={showtime.showtime_id}
                />
                <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 p-4 backdrop-blur-lg">
                  <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 flex justify-end items-center gap-4">
                      <div className="text-right hidden md:block">
                        <p className="text-sm text-muted-foreground">
                          Ghế đang chọn
                        </p>
                        <p className="font-bold text-primary">
                          {selectedSeats.length > 0
                            ? selectedSeats
                                .map((s) => `${s.seat_row}${s.seat_column}`)
                                .join(", ")
                            : "Chưa chọn"}
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          if (selectedSeats.length > 0) {
                            setBookingStep("food");
                          }
                        }}
                        disabled={selectedSeats.length === 0}
                        className="min-w-[200px] h-12 text-base rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary shadow-lg hover:shadow-primary/30 transition-all"
                      >
                        Tiếp tục ({selectedSeats.length} ghế)
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {bookingStep === "food" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                <FoodSelection onFoodChange={setSelectedFoods} />

                <div className="rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                  <h3 className="mb-4 text-lg font-bold flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full" />
                    Mã khuyến mại
                  </h3>
                  <VoucherInput
                    onVoucherApply={handleVoucherApply}
                    appliedVoucher={appliedVoucher}
                    appliedDiscount={discountAmount}
                    initialCode={prefilledVoucherCode}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    onClick={() => setBookingStep("seats")}
                    variant="outline"
                    className="h-12 px-8 rounded-xl border-border/50 hover:bg-muted/50"
                  >
                    Quay lại
                  </Button>
                  <Button
                    onClick={handleCompleteBooking}
                    className="min-w-[240px] h-12 text-base rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-xl hover:shadow-primary/25 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Đang xử lý..." : "Hoàn thành đặt vé"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-3xl border border-border/50 bg-card/80 backdrop-blur-md shadow-xl overflow-hidden">
              <div className="bg-primary/5 p-6 border-b border-border/50">
                <h3 className="text-lg font-bold">Thông tin đặt vé</h3>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Ghế đang chọn</span>
                    <div className="text-right">
                      <span className="font-bold text-primary text-lg block break-all max-w-[150px]">
                        {selectedSeats.length > 0
                          ? selectedSeats
                              .map((s) => `${s.seat_row}${s.seat_column}`)
                              .join(", ")
                          : "Chưa chọn"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-border/50 border-dashed">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Vé ({selectedSeats.length})
                      </span>
                      <span className="font-medium">
                        {ticketTotal.toLocaleString("vi-VN")}₫
                      </span>
                    </div>

                    {selectedFoods.length > 0 && (
                      <div className="space-y-2">
                        {selectedFoods.map((food) => (
                          <div
                            key={food.food_id}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-muted-foreground">
                              {food.name} (x{food.quantity})
                            </span>
                            <span className="font-medium">
                              {(food.price * food.quantity).toLocaleString(
                                "vi-VN"
                              )}
                              ₫
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-border/50 border-dashed space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tạm tính</span>
                      <span className="font-medium">
                        {subtotal.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-500">
                        <span>Khuyến mãi</span>
                        <span>-{discountAmount.toLocaleString("vi-VN")}₫</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-border/50">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Tổng cộng
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {finalTotal.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    Đã bao gồm VAT
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
