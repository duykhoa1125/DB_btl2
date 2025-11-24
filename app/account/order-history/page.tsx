"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

export default function OrderHistoryPage() {
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
    (order) => order.userId === currentUser.userId
  );

  const filteredOrders = userOrders.filter((order) => {
    if (activeFilter === "all") return true;
    return order.status === activeFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmed":
        return <Badge className="bg-green-600">Đã xác nhận</Badge>;
      case "Pending_Confirmation":
        return <Badge className="bg-yellow-600">Chờ xác nhận</Badge>;
      case "Cancelled":
        return <Badge className="bg-red-600">Đã hủy</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getShowtimeInfo = (showtimeId: string) => {
    const showtime = mockShowtimes.find((s) => s.showtimeId === showtimeId);
    if (!showtime) return null;

    const movie = mockMovies.find((p) => p.movieId === showtime.movieId);
    const cinema = mockCinemas.find((r) => r.cinemaId === showtime.cinemaId);

    return { showtime, movie, cinema };
  };

  return (
    <div className="px-4 py-12 bg-background">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Link
            href="/account/profile"
            className="text-sm text-red-600 hover:underline"
          >
            ← Quay lại hồ sơ
          </Link>
        </div>

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
              const info = getShowtimeInfo(order.showtimeId);
              if (!info) return null;

              const { movie, showtime, cinema } = info;
              const orderDate = new Date(order.bookingDate);

              return (
                <Card
                  key={order.bookingId}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Phim</p>
                        <p className="font-medium">{movie?.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rạp</p>
                        <p className="font-medium">{cinema?.cinemaName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ngày giờ</p>
                        <p className="font-medium">
                          {new Date(showtime?.startTime || "").toLocaleString(
                            "vi-VN",
                            {
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Trạng thái
                          </p>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Mã vé</p>
                          <p className="font-mono text-sm font-medium">
                            {order.ticketCode}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Ghế</p>
                          <p className="font-medium">
                            {order.seatList.join(", ")}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Phòng</p>
                          <p className="font-medium">{showtime?.room}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Tổng tiền</p>
                          <p className="font-bold text-red-600">
                            {order.totalAmount.toLocaleString("vi-VN")}₫
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Đặt lúc</p>
                          <p className="font-medium text-xs">
                            {orderDate.toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
