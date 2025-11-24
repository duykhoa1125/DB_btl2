"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Showtime } from "@/lib/mock-data";

interface ShowtimeSelectorProps {
  showtimes: Showtime[];
  movieId: string;
}

export function ShowtimeSelector({
  showtimes,
  movieId,
}: ShowtimeSelectorProps) {
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

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Chọn lịch chiếu</h3>

      {/* Date tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {dateKeys.map((date) => {
          const dateObj = new Date(date);
          const dayName = dateObj.toLocaleDateString("vi-VN", {
            weekday: "short",
          });
          const dayNum = dateObj.getDate();

          return (
            <Button
              key={date}
              variant={
                selectedShowtime?.startsWith(date) ? "default" : "outline"
              }
              onClick={() => {
                const firstShowtime = groupedShowtimes[date][0].showtimeId;
                setSelectedShowtime(`${date}_${firstShowtime}`);
              }}
              className="whitespace-nowrap"
            >
              <span className="text-xs">{dayName}</span>
              <span className="ml-2 font-bold">{dayNum}</span>
            </Button>
          );
        })}
      </div>

      {/* Showtimes for selected date */}
      {dateKeys.map((date) => {
        const isSelected = selectedShowtime?.startsWith(date);
        if (!isSelected) return null;

        return (
          <div key={date} className="space-y-4">
            <p className="text-sm text-muted-foreground">{formatDate(date)}</p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {groupedShowtimes[date].map((showtime) => {
                const isSelectedShowtime = selectedShowtime?.endsWith(
                  showtime.showtimeId
                );

                return (
                  <div
                    key={showtime.showtimeId}
                    className={`rounded-lg border-2 p-4 transition-all cursor-pointer ${
                      isSelectedShowtime
                        ? "border-red-600 bg-red-50"
                        : "border-border hover:border-red-300"
                    }`}
                    onClick={() =>
                      setSelectedShowtime(`${date}_${showtime.showtimeId}`)
                    }
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-foreground">
                          {formatTime(showtime.startTime)}
                        </div>
                        <Badge
                          variant={
                            showtime.status === "Available"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {showtime.status === "Available"
                            ? "Còn vé"
                            : "Hết vé"}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {showtime.room}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {showtime.ticketPrice.toLocaleString("vi-VN")}₫
                    </p>

                    {isSelectedShowtime && (
                      <Link href={`/book-ticket/${showtime.showtimeId}`}>
                        <Button className="mt-3 w-full bg-red-600 hover:bg-red-700">
                          Chọn ghế
                        </Button>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
