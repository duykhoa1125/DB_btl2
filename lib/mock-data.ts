// Movie types and mock data for the cinema ticket booking system

export interface Movie {
  movieId: string;
  title: string;
  description: string;
  image: string;
  status: "Now Showing" | "Coming Soon";
  producer: string;
  director: string;
  actors: string[];
  genres: string[];
  duration: number; // minutes
  releaseYear: number;
  rating: number; // 0-10
  trailerUrl: string;
}

export interface Showtime {
  showtimeId: string;
  movieId: string;
  cinemaId: string;
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  room: string;
  ticketPrice: number;
  status: "Coming_Soon" | "Available" | "Sold_Out" | "Now_Showing" | "Ended";
}

export interface Seat {
  seatId: string;
  seatName: string; // A1, A2, B1, etc.
  row: string; // A, B, C, D, etc.
  column: number; // 1, 2, 3, etc.
  seatType: "Standard" | "VIP" | "Couple" | "Accessible";
}

export interface SeatBooking {
  seatBookingId: string;
  showtimeId: string;
  seatId: string;
  status: "Available" | "Booked" | "Sold";
}

export interface Food {
  foodId: string;
  foodName: string;
  category: "Popcorn" | "Drink" | "Special";
  price: number;
  image: string;
}

export interface Invoice {
  invoiceId: string;
  bookingId: string;
  createdDate: string; // ISO date
  totalAmount: number;
  status: "Unpaid" | "Paid" | "Cancelled";
  paymentMethod: "Credit_Card" | "Cash" | "E_Wallet";
}

export interface Cinema {
  cinemaId: string;
  cinemaName: string;
  address: string;
  city: string;
  numberOfRooms: number;
}

