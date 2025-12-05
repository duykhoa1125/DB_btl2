"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  cinemaService,
  showtimeService,
  roomService,
  movieService,
} from "@/services";
import type { Showtime, Cinema, Room, Movie } from "@/services/types";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock, Film } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CinemaDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [cinema, setCinema] = useState<Cinema | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch cinema, showtimes, and rooms in parallel
        const [cinemaData, showtimesData, roomsData, moviesData] =
          await Promise.all([
            cinemaService.getById(id),
            showtimeService.getByCinema(id),
            roomService.getByCinema(id),
            movieService.getAll(),
          ]);

        setCinema(cinemaData);
        setShowtimes(Array.isArray(showtimesData) ? showtimesData : []);
        setRooms(Array.isArray(roomsData) ? roomsData : []);
        setMovies(Array.isArray(moviesData) ? moviesData : []);
      } catch (err) {
        setError("Không thể tải thông tin rạp chiếu");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4 mx-auto"></div>
          <p className="text-muted-foreground">Đang tải thông tin rạp...</p>
        </div>
      </div>
    );
  }

  if (error || !cinema) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy rạp chiếu</h1>
          <p className="text-muted-foreground mb-4">
            {error || "Rạp chiếu không tồn tại"}
          </p>
          <Link href="/cinemas" className="text-primary hover:underline">
            ← Quay lại danh sách rạp
          </Link>
        </div>
      </div>
    );
  }

  // Filter showtimes by cinema's rooms
  const roomIds = rooms.map((r) => r.room_id);
  const cinemaShowtimes = showtimes.filter((s) => roomIds.includes(s.room_id));

  // 2. Get unique dates from start_date
  const uniqueDates = Array.from(
    new Set(cinemaShowtimes.map((s) => s.start_date))
  ).sort();

  // 3. Set default date if not set
  if (!selectedDate && uniqueDates.length > 0) {
    setSelectedDate(uniqueDates[0]);
  }

  // 4. Filter showtimes by selected date
  const showtimesOnDate = selectedDate
    ? cinemaShowtimes.filter((s) => s.start_date === selectedDate)
    : [];

  // 5. Group showtimes by Movie
  const showtimesByMovie = showtimesOnDate.reduce((acc, showtime) => {
    if (!acc[showtime.movie_id]) {
      acc[showtime.movie_id] = [];
    }
    acc[showtime.movie_id].push(showtime);
    return acc;
  }, {} as Record<string, Showtime[]>);

  // Helper functions
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      dayName: date.toLocaleDateString("vi-VN", { weekday: "short" }),
      dayNum: date.getDate(),
      monthName: date.toLocaleDateString("vi-VN", { month: "short" }),
      full: date.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    };
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[300px] w-full overflow-hidden bg-muted/30">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <Film className="w-64 h-64" />
        </div>
        <div className="absolute inset-0 bg-background/60" />

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="mx-auto max-w-7xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {cinema.name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{cinema.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-12">
          {/* Main Content: Showtimes */}
          <div className="space-y-8">
            {/* Sticky Date Selector */}
            <div className="sticky top-[72px] z-30 -mx-6 px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 py-4 border-b border-border/40 transition-all">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold">Lịch Chiếu Phim</h2>
              </div>

              <div className="relative">
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                  {uniqueDates.map((date) => {
                    const { dayName, dayNum, monthName } = formatDate(date);
                    const isSelected = selectedDate === date;

                    return (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={cn(
                          "flex flex-col items-center justify-center min-w-[70px] h-20 rounded-xl border transition-all duration-300 snap-start",
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 scale-105 ring-2 ring-primary/20"
                            : "bg-card border-border/50 text-muted-foreground hover:border-primary/50 hover:bg-accent hover:text-foreground"
                        )}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {dayName}
                        </span>
                        <span className="text-2xl font-black">{dayNum}</span>
                        <span className="text-[10px] font-medium">
                          {monthName}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {/* Fade effect for scroll */}
                <div className="absolute right-0 top-0 bottom-2 w-12 bg-background pointer-events-none" />
              </div>
            </div>

            {/* Movies List */}
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {Object.keys(showtimesByMovie).length > 0 ? (
                Object.entries(showtimesByMovie).map(
                  ([movie_id, showtimes]) => {
                    const movie = movies.find((m) => m.movie_id === movie_id);
                    if (!movie) return null;

                    return (
                      <div
                        key={movie_id}
                        className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/40 p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                      >
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Movie Poster */}
                          <Link
                            href={`/movie/${movie_id}`}
                            className="shrink-0 relative group/poster"
                          >
                            <div className="relative h-52 w-36 overflow-hidden rounded-2xl shadow-md">
                              <Image
                                src={movie.image}
                                alt={movie.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover/poster:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/20 group-hover/poster:bg-transparent transition-colors" />
                            </div>
                          </Link>

                          {/* Movie Info & Showtimes */}
                          <div className="flex-1 space-y-5">
                            <div>
                              <Link
                                href={`/movie/${movie_id}`}
                                className="inline-block"
                              >
                                <h3 className="text-2xl font-bold hover:text-primary transition-colors duration-300">
                                  {movie.name}
                                </h3>
                              </Link>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-2">
                                <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-md">
                                  <Clock className="h-3.5 w-3.5 text-primary" />
                                  <span>{movie.duration} phút</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <p className="text-sm font-medium text-foreground/80">
                                Suất chiếu:
                              </p>
                              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                {showtimes.map((showtime) => (
                                  <Link
                                    key={showtime.showtime_id}
                                    href={`/book-ticket/${showtime.showtime_id}`}
                                    className="group/time relative flex flex-col items-center justify-center rounded-xl border border-border/50 bg-background/50 py-2.5 hover:border-primary hover:bg-primary/5 hover:shadow-md hover:shadow-primary/10 transition-all duration-300"
                                  >
                                    <span className="text-lg font-bold text-foreground group-hover/time:text-primary transition-colors">
                                      {formatTime(showtime.start_time)}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                                      {(() => {
                                        const room = rooms.find(
                                          (r) => r.room_id === showtime.room_id
                                        );
                                        return (
                                          room?.name.replace("Room", "R") ||
                                          showtime.room_id
                                        );
                                      })()}
                                    </span>
                                    <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary opacity-0 group-hover/time:opacity-100 transition-opacity" />
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border/50 rounded-3xl bg-muted/10">
                  <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                    <Film className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    Không có suất chiếu
                  </h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    Hiện tại rạp chưa có lịch chiếu cho ngày này. Vui lòng chọn
                    ngày khác.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
