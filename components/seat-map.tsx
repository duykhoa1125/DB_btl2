"use client"
import type { Ghe } from "@/lib/types"

interface SeatMapProps {
  ghe: Ghe[]
  gheDaChon: Array<{ So_hang: string; So_cot: number }>
  onSeatSelect: (hang: string, cot: number) => void
}

export function SeatMap({ ghe, gheDaChon, onSeatSelect }: SeatMapProps) {
  // Group seats by row
  const seatsByRow = ghe.reduce(
    (acc, seat) => {
      if (!acc[seat.So_hang]) {
        acc[seat.So_hang] = []
      }
      acc[seat.So_hang].push(seat)
      return acc
    },
    {} as Record<string, Ghe[]>,
  )

  const isSelected = (hang: string, cot: number) => {
    return gheDaChon.some((g) => g.So_hang === hang && g.So_cot === cot)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-8 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-muted border border-border" />
          <span>Trống</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-red-600" />
          <span>Đã chọn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-gray-400" />
          <span>Đã đặt</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-yellow-500" />
          <span>VIP</span>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="space-y-3">
          {/* Screen indicator */}
          <div className="mb-8 text-center">
            <div className="mx-auto h-1 w-3/4 bg-gradient-to-r from-transparent via-gray-400 to-transparent" />
            <p className="mt-2 text-sm font-semibold text-muted-foreground">MÀN HÌNH</p>
          </div>

          {/* Seats */}
          {Object.entries(seatsByRow)
            .sort()
            .map(([hang, seats]) => (
              <div key={hang} className="flex items-center gap-4">
                <div className="w-6 text-center text-sm font-semibold">{hang}</div>
                <div className="flex gap-2">
                  {seats.map((seat) => {
                    const isBooked = seat.Trang_thai === "Đã đặt"
                    const selected = isSelected(hang, seat.So_cot)
                    const isVIP = seat.Loai_ghe === "VIP"

                    return (
                      <button
                        key={`${hang}-${seat.So_cot}`}
                        onClick={() => !isBooked && onSeatSelect(hang, seat.So_cot)}
                        disabled={isBooked}
                        className={`h-7 w-7 rounded text-xs font-semibold transition-all ${
                          isBooked
                            ? "bg-gray-400 cursor-not-allowed"
                            : selected
                              ? "bg-red-600 text-white"
                              : isVIP
                                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                                : "bg-muted hover:bg-red-600 hover:text-white border border-border"
                        }`}
                      >
                        {seat.So_cot}
                      </button>
                    )
                  })}
                </div>
                <div className="w-6 text-center text-sm font-semibold">{hang}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