export const mockMovies: Movie[] = [
  {
    movieId: "movie_001",
    title: "Avengers: Endgame",
    description:
      "Các siêu anh hùng Avengers phải đối mặt với Thanos trong trận chiến cuối cùng để cứu thế giới.",
    image: "/avengers-endgame-movie-poster.jpg",
    status: "Now Showing",
    producer: "Marvel Studios",
    director: "Anthony Russo, Joe Russo",
    actors: [
      "Robert Downey Jr.",
      "Chris Evans",
      "Mark Ruffalo",
      "Chris Hemsworth",
    ],
    genres: ["Hành động", "Viễn tưởng", "Phiêu lưu"],
    duration: 181,
    releaseYear: 2019,
    rating: 8.4,
    trailerUrl: "https://www.youtube.com/embed/TcMBFSGVi1c",
  },
  {
    movieId: "movie_002",
    title: "The Shawshank Redemption",
    description:
      "Một người tù bị kết án chung thân lên kế hoạch trốn thoát trong khi giúp đỡ những tù nhân khác.",
    image: "/shawshank-redemption-movie-poster.jpg",
    status: "Now Showing",
    producer: "Castle Rock Entertainment",
    director: "Frank Darabont",
    actors: ["Tim Robbins", "Morgan Freeman"],
    genres: ["Drama", "Tội phạm"],
    duration: 142,
    releaseYear: 1994,
    rating: 9.3,
    trailerUrl: "https://www.youtube.com/embed/NmzuHjWmXOc",
  },
  {
    movieId: "movie_003",
    title: "Inception",
    description:
      "Một tên trộm chuyên biệt trong ăn cắp từ các giấc mơ phải thực hiện nhiệm vụ đặc biệt: nhồi nộ ý tưởng.",
    image: "/inception-movie-poster.jpg",
    status: "Now Showing",
    producer: "Warner Bros.",
    director: "Christopher Nolan",
    actors: [
      "Leonardo DiCaprio",
      "Marion Cotillard",
      "Tom Hardy",
      "Ellen Page",
    ],
    genres: ["Viễn tưởng", "Tâm lý", "Hành động"],
    duration: 148,
    releaseYear: 2010,
    rating: 8.8,
    trailerUrl: "https://www.youtube.com/embed/YoHD_XwIlf8",
  },
  {
    movieId: "movie_004",
    title: "The Dark Knight",
    description:
      "Batman phải chống lại Joker, một tên tội phạm có khả năng tạo ra hỗn loạn trong Gotham.",
    image: "/dark-knight-movie-poster.jpg",
    status: "Now Showing",
    producer: "Legendary Pictures",
    director: "Christopher Nolan",
    actors: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    genres: ["Hành động", "Tội phạm", "Drama"],
    duration: 152,
    releaseYear: 2008,
    rating: 9.0,
    trailerUrl: "https://www.youtube.com/embed/EXeTwQWrcwY",
  },
  {
    movieId: "movie_005",
    title: "Interstellar",
    description:
      "Một nhóm nhà du hành vũ trụ phải vượt qua lỗ sâu không gian để cứu nhân loại.",
    image: "/interstellar-movie-poster.jpg",
    status: "Now Showing",
    producer: "Paramount Pictures",
    director: "Christopher Nolan",
    actors: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    genres: ["Viễn tưởng", "Drama", "Phiêu lưu"],
    duration: 169,
    releaseYear: 2014,
    rating: 8.6,
    trailerUrl: "https://www.youtube.com/embed/zSID6PrCR74",
  },
  {
    movieId: "movie_006",
    title: "Forrest Gump",
    description:
      "Cuộc sống của Forrest Gump, một người bình thường nhưng lại tham gia vào những sự kiện lịch sử quan trọng.",
    image: "/forrest-gump-movie-poster.jpg",
    status: "Now Showing",
    producer: "Paramount Pictures",
    director: "Robert Zemeckis",
    actors: ["Tom Hanks", "Sally Field", "Gary Sinise"],
    genres: ["Drama", "Lãng mạn"],
    duration: 142,
    releaseYear: 1994,
    rating: 8.8,
    trailerUrl: "https://www.youtube.com/embed/bLvqoByHw20",
  },
  {
    movieId: "movie_007",
    title: "Dune",
    description:
      "Một người trẻ phải đối mặt với vận mệnh của mình khi phải bảo vệ một hành tinh sa mạc giàu tài nguyên.",
    image: "/dune-part-one-movie-poster.jpg",
    status: "Coming Soon",
    producer: "Warner Bros.",
    director: "Denis Villeneuve",
    actors: ["Timothée Chalamet", "Zendaya", "Oscar Isaac"],
    genres: ["Viễn tưởng", "Phiêu lưu"],
    duration: 156,
    releaseYear: 2021,
    rating: 8.0,
    trailerUrl: "https://www.youtube.com/embed/n9xhJsAgZmE",
  },
  {
    movieId: "movie_008",
    title: "Avatar: The Way of Water",
    description:
      "Jake Sully phải bảo vệ gia đình của mình khỏi những kẻ thù trong một thế giới hoàn toàn khác.",
    image: "/avatar-way-of-water-movie-poster.jpg",
    status: "Coming Soon",
    producer: "20th Century Studios",
    director: "James Cameron",
    actors: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
    genres: ["Viễn tưởng", "Phiêu lưu"],
    duration: 192,
    releaseYear: 2022,
    rating: 7.6,
    trailerUrl: "https://www.youtube.com/embed/d9MyW72EhRE",
  },
  {
    movieId: "movie_009",
    title: "Oppenheimer",
    description:
      "Câu chuyện về J. Robert Oppenheimer và sự phát triển của bom nguyên tử trong Thế chiến II.",
    image: "/oppenheimer-movie-poster.jpg",
    status: "Coming Soon",
    producer: "Universal Pictures",
    director: "Christopher Nolan",
    actors: ["Cillian Murphy", "Emily Blunt", "Robert Downey Jr."],
    genres: ["Drama", "Lịch sử"],
    duration: 180,
    releaseYear: 2023,
    rating: 8.1,
    trailerUrl: "https://www.youtube.com/embed/bK6DsqIvgIU",
  },
  {
    movieId: "movie_010",
    title: "Pulp Fiction",
    description:
      "Một bộ phim gồm nhiều câu chuyện liên kết với nhau về các nhân vật trong thế giới Mafia.",
    image: "/pulp-fiction-movie-poster.jpg",
    status: "Coming Soon",
    producer: "Miramax",
    director: "Quentin Tarantino",
    actors: ["John Travolta", "Samuel L. Jackson", "Uma Thurman"],
    genres: ["Tội phạm", "Drama"],
    duration: 154,
    releaseYear: 1994,
    rating: 8.9,
    trailerUrl: "https://www.youtube.com/embed/s7EdQ4FqSTM",
  },
];

