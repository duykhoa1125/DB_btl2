"use client";

import { useState, useEffect } from "react";
import adminService from "@/services/adminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Film,
  MapPin,
  Ticket,
  DollarSign,
  PlayCircle,
  CalendarClock,
} from "lucide-react";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
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
        <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số phim</CardTitle>
            <div className="rounded-lg bg-blue-500/20 p-2">
              <Film className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total_movies}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Phim trong hệ thống
            </p>
          </CardContent>
        </Card>

        {/* Now Showing */}
        <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang chiếu</CardTitle>
            <div className="rounded-lg bg-indigo-500/20 p-2">
              <PlayCircle className="h-4 w-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.now_showing}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Phim đang hoạt động
            </p>
          </CardContent>
        </Card>

        {/* Coming Soon */}
        <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-pink-500/10 via-transparent to-transparent hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sắp chiếu</CardTitle>
            <div className="rounded-lg bg-pink-500/20 p-2">
              <CalendarClock className="h-4 w-4 text-pink-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.coming_soon}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Phim sắp ra mắt
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
            <div className="text-3xl font-bold">{stats.total_cinemas}</div>
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
              {stats.bookings_this_month}
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
              {stats.monthly_revenue?.toLocaleString("vi-VN")} đ
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Tháng {currentMonth}/{currentYear}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
