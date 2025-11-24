"use client";

import { useState } from "react";
import type { Review } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp } from "lucide-react";

interface ReviewListProps {
  reviews: Review[];
  onAddReview?: () => void;
}

export function ReviewList({ reviews, onAddReview }: ReviewListProps) {
  const [sortBy, setSortBy] = useState<"newest" | "helpful" | "highest">(
    "newest"
  );
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const filteredReviews = reviews
    .filter((r) => (filterRating ? r.rating >= filterRating : true))
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdDate).getTime() -
            new Date(a.createdDate).getTime()
          );
        case "helpful":
          return b.likeCount - a.likeCount;
        case "highest":
          return b.rating - a.rating;
        default:
          return 0;
      }
    })
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filterRating === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterRating(null)}
          >
            Tất cả
          </Button>
          {[5, 4, 3].map((rating) => (
            <Button
              key={rating}
              variant={filterRating === rating ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterRating(rating)}
            >
              {rating}+ sao
            </Button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="newest">Mới nhất</option>
          <option value="helpful">Hữu ích nhất</option>
          <option value="highest">Đánh giá cao nhất</option>
        </select>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div
              key={review.reviewId}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < review.rating / 2
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.createdDate).toLocaleDateString("vi-VN")}
                </span>
              </div>

              <h4 className="mb-2 font-semibold">{review.title}</h4>
              <p className="mb-3 text-sm text-muted-foreground">
                {review.content}
              </p>

              <div className="mb-3 flex flex-wrap gap-2">
                {review.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ThumbsUp className="h-4 w-4" />
                <span>{review.likeCount} người hữu ích</span>
              </button>
            </div>
          ))
        ) : (
          <p className="text-center py-8 text-muted-foreground">
            Chưa có đánh giá nào
          </p>
        )}
      </div>

      {/* Add Review Button */}
      {onAddReview && (
        <Button onClick={onAddReview} className="w-full" size="lg">
          Viết đánh giá của bạn
        </Button>
      )}
    </div>
  );
}