export const mockShowtimes: Showtime[] = [
  {
    showtimeId: "st_001",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-01T09:00:00",
    endTime: "2025-11-01T10:54:00",
    room: "Room 1",
    ticketPrice: 80000,
    status: "Available",
  },
  {
    showtimeId: "st_002",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-01T13:00:00",
    endTime: "2025-11-01T14:54:00",
    room: "Room 1",
    ticketPrice: 80000,
    status: "Available",
  },
  {
    showtimeId: "st_003",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-01T16:00:00",
    endTime: "2025-11-01T17:54:00",
    room: "Room 1",
    ticketPrice: 100000,
    status: "Available",
  },
  {
    showtimeId: "st_004",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-01T19:00:00",
    endTime: "2025-11-01T20:54:00",
    room: "Room 1",
    ticketPrice: 120000,
    status: "Available",
  },
  {
    showtimeId: "st_005",
    movieId: "movie_002",
    cinemaId: "cinema_001",
    startTime: "2025-11-01T09:30:00",
    endTime: "2025-11-01T11:00:00",
    room: "Room 2",
    ticketPrice: 80000,
    status: "Available",
  },
  {
    showtimeId: "st_006",
    movieId: "movie_002",
    cinemaId: "cinema_001",
    startTime: "2025-11-01T14:00:00",
    endTime: "2025-11-01T15:30:00",
    room: "Room 2",
    ticketPrice: 80000,
    status: "Available",
  },
  {
    showtimeId: "st_007",
    movieId: "movie_003",
    cinemaId: "cinema_002",
    startTime: "2025-11-01T10:00:00",
    endTime: "2025-11-01T11:48:00",
    room: "Room 1",
    ticketPrice: 90000,
    status: "Available",
  },
  {
    showtimeId: "st_008",
    movieId: "movie_003",
    cinemaId: "cinema_002",
    startTime: "2025-11-01T15:30:00",
    endTime: "2025-11-01T17:18:00",
    room: "Room 1",
    ticketPrice: 100000,
    status: "Available",
  },
  // Additional showtimes for movie_001: 7 days (2025-11-10 -> 2025-11-16), 4 showtimes per day
  {
    showtimeId: "st_009",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-10T09:00:00",
    endTime: "2025-11-10T10:54:00",
    room: "Room 1",
    ticketPrice: 80000,
    status: "Available",
  },
  {
    showtimeId: "st_010",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-10T12:00:00",
    endTime: "2025-11-10T13:54:00",
    room: "Room 1",
    ticketPrice: 90000,
    status: "Available",
  },
  {
    showtimeId: "st_011",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-10T15:00:00",
    endTime: "2025-11-10T16:54:00",
    room: "Room 1",
    ticketPrice: 100000,
    status: "Available",
  },
  {
    showtimeId: "st_012",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-10T18:00:00",
    endTime: "2025-11-10T19:54:00",
    room: "Room 1",
    ticketPrice: 120000,
    status: "Available",
  },
  {
    showtimeId: "st_013",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-11T09:00:00",
    endTime: "2025-11-11T10:54:00",
    room: "Room 1",
    ticketPrice: 80000,
    status: "Available",
  },
  {
    showtimeId: "st_014",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-11T12:00:00",
    endTime: "2025-11-11T13:54:00",
    room: "Room 1",
    ticketPrice: 90000,
    status: "Available",
  },
  {
    showtimeId: "st_015",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-11T15:00:00",
    endTime: "2025-11-11T16:54:00",
    room: "Room 1",
    ticketPrice: 100000,
    status: "Available",
  },
  {
    showtimeId: "st_016",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-11T18:00:00",
    endTime: "2025-11-11T19:54:00",
    room: "Room 1",
    ticketPrice: 120000,
    status: "Available",
  },
  {
    showtimeId: "st_017",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-12T09:00:00",
    endTime: "2025-11-12T10:54:00",
    room: "Room 1",
    ticketPrice: 80000,
    status: "Available",
  },
  {
    showtimeId: "st_018",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-12T12:00:00",
    endTime: "2025-11-12T13:54:00",
    room: "Room 1",
    ticketPrice: 90000,
    status: "Available",
  },
  {
    showtimeId: "st_019",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-12T15:00:00",
    endTime: "2025-11-12T16:54:00",
    room: "Room 1",
    ticketPrice: 100000,
    status: "Available",
  },
  {
    showtimeId: "st_020",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-12T18:00:00",
    endTime: "2025-11-12T19:54:00",
    room: "Room 1",
    ticketPrice: 120000,
    status: "Available",
  },
  {
    showtimeId: "st_021",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-13T09:00:00",
    endTime: "2025-11-13T10:54:00",
    room: "Room 1",
    ticketPrice: 80000,
    status: "Available",
  },
  {
    showtimeId: "st_022",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-13T12:00:00",
    endTime: "2025-11-13T13:54:00",
    room: "Room 1",
    ticketPrice: 90000,
    status: "Available",
  },
  {
    showtimeId: "st_023",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-13T15:00:00",
    endTime: "2025-11-13T16:54:00",
    room: "Room 1",
    ticketPrice: 100000,
    status: "Available",
  },
  {
    showtimeId: "st_024",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-13T18:00:00",
    endTime: "2025-11-13T19:54:00",
    room: "Room 1",
    ticketPrice: 120000,
    status: "Available",
  },
  {
    showtimeId: "st_025",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-14T09:00:00",
    endTime: "2025-11-14T10:54:00",
    room: "Room 1",
    ticketPrice: 80000,
    status: "Available",
  },
  {
    showtimeId: "st_026",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-14T12:00:00",
    endTime: "2025-11-14T13:54:00",
    room: "Room 1",
    ticketPrice: 90000,
    status: "Available",
  },
  {
    showtimeId: "st_027",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-14T15:00:00",
    endTime: "2025-11-14T16:54:00",
    room: "Room 1",
    ticketPrice: 100000,
    status: "Available",
  },
  {
    showtimeId: "st_028",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-14T18:00:00",
    endTime: "2025-11-14T19:54:00",
    room: "Room 1",
    ticketPrice: 120000,
    status: "Available",
  },
  {
    showtimeId: "st_029",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-15T09:00:00",
    endTime: "2025-11-15T10:54:00",
    room: "Room 1",
    ticketPrice: 80000,
    status: "Available",
  },
  {
    showtimeId: "st_030",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-15T12:00:00",
    endTime: "2025-11-15T13:54:00",
    room: "Room 1",
    ticketPrice: 90000,
    status: "Available",
  },
  {
    showtimeId: "st_031",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-15T15:00:00",
    endTime: "2025-11-15T16:54:00",
    room: "Room 1",
    ticketPrice: 100000,
    status: "Available",
  },
  {
    showtimeId: "st_032",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-15T18:00:00",
    endTime: "2025-11-15T19:54:00",
    room: "Room 1",
    ticketPrice: 120000,
    status: "Available",
  },
  {
    showtimeId: "st_033",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-16T09:00:00",
    endTime: "2025-11-16T10:54:00",
    room: "Room 1",
    ticketPrice: 80000,
    status: "Available",
  },
  {
    showtimeId: "st_034",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-16T12:00:00",
    endTime: "2025-11-16T13:54:00",
    room: "Room 1",
    ticketPrice: 90000,
    status: "Available",
  },
  {
    showtimeId: "st_035",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-16T15:00:00",
    endTime: "2025-11-16T16:54:00",
    room: "Room 1",
    ticketPrice: 100000,
    status: "Available",
  },
  {
    showtimeId: "st_036",
    movieId: "movie_001",
    cinemaId: "cinema_001",
    startTime: "2025-11-16T18:00:00",
    endTime: "2025-11-16T19:54:00",
    room: "Room 1",
    ticketPrice: 120000,
    status: "Available",
  },
];

