"use client";

import { useState, useEffect } from "react";
import { movieService, cinemaService, billService } from "@/services";
import adminService from "@/services/adminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, MapPin, Ticket, DollarSign, TrendingUp } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";

export default function AdminDashboard() {
  const [movies, setMovies] = useState<any[]>([]);
  const [cinemas, setCinemas] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [topMovies, setTopMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      movieService.getAll(),
      cinemaService.getAll(),
      billService.getAll(),
    ])
      .then(async ([moviesData, cinemasData, billsData]) => {
        setMovies(Array.isArray(moviesData) ? moviesData : []);
        setCinemas(Array.isArray(cinemasData) ? cinemasData : []);
        setBills(Array.isArray(billsData) ? billsData : []);

        // Get stats from admin service
        const stats = await adminService.getDashboardStats();
        const enhancedTopMovies = await Promise.all(
          (stats.topMovies || []).map(async (item: any) => {
            try {
              const detail = await movieService.getWithDetails(
                item.movie.movie_id
              );
              return { ...item, movie: detail || item.movie };
            } catch {
              return item;
            }
          })
        );
        setTopMovies(enhancedTopMovies);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load dashboard data:", error);
        setMovies([]);
        setCinemas([]);
        setBills([]);
        setLoading(false);
      });
  }, []);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const dashboardStats = {
    totalMovies: movies.length,
    nowShowing: movies.filter((m: any) => m.status === "showing").length,
    comingSoon: movies.filter((m: any) => m.status === "upcoming").length,
    totalCinemas: cinemas.length,
    totalBookingsThisMonth:
      topMovies.length > 0 ? (topMovies as any)[0]?.totalBookings || 0 : 0,
    monthlyRevenue:
      topMovies.length > 0 ? (topMovies as any)[0]?.monthlyRevenue || 0 : 0,
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Tổng quan"
        description="Chào mừng trở lại với trang quản trị CinemaHub"
      />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Movies */}
        <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số phim</CardTitle>
            <div className="rounded-lg bg-blue-500/20 p-2">
              <Film className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dashboardStats.totalMovies}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {dashboardStats.nowShowing} đang chiếu,{" "}
              {dashboardStats.comingSoon} sắp chiếu
            </p>
          </CardContent>
        </Card>

        {/* Total Cinemas */}
        <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số rạp</CardTitle>
            <div className="rounded-lg bg-purple-500/20 p-2">
              <MapPin className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dashboardStats.totalCinemas}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Chi nhánh đang hoạt động
            </p>
          </CardContent>
        </Card>

        {/* Bookings This Month */}
        <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-green-500/10 via-transparent to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vé bán trong tháng
            </CardTitle>
            <div className="rounded-lg bg-green-500/20 p-2">
              <Ticket className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dashboardStats.totalBookingsThisMonth}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Tháng {currentMonth}/{currentYear}
            </p>
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Doanh thu tháng
            </CardTitle>
            <div className="rounded-lg bg-yellow-500/20 p-2">
              <DollarSign className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dashboardStats.monthlyRevenue.toLocaleString("vi-VN")} đ
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Tháng {currentMonth}/{currentYear}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Movies by Revenue */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Top 5 Phim Doanh Thu Cao Nhất</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {topMovies.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Chưa có dữ liệu doanh thu
            </p>
          ) : (
            <div className="space-y-4">
              {topMovies.map((item, index) => (
                <div
                  key={item.movie.movie_id}
                  className="flex items-center gap-4 rounded-lg border border-border/50 bg-card/50 p-4 transition-all hover:bg-card hover:shadow-md hover:scale-[1.01]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {index + 1}
                  </div>
                  <img
                    src={item.movie.image}
                    alt={item.movie.name}
                    className="h-16 w-12 rounded object-cover shadow-sm"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.movie.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Năm phát hành:{" "}
                      {new Date(item.movie.release_date).getFullYear()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      {item.revenue.toLocaleString("vi-VN")} đ
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Tổng doanh thu
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Bookings (Bills) */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Giao Dịch Gần Đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bills.slice(0, 5).map((bill) => (
              <div
                key={bill.bill_id}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-4 transition-colors hover:bg-card"
              >
                <div>
                  <p className="font-medium">Hóa đơn #{bill.bill_id}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(bill.creation_date).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    {bill.total_price.toLocaleString("vi-VN")} đ
                  </p>
                  <span className="inline-block rounded-full px-2 py-1 text-xs font-medium bg-green-500/10 text-green-600">
                    Đã thanh toán
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
