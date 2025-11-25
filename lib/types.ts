// Data types for cinema booking app
export interface Movie {
  movie_id: number;
  title: string;
  description: string;
  duration: number; // in minutes
  trailer: string; // YouTube URL
  releaseDate: string; // YYYY-MM-DD
  status: "Now Showing" | "Coming Soon";
  directorName: string[];
  actorName: string[];
  poster: string;
}

export interface Cinema {
  cinema_id: number;
  cinemaName: string;
  address: string;
  rooms: Room[];
}

export interface Room {
  roomId: number;
  roomName: string;
}

export interface Showtime {
  showtime_id: number;
  movie_id: number;
  roomId: number;
  showDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  price: number;
}

export interface Seat {
  roomId: number;
  rowNumber: string;
  columnNumber: number;
  seatType: "Standard" | "VIP";
  status: "Available" | "Booked";
}

export interface Food {
  food_id: number;
  foodName: string;
  description: string;
  price: number;
  image: string;
}

export interface BookingState {
  movie: Movie | null;
  showtime: Showtime | null;
  room: Room | null;
  selectedSeats: Array<{ rowNumber: string; columnNumber: number }>;
  selectedFoods: Array<{
    id: number;
    foodName: string;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
}
