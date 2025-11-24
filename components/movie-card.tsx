import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Movie } from "@/lib/mock-data";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.movieId}`}>
      <div className="group relative overflow-hidden rounded-lg bg-card transition-all duration-300 hover:shadow-2xl">
        <div className="aspect-[2/3] overflow-hidden bg-muted">
          <img
            src={movie.image || "/placeholder.svg"}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute bottom-0 left-0 right-0 translate-y-full space-y-3 bg-gradient-to-t from-black/95 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
          <h3 className="line-clamp-2 text-sm font-bold text-white">
            {movie.title}
          </h3>
          <div className="space-y-1 text-xs text-gray-300">
            <p>⏱️ {movie.duration} phút</p>
            <p>⭐ {movie.rating}/10</p>
            <p className="line-clamp-1">{movie.director}</p>
          </div>
          <Button className="w-full bg-red-600 hover:bg-red-700" size="sm">
            Mua vé
          </Button>
        </div>
      </div>
    </Link>
  );
}
