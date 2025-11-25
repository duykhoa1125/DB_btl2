"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { MOCK_SEATS } from "@/services/mock-data";
import type { Seat } from "@/services/types";
import { cn } from "@/lib/utils";
import { Armchair, Sofa } from "lucide-react";

interface SeatSelectionProps {
  onSeatsChange: (seats: Seat[]) => void;
}

// Icons for different seat types
const StandardSeatIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 18v3h3v-3h10v3h3v-6a4 4 0 0 0-4-4h-8a4 4 0 0 0-4 4v6z" />
    <path d="M6 2h12v11H6z" opacity="0.8" />
  </svg>
);

const VIPSeatIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 18v3h3v-3h12v3h3v-6a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v6z" />
    <path d="M5 2h14v12H5z" opacity="0.9" />
    <path d="M12 4l1.5 3h3l-2.5 2 1 3-3-2-3 2 1-3-2.5-2h3z" fill="white" opacity="0.5" />
  </svg>
);

const CoupleSeatIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 48 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 18v3h3v-3h34v3h3v-6a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v6z" />
    <path d="M6 2h36v11H6z" opacity="0.8" />
    <path d="M24 2v11" stroke="currentColor" strokeWidth="2" opacity="0.3" />
  </svg>
);

export function SeatSelection({ onSeatsChange }: SeatSelectionProps) {
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());

  // Use seats from a specific room (e.g., first room of first cinema) for demo
  // In a real app, this would be passed as a prop or fetched based on showtime
  const demoSeats = MOCK_SEATS.filter(s => s.room_id === 'CNM001_R1');

  // Group seats by row
  const seatsByRow = demoSeats.reduce((acc, seat) => {
    if (!acc[seat.seat_row]) {
      acc[seat.seat_row] = [];
    }
    acc[seat.seat_row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  const getSeatId = (seat: Seat) => `${seat.seat_row}${seat.seat_column}`;

  const handleSeatClick = (seat: Seat) => {
    const seatId = getSeatId(seat);
    const newSelected = new Set(selectedSeats);
    if (newSelected.has(seatId)) {
      newSelected.delete(seatId);
    } else {
      newSelected.add(seatId);
    }
    setSelectedSeats(newSelected);
    const selectedSeatObjects = demoSeats.filter((s) =>
      newSelected.has(getSeatId(s))
    );
    onSeatsChange(selectedSeatObjects);
  };

  const getSeatColor = (seat: Seat) => {
    const seatId = getSeatId(seat);
    if (selectedSeats.has(seatId)) {
      return "text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.6)] scale-105";
    }
    // Default unselected state - uniform color as requested, but hover effect remains
    return "text-muted-foreground/40 hover:text-primary/80 hover:scale-105 transition-all duration-200";
  };

  const renderSeat = (seat: Seat) => {
    const seatId = getSeatId(seat);
    const isSelected = selectedSeats.has(seatId);
    
    let Icon = StandardSeatIcon;
    let width = "w-8";
    
    if (seat.seat_type === "vip") {
      Icon = VIPSeatIcon;
      width = "w-9";
    } else if (seat.seat_type === "couple") {
      Icon = CoupleSeatIcon;
      width = "w-16";
    }

    return (
      <button
        key={seatId}
        onClick={() => handleSeatClick(seat)}
        className={cn(
          "group relative flex flex-col items-center justify-center transition-all duration-300",
          width,
          "h-8",
          getSeatColor(seat)
        )}
        title={`${seat.seat_row}${seat.seat_column} - ${seat.seat_type}`}
      >
        <Icon className="h-full w-full" />
        <span className={cn(
          "absolute -bottom-6 text-[10px] font-bold opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-1 z-10 bg-background/80 px-1 rounded",
          isSelected ? "text-primary" : "text-foreground"
        )}>
          {seat.seat_row}{seat.seat_column}
        </span>
      </button>
    );
  };

  const rows = Object.keys(seatsByRow).sort();

  return (
    <div className="space-y-10 w-full max-w-6xl mx-auto">
      <div className="flex flex-col items-center">
        <h3 className="mb-8 text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Chọn vị trí ngồi
        </h3>

        {/* Screen */}
        <div className="relative mb-20 w-full max-w-4xl perspective-[1000px]">
          <div className="relative flex flex-col items-center justify-center transform-style-3d rotate-x-12">
             {/* Screen Glow */}
            <div className="absolute -top-10 w-3/4 h-24 bg-primary/20 blur-[80px] rounded-full animate-pulse" />
            
            {/* Screen Body */}
            <div className="w-full h-20 border-t-[6px] border-primary/40 rounded-[50%] shadow-[0_-10px_60px_-10px_rgba(var(--primary),0.3)] bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm" />
            
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.5em] text-primary/60">
              Màn hình
            </p>
          </div>
        </div>

        {/* Seats Grid */}
        <div className="relative mx-auto w-full overflow-x-auto pb-12">
          <div className="flex flex-col gap-4 min-w-[800px] items-center">
            {rows.map((row) => {
              const rowSeats = seatsByRow[row];
              
              // For Couple row (J), we just render them centered
              // Assuming 'J' is couple row based on mock data logic (rows - 2)
              // But let's check seat type instead
              const isCoupleRow = rowSeats.some(s => s.seat_type === 'couple');

              if (isCoupleRow) {
                 return (
                  <div key={row} className="flex items-center justify-center gap-6 mt-4">
                    <span className="w-6 text-center text-sm font-bold text-muted-foreground/50">{row}</span>
                    <div className="flex gap-4">
                      {rowSeats.map(renderSeat)}
                    </div>
                    <span className="w-6 text-center text-sm font-bold text-muted-foreground/50">{row}</span>
                  </div>
                 )
              }

              // For other rows, split into 3 sections: 1-4, 5-8, 9-12 (assuming 12 cols)
              const leftSeats = rowSeats.filter(s => s.seat_column <= 4);
              const centerSeats = rowSeats.filter(s => s.seat_column >= 5 && s.seat_column <= 8);
              const rightSeats = rowSeats.filter(s => s.seat_column >= 9);

              return (
                <div key={row} className="flex items-center justify-center gap-6">
                  {/* Row Label */}
                  <span className="w-6 text-center text-sm font-bold text-muted-foreground/50">
                    {row}
                  </span>

                  {/* Left Section */}
                  <div className="flex gap-1.5">
                    {leftSeats.map(renderSeat)}
                  </div>

                  {/* Aisle Gap */}
                  <div className="w-8" />

                  {/* Center Section */}
                  <div className="flex gap-1.5">
                    {centerSeats.map(renderSeat)}
                  </div>

                  {/* Aisle Gap */}
                  <div className="w-8" />

                  {/* Right Section */}
                  <div className="flex gap-1.5">
                    {rightSeats.map(renderSeat)}
                  </div>

                  {/* Row Label */}
                  <span className="w-6 text-center text-sm font-bold text-muted-foreground/50">
                    {row}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-8 p-6 rounded-2xl bg-muted/20 border border-border/30 backdrop-blur-sm">
          {[
            { label: "Ghế thường", icon: StandardSeatIcon, price: "45k" },
            { label: "Ghế VIP", icon: VIPSeatIcon, price: "65k" },
            { label: "Ghế Couple", icon: CoupleSeatIcon, price: "110k" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <item.icon className={cn("h-6 text-muted-foreground/70", item.label === "Ghế Couple" ? "w-10" : "w-6")} />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  {item.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.price}
                </span>
              </div>
            </div>
          ))}
          
          {/* Status Legend */}
          <div className="w-px h-10 bg-border/50 mx-2" />
          
          <div className="flex items-center gap-3">
             <div className="w-6 h-6 rounded bg-primary/20 border border-primary/50" />
             <span className="text-sm font-medium">Đang chọn</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-6 h-6 rounded bg-muted-foreground/20 border border-muted-foreground/30" />
             <span className="text-sm font-medium">Đã đặt</span>
          </div>
        </div>
      </div>


    </div>
  );
}
