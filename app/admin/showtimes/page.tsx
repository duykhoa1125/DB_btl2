"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllShowtimes, deleteShowtime } from "@/lib/admin-helpers";
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
import { Edit, Trash2, Calendar } from "lucide-react";
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
  const [showtimes, setShowtimes] = useState<Showtime[]>(getAllShowtimes());
  const [searchTerm, setSearchTerm] = useState("");
  const [movieFilter, setMovieFilter] = useState<string>("all");
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
      movieService.getAllWithDetails(),
      cinemaService.getAll(),
      roomService.getAll(),
    ])
      .then(([moviesData, cinemasData, roomsData]) => {
        setMovies(Array.isArray(moviesData) ? moviesData : []);
        setCinemas(Array.isArray(cinemasData) ? cinemasData : []);
        setRooms(Array.isArray(roomsData) ? roomsData : []);
      })
      .catch((err) => {
        console.error(err);
        setMovies([]);
        setCinemas([]);
        setRooms([]);
      });
  }, []);

  const filteredShowtimes = showtimes.filter((showtime) => {
    const movie = movies.find((m) => m.movie_id === showtime.movie_id);
    const room = rooms.find((r) => r.room_id === showtime.room_id);
    const cinema = room
      ? cinemas.find((c) => c.cinema_id === room.cinema_id)
      : null;

    const matchesSearch =
      movie?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cinema?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMovie =
      movieFilter === "all" || showtime.movie_id === movieFilter;
    const matchesCinema =
      cinemaFilter === "all" || room?.cinema_id === cinemaFilter;

    return matchesSearch && matchesMovie && matchesCinema;
  });

  const handleDeleteClick = (showtime: Showtime) => {
    setShowtimeToDelete(showtime);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (showtimeToDelete) {
      const success = deleteShowtime(showtimeToDelete.showtime_id);
      if (success) {
        setShowtimes(getAllShowtimes());
        toast({
          title: "Đã xóa suất chiếu",
          description: "Suất chiếu đã được xóa thành công.",
        });
      } else {
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
      movies.find((m) => m.movie_id === movie_id)?.name || "Không xác định"
    );
  };

  const getCinemaName = (room_id: string) => {
    const room = rooms.find((r) => r.room_id === room_id);
    const cinema = room
      ? cinemas.find((c) => c.cinema_id === room.cinema_id)
      : null;
    return cinema?.name || "Không xác định";
  };

  const getRoomName = (room_id: string) => {
    return rooms.find((r) => r.room_id === room_id)?.name || room_id;
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
      <div className="grid gap-4 rounded-lg border border-border/50 bg-card/50 p-4 md:grid-cols-2 lg:grid-cols-4 backdrop-blur-sm">
        <div className="relative">
          <AdminSearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Tìm kiếm suất chiếu..."
          />
        </div>
        <Select value={movieFilter} onValueChange={setMovieFilter}>
          <SelectTrigger className="bg-background/50 border-border/50">
            <SelectValue placeholder="Lọc theo phim" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả phim</SelectItem>
            {movies.slice(0, 10).map((movie) => (
              <SelectItem key={movie.movie_id} value={movie.movie_id}>
                {movie.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={cinemaFilter} onValueChange={setCinemaFilter}>
          <SelectTrigger className="bg-background/50 border-border/50">
            <SelectValue placeholder="Lọc theo rạp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả rạp</SelectItem>
            {cinemas.map((cinema) => (
              <SelectItem key={cinema.cinema_id} value={cinema.cinema_id}>
                {cinema.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Showtimes Table */}
      <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Phim</TableHead>
              <TableHead>Rạp</TableHead>
              <TableHead>Ngày & Giờ</TableHead>
              <TableHead>Phòng</TableHead>
              <TableHead>Loại vé</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredShowtimes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  Không tìm thấy suất chiếu nào
                </TableCell>
              </TableRow>
            ) : (
              filteredShowtimes.map((showtime) => (
                <TableRow
                  key={showtime.showtime_id}
                  className="hover:bg-muted/50"
                >
                  <TableCell className="font-medium">
                    {getMovieName(showtime.movie_id)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {getCinemaName(showtime.room_id)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <p className="font-medium">
                          {new Date(showtime.start_date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                        <p className="text-muted-foreground">
                          {(() => {
                            const [hours, minutes] =
                              showtime.start_time.split(":");
                            return `${hours}:${minutes}`;
                          })()}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {getRoomName(showtime.room_id)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      Ghế ngồi
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="default"
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Đang bán
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8 hover:text-primary hover:bg-primary/10"
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
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results count */}
      <div className="text-center text-sm text-muted-foreground">
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
