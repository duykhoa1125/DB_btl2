"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  mockBookings,
  mockShowtimes,
  mockMovies,
  mockCinemas,
} from "@/lib/mock-data";
import { QrCode, MapPin, Calendar, Clock, Armchair } from "lucide-react";

export function OrderHistoryList() {
  const { currentUser, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");

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

  const userOrders = mockBookings.filter(
    (order) => order.user_id === currentUser.user_id
  );

  const filteredOrders = userOrders.filter((order) => {
    if (activeFilter === "all") return true;
    return order.status === activeFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmed":
        return <Badge className="bg-gradient-to-r from-accent to-accent/90 text-accent-foreground shadow-sm">Đã xác nhận</Badge>;
      case "Pending_Confirmation":
        return <Badge className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-sm">Chờ xác nhận</Badge>;
      case "Cancelled":
        return <Badge className="bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground shadow-sm">Đã hủy</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getShowtimeInfo = (showtime_id: string) => {
    const showtime = mockShowtimes.find((s) => s.showtime_id === showtime_id);
    if (!showtime) return null;

    const movie = mockMovies.find((p) => p.movie_id === showtime.movie_id);
    const cinema = mockCinemas.find((r) => r.cinema_id === showtime.cinema_id);

    return { showtime, movie, cinema };
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

        <Tabs
          value={activeFilter}
          onValueChange={setActiveFilter}
          className="mb-6"
        >
          <TabsList>
            <TabsTrigger value="all">Tất cả ({userOrders.length})</TabsTrigger>
            <TabsTrigger value="Confirmed">
              Đã xác nhận (
              {userOrders.filter((o) => o.status === "Confirmed").length})
            </TabsTrigger>
            <TabsTrigger value="Pending_Confirmation">
              Chờ xác nhận (
              {
                userOrders.filter((o) => o.status === "Pending_Confirmation")
                  .length
              }
              )
            </TabsTrigger>
            <TabsTrigger value="Cancelled">
              Đã hủy (
              {userOrders.filter((o) => o.status === "Cancelled").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Không có đơn hàng nào</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const info = getShowtimeInfo(order.showtime_id);
              if (!info) return null;

              const { movie, showtime, cinema } = info;
              const orderDate = new Date(order.bookingDate);

              return (
                <div
                  key={order.booking_id}
                  className="group relative flex flex-col md:flex-row bg-card rounded-3xl overflow-hidden border border-border/50 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
                >
                  {/* Left Part - Movie Info */}
                  <div className="flex-1 p-6 flex gap-6 relative">
                    {/* Poster */}
                    <div className="shrink-0 w-24 h-36 rounded-xl overflow-hidden shadow-md hidden sm:block">
                      <img
                        src={movie?.image || "/placeholder.svg"}
                        alt={movie?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">
                            {movie?.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {cinema?.cinemaName}
                            </span>
                          </div>
                        </div>
                        <div className="md:hidden">
                           {getStatusBadge(order.status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                            <Calendar className="w-3 h-3" /> Ngày chiếu
                          </span>
                          <p className="font-medium">
                            {new Date(showtime?.startTime || "").toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                            <Clock className="w-3 h-3" /> Giờ chiếu
                          </span>
                          <p className="font-medium">
                            {new Date(showtime?.startTime || "").toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <div className="bg-muted/50 rounded-lg px-3 py-2 border border-border/50">
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-0.5">
                            <Armchair className="w-3 h-3" /> Ghế
                          </span>
                          <span className="font-bold text-primary">{order.seatList.join(", ")}</span>
                        </div>
                        <div className="bg-muted/50 rounded-lg px-3 py-2 border border-border/50">
                          <span className="text-xs text-muted-foreground block mb-0.5">Phòng</span>
                          <span className="font-bold">{showtime?.room}</span>
                        </div>
                        <div className="bg-muted/50 rounded-lg px-3 py-2 border border-border/50 ml-auto">
                          <span className="text-xs text-muted-foreground block mb-0.5">Tổng tiền</span>
                          <span className="font-bold text-primary text-lg">
                            {order.totalAmount.toLocaleString("vi-VN")}₫
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
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Mã vé</p>
                        <p className="text-xl font-mono font-bold tracking-widest text-foreground/80">{order.ticketCode}</p>
                      </div>
                      <div className="hidden md:block">
                        {getStatusBadge(order.status)}
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
