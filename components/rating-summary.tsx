"use client";

import type { Movie } from "@/lib/mock-data";
import { StarIcon } from "lucide-react";

interface RatingSummaryProps {
  movie: Movie;
  reviewCount: number;
}

export function RatingSummary({ movie, reviewCount }: RatingSummaryProps) {
  // Calculate rating distribution (simulated)
  const ratingDistribution = {
    5: 45,
    4: 30,
    3: 15,
    2: 7,
    1: 3,
  };

  const maxCount = Math.max(...Object.values(ratingDistribution));

  return (
    <div className="space-y-6 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 min-w-[120px]">
          <span className="text-5xl font-black bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
            {movie.rating.toFixed(1)}
          </span>
          <div className="flex gap-1 my-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(movie.rating / 2)
                    ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.4)]"
                    : "text-muted stroke-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <p className="text-xs font-medium text-muted-foreground">{reviewCount} đánh giá</p>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-3 w-full">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count =
              ratingDistribution[rating as keyof typeof ratingDistribution];
            const percentage = (count / maxCount) * 100;

            return (
              <div key={rating} className="flex items-center gap-3 group">
                <div className="flex items-center gap-1 w-12 justify-end">
                  <span className="text-sm font-bold text-foreground">{rating}</span>
                  <StarIcon className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                </div>
                
                <div className="h-2.5 flex-1 rounded-full bg-muted/50 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-[0_0_10px_rgba(250,204,21,0.3)] transition-all duration-500 group-hover:brightness-110"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                <span className="w-8 text-xs font-medium text-muted-foreground text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
