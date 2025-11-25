"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getBillsByPhone,
  getTicketsByBill,
  MOCK_SHOWTIMES,
  MOCK_CINEMAS,
  MOCK_ROOMS,
  getMovieWithDetails
} from "@/services/mock-data";
import { QrCode, MapPin, Calendar, Clock, Armchair } from "lucide-react";

export function OrderHistoryList() {
  const { currentUser, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push("/account/login");
    }
  }, [currentUser, authLoading, router]);

  if (authLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center py-12">
        <p>Đang tải...</p>
      </div>
    );
  }

  const userBills = getBillsByPhone(currentUser.phone_number);

  const getShowtimeInfo = (showtime_id: string) => {
    const showtime = MOCK_SHOWTIMES.find((s) => s.showtime_id === showtime_id);
    if (!showtime) return null;

    const movie = getMovieWithDetails(showtime.movie_id);
    const room = MOCK_ROOMS.find(r => r.room_id === showtime.room_id);
    const cinema = room ? MOCK_CINEMAS.find((c) => c.cinema_id === room.cinema_id) : null;

    return { showtime, movie, cinema, room };
  };

  return (
    <div className="px-4 py-12 bg-background">
      <div className="mx-auto max-w-4xl">

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Lịch sử đơn hàng</h1>
          <p className="text-muted-foreground">
            Quản lý và xem chi tiết các đơn đặt vé của bạn
          </p>
        </div>

        {userBills.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Không có đơn hàng nào</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {userBills.map((bill) => {
              const tickets = getTicketsByBill(bill.bill_id);
              if (tickets.length === 0) return null;

              // Assuming all tickets in a bill are for the same showtime for display purposes
              const firstTicket = tickets[0];
              const info = getShowtimeInfo(firstTicket.showtime_id);
              if (!info) return null;

              const { movie, showtime, cinema, room } = info;
              
              // Seat list string
              const seatList = tickets.map(t => `${t.seat_row}${t.seat_column}`).join(", ");

              return (
                <div
                  key={bill.bill_id}
                  className="group relative flex flex-col md:flex-row bg-card rounded-3xl overflow-hidden border border-border/50 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
                >
                  {/* Left Part - Movie Info */}
                  <div className="flex-1 p-6 flex gap-6 relative">
                    {/* Poster */}
                    <div className="shrink-0 w-24 h-36 rounded-xl overflow-hidden shadow-md hidden sm:block">
                      <img
                        src={movie?.image || "/placeholder.svg"}
                        alt={movie?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">
                            {movie?.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {cinema?.name}
                            </span>
                          </div>
                        </div>
                        <div className="md:hidden">
                           <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Đã thanh toán</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                            <Calendar className="w-3 h-3" /> Ngày chiếu
                          </span>
                          <p className="font-medium">
                            {showtime?.start_date ? new Date(showtime.start_date).toLocaleDateString("vi-VN") : ''}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                            <Clock className="w-3 h-3" /> Giờ chiếu
                          </span>
                          <p className="font-medium">
                            {showtime?.start_time ? (() => {
                              const [hours, minutes] = showtime.start_time.split(':');
                              return `${hours}:${minutes}`;
                            })() : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <div className="bg-muted/50 rounded-lg px-3 py-2 border border-border/50">
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-0.5">
                            <Armchair className="w-3 h-3" /> Ghế
                          </span>
                          <span className="font-bold text-primary">{seatList}</span>
                        </div>
                        <div className="bg-muted/50 rounded-lg px-3 py-2 border border-border/50">
                          <span className="text-xs text-muted-foreground block mb-0.5">Phòng</span>
                          <span className="font-bold">{room?.name || showtime?.room_id}</span>
                        </div>
                        <div className="bg-muted/50 rounded-lg px-3 py-2 border border-border/50 ml-auto">
                          <span className="text-xs text-muted-foreground block mb-0.5">Tổng tiền</span>
                          <span className="font-bold text-primary text-lg">
                            {bill.total_price.toLocaleString("vi-VN")}₫
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Decorative Elements for Ticket Look */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-[80%] border-r-2 border-dashed border-border/40 hidden md:block" />
                    <div className="absolute -right-3 top-0 w-6 h-6 bg-background rounded-full hidden md:block z-10" />
                    <div className="absolute -right-3 bottom-0 w-6 h-6 bg-background rounded-full hidden md:block z-10" />
                  </div>

                  {/* Right Part - Stub */}
                  <div className="w-full md:w-72 bg-muted/30 p-6 flex flex-col items-center justify-center gap-4 border-t md:border-t-0 md:border-l border-dashed border-border/50 relative">
                    {/* Notches for right side to match */}
                    <div className="absolute -left-3 top-0 w-6 h-6 bg-background rounded-full hidden md:block z-10" />
                    <div className="absolute -left-3 bottom-0 w-6 h-6 bg-background rounded-full hidden md:block z-10" />

                    <div className="bg-white p-3 rounded-xl shadow-sm">
                      <QrCode className="w-24 h-24 text-black" />
                    </div>
                    
                    <div className="text-center w-full space-y-2">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Mã đơn</p>
                        <p className="text-xl font-mono font-bold tracking-widest text-foreground/80">{bill.bill_id}</p>
                      </div>
                      <div className="hidden md:block">
                        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Đã thanh toán</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
