import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Star, Clock, Tag, Film } from "lucide-react";
import type { Movie } from "@/lib/mock-data";

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
        <div className="relative h-full rounded-[18px] bg-card border border-white/10 p-1.5 shadow-2xl overflow-hidden ring-1 ring-black/5">
            
            {/* Inner Content - Clipped */}
            <div className="relative h-full w-full overflow-hidden rounded-xl bg-black">
                {/* Poster */}
                <div className="aspect-[2/3] w-full relative">
                     <Image
                        src={movie.image || "/placeholder.svg"}
                        alt={movie.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

                      {/* Top Right Rating Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        <div className="flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-yellow-500 border border-white/10 shadow-sm">
                            <Star className="h-3 w-3 fill-yellow-500" />
                            <span>{(movie.rating / 2).toFixed(1)}</span>
                        </div>
                      </div>
                </div>
                
                {/* Content Section - Slide up effect */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/95 to-transparent transform transition-transform duration-500 translate-y-[60px] group-hover:translate-y-0">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="line-clamp-2 text-lg font-bold text-white group-hover:text-primary transition-colors drop-shadow-md">
                      {movie.title}
                    </h3>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-300 mb-1">
                       <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-primary" />
                          <span>{movie.duration}′</span>
                       </div>
                    </div>

                  </div>

                  {/* Button - Revealed on hover */}
                  <div className="pt-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <Button className="w-full rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 h-9 text-sm">
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
