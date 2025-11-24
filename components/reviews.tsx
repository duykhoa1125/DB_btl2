"use client";

import { mockReviews } from "@/lib/mock-data";
import { useState } from "react";
import { ReviewList } from "@/components/review-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Star, Send } from "lucide-react";

interface ReviewsProps {
  movieId: string;
  movieTitle: string;
}

export function Reviews({ movieId, movieTitle }: ReviewsProps) {
  const [reviews, setReviews] = useState(
    mockReviews.filter((r) => r.movieId === movieId)
  );
  
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const availableTags = [
    "Hay",
    "Tuyệt vời",
    "Kém",
    "Cảm động",
    "Hài hước",
    "Hư cấu",
    "Thực tế",
    "Tác động",
  ];

  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag) && selectedTags.length < 3) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleSubmit = () => {
    const review = {
      reviewId: `review_${Date.now()}`,
      movieId: movieId,
      userId: "current_user",
      rating: rating,
      title: title,
      content: content,
      tags: selectedTags,
      likeCount: 0,
      createdDate: new Date().toISOString(),
    };

    setReviews([review, ...reviews]);

    // Reset form
    setTitle("");
    setContent("");
    setRating(5);
    setSelectedTags([]);
  };

  const isComplete = title.trim() && content.trim() && selectedTags.length > 0;

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Đánh giá từ khán giả</h2>
      
      {/* Side-by-side layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Write Review Form - Left Side (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Viết đánh giá của bạn</h3>
            
            <div className="space-y-4">
              {/* Rating Stars */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Đánh giá
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star * 2)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-7 w-7 ${
                          star * 2 <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{rating}/10</p>
              </div>

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Tiêu đề
                </label>
                <Input
                  placeholder="Bộ phim tuyệt vời!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={50}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {title.length}/50
                </p>
              </div>

              {/* Content */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Nội dung
                </label>
                <Textarea
                  placeholder="Chia sẻ cảm nhận của bạn..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  maxLength={500}
                  className="resize-none"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {content.length}/500
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Thẻ (tối đa 3)
                </label>
                <div className="mb-3 flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleAddTag(tag)}
                      disabled={selectedTags.includes(tag)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:opacity-70"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={!isComplete}
                className="w-full gap-2"
                size="lg"
              >
                <Send className="h-4 w-4" />
                Gửi đánh giá
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews List - Right Side */}
        <div className="lg:col-span-2">
          <ReviewList reviews={reviews} />
        </div>
      </div>
    </div>
  );
}
