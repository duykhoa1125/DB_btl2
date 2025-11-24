import { Carousel } from "@/components/carousel";
import { mockMovies } from "@/lib/mock-data";
import { MovieTabs } from "@/components/movie-tabs";
import Link from "next/link";

export default function Home() {
  const nowShowingMovies = mockMovies.filter((m) => m.status === "Now Showing");
  const comingSoonMovies = mockMovies.filter((m) => m.status === "Coming Soon");

  return (
    <div className="bg-background">
      <section className="mx-auto max-w-7xl px-6 py-8">
        <Carousel
          items={nowShowingMovies.length > 0 ? nowShowingMovies : mockMovies}
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-balance mb-2">
            Danh sách phim
          </h2>
          <p className="text-muted-foreground">
            Khám phá những bộ phim hay nhất hiện nay
          </p>
        </div>

        <MovieTabs
          nowShowingMovies={nowShowingMovies}
          comingSoonMovies={comingSoonMovies}
        />
      </section>

      <section className="bg-card border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-lg bg-linear-to-r from-red-600 to-red-700 p-8 text-white">
            <h3 className="mb-2 text-2xl font-bold">Ưu đãi đặc biệt</h3>
            <p className="mb-4 max-w-2xl">
              Khám phá hàng ngàn voucher giảm giá và chương trình khuyến mãi hấp
              dẫn!
            </p>
            <Link href="/promotions">
              <button className="rounded-lg bg-white px-6 py-2 font-semibold text-red-600 hover:bg-gray-100 transition-colors">
                Xem tất cả ưu đãi
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
