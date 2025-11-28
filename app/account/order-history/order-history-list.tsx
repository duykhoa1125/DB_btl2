"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { billService, ticketService, showtimeService, movieService, cinemaService, roomService } from "@/services";
import { QrCode, MapPin, Calendar, Clock, Armchair, Ticket } from "lucide-react";

export function OrderHistoryList() {
  const { currentUser, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [userBills, setUserBills] = useState<any[]>([]);
  const [billDetails, setBillDetails] = useState<Map<string, any>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push("/account/login");
    } else if (currentUser) {
      billService.getByUser(currentUser.phone_number).then(async (bills) => {
        setUserBills(bills);
        
        // Load all bill details
        const detailsMap = new Map();
        for (const bill of bills) {
          try {
            const tickets = await ticketService.getByBill(bill.bill_id);
            if (tickets.length > 0) {
              const firstTicket = tickets[0];
              const showtime = await showtimeService.getById(firstTicket.showtime_id);
              if (showtime) {
                const [movie, room] = await Promise.all([
                  movieService.getWithDetails(showtime.movie_id),
                  roomService.getById(showtime.room_id)
                ]);
                const cinema = room ? await cinemaService.getById(room.cinema_id) : null;
                detailsMap.set(bill.bill_id, { tickets, showtime, movie, cinema, room });
              }
            }
          } catch (error) {
            console.error(`Error loading bill ${bill.bill_id}:`, error);
          }
        }
        setBillDetails(detailsMap);
        setLoading(false);
      }).catch((error) => {
        console.error('Failed to load bills:', error);
        setLoading(false);
      });
    }
  }, [currentUser, authLoading, router]);

  if (authLoading || !currentUser || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />
      
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-6 py-16">
        {/* Hero Section */}
        <div className="mb-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Ticket className="w-4 h-4" />
            <span>Vé Của Tôi</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 tracking-tight">
            Lịch Sử Đặt Vé
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Quản lý và xem lại toàn bộ lịch sử đặt vé của bạn tại CinemaHub.
          </p>
        </div>

        {userBills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border/50 rounded-3xl bg-card/30 backdrop-blur-sm">
            <div className="h-24 w-24 bg-muted/50 rounded-full flex items-center justify-center mb-6">
              <Ticket className="w-12 h-12 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Chưa có đơn hàng nào
            </h3>
            <p className="text-muted-foreground">
              Bạn chưa thực hiện giao dịch đặt vé nào.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {userBills.map((bill) => {
              const details = billDetails.get(bill.bill_id);
              if (!details) return null;
              
              const { tickets, movie, showtime, cinema, room } = details;
              const seatList = tickets.map((t: any) => `${t.seat_row}${t.seat_column}`).join(", ");

              return (
                <div
                  key={bill.bill_id}
                  className="group relative flex flex-col md:flex-row bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-border/50 shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-500"
                >
                  {/* Left Part - Movie Info */}
                  <div className="flex-1 p-8 flex gap-8 relative">
                    {/* Poster */}
                    <div className="shrink-0 w-32 h-48 rounded-2xl overflow-hidden shadow-lg hidden sm:block group-hover:scale-105 transition-transform duration-500">
                      <img
                        src={movie?.image || "/placeholder.svg"}
                        alt={movie?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                            {movie?.name}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md border border-border/50">
                              <MapPin className="w-3.5 h-3.5 text-primary" /> {cinema?.name}
                            </span>
                          </div>
                        </div>
                        <div className="md:hidden">
                           <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">Đã thanh toán</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <span className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-bold">
                            <Calendar className="w-3.5 h-3.5 text-primary" /> Ngày chiếu
                          </span>
                          <p className="font-semibold text-lg">
                            {showtime?.start_date ? new Date(showtime.start_date).toLocaleDateString("vi-VN") : ''}
                          </p>
                        </div>
                        <div className="space-y-1.5">
                          <span className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-bold">
                            <Clock className="w-3.5 h-3.5 text-primary" /> Giờ chiếu
                          </span>
                          <p className="font-semibold text-lg">
                            {showtime?.start_time ? (() => {
                              const [hours, minutes] = showtime.start_time.split(':');
                              return `${hours}:${minutes}`;
                            })() : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 pt-2">
                        <div className="bg-background/50 rounded-xl px-4 py-2 border border-border/50 shadow-sm">
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1 font-medium">
                            <Armchair className="w-3.5 h-3.5" /> Ghế
                          </span>
                          <span className="font-bold text-primary text-lg">{seatList}</span>
                        </div>
                        <div className="bg-background/50 rounded-xl px-4 py-2 border border-border/50 shadow-sm">
                          <span className="text-xs text-muted-foreground block mb-1 font-medium">Phòng</span>
                          <span className="font-bold text-lg">{room?.name || showtime?.room_id}</span>
                        </div>
                        <div className="bg-primary/5 rounded-xl px-4 py-2 border border-primary/10 shadow-sm ml-auto">
                          <span className="text-xs text-muted-foreground block mb-1 font-medium">Tổng tiền</span>
                          <span className="font-black text-primary text-xl">
                            {bill.total_price.toLocaleString("vi-VN")}₫
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Decorative Elements for Ticket Look */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-[80%] border-r-2 border-dashed border-border/40 hidden md:block" />
                    <div className="absolute -right-4 top-0 w-8 h-8 bg-background rounded-full hidden md:block z-10 border-b border-border/50" />
                    <div className="absolute -right-4 bottom-0 w-8 h-8 bg-background rounded-full hidden md:block z-10 border-t border-border/50" />
                  </div>

                  {/* Right Part - Stub */}
                  <div className="w-full md:w-80 bg-muted/30 p-8 flex flex-col items-center justify-center gap-6 border-t md:border-t-0 md:border-l border-dashed border-border/50 relative">
                    {/* Notches for right side to match */}
                    <div className="absolute -left-4 top-0 w-8 h-8 bg-background rounded-full hidden md:block z-10 border-b border-border/50" />
                    <div className="absolute -left-4 bottom-0 w-8 h-8 bg-background rounded-full hidden md:block z-10 border-t border-border/50" />

                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-border/20">
                      <QrCode className="w-32 h-32 text-black" />
                    </div>
                    
                    <div className="text-center w-full space-y-3">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Mã đơn hàng</p>
                        <p className="text-xl font-mono font-black tracking-widest text-foreground">{bill.bill_id}</p>
                      </div>
                      <div className="hidden md:block">
                        <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20 px-4 py-1">Đã thanh toán</Badge>
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