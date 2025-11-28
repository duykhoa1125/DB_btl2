import { Badge } from "@/components/ui/badge";
import { ShowtimeSelector } from "@/components/showtime-selector";
import { RatingSummary } from "@/components/rating-summary";
import { Breadcrumb } from "@/components/breadcrumb";

import {
  movieService,
  showtimeService,
  reviewService,
  cinemaService,
  roomService,
} from "@/services";
import { User, Clock, Calendar, Factory, Play } from "lucide-react";

import { Reviews } from "@/components/reviews";

const getEmbedUrl = (url: string | null | undefined) => {
  if (!url) return "";
  try {
    // Handle standard YouTube watch URLs
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    // Handle youtu.be short URLs
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    // Handle already embed URLs
    if (url.includes("youtube.com/embed/")) {
      return url;
    }
    return url;
  } catch (e) {
    return url || "";
  }
};

export default async function MovieDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  // Fetch data in parallel for better performance
  const [movie, showtimes, reviews, cinemas, rooms] = await Promise.all([
    movieService.getWithDetails(id),
    showtimeService.getByMovie(id),
    reviewService.getByMovie(id),
    cinemaService.getAll(),
    roomService.getAll(),
  ]);

  const reviewCount = reviews.length;

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Breadcrumb items={[{ label: "Phim" }]} className="mb-8" />
          <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-2xl font-bold mb-4">Phim không tìm thấy</h1>
            <p className="text-muted-foreground">
              Không tìm thấy thông tin phim bạn đang tìm kiếm
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Breadcrumb Navigation */}
      <div className="border-b border-border/40 bg-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Breadcrumb
            items={[{ label: "Phim", href: "/" }, { label: movie.name }]}
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
                alt={movie.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <a
                href={movie.trailer || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg">
                  <Play
                    className="h-5 w-5 text-primary-foreground"
                    fill="currentColor"
                  />
                </div>
              </a>
            </div>
          </div>

          {/* Info - Flexible */}
          <div className="flex-1 space-y-4">
            {/* Title & Status */}
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Badge
                  variant={movie.status === "showing" ? "default" : "outline"}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground border-none px-3 py-1"
                >
                  {movie.status === "showing"
                    ? "Đang chiếu"
                    : movie.status === "upcoming"
                    ? "Sắp chiếu"
                    : "Đã kết thúc"}
                </Badge>
                {movie.age_rating > 0 && (
                  <Badge
                    variant="outline"
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/50 px-3 py-1"
                  >
                    {movie.age_rating}+
                  </Badge>
                )}
              </div>

              <h1 className="mb-3 text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {movie.name}
              </h1>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground line-clamp-3 font-light">
                {movie.synopsis || ""}
              </p>
            </div>

            {/* Quick Info Grid - Compact 4 columns */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-xl bg-gradient-to-br from-background/80 to-muted/20 border border-border/50 p-4 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>Thời lượng</span>
                </div>
                <p className="font-bold text-lg group-hover:text-primary transition-colors">
                  {movie.duration}′
                </p>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-background/80 to-muted/20 border border-border/50 p-4 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>Năm</span>
                </div>
                <p className="font-bold text-lg group-hover:text-primary transition-colors">
                  {new Date(movie.release_date).getFullYear()}
                </p>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-background/80 to-muted/20 border border-border/50 p-4 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span>Đạo diễn</span>
                </div>
                <p className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                  {movie.directors && movie.directors.length > 0
                    ? movie.directors.join(", ")
                    : "Chưa cập nhật"}
                </p>
              </div>

              {movie.language && (
                <div className="rounded-xl bg-gradient-to-br from-background/80 to-muted/20 border border-border/50 p-4 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                  <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    <span>Ngôn ngữ</span>
                  </div>
                  <p className="font-bold text-lg uppercase group-hover:text-primary transition-colors">
                    {movie.language}
                  </p>
                </div>
              )}
            </div>

            {/* Cast - Compact horizontal scroll */}
            <div className="rounded-xl bg-gradient-to-br from-background/80 to-muted/20 border border-border/50 p-4">
              <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                <User className="h-3.5 w-3.5 text-primary" />
                <span>Diễn viên</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {movie.actors &&
                  movie.actors.slice(0, 5).map((actor, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-card border border-border/50 px-4 py-1.5 text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all cursor-default shadow-sm"
                    >
                      {actor}
                    </span>
                  ))}
                {movie.actors && movie.actors.length > 5 && (
                  <span className="rounded-full bg-muted/50 border border-border/50 px-3 py-1.5 text-sm font-medium text-muted-foreground">
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
            <RatingSummary movie={movie} reviews={reviews} />
          </div>

          {/* Trailer - Right Side */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg h-full">
              <div className="border-b border-border bg-muted/30 px-6 py-4 flex items-center gap-2">
                <Play className="h-4 w-4 text-primary" />
                <h2 className="font-bold">Trailer Official</h2>
              </div>
              <div
                className="relative bg-black"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  src={getEmbedUrl(movie.trailer)}
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
            <ShowtimeSelector
              showtimes={showtimes}
              movie_id={movie.movie_id}
              cinemas={cinemas}
              rooms={rooms}
            />
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
          <Reviews
            movie_id={movie.movie_id}
            movieTitle={movie.name}
            initialReviews={reviews}
          />
        </div>
      </section>
    </div>
  );
}
