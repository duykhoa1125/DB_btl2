import { reviewService } from "@/services";
import { ReviewList } from "@/components/review-list";

interface ReviewListServerProps {
  movie_id: string;
}

/**
 * Server Component để fetch và render danh sách reviews
 * Data được fetch ở server → tốt cho SEO
 */
export async function ReviewListServer({ movie_id }: ReviewListServerProps) {
  const reviews = await reviewService.getByMovie(movie_id);

  return <ReviewList reviews={reviews} />;
}
