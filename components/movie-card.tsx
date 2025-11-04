import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Phim } from "@/lib/mock-data"

interface MovieCardProps {
  phim: Phim
}

export function MovieCard({ phim }: MovieCardProps) {
  return (
    <Link href={`/phim/${phim.Id_phim}`}>
      <div className="group relative overflow-hidden rounded-lg bg-card transition-all duration-300 hover:shadow-2xl">
        <div className="aspect-[2/3] overflow-hidden bg-muted">
          <img
            src={phim.Hinh_anh || "/placeholder.svg"}
            alt={phim.Ten_phim}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute bottom-0 left-0 right-0 translate-y-full space-y-3 bg-gradient-to-t from-black/95 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
          <h3 className="line-clamp-2 text-sm font-bold text-white">{phim.Ten_phim}</h3>
          <div className="space-y-1 text-xs text-gray-300">
            <p>⏱️ {phim.Thoi_luong} phút</p>
            <p>⭐ {phim.Diem_danh_gia}/10</p>
            <p className="line-clamp-1">{phim.Dao_dien}</p>
          </div>
          <Button className="w-full bg-red-600 hover:bg-red-700" size="sm">
            Mua vé
          </Button>
        </div>
      </div>
    </Link>
  )
}
