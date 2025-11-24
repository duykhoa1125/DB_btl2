import { Carousel } from "@/components/carousel";
import { mockMovies } from "@/lib/mock-data";
import { MovieTabs } from "@/components/movie-tabs";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  const nowShowingMovies = mockMovies.filter((m) => m.status === "Now Showing");
  const comingSoonMovies = mockMovies.filter((m) => m.status === "Coming Soon");

  return (
    <div className="bg-background">
      {/* Hero Carousel */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <Carousel
          items={nowShowingMovies.length > 0 ? nowShowingMovies : mockMovies}
        />
      </section>

      {/* Movie Listings */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-balance mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Danh sách phim
          </h2>
          <p className="text-lg text-muted-foreground">
            Khám phá những bộ phim hay nhất hiện nay
          </p>
        </div>

        <MovieTabs
          nowShowingMovies={nowShowingMovies}
          comingSoonMovies={comingSoonMovies}
        />
      </section>

      {/* Promotional Section */}
      <section className="border-y border-border bg-gradient-to-b from-card via-card/50 to-background py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-10 shadow-2xl shadow-primary/20 transition-all hover:shadow-primary/30">
            {/* Decorative elements */}
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            
            {/* Content */}
            <div className="relative flex items-start gap-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              
              <div className="flex-1">
                <h3 className="mb-3 text-3xl font-bold text-white">
                  Ưu đãi đặc biệt
                </h3>
                <p className="mb-6 max-w-2xl text-lg text-white/90">
                  Khám phá hàng ngàn voucher giảm giá và chương trình khuyến mãi hấp dẫn! Đặt vé ngay để nhận ưu đãi tốt nhất.
                </p>
                
                <Link href="/promotions">
                  <button className="group/btn inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-primary shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                    <span>Xem tất cả ưu đãi</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
