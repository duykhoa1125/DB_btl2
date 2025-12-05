"use client";

import { useState, useEffect } from "react";
import adminService, { type TopRevenueMovie } from "@/services/adminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Film,
  MapPin,
  Ticket,
  DollarSign,
  PlayCircle,
  CalendarClock,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/page-header";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({
    total_movies: 0,
    now_showing: 0,
    coming_soon: 0,
    total_cinemas: 0,
    monthly_revenue: 0,
    bookings_this_month: 0,
  });
  const [topRevenueMovies, setTopRevenueMovies] = useState<TopRevenueMovie[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsData, topRevenueData] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getTopRevenue(),
        ]);
        setStats(statsData);
        setTopRevenueMovies(topRevenueData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  if (loading) {
    return <div>Loading stats...</div>;
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Tổng quan"
        description="Chào mừng trở lại với trang quản trị CinemaHub"
      />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Movies */}
        <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group">
          <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng số phim</CardTitle>
            <div className="rounded-xl bg-blue-500/20 p-2.5 group-hover:scale-110 transition-transform duration-300">
              <Film className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-foreground">{stats.total_movies}</div>
            <p className="mt-1 text-xs text-blue-500/80 font-medium">
              Phim trong hệ thống
            </p>
          </CardContent>
        </Card>

        {/* Now Showing */}
        <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 group">
          <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đang chiếu</CardTitle>
            <div className="rounded-xl bg-indigo-500/20 p-2.5 group-hover:scale-110 transition-transform duration-300">
              <PlayCircle className="h-5 w-5 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-foreground">{stats.now_showing}</div>
            <p className="mt-1 text-xs text-indigo-500/80 font-medium">
              Phim đang hoạt động
            </p>
          </CardContent>
        </Card>

        {/* Coming Soon */}
        <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-pink-500/10 via-pink-500/5 to-transparent hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300 group">
          <div className="absolute inset-0 bg-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sắp chiếu</CardTitle>
            <div className="rounded-xl bg-pink-500/20 p-2.5 group-hover:scale-110 transition-transform duration-300">
              <CalendarClock className="h-5 w-5 text-pink-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-foreground">{stats.coming_soon}</div>
            <p className="mt-1 text-xs text-pink-500/80 font-medium">
              Phim sắp ra mắt
            </p>
          </CardContent>
        </Card>

        {/* Total Cinemas */}
        <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group">
          <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng số rạp</CardTitle>
            <div className="rounded-xl bg-purple-500/20 p-2.5 group-hover:scale-110 transition-transform duration-300">
              <MapPin className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-foreground">{stats.total_cinemas}</div>
            <p className="mt-1 text-xs text-purple-500/80 font-medium">
              Chi nhánh đang hoạt động
            </p>
          </CardContent>
        </Card>

        {/* Bookings This Month */}
        <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 group">
          <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vé bán trong tháng
            </CardTitle>
            <div className="rounded-xl bg-emerald-500/20 p-2.5 group-hover:scale-110 transition-transform duration-300">
              <Ticket className="h-5 w-5 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-foreground">
              {stats.bookings_this_month}
            </div>
            <p className="mt-1 text-xs text-emerald-500/80 font-medium">
              Tháng {currentMonth}/{currentYear}
            </p>
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 group">
          <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Doanh thu tháng
            </CardTitle>
            <div className="rounded-xl bg-amber-500/20 p-2.5 group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="h-5 w-5 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-foreground">
              {stats.monthly_revenue?.toLocaleString("vi-VN")} đ
            </div>
            <p className="mt-1 text-xs text-amber-500/80 font-medium">
              Tháng {currentMonth}/{currentYear}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Revenue Movies Section */}
      <Card className="overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md shadow-xl">
        <CardHeader className="border-b border-border/50 bg-muted/30 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-inner">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Phim có doanh thu cao nhất</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground font-medium">
                Top {topRevenueMovies.length} phim dẫn đầu doanh thu
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {topRevenueMovies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border border-dashed border-border/50 rounded-xl bg-card/20">
              <Film className="h-12 w-12 mb-4 opacity-20" />
              <p>Chưa có dữ liệu doanh thu</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topRevenueMovies.map((movie, index) => {
                // Styling for top 3
                let rankStyle = "bg-muted/50 text-muted-foreground border-border/50";
                let containerStyle = "border-border/50 bg-card/50 hover:border-primary/30";
                let glow = "";
                
                if (index === 0) {
                  rankStyle = "bg-yellow-500/10 text-yellow-600 border-yellow-500/30";
                  containerStyle = "border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/50";
                  glow = "shadow-[0_0_30px_-10px_rgba(234,179,8,0.2)]";
                } else if (index === 1) {
                  rankStyle = "bg-slate-300/20 text-slate-500 border-slate-400/30";
                  containerStyle = "border-slate-400/30 bg-slate-400/5 hover:border-slate-400/50";
                } else if (index === 2) {
                  rankStyle = "bg-orange-700/10 text-orange-700 border-orange-700/30";
                  containerStyle = "border-orange-700/30 bg-orange-700/5 hover:border-orange-700/50";
                }

                return (
                  <div
                    key={index}
                    className={`group relative flex items-center justify-between p-5 rounded-xl border transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${containerStyle} ${glow}`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg border ${rankStyle}`}>
                        #{index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                          {movie.ten_phim}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge variant="secondary" className="text-[10px] h-5 font-bold tracking-wider border border-border/50">
                            TOP REVENUE
                          </Badge>
                          <span className="text-xs text-muted-foreground font-mono">
                            {movie.ma_phim}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary font-mono tracking-tight">
                        {(movie.doanh_thu ?? 0).toLocaleString("vi-VN")} đ
                      </div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mt-1">
                        Tổng doanh thu
                      </p>
                    </div>
                    
                    {/* Tech line decoration */}
                    {index < 3 && (
                      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
