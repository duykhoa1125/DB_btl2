import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShowtimeSelector } from "@/components/showtime-selector";
import { RatingSummary } from "@/components/rating-summary";

import { mockMovies, mockShowtimes, mockReviews } from "@/lib/mock-data";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { Reviews } from "@/components/reviews";

export default async function MovieDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  console.log("Searching for movie with ID:", id);
  console.log(
    "Available movies:",
    mockMovies.map((m) => m.movieId)
  );

  const movie = mockMovies.find((m) => m.movieId === id);
  const showtimes = mockShowtimes.filter((s) => s.movieId === id);

  const reviewCount = mockReviews.filter((r) => r.movieId === id).length;

  console.log("Found movie:", movie);

  if (!movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="text-2xl font-bold mb-4">Phim không tìm thấy</h1>
        <Link href="/">
          <Button>Quay lại trang chủ</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Back Navigation */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </Link>
      </div>

      {/* Hero Section with Poster and Details */}
      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Poster and Rating */}
          <div className="md:col-span-1 space-y-4">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src={movie.image || "/placeholder.svg"}
                alt={movie.title}
                className="w-full h-auto"
              />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
              <Badge
                variant={movie.status === "Now Showing" ? "default" : "outline"}
              >
                {movie.status}
              </Badge>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <RatingSummary movie={movie} reviewCount={reviewCount} />
            </div>
          </div>

          {/* Movie Details and Trailer */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-balance mb-2">
                {movie.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                {movie.description}
              </p>
            </div>

            {/* Movie Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-card border border-border p-4">
                <p className="text-sm text-muted-foreground mb-1">Đạo diễn</p>
                <p className="font-semibold">{movie.director}</p>
              </div>
              <div className="rounded-lg bg-card border border-border p-4">
                <p className="text-sm text-muted-foreground mb-1">Thời lượng</p>
                <p className="font-semibold">{movie.duration} phút</p>
              </div>
              <div className="rounded-lg bg-card border border-border p-4">
                <p className="text-sm text-muted-foreground mb-1">
                  Năm phát hành
                </p>
                <p className="font-semibold">{movie.releaseYear}</p>
              </div>
              <div className="rounded-lg bg-card border border-border p-4">
                <p className="text-sm text-muted-foreground mb-1">
                  Nhà sản xuất
                </p>
                <p className="font-semibold">{movie.producer}</p>
              </div>
            </div>

            {/* Trailer */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Trailer</h3>
              <div
                className="relative w-full bg-black rounded-lg overflow-hidden"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  src={
                    movie.trailerUrl.replace(
                      "youtube.com/embed/",
                      "youtube.com/embed/"
                    ) || ""
                  }
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>

            {/* Cast */}
            <div>
              <h3 className="mb-2 text-lg font-bold">Diễn viên</h3>
              <p className="text-muted-foreground">{movie.actors.join(", ")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Showtimes Section */}
      <section className="border-t border-border bg-card py-8">
        <div className="mx-auto max-w-7xl px-6">
          {showtimes.length > 0 ? (
            <ShowtimeSelector showtimes={showtimes} movieId={movie.movieId} />
          ) : (
            <div className="py-12 text-center">
              <p className="text-lg text-muted-foreground mb-4">
                Không có lịch chiếu cho phim này
              </p>
              <Link href="/">
                <Button>Quay lại trang chủ</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-6">
          <Reviews movieId={movie.movieId} movieTitle={movie.title} />
        </div>
      </section>
    </div>
  );
}
