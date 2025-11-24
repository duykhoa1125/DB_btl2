"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { mockSeats } from "@/lib/mock-data";
import type { Seat } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface SeatSelectionProps {
  onSeatsChange: (seats: Seat[]) => void;
}

const SeatIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M4.5 19.5C4.5 20.3284 5.17157 21 6 21H18C18.8284 21 19.5 20.3284 19.5 19.5V16.5H4.5V19.5Z" />
    <path d="M6 3C4.89543 3 4 3.89543 4 5V15H20V5C20 3.89543 19.1046 3 18 3H6Z" />
    <path d="M2 14C2 12.8954 2.89543 12 4 12H5V15H3V18H2V14Z" />
    <path d="M22 14C22 12.8954 21.1046 12 20 12H19V15H21V18H22V14Z" />
  </svg>
);

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
      return "text-red-600 hover:text-red-700";
    }
    switch (seat.seatType) {
      case "VIP":
        return "text-yellow-500 hover:text-yellow-600";
      case "Couple":
        return "text-pink-500 hover:text-pink-600";
      case "Accessible":
        return "text-blue-500 hover:text-blue-600";
      default:
        return "text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400";
    }
  };

  const getSeatLabel = (type: string) => {
    switch (type) {
      case "VIP":
        return "Ghế VIP";
      case "Couple":
        return "Ghế Couple";
      case "Accessible":
        return "Khuyết tật";
      default:
        return "Ghế thường";
    }
  };

  const rows = Object.keys(seatsByRow).sort();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-6 text-xl font-bold">Chọn ghế</h3>

        {/* Screen */}
        <div className="mb-14 flex flex-col items-center justify-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Màn hình
          </p>
          <div className="relative h-8 w-full max-w-2xl">
            {/* Main glow - Darker and stronger */}
            <div className="absolute -inset-4 rounded-[50%] bg-cyan-500/30 blur-2xl" />
            
            {/* The Screen Body - Thicker and curved */}
            <div className="absolute inset-x-0 top-0 h-4 rounded-[50%] border-t-[12px] border-cyan-600 shadow-[0_-4px_30px_rgba(8,145,178,0.6)]" />
            
            {/* Inner highlight for 3D effect */}
            <div className="absolute inset-x-4 top-0 h-3 rounded-[50%] border-t-[4px] border-cyan-400/50 blur-[1px]" />
          </div>
        </div>

        {/* Seats Grid */}
        <div className="relative mx-auto max-w-5xl rounded-xl border border-border/50 bg-card/50 p-8 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col gap-2">
            {rows.map((row) => {
              const rowSeats = seatsByRow[row];
              
              // Split seats into sections: left (1-3), center (4-7), right (8-10)
              const leftSeats = rowSeats.filter(s => s.column >= 1 && s.column <= 3);
              const centerSeats = rowSeats.filter(s => s.column >= 4 && s.column <= 7);
              const rightSeats = rowSeats.filter(s => s.column >= 8 && s.column <= 10);

              return (
                <div key={row} className="flex items-center justify-center gap-2">
                  {/* Row Label - Left */}
                  <span className="w-8 text-center text-sm font-bold text-muted-foreground">
                    {row}
                  </span>

                  {/* Left Section */}
                  <div className="flex gap-1.5">
                    {leftSeats.map((seat) => (
                      <button
                        key={seat.seatId}
                        onClick={() => handleSeatClick(seat)}
                        className={cn(
                          "group relative flex h-9 w-9 flex-col items-center justify-center rounded-t-lg transition-all duration-200 hover:scale-110",
                          getSeatColor(seat)
                        )}
                        title={`${seat.seatName} - ${getSeatLabel(seat.seatType)}`}
                        aria-label={`Seat ${seat.seatName}`}
                      >
                        <SeatIcon className="h-full w-full" />
                        <span className="absolute -bottom-4 text-[9px] font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                          {seat.column}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Aisle Gap */}
                  <div className="w-6" />

                  {/* Center Section */}
                  <div className="flex gap-1.5">
                    {centerSeats.map((seat) => (
                      <button
                        key={seat.seatId}
                        onClick={() => handleSeatClick(seat)}
                        className={cn(
                          "group relative flex h-9 w-9 flex-col items-center justify-center rounded-t-lg transition-all duration-200 hover:scale-110",
                          getSeatColor(seat)
                        )}
                        title={`${seat.seatName} - ${getSeatLabel(seat.seatType)}`}
                        aria-label={`Seat ${seat.seatName}`}
                      >
                        <SeatIcon className="h-full w-full" />
                        <span className="absolute -bottom-4 text-[9px] font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                          {seat.column}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Aisle Gap */}
                  <div className="w-6" />

                  {/* Right Section */}
                  <div className="flex gap-1.5">
                    {rightSeats.map((seat) => (
                      <button
                        key={seat.seatId}
                        onClick={() => handleSeatClick(seat)}
                        className={cn(
                          "group relative flex h-9 w-9 flex-col items-center justify-center rounded-t-lg transition-all duration-200 hover:scale-110",
                          getSeatColor(seat)
                        )}
                        title={`${seat.seatName} - ${getSeatLabel(seat.seatType)}`}
                        aria-label={`Seat ${seat.seatName}`}
                      >
                        <SeatIcon className="h-full w-full" />
                        <span className="absolute -bottom-4 text-[9px] font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                          {seat.column}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Row Label - Right */}
                  <span className="w-8 text-center text-sm font-bold text-muted-foreground">
                    {row}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-6">
          {[
            { label: "Ghế thường", color: "text-gray-400 dark:text-gray-500" },
            { label: "Ghế VIP", color: "text-yellow-500" },
            { label: "Ghế Couple", color: "text-pink-500" },
            { label: "Khuyết tật", color: "text-blue-500" },
            { label: "Đã chọn", color: "text-red-600" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <SeatIcon className={cn("h-5 w-5", item.color)} />
              <span className="text-sm text-muted-foreground">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Seats Summary */}
      {selectedSeats.size > 0 && (
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <p className="mb-2 font-semibold">Ghế đã chọn:</p>
          <div className="flex flex-wrap gap-2">
            {Array.from(selectedSeats).map((seatId) => {
              const seat = mockSeats.find((s) => s.seatId === seatId);
              return (
                <Badge
                  key={seatId}
                  variant="secondary"
                  className="bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
                >
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