export const mockSeats: Seat[] = [
  // Row A
  ...Array.from({ length: 10 }, (_, i) => ({
    seatId: `seat_A${i + 1}`,
    seatName: `A${i + 1}`,
    row: "A",
    column: i + 1,
    seatType: "Standard" as const,
  })),
  // Row B (with couple seats)
  ...Array.from({ length: 10 }, (_, i) => ({
    seatId: `seat_B${i + 1}`,
    seatName: `B${i + 1}`,
    row: "B",
    column: i + 1,
    seatType: i >= 4 && i <= 5 ? ("Couple" as const) : ("Standard" as const),
  })),
  // Row C (VIP)
  ...Array.from({ length: 10 }, (_, i) => ({
    seatId: `seat_C${i + 1}`,
    seatName: `C${i + 1}`,
    row: "C",
    column: i + 1,
    seatType: "VIP" as const,
  })),
  // Row D (VIP)
  ...Array.from({ length: 10 }, (_, i) => ({
    seatId: `seat_D${i + 1}`,
    seatName: `D${i + 1}`,
    row: "D",
    column: i + 1,
    seatType: "VIP" as const,
  })),
  // Row E (Accessible)
  ...Array.from({ length: 10 }, (_, i) => ({
    seatId: `seat_E${i + 1}`,
    seatName: `E${i + 1}`,
    row: "E",
    column: i + 1,
    seatType: i <= 1 ? ("Accessible" as const) : ("Standard" as const),
  })),
];

