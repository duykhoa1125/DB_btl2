import { Carousel } from "@/components/carousel";
import { movieService } from "@/services";
import { MovieTabs } from "@/components/movie-tabs";
import Link from "next/link";
import { Sparkles, ArrowRight, Film } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const allMovies = await movieService.getAllWithDetails();
  const nowShowingMovies = allMovies.filter((m) => m.status === "showing");
  const comingSoonMovies = allMovies.filter((m) => m.status === "upcoming");

  return (
    <div className="bg-background relative">
      {/* Ambient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-8 pb-6">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Film className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Premium Cinema Experience</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
            Đặt vé phim <span className="text-primary">online</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trải nghiệm điện ảnh đỉnh cao với hệ thống đặt vé thông minh
          </p>
        </div>
        
        <Carousel
          items={nowShowingMovies.length > 0 ? nowShowingMovies : allMovies}
        />
      </section>

      {/* Movie Listings */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Phim đang chiếu
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Khám phá những bộ phim blockbuster và các tác phẩm nghệ thuật đặc sắc
          </p>
        </div>

        <MovieTabs
          nowShowingMovies={nowShowingMovies}
          comingSoonMovies={comingSoonMovies}
        />
      </section>

      {/* Promotional Section */}
      <section className="border-y border-border/40 bg-gradient-to-b from-card/30 via-card/50 to-background py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="group relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/90 via-primary to-primary/80 p-12 shadow-2xl hover:shadow-primary/30 transition-all duration-500">
            {/* Animated Glow Effects */}
            <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-white/20 blur-3xl animate-pulse" />
            <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-accent/30 blur-3xl animate-pulse delay-500" />
            
            {/* Content */}
            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm ring-4 ring-white/30">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="mb-4 text-4xl font-bold text-white">
                  Ưu đãi đặc biệt dành cho bạn
                </h3>
                <p className="mb-8 max-w-2xl text-lg text-white/95 leading-relaxed">
                  Khám phá hàng ngàn voucher giảm giá và chương trình khuyến mãi độc quyền. 
                  Đặt vé ngay hôm nay để nhận ưu đãi tốt nhất!
                </p>
                
                <Link href="/promotions">
                  <button className="group/btn inline-flex items-center gap-3 rounded-2xl bg-white px-10 py-5 font-bold text-primary shadow-2xl transition-all hover:scale-105 hover:shadow-white/20 active:scale-95">
                    <span className="text-lg">Xem tất cả ưu đãi</span>
                    <ArrowRight className="h-6 w-6 transition-transform group-hover/btn:translate-x-2" />
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
