"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Star, PenLine, Send } from "lucide-react";

interface ReviewEditorProps {
  movie_id: string;
  movieTitle: string;
  onSubmit?: (review: any) => void;
}

export function ReviewEditor({
  movie_id,
  movieTitle,
  onSubmit,
}: ReviewEditorProps) {
  const [open, setOpen] = useState(false);
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

    onSubmit?.(review);

    // Reset form
    setTitle("");
    setContent("");
    setRating(5);
    setSelectedTags([]);
    setOpen(false);
  };

  const isComplete = title.trim() && content.trim() && selectedTags.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/20 font-bold h-12 text-lg group">
          <PenLine className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" /> 
          Viết đánh giá của bạn
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Đánh giá "{movieTitle}"
          </DialogTitle>
          <DialogDescription className="text-base">
            Chia sẻ cảm nhận chân thực của bạn về bộ phim này
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Rating Stars */}
          <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-2xl border border-border/50">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Đánh giá của bạn
            </label>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star * 2)}
                  className="transition-transform hover:scale-110 focus:outline-none group"
                >
                  <Star
                    className={`h-10 w-10 transition-all duration-300 ${
                      star * 2 <= rating
                        ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                        : "text-muted stroke-muted-foreground/30 group-hover:stroke-yellow-400/50"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-lg font-bold text-primary mt-3">{rating}/10 điểm</p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">
              Tiêu đề đánh giá
            </label>
            <Input
              placeholder="Ví dụ: Bộ phim tuyệt vời!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={50}
              className="bg-background/50 border-border/50 h-11 focus:ring-primary/20"
            />
            <p className="text-xs text-right text-muted-foreground">
              {title.length}/50 ký tự
            </p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">
              Nội dung đánh giá
            </label>
            <Textarea
              placeholder="Chia sẻ chi tiết cảm nhận của bạn về bộ phim..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              maxLength={500}
              className="resize-none bg-background/50 border-border/50 focus:ring-primary/20"
            />
            <p className="text-xs text-right text-muted-foreground">
              {content.length}/500 ký tự
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground">
              Thẻ (chọn tối đa 3)
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleAddTag(tag)}
                  disabled={selectedTags.includes(tag)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${
                    selectedTags.includes(tag)
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105"
                      : "bg-muted/30 text-muted-foreground border-transparent hover:bg-muted hover:border-border"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {selectedTags.length > 0 && (
              <div className="space-y-2 p-4 bg-muted/30 rounded-xl border border-border/50">
                <label className="text-xs font-bold uppercase text-muted-foreground">Thẻ đã chọn</label>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1.5 pl-3 pr-1.5 py-1.5 bg-background border border-border/50">
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:bg-destructive/10 hover:text-destructive rounded-full p-0.5 transition-colors"
                        aria-label="Remove tag"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border/50">
            <Button variant="ghost" onClick={() => setOpen(false)} className="hover:bg-muted">
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isComplete}
              className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 min-w-[140px]"
            >
              <Send className="w-4 h-4 mr-2" />
              Gửi đánh giá
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
