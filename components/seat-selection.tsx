"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { mockSeats } from "@/lib/mock-data";
import type { Seat } from "@/lib/mock-data";

interface SeatSelectionProps {
  onSeatsChange: (seats: Seat[]) => void;
}

export function SeatSelection({ onSeatsChange }: SeatSelectionProps) {
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());

  // Group seats by row
  const seatsByRow = mockSeats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  const handleSeatClick = (seat: Seat) => {
    const newSelected = new Set(selectedSeats);
    if (newSelected.has(seat.seatId)) {
      newSelected.delete(seat.seatId);
    } else {
      newSelected.add(seat.seatId);
    }
    setSelectedSeats(newSelected);
    const selectedSeatObjects = mockSeats.filter((s) =>
      newSelected.has(s.seatId)
    );
    onSeatsChange(selectedSeatObjects);
  };

  const getSeatColor = (seat: Seat) => {
    if (selectedSeats.has(seat.seatId)) {
      return "bg-red-600 border-red-700";
    }
    switch (seat.seatType) {
      case "VIP":
        return "bg-yellow-500 border-yellow-600 hover:bg-yellow-600";
      case "Couple":
        return "bg-pink-500 border-pink-600 hover:bg-pink-600";
      case "Accessible":
        return "bg-blue-500 border-blue-600 hover:bg-blue-600";
      default:
        return "bg-gray-400 border-gray-500 hover:bg-gray-500";
    }
  };

  const rows = Object.keys(seatsByRow).sort();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-xl font-bold">Chọn ghế</h3>

        {/* Legend */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border border-gray-500 bg-gray-400" />
            <span className="text-sm">Ghế thường</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border border-yellow-600 bg-yellow-500" />
            <span className="text-sm">Ghế VIP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border border-pink-600 bg-pink-500" />
            <span className="text-sm">Ghế Couple</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border border-blue-600 bg-blue-500" />
            <span className="text-sm">Khuyết tật</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border border-red-700 bg-red-600" />
            <span className="text-sm">Đã chọn</span>
          </div>
        </div>

        {/* Screen */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-block rounded-full border-4 border-gray-400 px-8 py-2 font-bold text-muted-foreground">
            Màn hình
          </div>
        </div>

        {/* Seats Grid */}
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row} className="flex items-center justify-center gap-2">
              <span className="w-6 font-bold text-muted-foreground">{row}</span>
              <div className="flex gap-1">
                {seatsByRow[row].map((seat) => (
                  <button
                    key={seat.seatId}
                    onClick={() => handleSeatClick(seat)}
                    className={`h-8 w-8 rounded border-2 transition-all ${getSeatColor(
                      seat
                    )}`}
                    title={`${seat.seatName} - ${seat.seatType}`}
                    aria-label={`Seat ${seat.seatName}`}
                  />
                ))}
              </div>
              <span className="w-6 font-bold text-muted-foreground">{row}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Seats Summary */}
      {selectedSeats.size > 0 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="mb-2 font-semibold">Ghế đã chọn:</p>
          <div className="flex flex-wrap gap-2">
            {Array.from(selectedSeats).map((seatId) => {
              const seat = mockSeats.find((s) => s.seatId === seatId);
              return (
                <Badge key={seatId} variant="secondary">
                  {seat?.seatName}
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
