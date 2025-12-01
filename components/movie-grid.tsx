import { MovieCard } from "@/components/movie-card";
import type { Movie } from "@/services/types";
import { Sparkles, Clock } from "lucide-react";

interface MovieGridProps {
  movies: Movie[];
  emptyMessage: string;
  emptyIcon?: "sparkles" | "clock";
}

/**
 * Server Component để hiển thị danh sách phim
 * Không có state hoặc interactivity, chỉ render dữ liệu
 */
export function MovieGrid({
  movies,
  emptyMessage,
  emptyIcon = "sparkles",
}: MovieGridProps) {
  if (movies.length === 0) {
    const Icon = emptyIcon === "sparkles" ? Sparkles : Clock;

    return (
      <div className="col-span-full py-20 text-center border-2 border-dashed border-border/50 rounded-3xl bg-muted/20">
        <Icon className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
        <p className="text-lg text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.movie_id} movie={movie} />
      ))}
    </div>
  );
}
