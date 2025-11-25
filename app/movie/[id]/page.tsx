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
        <div className="mb-8 flex flex-col gap-6 rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/20 p-6 shadow-lg lg:flex-row">
          {/* Poster - Compact */}
          <div className="shrink-0">
            <div className="group relative h-[400px] w-[270px] overflow-hidden rounded-xl shadow-xl">
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
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Badge variant={movie.status === "Now Showing" ? "default" : "outline"} className="bg-primary hover:bg-primary/90 text-primary-foreground border-none px-3 py-1">
                  {movie.status}
                </Badge>
                {movie.genres.slice(0, 3).map((genre) => (
                  <Badge key={genre} variant="secondary" className="bg-white/10 hover:bg-white/20 text-foreground border border-border/50 backdrop-blur-sm">
                    {genre}
                  </Badge>
                ))}
              </div>
              <h1 className="mb-3 text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {movie.title}
              </h1>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground line-clamp-3 font-light">
                {movie.description}
              </p>
            </div>

            {/* Quick Info Grid - Compact 4 columns */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-xl bg-background/50 border border-border/50 p-4 hover:border-primary/30 transition-colors group">
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>Thời lượng</span>
                </div>
                <p className="font-bold text-lg group-hover:text-primary transition-colors">{movie.duration}′</p>
              </div>
              
              <div className="rounded-xl bg-background/50 border border-border/50 p-4 hover:border-primary/30 transition-colors group">
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>Năm</span>
                </div>
                <p className="font-bold text-lg group-hover:text-primary transition-colors">{movie.releaseYear}</p>
              </div>

              <div className="rounded-xl bg-background/50 border border-border/50 p-4 hover:border-primary/30 transition-colors group">
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span>Đạo diễn</span>
                </div>
                <p className="font-bold text-lg truncate group-hover:text-primary transition-colors">{movie.director}</p>
              </div>

              <div className="rounded-xl bg-background/50 border border-border/50 p-4 hover:border-primary/30 transition-colors group">
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  <Factory className="h-3.5 w-3.5 text-primary" />
                  <span>Nhà sản xuất</span>
                </div>
                <p className="font-bold text-lg truncate group-hover:text-primary transition-colors">{movie.producer}</p>
              </div>
            </div>

            {/* Cast - Compact horizontal scroll */}
            <div className="rounded-xl bg-background/50 border border-border/50 p-4">
              <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                <User className="h-3.5 w-3.5 text-primary" />
                <span>Diễn viên</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {movie.actors.slice(0, 5).map((actor, index) => (
                  <span
                    key={index}
                    className="rounded-lg bg-muted/50 border border-border/50 px-3 py-1.5 text-sm font-medium hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all cursor-default"
                  >
                    {actor}
                  </span>
                ))}
                {movie.actors.length > 5 && (
                  <span className="rounded-lg bg-muted/50 border border-border/50 px-3 py-1.5 text-sm font-medium text-muted-foreground">
                    +{movie.actors.length - 5}
                  </span>
                )}
              </div>
            </div>
          </div>


        </div>

        {/* Secondary Content Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Rating Summary - Left Side */}
          <div className="lg:col-span-1">
             <RatingSummary movie={movie} reviewCount={reviewCount} />
          </div>

          {/* Trailer - Right Side */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg h-full">
              <div className="border-b border-border bg-muted/30 px-6 py-4 flex items-center gap-2">
                <Play className="h-4 w-4 text-primary" />
                <h2 className="font-bold">Trailer Official</h2>
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