export const mockFoods: Food[] = [
  {
    foodId: "food_001",
    foodName: "Bắp mặn vừa",
    category: "Popcorn",
    price: 45000,
    image: "/popcorn-salty.jpg",
  },
  {
    foodId: "food_002",
    foodName: "Bắp mặn lớn",
    category: "Popcorn",
    price: 65000,
    image: "/popcorn-large-salty.jpg",
  },
  {
    foodId: "food_003",
    foodName: "Bắp bơ vừa",
    category: "Popcorn",
    price: 50000,
    image: "/popcorn-butter.jpg",
  },
  {
    foodId: "food_004",
    foodName: "Bắp bơ lớn",
    category: "Popcorn",
    price: 70000,
    image: "/popcorn-large-butter.jpg",
  },
  {
    foodId: "food_005",
    foodName: "Nước cam vừa",
    category: "Drink",
    price: 35000,
    image: "/vibrant-orange-juice.png",
  },
  {
    foodId: "food_006",
    foodName: "Nước cam lớn",
    category: "Drink",
    price: 45000,
    image: "/orange-juice-large.jpg",
  },
  {
    foodId: "food_007",
    foodName: "Coca-Cola vừa",
    category: "Drink",
    price: 30000,
    image: "/classic-coca-cola.png",
  },
  {
    foodId: "food_008",
    foodName: "Coca-Cola lớn",
    category: "Drink",
    price: 40000,
    image: "/coca-cola-large.jpg",
  },
  {
    foodId: "food_009",
    foodName: "Combo tiết kiệm",
    category: "Special",
    price: 120000,
    image: "/combo-popcorn-drink.jpg",
  },
  {
    foodId: "food_010",
    foodName: "Combo VIP",
    category: "Special",
    price: 180000,
    image: "/vip-combo.jpg",
  },
];

export const mockCinemas: Cinema[] = [
  {
    cinemaId: "cinema_001",
    cinemaName: "CinemaHub - Tân Bình",
    address: "123 Nguyễn Hữu Cảnh, Quận Tân Bình",
    city: "TP. Hồ Chí Minh",
    numberOfRooms: 4,
  },
  {
    cinemaId: "cinema_002",
    cinemaName: "CinemaHub - Bình Thạnh",
    address: "456 Nguyễn Văn Trỗi, Quận Bình Thạnh",
    city: "TP. Hồ Chí Minh",
    numberOfRooms: 3,
  },
  {
    cinemaId: "cinema_003",
    cinemaName: "CinemaHub - Quận 1",
    address: "789 Lê Lợi, Quận 1",
    city: "TP. Hồ Chí Minh",
    numberOfRooms: 5,
  },
  {
    cinemaId: "cinema_004",
    cinemaName: "CinemaHub - Hà Nội",
    address: "321 Tô Vĩ Tử, Quận Đống Đa",
    city: "Hà Nội",
    numberOfRooms: 3,
  },
];

export interface User {
  userId: string;
  email: string;
  passwordHash: string;
  fullName: string;
  phoneNumber: string;
  avatar: string;
  birthDate: string; // ISO date
  createdDate: string; // ISO date
}

export interface Booking {
  bookingId: string;
  userId: string | null; // null for guest bookings
  showtimeId: string;
  seatList: string[]; // Array of seatId
  foodList: Array<{ foodId: string; quantity: number }>;
  totalAmount: number;
  status: "Pending_Confirmation" | "Confirmed" | "Cancelled";
  paymentMethod: "Credit_Card" | "Cash" | "E_Wallet";
  bookingDate: string; // ISO datetime
  ticketCode: string;
}

