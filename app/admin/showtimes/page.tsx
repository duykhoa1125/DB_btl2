"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import adminService from "@/services/adminService";
import { movieService, cinemaService, roomService } from "@/services";
import type { Showtime } from "@/services/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Calendar, Clock } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminSearch } from "@/components/admin/search";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ShowtimesPage() {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [movieFilter, setMovieFilter] = useState<string>("all");
  const [roomFilter, setRoomFilter] = useState<string>("all");
  const [cinemaFilter, setCinemaFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showtimeToDelete, setShowtimeToDelete] = useState<Showtime | null>(
    null
  );
  const { toast } = useToast();
  const [movies, setMovies] = useState<any[]>([]);
  const [cinemas, setCinemas] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      adminService.getAllShowtimes(),
      movieService.getAll(),
      cinemaService.getAll(),
      roomService.getAll(),
    ])
      .then(([showtimesData, moviesData, cinemasData, roomsData]) => {
        setShowtimes(Array.isArray(showtimesData) ? showtimesData : []);
        setMovies(Array.isArray(moviesData) ? moviesData : []);
        setCinemas(Array.isArray(cinemasData) ? cinemasData : []);
        setRooms(Array.isArray(roomsData) ? roomsData : []);
      })
      .catch((err) => {
        console.error(err);
        setShowtimes([]);
        setMovies([]);
        setCinemas([]);
        setRooms([]);
      });
  }, []);

  const filteredShowtimes = showtimes.filter((showtime: any) => {
    const movie = movies.find(
      (m) => String(m.movie_id) === String(showtime.movie_id)
    );
    const room = rooms.find(
      (r: any) => String(r.room_id) === String(showtime.room_id)
    );
    // Backend returns cinema with 'id' field, not 'cinema_id'
    const cinema = room
      ? cinemas.find((c: any) => String(c.cinema_id) === String(room.cinema_id) || String(c.id) === String(room.cinema_id))
      : null;

    const matchesSearch =
      movie?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cinema?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      showtime.cinema_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      showtime.room_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMovie =
      movieFilter === "all" || String(showtime.movie_id) === movieFilter;
    const matchesRoom =
      roomFilter === "all" ||
      rooms.find((r: any) => String(r.room_id) === String(showtime.room_id))
        ?.name === roomFilter;
    const matchesCinema =
      cinemaFilter === "all" ||
      (cinema && (String(cinema.cinema_id) === cinemaFilter || String(cinema.id) === cinemaFilter));

    return matchesSearch && matchesMovie && matchesRoom && matchesCinema;
  });

  const handleDeleteClick = (showtime: Showtime) => {
    setShowtimeToDelete(showtime);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (showtimeToDelete) {
      try {
        await adminService.deleteShowtime(showtimeToDelete.showtime_id);
        const updatedShowtimes = await adminService.getAllShowtimes();
        setShowtimes(Array.isArray(updatedShowtimes) ? updatedShowtimes : []);
        toast({
          title: "Đã xóa suất chiếu",
          description: "Suất chiếu đã được xóa thành công.",
        });
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể xóa suất chiếu.",
          variant: "destructive",
        });
      }
    }
    setDeleteDialogOpen(false);
    setShowtimeToDelete(null);
  };

  const getMovieName = (movie_id: string) => {
    return (
      movies.find((m) => String(m.movie_id) === String(movie_id))?.name ||
      "Không xác định"
    );
  };

  const getCinemaName = (room_id: string) => {
    const room = rooms.find((r: any) => String(r.room_id) === String(room_id));
    const cinema = room
      ? cinemas.find((c: any) => String(c.cinema_id) === String(room.cinema_id))
      : null;
    return cinema?.name || "Không xác định";
  };

  const getRoomName = (room_id: string) => {
    return (
      rooms.find((r: any) => String(r.room_id) === String(room_id))?.name ||
      room_id
    );
  };

  // Helper to get cinema name directly from showtime (uses response data if available)
  const getShowtimeCinemaName = (showtime: any) => {
    return showtime.cinema_name || getCinemaName(showtime.room_id);
  };

  const getShowtimeRoomName = (showtime: any) => {
    return showtime.room_name || getRoomName(showtime.room_id);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản lý Suất chiếu"
        description="Quản lý lịch chiếu phim tại tất cả các rạp"
        actionLabel="Thêm suất chiếu"
        actionLink="/admin/showtimes/new"
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/50 p-1 md:flex-row backdrop-blur-xl shadow-sm">
        <div className="relative flex-1">
          <AdminSearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Tìm kiếm suất chiếu..."
            className="w-full"
          />
        </div>
        <div className="flex gap-2 p-1 overflow-x-auto">
          <Select value={movieFilter} onValueChange={setMovieFilter}>
            <SelectTrigger className="w-[180px] h-12 bg-background/80 backdrop-blur-xl border-border/60 focus:ring-primary/10 rounded-xl transition-all hover:border-primary/30">
              <SelectValue placeholder="Lọc theo phim" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả phim</SelectItem>
              {movies.slice(0, 10).map((movie) => (
                <SelectItem key={movie.movie_id} value={String(movie.movie_id)}>
                  {movie.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={cinemaFilter} onValueChange={setCinemaFilter}>
            <SelectTrigger className="w-[180px] h-12 bg-background/80 backdrop-blur-xl border-border/60 focus:ring-primary/10 rounded-xl transition-all hover:border-primary/30">
              <SelectValue placeholder="Lọc theo rạp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả rạp</SelectItem>
              {cinemas.map((cinema: any) => (
                <SelectItem key={cinema.cinema_id || cinema.id} value={String(cinema.cinema_id || cinema.id)}>
                  {cinema.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={roomFilter} onValueChange={setRoomFilter}>
            <SelectTrigger className="w-[160px] h-12 bg-background/80 backdrop-blur-xl border-border/60 focus:ring-primary/10 rounded-xl transition-all hover:border-primary/30">
              <SelectValue placeholder="Lọc theo phòng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả phòng</SelectItem>
              {[
                ...new Map(rooms.map((room: any) => [room.name, room])).values(),
              ].map((room: any) => (
                <SelectItem key={room.name} value={room.name}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Showtimes Table */}
      <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="py-5 pl-6">Mã suất chiếu</TableHead>
              <TableHead className="py-5">Mã phim</TableHead>
              <TableHead className="py-5">Mã phòng</TableHead>
              <TableHead className="py-5">Ngày chiếu</TableHead>
              <TableHead className="py-5">Giờ bắt đầu</TableHead>
              <TableHead className="py-5">Giờ kết thúc</TableHead>
              <TableHead className="text-right py-5 pr-6">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredShowtimes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-48 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Calendar className="h-8 w-8 opacity-20" />
                    <p>Không tìm thấy suất chiếu nào</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredShowtimes.map((showtime: any) => {
                const movie = movies.find(
                  (m) => String(m.movie_id) === String(showtime.movie_id)
                );
                const duration = movie?.duration || 0;
                
                // Calculate end time
                const calculateEndTime = (startTime: string, durationMinutes: number) => {
                  if (!startTime) return "N/A";
                  const [hours, minutes] = startTime.split(':').map(Number);
                  const date = new Date();
                  date.setHours(hours, minutes, 0, 0);
                  date.setMinutes(date.getMinutes() + durationMinutes);
                  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
                };

                const endTime = calculateEndTime(showtime.start_time, duration);
                const startTimeFormatted = showtime.start_time.split(':').slice(0, 2).join(':');

                return (
                  <TableRow key={showtime.showtime_id} className="hover:bg-muted/40 transition-colors border-border/50 group">
                    <TableCell className="font-medium pl-6 py-4 text-xs font-mono text-muted-foreground">
                      {showtime.showtime_id}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-mono font-medium">{showtime.movie_id}</span>
                        <span className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {movie?.name || "Không xác định"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-mono font-medium">{showtime.room_id}</span>
                        <span className="text-xs text-muted-foreground">
                          {getShowtimeRoomName(showtime)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(showtime.start_date).toLocaleDateString("vi-VN")}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-500/10 px-2.5 py-1 rounded-md w-fit border border-green-500/20">
                        <Clock className="h-3.5 w-3.5" />
                        {startTimeFormatted}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md w-fit border border-border/50">
                        <Clock className="h-3.5 w-3.5" />
                        {endTime}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6 py-4">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-colors"
                        >
                          <Link
                            href={`/admin/showtimes/${showtime.showtime_id}/edit`}
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(showtime)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results count */}
      <div className="text-center text-sm text-muted-foreground font-medium">
        Hiển thị {filteredShowtimes.length} / {showtimes.length} suất chiếu
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xóa vĩnh viễn suất chiếu này. Hành động này không
              thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
