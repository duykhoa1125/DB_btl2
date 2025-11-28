"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star, Send } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import type { MovieReview } from "@/services/types";

interface ReviewFormProps {
  movie_id: string;
  onReviewSubmit?: (review: MovieReview) => void;
}

/**
 * Client Component để viết review
 * Quản lý form state và interaction
 */
export function ReviewForm({ movie_id, onReviewSubmit }: ReviewFormProps) {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(10); // Default 10/10
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!currentUser) {
      toast({
        title: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để viết đánh giá.",
        variant: "destructive",
      });
      return;
    }

    const review: MovieReview = {
      phone_number: currentUser.phone_number,
      movie_id: movie_id,
      date_written: new Date().toISOString(),
      star_rating: rating,
      review_content: content,
    };

    // Callback to parent if provided
    if (onReviewSubmit) {
      onReviewSubmit(review);
    }

    // Reset form
    setContent("");
    setRating(10);

    toast({
      title: "Đánh giá thành công",
      description: "Cảm ơn bạn đã chia sẻ đánh giá!",
    });
  };

  const isComplete = content.trim().length > 0;

  return (
    <div className="sticky top-24 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-lg">
      <h3 className="mb-6 text-lg font-bold flex items-center gap-2">
        <span className="w-1 h-6 bg-primary rounded-full"></span>
        Viết đánh giá của bạn
      </h3>

      <div className="space-y-5">
        {/* Rating Stars */}
        <div>
          <label className="mb-3 block text-sm font-medium text-muted-foreground">
            Đánh giá
          </label>
          <div className="flex gap-2 justify-center p-4 bg-muted/30 rounded-xl border border-border/50">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star * 2)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 transition-all duration-300 ${
                    star * 2 <= rating
                      ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]"
                      : "text-muted stroke-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="mt-2 text-center text-sm font-bold text-primary">
            {rating}/10 điểm
          </p>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Nội dung
          </label>
          <Textarea
            placeholder="Chia sẻ cảm nhận của bạn..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            maxLength={500}
            className="resize-none bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
          />
          <p className="text-xs text-right text-muted-foreground">
            {content.length}/500
          </p>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!isComplete || !currentUser}
          className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/20 font-bold h-11"
          size="lg"
        >
          <Send className="h-4 w-4" />
          {currentUser ? "Gửi đánh giá" : "Đăng nhập để đánh giá"}
        </Button>
      </div>
    </div>
  );
}
