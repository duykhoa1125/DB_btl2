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
import { X } from "lucide-react";

interface ReviewEditorProps {
  movieId: string;
  movieTitle: string;
  onSubmit?: (review: any) => void;
}

export function ReviewEditor({
  movieId,
  movieTitle,
  onSubmit,
}: ReviewEditorProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [inputTag, setInputTag] = useState("");

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
        <Button size="lg" className="w-full bg-red-600 hover:bg-red-700">
          ✍️ Viết đánh giá của bạn
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Đánh giá "{movieTitle}"</DialogTitle>
          <DialogDescription>
            Chia sẻ cảm nhận của bạn về bộ phim này
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Rating Stars */}
          <div>
            <label className="text-sm font-semibold mb-3 block">
              Đánh giá của bạn
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star * 2)}
                  className="text-4xl transition-transform hover:scale-110"
                >
                  <span
                    className={
                      star * 2 <= rating ? "text-yellow-400" : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">{rating}/10</p>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-semibold mb-2 block">
              Tiêu đề đánh giá
            </label>
            <Input
              placeholder="Ví dụ: Bộ phim tuyệt vời!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {title.length}/50 ký tự
            </p>
          </div>

          {/* Content */}
          <div>
            <label className="text-sm font-semibold mb-2 block">
              Nội dung đánh giá
            </label>
            <Textarea
              placeholder="Chia sẻ chi tiết cảm nhận của bạn về bộ phim..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              maxLength={500}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {content.length}/500 ký tự
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-semibold mb-2 block">
              Thẻ (chọn tối đa 3)
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleAddTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Thẻ đã chọn</label>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-2">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:opacity-70"
                      aria-label="Remove tag"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isComplete}
              className="bg-red-600 hover:bg-red-700"
            >
              Gửi đánh giá
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
