import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Star, Clock, Tag, Film } from "lucide-react";
import type { Movie, MovieDetail } from "@/services/types";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.movie_id}`} className="block h-full">
      <div className="group relative h-full transition-all duration-500 hover:-translate-y-3">
        {/* Glow behind the card */}
        <div className="absolute -inset-[1px] bg-gradient-to-b from-primary/50 via-accent/50 to-primary/50 rounded-[18px] blur-sm opacity-0 group-hover:opacity-100 transition duration-500" />

        {/* Card Container - The "Frame" */}
        <div className="relative h-full rounded-2xl bg-card border border-border transition-all duration-300 group-hover:border-primary group-hover:shadow-lg overflow-hidden">
          {/* Inner Content - Clipped */}
          <div className="relative h-full w-full overflow-hidden rounded-2xl bg-black">
            {/* Poster */}
            <div className="aspect-[2/3] w-full relative">
              <Image
                src={movie.image || "/placeholder.svg"}
                alt={movie.name}
                fill
                unoptimized
                className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:saturate-[1.2]"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

              {/* Top Right Rating Badge */}
              {(movie as MovieDetail).avg_rating !== undefined &&
                (movie as MovieDetail).avg_rating! > 0 && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-yellow-500 border border-white/10 shadow-[0_0_10px_rgba(234,179,8,0.4)]">
                      <Star className="h-3 w-3 fill-yellow-500" />
                      <span>
                        {(movie as MovieDetail).avg_rating!.toFixed(1)}
                      </span>
                    </div>
                  </div>
                )}

              {/* Age Rating Badge */}
              {movie.age_rating > 0 && (
                <div className="absolute top-3 left-3 z-10">
                  <div className="rounded-full bg-red-500/80 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-white border border-red-300/50 shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                    {movie.age_rating}+
                  </div>
                </div>
              )}
            </div>

            {/* Content Section - Slide up effect */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent transform transition-transform duration-500 translate-y-[60px] group-hover:translate-y-0">
              <div className="flex flex-col gap-1.5">
                <h3 className="line-clamp-2 text-lg font-bold text-white group-hover:text-primary transition-colors drop-shadow-md">
                  {movie.name}
                </h3>

                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-primary" />
                    <span>{movie.duration}′</span>
                  </div>
                  {movie.language && (
                    <div className="bg-purple-500/20 px-2 py-0.5 rounded uppercase">
                      {movie.language}
                    </div>
                  )}
                </div>
              </div>

              {/* Button - Revealed on hover */}
              <div className="pt-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <Button className="w-full rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 h-9 text-sm hover:scale-105 active:scale-95 transition-transform">
                  Đặt vé ngay
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
