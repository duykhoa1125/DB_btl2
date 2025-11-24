"use client";
import type { Seat } from "@/lib/types";

interface SeatMapProps {
  seats: Seat[];
  selectedSeats: Array<{ rowNumber: string; columnNumber: number }>;
  onSeatSelect: (rowNumber: string, columnNumber: number) => void;
}

export function SeatMap({ seats, selectedSeats, onSeatSelect }: SeatMapProps) {
  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.rowNumber]) {
      acc[seat.rowNumber] = [];
    }
    acc[seat.rowNumber].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  const isSelected = (rowNumber: string, columnNumber: number) => {
    return selectedSeats.some(
      (s) => s.rowNumber === rowNumber && s.columnNumber === columnNumber
    );
  };

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
            <p className="mt-2 text-sm font-semibold text-muted-foreground">
              MÀN HÌNH
            </p>
          </div>

          {/* Seats */}
          {Object.entries(seatsByRow)
            .sort()
            .map(([rowNumber, seats]) => (
              <div key={rowNumber} className="flex items-center gap-4">
                <div className="w-6 text-center text-sm font-semibold">
                  {rowNumber}
                </div>
                <div className="flex gap-2">
                  {seats.map((seat) => {
                    const isBooked = seat.status === "Booked";
                    const selected = isSelected(rowNumber, seat.columnNumber);
                    const isVIP = seat.seatType === "VIP";

                    return (
                      <button
                        key={`${rowNumber}-${seat.columnNumber}`}
                        onClick={() =>
                          !isBooked &&
                          onSeatSelect(rowNumber, seat.columnNumber)
                        }
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
                        {seat.columnNumber}
                      </button>
                    );
                  })}
                </div>
                <div className="w-6 text-center text-sm font-semibold">
                  {rowNumber}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
