"use client";

import { useState } from "react";
import type { MovieReview } from "@/services/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MessageCircle, Send, Filter, SortAsc } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReviewListProps {
  reviews: MovieReview[];
  onAddReview?: () => void;
}

export function ReviewList({ reviews, onAddReview }: ReviewListProps) {
  const [sortBy, setSortBy] = useState<"newest" | "highest">("newest");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<Record<string, string[]>>({});

  const handleReply = (reviewKey: string) => {
    if (replyText.trim()) {
      setReplies({
        ...replies,
        [reviewKey]: [...(replies[reviewKey] || []), replyText],
      });
      setReplyText("");
      setReplyingTo(null);
    }
  };

  const filteredReviews = reviews
    .filter((r) => (filterRating ? r.star_rating >= filterRating : true))
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.date_written).getTime() -
            new Date(a.date_written).getTime()
          );

        case "highest":
          return b.star_rating - a.star_rating;
        default:
          return 0;
      }
    })
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          <div className="flex items-center gap-2 px-2 border-r border-border/50 mr-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium hidden sm:inline">Lọc:</span>
          </div>
          <Button
            variant={filterRating === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterRating(null)}
            className={cn(
              "rounded-full transition-all",
              filterRating === null
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
            )}
          >
            Tất cả
          </Button>
          {[5, 4, 3].map((rating) => (
            <Button
              key={rating}
              variant={filterRating === rating ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterRating(rating)}
              className={cn(
                "rounded-full transition-all",
                filterRating === rating
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
              )}
            >
              {rating}+ sao
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2 min-w-[180px]">
          <SortAsc className="w-4 h-4 text-muted-foreground" />
          <Select
            value={sortBy}
            onValueChange={(value: any) => setSortBy(value)}
          >
            <SelectTrigger className="h-9 border-border/50 bg-background/50 focus:ring-primary/20">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="highest">Đánh giá cao nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => {
            const reviewKey = `${review.phone_number}-${review.date_written}`;
            const isReplying = replyingTo === reviewKey;

            return (
              <div
                key={reviewKey}
                className="group overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:bg-card/80"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex gap-1 p-1.5 rounded-lg bg-muted/30 border border-border/30">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "text-lg transition-all",
                          i < review.star_rating
                            ? "text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]"
                            : "text-muted stroke-muted-foreground/30"
                        )}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-medium text-muted-foreground bg-muted/30 px-2 py-1 rounded-md mb-1">
                      {new Date(review.date_written).toLocaleDateString(
                        "vi-VN",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {review.phone_number.replace(
                        /(\d{3})\d{4}(\d{3})/,
                        "$1****$2"
                      )}
                    </span>
                  </div>
                </div>

                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {review.review_content}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 border-t border-border/50 pt-4">
                  <button
                    onClick={() => setReplyingTo(isReplying ? null : reviewKey)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300",
                      isReplying
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Trả lời</span>
                  </button>
                </div>

                {/* Reply Input */}
                {isReplying && (
                  <div className="mt-4 space-y-3 rounded-xl bg-muted/30 p-4 border border-border/50 animate-in fade-in slide-in-from-top-2">
                    <Textarea
                      placeholder="Viết phản hồi của bạn..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="min-h-[80px] resize-none bg-background/50 border-border/50 focus:ring-primary/20"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText("");
                        }}
                        className="hover:bg-muted"
                      >
                        Hủy
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleReply(reviewKey)}
                        disabled={!replyText.trim()}
                        className="gap-2 bg-primary hover:bg-primary/90"
                      >
                        <Send className="h-3.5 w-3.5" />
                        Gửi
                      </Button>
                    </div>
                  </div>
                )}

                {/* Replies Display */}
                {replies[reviewKey]?.length > 0 && (
                  <div className="mt-4 space-y-3 border-t border-border/50 pt-4 pl-4 border-l-2 border-l-primary/20">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Phản hồi ({replies[reviewKey].length})
                    </p>
                    {replies[reviewKey].map((reply, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl bg-muted/30 p-3 text-sm border border-border/30"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-5 w-5 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] text-white font-bold">
                            B
                          </div>
                          <p className="font-bold text-foreground">Bạn</p>
                        </div>
                        <p className="text-muted-foreground pl-7">{reply}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-border/50 bg-muted/10 py-16 text-center">
            <MessageCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-lg font-medium text-muted-foreground">
              Chưa có đánh giá nào phù hợp
            </p>
            <Button
              variant="link"
              onClick={() => setFilterRating(null)}
              className="mt-2 text-primary"
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>

      {/* Add Review Button */}
      {onAddReview && (
        <Button
          onClick={onAddReview}
          className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20"
          size="lg"
        >
          Viết đánh giá của bạn
        </Button>
      )}
    </div>
  );
}
