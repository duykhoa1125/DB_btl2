"use client";

import { useState } from "react";
import type { Review } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MessageCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface ReviewListProps {
  reviews: Review[];
  onAddReview?: () => void;
}

export function ReviewList({ reviews, onAddReview }: ReviewListProps) {
  const [sortBy, setSortBy] = useState<"newest" | "helpful" | "highest">(
    "newest"
  );
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<Record<string, string[]>>({});

  const toggleLike = (reviewId: string) => {
    const newLiked = new Set(likedReviews);
    if (newLiked.has(reviewId)) {
      newLiked.delete(reviewId);
    } else {
      newLiked.add(reviewId);
    }
    setLikedReviews(newLiked);
  };

  const handleReply = (reviewId: string) => {
    if (replyText.trim()) {
      setReplies({
        ...replies,
        [reviewId]: [...(replies[reviewId] || []), replyText],
      });
      setReplyText("");
      setReplyingTo(null);
    }
  };

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
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
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
          filteredReviews.map((review) => {
            const isLiked = likedReviews.has(review.reviewId);
            const currentLikes = review.likeCount + (isLiked ? 1 : 0);
            const isReplying = replyingTo === review.reviewId;

            return (
              <div
                key={review.reviewId}
                className="group overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "text-xl transition-all",
                          i < review.rating / 2
                            ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                            : "text-gray-300 dark:text-gray-600"
                        )}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.createdDate).toLocaleDateString("vi-VN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <h4 className="mb-2 text-lg font-bold">{review.title}</h4>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {review.content}
                </p>

                <div className="mb-4 flex flex-wrap gap-2">
                  {review.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 border-t border-border pt-4">
                  <button
                    onClick={() => toggleLike(review.reviewId)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                      isLiked
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    )}
                  >
                    <ThumbsUp
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isLiked && "scale-110"
                      )}
                      fill={isLiked ? "currentColor" : "none"}
                    />
                    <span>{currentLikes} hữu ích</span>
                  </button>

                  <button
                    onClick={() =>
                      setReplyingTo(isReplying ? null : review.reviewId)
                    }
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Trả lời</span>
                  </button>
                </div>

                {/* Reply Input */}
                {isReplying && (
                  <div className="mt-4 space-y-2 rounded-lg bg-muted/50 p-4">
                    <Textarea
                      placeholder="Viết phản hồi của bạn..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText("");
                        }}
                      >
                        Hủy
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleReply(review.reviewId)}
                        disabled={!replyText.trim()}
                        className="gap-2"
                      >
                        <Send className="h-4 w-4" />
                        Gửi
                      </Button>
                    </div>
                  </div>
                )}

                {/* Replies Display */}
                {replies[review.reviewId]?.length > 0 && (
                  <div className="mt-4 space-y-3 border-t border-border pt-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      Phản hồi ({replies[review.reviewId].length})
                    </p>
                    {replies[review.reviewId].map((reply, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg bg-muted/30 p-3 text-sm"
                      >
                        <p className="mb-1 font-medium">Bạn</p>
                        <p className="text-muted-foreground">{reply}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border-2 border-dashed border-border bg-muted/20 py-16 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              Chưa có đánh giá nào
            </p>
          </div>
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
