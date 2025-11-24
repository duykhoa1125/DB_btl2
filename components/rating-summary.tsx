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
    <div className="space-y-4">
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold">{movie.rating.toFixed(1)}</span>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`h-5 w-5 ${
                i < Math.round(movie.rating / 2)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{reviewCount} đánh giá</p>

      {/* Rating Distribution */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count =
            ratingDistribution[rating as keyof typeof ratingDistribution];
          const percentage = (count / maxCount) * 100;

          return (
            <div key={rating} className="flex items-center gap-2">
              <span className="w-12 text-sm text-muted-foreground">
                {rating} sao
              </span>
              <div className="h-2 w-32 flex-1 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-yellow-400 transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-12 text-right text-sm text-muted-foreground">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
