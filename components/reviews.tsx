"use client";

import { mockReviews } from "@/lib/mock-data";
import { useState } from "react";
import { ReviewList } from "@/components/review-list";
import { ReviewEditor } from "@/components/review-editor";

interface ReviewsProps {
  movieId: string;
  movieTitle: string;
}

export function Reviews({ movieId, movieTitle }: ReviewsProps) {
  const [reviews, setReviews] = useState(
    mockReviews.filter((r) => r.movieId === movieId)
  );

  const handleAddReview = (newReview: any) => {
    setReviews([newReview, ...reviews]);
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Đánh giá từ khán giả</h2>
      <ReviewEditor
        movieId={movieId}
        movieTitle={movieTitle}
        onSubmit={handleAddReview}
      />
      <div className="mt-8">
        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
}
