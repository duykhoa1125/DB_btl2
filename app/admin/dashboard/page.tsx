"use client";

import { MOCK_MOVIES, MOCK_CINEMAS, MOCK_BILLS } from "@/services/mock-data";
import { getMovieWithDetails } from "@/services/mock-data";
import {
  calculateMonthlyRevenue,
  getTotalBookingsThisMonth,
  getTopMoviesByRevenue,
} from "@/lib/admin-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, MapPin, Ticket, DollarSign, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const stats = {
    totalMovies: MOCK_MOVIES.length,
    nowShowing: MOCK_MOVIES.filter((m) => m.status === "showing").length,
    comingSoon: MOCK_MOVIES.filter((m) => m.status === "upcoming").length,
    totalCinemas: MOCK_CINEMAS.length,
    totalBookingsThisMonth: getTotalBookingsThisMonth(),
    monthlyRevenue: calculateMonthlyRevenue(currentYear, currentMonth),
  };

  const topMovies = getTopMoviesByRevenue(5).map(item => {
    const detail = getMovieWithDetails(item.movie.movie_id);
    return {
      ...item,
      movie: detail || item.movie
    };
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-4xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to CinemaHub Admin Panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Movies */}
        <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Movies</CardTitle>
            <div className="rounded-lg bg-blue-500/20 p-2">
              <Film className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalMovies}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {stats.nowShowing} now showing, {stats.comingSoon} coming soon
            </p>
          </CardContent>
        </Card>

        {/* Total Cinemas */}
        <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cinemas</CardTitle>
            <div className="rounded-lg bg-purple-500/20 p-2">
              <MapPin className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCinemas}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Active cinema locations
            </p>
          </CardContent>
        </Card>

        {/* Bookings This Month */}
        <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-green-500/10 via-transparent to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bookings (This Month)
            </CardTitle>
            <div className="rounded-lg bg-green-500/20 p-2">
              <Ticket className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.totalBookingsThisMonth}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Total bookings in {currentDate.toLocaleString("default", { month: "long" })}
            </p>
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <div className="rounded-lg bg-yellow-500/20 p-2">
              <DollarSign className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.monthlyRevenue.toLocaleString("vi-VN")} VNĐ
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Revenue for {currentDate.toLocaleString("default", { month: "long" })} {currentYear}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Movies by Revenue */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Top 5 Movies by Revenue</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {topMovies.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No revenue data available
            </p>
          ) : (
            <div className="space-y-4">
              {topMovies.map((item, index) => (
                <div
                  key={item.movie.movie_id}
                  className="flex items-center gap-4 rounded-lg border border-border/50 bg-card/50 p-4 transition-colors hover:bg-card"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {index + 1}
                  </div>
                  <img
                    src={item.movie.image}
                    alt={item.movie.name}
                    className="h-16 w-12 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.movie.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.movie.release_date).getFullYear()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      {item.revenue.toLocaleString("vi-VN")} VNĐ
                    </p>
                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Bookings (Bills) */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_BILLS.slice(0, 5).map((bill) => (
              <div
                key={bill.bill_id}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-4"
              >
                <div>
                  <p className="font-medium">Bill #{bill.bill_id}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(bill.creation_date).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    {bill.total_price.toLocaleString("vi-VN")} VNĐ
                  </p>
                  <span className="inline-block rounded-full px-2 py-1 text-xs font-medium bg-green-500/10 text-green-600">
                    Paid
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