export const mockUsers: User[] = [
  {
    userId: "user_001",
    email: "john.doe@gmail.com",
    passwordHash: "hashed_password_123", // In real app, use proper hashing
    fullName: "John Doe",
    phoneNumber: "0912345678",
    avatar: "https://avatar.vercel.sh/john",
    birthDate: "1990-05-15",
    createdDate: "2025-10-01T10:00:00",
  },
  {
    userId: "user_002",
    email: "jane.smith@gmail.com",
    passwordHash: "hashed_password_456",
    fullName: "Jane Smith",
    phoneNumber: "0987654321",
    avatar: "https://avatar.vercel.sh/jane",
    birthDate: "1992-08-22",
    createdDate: "2025-09-15T14:30:00",
  },
];

export const mockBookings: Booking[] = [
  {
    bookingId: "booking_001",
    userId: "user_001",
    showtimeId: "st_001",
    seatList: ["seat_A1", "seat_A2"],
    foodList: [
      { foodId: "food_001", quantity: 1 },
      { foodId: "food_007", quantity: 2 },
    ],
    totalAmount: 185000,
    status: "Confirmed",
    paymentMethod: "Credit_Card",
    bookingDate: "2025-10-25T15:30:00",
    ticketCode: "CV-20251025-001",
  },
  {
    bookingId: "booking_002",
    userId: "user_001",
    showtimeId: "st_003",
    seatList: ["seat_C5", "seat_C6"],
    foodList: [
      { foodId: "food_003", quantity: 1 },
      { foodId: "food_006", quantity: 1 },
    ],
    totalAmount: 245000,
    status: "Confirmed",
    paymentMethod: "E_Wallet",
    bookingDate: "2025-10-20T10:15:00",
    ticketCode: "CV-20251020-002",
  },
  {
    bookingId: "booking_003",
    userId: "user_002",
    showtimeId: "st_002",
    seatList: ["seat_B5", "seat_B6"],
    foodList: [{ foodId: "food_009", quantity: 1 }],
    totalAmount: 280000,
    status: "Confirmed",
    paymentMethod: "Credit_Card",
    bookingDate: "2025-10-18T16:45:00",
    ticketCode: "CV-20251018-003",
  },
  {
    bookingId: "booking_004",
    userId: "user_001",
    showtimeId: "st_005",
    seatList: ["seat_A3"],
    foodList: [],
    totalAmount: 80000,
    status: "Pending_Confirmation",
    paymentMethod: "Cash",
    bookingDate: "2025-10-31T11:00:00",
    ticketCode: "CV-20251031-004",
  },
];

export interface Review {
  reviewId: string;
  movieId: string;
  userId: string;
  rating: number; // 1-10
  title: string;
  content: string;
  tags: string[];
  likeCount: number;
  createdDate: string; // ISO datetime
}

export interface Voucher {
  voucherId: string;
  voucherCode: string;
  voucherName: string;
  discountType: "Percentage" | "Fixed_Amount";
  discountValue: number; // percentage or fixed amount
  maxDiscount: number; // max discount
  minPurchase: number; // min purchase required
  regions: string[]; // regions where applicable
  scope: "All_Cinemas" | "Designated_Cinemas" | "Food";
  startDate: string; // ISO date
  endDate: string; // ISO date
  remainingQuantity: number;
  status: "Active" | "Expired" | "Out_Of_Stock";
}

