import { Badge } from "@/components/ui/badge";
import { ShowtimeSelector } from "@/components/showtime-selector";
import { RatingSummary } from "@/components/rating-summary";
import { Breadcrumb } from "@/components/breadcrumb";

import { mockMovies, mockShowtimes, mockReviews } from "@/lib/mock-data";
import { User, Clock, Calendar, Factory, Play } from "lucide-react";

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
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Breadcrumb items={[{ label: "Phim" }]} className="mb-8" />
          <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-2xl font-bold mb-4">Phim không tìm thấy</h1>
            <p className="text-muted-foreground">Không tìm thấy thông tin phim bạn đang tìm kiếm</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-border/40 bg-card/50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Breadcrumb 
            items={[
              { label: "Phim", href: "/" },
              { label: movie.title }
            ]} 
          />
        </div>
      </div>

      {/* Hero Section - Compact Modern Layout */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        {/* Main Info - Horizontal Layout */}
        <div className="mb-8 flex flex-col gap-6 rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/20 p-6 shadow-lg md:flex-row">
          {/* Poster - Compact */}
          <div className="shrink-0">
            <div className="group relative h-[320px] w-[220px] overflow-hidden rounded-xl shadow-xl">
              <img
                src={movie.image || "/placeholder.svg"}
                alt={movie.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <a 
                href={movie.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg">
                  <Play className="h-5 w-5 text-primary-foreground" fill="currentColor" />
                </div>
              </a>
            </div>
          </div>

          {/* Info - Flexible */}
          <div className="flex-1 space-y-4">
            {/* Title & Status */}
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge variant={movie.status === "Now Showing" ? "default" : "outline"}>
                  {movie.status}
                </Badge>
                {movie.genres.slice(0, 3).map((genre) => (
                  <Badge key={genre} variant="secondary" className="bg-primary/10 text-primary">
                    {genre}
                  </Badge>
                ))}
              </div>
              <h1 className="mb-2 text-3xl font-bold leading-tight">{movie.title}</h1>
              <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {movie.description}
              </p>
            </div>

            {/* Quick Info Grid - Compact 4 columns */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className="rounded-lg bg-background/50 p-3">
                <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Thời lượng</span>
                </div>
                <p className="font-semibold text-sm">{movie.duration}′</p>
              </div>
              
              <div className="rounded-lg bg-background/50 p-3">
                <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Năm</span>
                </div>
                <p className="font-semibold text-sm">{movie.releaseYear}</p>
              </div>

              <div className="rounded-lg bg-background/50 p-3 lg:col-span-2">
                <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  <span>Đạo diễn</span>
                </div>
                <p className="font-semibold text-sm truncate">{movie.director}</p>
              </div>
            </div>

            {/* Cast - Compact horizontal scroll */}
            <div className="rounded-lg bg-background/50 p-3">
              <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                <span>Diễn viên</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {movie.actors.slice(0, 5).map((actor, index) => (
                  <span
                    key={index}
                    className="rounded-md bg-muted px-2 py-1 text-xs font-medium"
                  >
                    {actor}
                  </span>
                ))}
                {movie.actors.length > 5 && (
                  <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    +{movie.actors.length - 5}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Rating - Compact Side Panel */}
          <div className="shrink-0 md:w-[200px]">
            <div className="rounded-xl border border-border bg-card p-4">
              <RatingSummary movie={movie} reviewCount={reviewCount} />
            </div>
          </div>
        </div>

        {/* Secondary Content Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Trailer - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="border-b border-border bg-muted/30 px-4 py-3">
                <h2 className="font-semibold">Trailer</h2>
              </div>
              <div className="relative bg-black" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src={movie.trailerUrl || ""}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>
          </div>

          {/* Additional Info - 1 column */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-3 text-sm font-semibold">Thông tin thêm</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Nhà sản xuất</span>
                  <span className="font-medium">{movie.producer}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Đánh giá</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">{(movie.rating / 2).toFixed(1)}/5</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Số đánh giá</span>
                  <span className="font-medium">{reviewCount}</span>
                </div>
              </div>
            </div>

            {/* All Genres */}
            {movie.genres.length > 3 && (
              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="mb-3 text-sm font-semibold">Thể loại</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Badge key={genre} variant="secondary" className="bg-primary/10 text-primary">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Showtimes Section */}
      <section className="border-t border-border bg-gradient-to-b from-card/50 to-background py-12">
        <div className="mx-auto max-w-7xl px-6">
          {showtimes.length > 0 ? (
            <ShowtimeSelector showtimes={showtimes} movieId={movie.movieId} />
          ) : (
            <div className="rounded-xl border-2 border-dashed border-border bg-muted/20 py-16 text-center">
              <p className="text-lg font-medium text-muted-foreground mb-2">
                Không có lịch chiếu
              </p>
              <p className="text-sm text-muted-foreground">
                Hiện tại phim này chưa có lịch chiếu. Vui lòng quay lại sau.
              </p>
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
