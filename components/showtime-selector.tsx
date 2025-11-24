"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Showtime } from "@/lib/mock-data";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShowtimeSelectorProps {
  showtimes: Showtime[];
  movieId: string;
}

export function ShowtimeSelector({
  showtimes,
  movieId,
}: ShowtimeSelectorProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);

  // Format time from ISO datetime
  const formatTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const getMonthName = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleDateString("vi-VN", {
      month: "short",
    });
  };

  // Group showtimes by date and cinema
  const groupedShowtimes = showtimes.reduce((acc, showtime) => {
    const date = showtime.startTime.split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(showtime);
    return acc;
  }, {} as Record<string, Showtime[]>);

  const dateKeys = Object.keys(groupedShowtimes).sort();

  // Auto-select first date if none selected
  if (!selectedDate && dateKeys.length > 0) {
    setSelectedDate(dateKeys[0]);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Lịch chiếu</h3>
          <p className="text-sm text-muted-foreground">
            Chọn ngày và suất chiếu phù hợp
          </p>
        </div>
      </div>

      {/* Date Selector - Premium Pills */}
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {dateKeys.map((date) => {
            const dateObj = new Date(date);
            const dayName = dateObj.toLocaleDateString("vi-VN", {
              weekday: "short",
            });
            const dayNum = dateObj.getDate();
            const monthName = getMonthName(date);
            const isSelected = selectedDate === date;

            return (
              <button
                key={date}
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedShowtime(null);
                }}
                className={cn(
                  "group relative flex shrink-0 flex-col items-center gap-1 rounded-xl border-2 px-6 py-4 transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary shadow-lg shadow-primary/20"
                    : "border-border bg-card hover:border-primary/50 hover:shadow-md"
                )}
              >
                <span
                  className={cn(
                    "text-xs font-medium uppercase tracking-wider",
                    isSelected
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {dayName}
                </span>
                <span
                  className={cn(
                    "text-2xl font-bold",
                    isSelected
                      ? "text-primary-foreground"
                      : "text-foreground"
                  )}
                >
                  {dayNum}
                </span>
                <span
                  className={cn(
                    "text-xs",
                    isSelected
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  )}
                >
                  {monthName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Showtimes for selected date */}
      {selectedDate && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">
              {formatDate(selectedDate)}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groupedShowtimes[selectedDate].map((showtime) => {
              const isSelected = selectedShowtime === showtime.showtimeId;

              return (
                <div
                  key={showtime.showtimeId}
                  onClick={() =>
                    setSelectedShowtime(
                      isSelected ? null : showtime.showtimeId
                    )
                  }
                  className={cn(
                    "group relative cursor-pointer overflow-hidden rounded-xl border-2 p-5 transition-all duration-200",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                      : "border-border bg-card hover:border-primary/30 hover:shadow-md"
                  )}
                >
                  {/* Status Badge */}
                  <div className="absolute right-3 top-3">
                    <Badge
                      variant={
                        showtime.status === "Available"
                          ? "default"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {showtime.status === "Available" ? "Còn vé" : "Hết vé"}
                    </Badge>
                  </div>

                  {/* Time Display */}
                  <div className="mb-4 flex items-baseline gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-3xl font-bold">
                      {formatTime(showtime.startTime)}
                    </span>
                  </div>

                  {/* Room Info */}
                  <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{showtime.room}</span>
                  </div>

                  {/* Price */}
                  <div className="mb-4 flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg font-bold text-primary">
                      {showtime.ticketPrice.toLocaleString("vi-VN")}₫
                    </span>
                  </div>

                  {/* Book Button */}
                  {isSelected && (
                    <Link
                      href={`/book-ticket/${showtime.showtimeId}`}
                      className="block"
                    >
                      <Button
                        className="w-full bg-primary shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
                        size="lg"
                      >
                        Đặt vé ngay
                      </Button>
                    </Link>
                  )}

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 h-full w-1 bg-primary" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {dateKeys.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-border bg-muted/20 py-16 text-center">
          <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-medium text-muted-foreground">
            Chưa có lịch chiếu
          </p>
        </div>
      )}
    </div>
  );
}