export const mockReviews: Review[] = [
  {
    reviewId: "review_001",
    movieId: "movie_001",
    userId: "user_001",
    rating: 9,
    title: "Tuyệt vời! Đáng xem",
    content:
      "Avengers Endgame là bộ phim hoành tráng với cách kết thúc hoàn hảo cho saga Infinity Stones. Diễn xuất tuyệt vời, cốt truyện hấp dẫn.",
    tags: ["Tuyệt vời", "Hành động", "Cảm động"],
    likeCount: 245,
    createdDate: "2025-10-20T10:30:00",
  },
  {
    reviewId: "review_002",
    movieId: "movie_001",
    userId: "user_002",
    rating: 8,
    title: "Rất hay nhưng hơi dài",
    content:
      "Phim rất tốt nhưng độ dài 3 giờ khiến tôi hơi mệt. Tuy nhiên mọi cảnh quay đều đáng xem.",
    tags: ["Hay", "Hành động"],
    likeCount: 156,
    createdDate: "2025-10-18T15:45:00",
  },
  {
    reviewId: "review_003",
    movieId: "movie_002",
    userId: "user_001",
    rating: 10,
    title: "Kiệt tác điện ảnh",
    content:
      "Shawshank Redemption là một trong những bộ phim hay nhất mọi thời đại. Diễn xuất của Tim Robbins và Morgan Freeman đều xuất sắc.",
    tags: ["Kiệt tác", "Drama", "Cảm động"],
    likeCount: 512,
    createdDate: "2025-10-15T08:00:00",
  },
  {
    reviewId: "review_004",
    movieId: "movie_002",
    userId: "user_002",
    rating: 9,
    title: "Chắc chắn xem lại",
    content:
      "Câu chuyện về hy vọng và tự do rất ý nghĩa. Tôi sẽ xem lại bộ phim này nhiều lần.",
    tags: ["Drama", "Hy vọng"],
    likeCount: 389,
    createdDate: "2025-10-10T14:20:00",
  },
  {
    reviewId: "review_005",
    movieId: "movie_003",
    userId: "user_001",
    rating: 8,
    title: "Hoa mắt sau khi xem",
    content:
      "Inception là bộ phim đòi hỏi sự tập trung cao. Cốt truyện phức tạp nhưng logic. Xứng đáng xem lại.",
    tags: ["Viễn tưởng", "Khó hiểu"],
    likeCount: 234,
    createdDate: "2025-10-08T19:00:00",
  },
];

export const mockVouchers: Voucher[] = [
  {
    voucherId: "voucher_001",
    voucherCode: "SUMMER20",
    voucherName: "Giảm 20% giá vé",
    discountType: "Percentage",
    discountValue: 20,
    maxDiscount: 100000,
    minPurchase: 100000,
    regions: ["TP. Hồ Chí Minh", "Hà Nội"],
    scope: "All_Cinemas",
    startDate: "2025-10-15",
    endDate: "2025-11-15",
    remainingQuantity: 250,
    status: "Active",
  },
  {
    voucherId: "voucher_002",
    voucherCode: "POPCORN50K",
    voucherName: "Giảm 50K khi mua bắp",
    discountType: "Fixed_Amount",
    discountValue: 50000,
    maxDiscount: 50000,
    minPurchase: 100000,
    regions: ["TP. Hồ Chí Minh"],
    scope: "Food",
    startDate: "2025-10-20",
    endDate: "2025-11-05",
    remainingQuantity: 100,
    status: "Active",
  },
  {
    voucherId: "voucher_003",
    voucherCode: "VIPWEEKEND15",
    voucherName: "Giảm 15% vé VIP cuối tuần",
    discountType: "Percentage",
    discountValue: 15,
    maxDiscount: 75000,
    minPurchase: 200000,
    regions: ["TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng"],
    scope: "Designated_Cinemas",
    startDate: "2025-10-25",
    endDate: "2025-11-30",
    remainingQuantity: 50,
    status: "Active",
  },
  {
    voucherId: "voucher_004",
    voucherCode: "AUTUMN100",
    voucherName: "Giảm 100K cho đơn trên 300K",
    discountType: "Fixed_Amount",
    discountValue: 100000,
    maxDiscount: 100000,
    minPurchase: 300000,
    regions: ["TP. Hồ Chí Minh", "Hà Nội"],
    scope: "All_Cinemas",
    startDate: "2025-11-01",
    endDate: "2025-11-10",
    remainingQuantity: 15,
    status: "Active",
  },
  {
    voucherId: "voucher_005",
    voucherCode: "COUPLE30",
    voucherName: "Giảm 30% ghế Couple",
    discountType: "Percentage",
    discountValue: 30,
    maxDiscount: 60000,
    minPurchase: 160000,
    regions: ["TP. Hồ Chí Minh"],
    scope: "Designated_Cinemas",
    startDate: "2025-10-25",
    endDate: "2025-11-25",
    remainingQuantity: 5,
    status: "Active",
  },
];
