"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import adminService from "@/services/adminService";
import { movieService } from "@/services";
import type { MovieDetail } from "@/services/types";
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
import { Edit, Trash2, Eye, Film } from "lucide-react";
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

export default function MoviesPage() {
  const [movies, setMovies] = useState<MovieDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    movieService
      .getAll()
      .then((data) => {
        setMovies(
          Array.isArray(data) ? (data as unknown as MovieDetail[]) : []
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load movies:", error);
        setMovies([]);
        setLoading(false);
      });
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<MovieDetail | null>(null);
  const { toast } = useToast();

  // Filter and sort movies
  const filteredMovies = movies
    .filter((movie) => {
      const matchesSearch =
        movie.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || movie.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "year":
          return (
            new Date(b.release_date).getTime() -
            new Date(a.release_date).getTime()
          );
        case "rating":
          return (b.avg_rating || 0) - (a.avg_rating || 0);
        default:
          return 0;
      }
    });

  const handleDeleteClick = (movie: MovieDetail) => {
    setMovieToDelete(movie);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (movieToDelete) {
      try {
        await adminService.deleteMovie(movieToDelete.movie_id);
        const updatedMovies = await movieService.getAll();
        setMovies(
          Array.isArray(updatedMovies)
            ? (updatedMovies as unknown as MovieDetail[])
            : []
        );
        toast({
          title: "Đã xóa phim",
          description: `"${movieToDelete.name}" đã được xóa thành công.`,
        });
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể xóa phim.",
          variant: "destructive",
        });
      }
    }
    setDeleteDialogOpen(false);
    setMovieToDelete(null);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản lý Phim"
        description="Quản lý danh sách phim, lịch chiếu và thông tin chi tiết"
        actionLabel="Thêm phim mới"
        actionLink="/admin/movies/new"
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/50 p-1 md:flex-row backdrop-blur-xl shadow-sm">
        <div className="relative flex-1">
          <AdminSearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Tìm kiếm theo tên phim..."
            className="w-full"
          />
        </div>
        <div className="flex gap-2 p-1">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px] h-12 bg-background/80 backdrop-blur-xl border-border/60 focus:ring-primary/10 rounded-xl transition-all hover:border-primary/30">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="showing">Đang chiếu</SelectItem>
              <SelectItem value="upcoming">Sắp chiếu</SelectItem>
              <SelectItem value="ended">Đã kết thúc</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px] h-12 bg-background/80 backdrop-blur-xl border-border/60 focus:ring-primary/10 rounded-xl transition-all hover:border-primary/30">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Tên (A-Z)</SelectItem>
              <SelectItem value="year">Ngày phát hành</SelectItem>
              <SelectItem value="rating">Đánh giá</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Movies Table */}
      <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="w-[100px] py-5 pl-6">Poster</TableHead>
              <TableHead className="py-5">Tên phim</TableHead>
              <TableHead className="py-5">Ngôn ngữ / Tuổi</TableHead>
              <TableHead className="py-5">Thời lượng</TableHead>
              <TableHead className="py-5">Đánh giá</TableHead>
              <TableHead className="py-5">Trạng thái</TableHead>
              <TableHead className="text-right py-5 pr-6">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMovies.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-48 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Film className="h-8 w-8 opacity-20" />
                    <p>Không tìm thấy phim nào</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredMovies.map((movie) => (
                <TableRow key={movie.movie_id} className="hover:bg-muted/40 transition-colors border-border/50 group">
                  <TableCell className="pl-6 py-4">
                    {movie.image ? (
                      <div className="relative h-20 w-14 overflow-hidden rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300 ring-1 ring-border/50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={movie.image}
                          alt={movie.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-20 w-14 items-center justify-center rounded-lg bg-muted text-muted-foreground ring-1 ring-border/50">
                        <Film className="h-8 w-8 opacity-50" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="font-bold text-base text-foreground group-hover:text-primary transition-colors">{movie.name}</div>
                    <div className="text-xs text-muted-foreground mt-1 font-medium">
                      {new Date(movie.release_date).getFullYear()}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider bg-secondary/50 border border-border/50">
                        {movie.language}
                      </Badge>
                      {movie.age_rating > 0 && (
                        <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary bg-primary/5">
                          {movie.age_rating}+
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium py-4">
                    {movie.duration} phút
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border ${
                        (movie.avg_rating || 0) >= 4.5 ? "bg-green-500/10 text-green-600 border-green-500/20" :
                        (movie.avg_rating || 0) >= 3.5 ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" :
                        "bg-red-500/10 text-red-600 border-red-500/20"
                      }`}>
                        {movie.avg_rating ? movie.avg_rating.toFixed(1) : "-"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      className={`font-medium border shadow-sm ${
                        movie.status === "showing" 
                          ? "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20" 
                          : movie.status === "upcoming"
                          ? "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20"
                          : "bg-slate-500/10 text-slate-600 border-slate-500/20 hover:bg-slate-500/20"
                      }`}
                    >
                      {movie.status === "showing"
                        ? "Đang chiếu"
                        : movie.status === "upcoming"
                        ? "Sắp chiếu"
                        : "Đã kết thúc"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6 py-4">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <Link href={`/movie/${movie.movie_id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-colors"
                      >
                        <Link href={`/admin/movies/${movie.movie_id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(movie)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
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
      <div className="text-center text-sm text-muted-foreground font-medium">
        Hiển thị {filteredMovies.length} / {movies.length} phim
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xóa vĩnh viễn phim &quot;{movieToDelete?.name}
              &quot;. Hành động này không thể hoàn tác.
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
