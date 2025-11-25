"use client";

import { mockReviews } from "@/lib/mock-data";
import { useState } from "react";
import { ReviewList } from "@/components/review-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Star, Send, MessageSquarePlus } from "lucide-react";

interface ReviewsProps {
  movie_id: string;
  movieTitle: string;
}

export function Reviews({ movie_id, movieTitle }: ReviewsProps) {
  const [reviews, setReviews] = useState(
    mockReviews.filter((r) => r.movie_id === movie_id)
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
      review_id: `review_${Date.now()}`,
      movie_id: movie_id,
      user_id: "current_user",
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
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <MessageSquarePlus className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Đánh giá từ khán giả</h2>
      </div>
      
      {/* Side-by-side layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Write Review Form - Left Side (Sticky) */}
        <div className="lg:col-span-1">
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
                <p className="mt-2 text-center text-sm font-bold text-primary">{rating}/10 điểm</p>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Tiêu đề
                </label>
                <Input
                  placeholder="Bộ phim tuyệt vời!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={50}
                  className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                />
                <p className="text-xs text-right text-muted-foreground">
                  {title.length}/50
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

              {/* Tags */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
                  Thẻ (tối đa 3)
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleAddTag(tag)}
                      disabled={selectedTags.includes(tag)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-300 border ${
                        selectedTags.includes(tag)
                          ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                          : "bg-muted/30 text-muted-foreground border-transparent hover:bg-muted hover:border-border"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 p-3 bg-muted/30 rounded-xl border border-border/50">
                    {selectedTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1 bg-background border border-border/50 pl-2 pr-1 py-1">
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:bg-destructive/10 hover:text-destructive rounded-full p-0.5 transition-colors"
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
                className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/20 font-bold h-11"
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
