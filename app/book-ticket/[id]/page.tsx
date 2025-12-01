import { showtimeService, movieService } from "@/services";
import { BookingContent } from "./booking-content";
import { Breadcrumb } from "@/components/breadcrumb";

interface BookingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { id } = await params;

  const showtime = await showtimeService.getById(id);
  const movie = showtime ? await movieService.getById(showtime.movie_id) : null;

  if (!showtime || !movie) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border/40 bg-card/50">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <Breadcrumb items={[{ label: "Đặt vé", href: "/" }]} />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-bold mb-4">Lịch chiếu không tìm thấy</h1>
          <p className="text-muted-foreground">
            Không tìm thấy thông tin lịch chiếu bạn đang tìm kiếm
          </p>
        </div>
      </div>
    );
  }

  return <BookingContent showtime={showtime} movie={movie} />;
}
