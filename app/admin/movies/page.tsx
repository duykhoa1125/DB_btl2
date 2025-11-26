"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { deleteMovie } from  "@/lib/admin-helpers";
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
import { Edit, Trash2, Eye } from "lucide-react";
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
    movieService.getAllWithDetails().then((data) => {
      setMovies(data);
      setLoading(false);
    }).catch((error) => {
      console.error('Failed to load movies:', error);
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
        movie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (movie.directors && movie.directors.some((d) => d.toLowerCase().includes(searchTerm.toLowerCase())));
      const matchesStatus =
        statusFilter === "all" || movie.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "year":
          return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
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

  const handleDeleteConfirm = () => {
    if (movieToDelete) {
      const success = deleteMovie(movieToDelete.movie_id);
      if (success) {
        movieService.getAllWithDetails().then(setMovies);
        toast({
          title: "Đã xóa phim",
          description: `"${movieToDelete.name}" đã được xóa thành công.`,
        });
      } else {
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
      <div className="flex flex-col gap-4 rounded-lg border border-border/50 bg-card/50 p-4 md:flex-row backdrop-blur-sm">
        <div className="relative flex-1">
          <AdminSearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Tìm kiếm theo tên, đạo diễn..."
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[200px] bg-background/50 border-border/50">
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
          <SelectTrigger className="w-full md:w-[200px] bg-background/50 border-border/50">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Tên (A-Z)</SelectItem>
            <SelectItem value="year">Ngày phát hành</SelectItem>
            <SelectItem value="rating">Đánh giá</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Movies Table */}
      <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px]">Poster</TableHead>
              <TableHead>Tên phim</TableHead>
              <TableHead>Đạo diễn</TableHead>
              <TableHead>Ngôn ngữ / Tuổi</TableHead>
              <TableHead>Thời lượng</TableHead>
              <TableHead>Đánh giá</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMovies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  Không tìm thấy phim nào
                </TableCell>
              </TableRow>
            ) : (
              filteredMovies.map((movie) => (
                <TableRow key={movie.movie_id} className="hover:bg-muted/50">
                  <TableCell>
                    <img
                      src={movie.image}
                      alt={movie.name}
                      className="h-16 w-12 rounded object-cover shadow-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{movie.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(movie.release_date).getFullYear()}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {movie.directors && movie.directors.length > 0 ? movie.directors.join(", ") : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs uppercase">
                        {movie.language}
                      </Badge>
                      {movie.age_rating > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {movie.age_rating}+
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{movie.duration} phút</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{movie.avg_rating ? movie.avg_rating.toFixed(1) : "N/A"}</span>
                      {movie.avg_rating && <span className="text-xs text-muted-foreground">/5</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        movie.status === "showing" ? "default" : "secondary"
                      }
                    >
                      {movie.status === "showing" ? "Đang chiếu" : movie.status === "upcoming" ? "Sắp chiếu" : "Đã kết thúc"}
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
                        <Link href={`/movie/${movie.movie_id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8 hover:text-primary hover:bg-primary/10"
                      >
                        <Link href={`/admin/movies/${movie.movie_id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(movie)}
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
        Hiển thị {filteredMovies.length} / {movies.length} phim
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xóa vĩnh viễn phim &quot;{movieToDelete?.name}&quot;.
              Hành động này không thể hoàn tác.
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
