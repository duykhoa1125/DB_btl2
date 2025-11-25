// Movie types and mock data for the cinema ticket booking system

export interface Movie {
  movie_id: string;
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
  showtime_id: string;
  movie_id: string;
  cinema_id: string;
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  room: string;
  ticketPrice: number;
  status: "Coming_Soon" | "Available" | "Sold_Out" | "Now_Showing" | "Ended";
}

export interface Seat {
  seat_id: string;
  seatName: string; // A1, A2, B1, etc.
  row: string; // A, B, C, D, etc.
  column: number; // 1, 2, 3, etc.
  seatType: "Standard" | "VIP" | "Couple" | "Accessible";
}

export interface SeatBooking {
  seat_booking_id: string;
  showtime_id: string;
  seat_id: string;
  status: "Available" | "Booked" | "Sold";
}

export interface Food {
  food_id: string;
  foodName: string;
  category: "Popcorn" | "Drink" | "Special";
  price: number;
  image: string;
}

export interface Invoice {
  invoice_id: string;
  booking_id: string;
  createdDate: string; // ISO date
  totalAmount: number;
  status: "Unpaid" | "Paid" | "Cancelled";
  paymentMethod: "Credit_Card" | "Cash" | "E_Wallet";
}

export interface Cinema {
  cinema_id: string;
  cinemaName: string;
  address: string;
}

export const mockMovies: Movie[] = [
  {
    movie_id: "movie_001",
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
    movie_id: "movie_002",
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
    movie_id: "movie_003",
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
    movie_id: "movie_004",
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
    movie_id: "movie_005",
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
    movie_id: "movie_006",
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
    movie_id: "movie_007",
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
    movie_id: "movie_008",
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
    movie_id: "movie_009",
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
    movie_id: "movie_010",
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
    showtime_id: "st_001",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-01T09:00:00",
    endTime: "2025-11-01T10:54:00",
    room: "Room 1",
    ticketPrice: 80000,
    status: "Available",
  },
  {
    showtime_id: "st_002",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-01T13:00:00",
    endTime: "2025-11-01T14:54:00",
    room: "Room 1",
    ticketPrice: 80000,
    status: "Available",
  },
  {
    showtime_id: "st_003",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-01T16:00:00",
    endTime: "2025-11-01T17:54:00",
    room: "Room 1",
    ticketPrice: 100000,
    status: "Available",
  },
  {
    showtime_id: "st_004",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-01T19:00:00",
    endTime: "2025-11-01T20:54:00",
    room: "Room 1",
    ticketPrice: 120000,
    status: "Available",
  },
  {
    showtime_id: "st_005",
    movie_id: "movie_002",
    cinema_id: "cinema_001",
    startTime: "2025-11-01T09:30:00",
    endTime: "2025-11-01T11:00:00",
    room: "Room 2",
    ticketPrice: 80000,
    status: "Available",
  },
  {
    showtime_id: "st_006",
    movie_id: "movie_002",
    cinema_id: "cinema_001",
    startTime: "2025-11-01T14:00:00",
    endTime: "2025-11-01T15:30:00",
    room: "Room 2",
    ticketPrice: 80000,
    status: "Available",
  },
  {
    showtime_id: "st_007",
    movie_id: "movie_003",
    cinema_id: "cinema_002",
    startTime: "2025-11-01T10:00:00",
    endTime: "2025-11-01T11:48:00",
    room: "Room 1",
    ticketPrice: 90000,
    status: "Available",
  },
  {
    showtime_id: "st_008",
    movie_id: "movie_003",
    cinema_id: "cinema_002",
    startTime: "2025-11-01T15:30:00",
    endTime: "2025-11-01T17:18:00",
    room: "Room 1",
    ticketPrice: 100000,
    status: "Available",
  },
  // Additional showtimes for movie_001: 7 days (2025-11-10 -> 2025-11-16), 4 showtimes per day
  {
    showtime_id: "st_009",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-10T09:00:00",
    endTime: "2025-11-10T10:54:00",
    room: "Room 1",
    ticketPrice: 80000,
    status: "Available",
  },
  {
    showtime_id: "st_010",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-10T12:00:00",
    endTime: "2025-11-10T13:54:00",
    room: "Room 1",
    ticketPrice: 90000,
    status: "Available",
  },
  {
    showtime_id: "st_011",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-10T15:00:00",
    endTime: "2025-11-10T16:54:00",
    room: "Room 1",
    ticketPrice: 100000,
    status: "Available",
  },
  {
    showtime_id: "st_012",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-10T18:00:00",
    endTime: "2025-11-10T19:54:00",
    room: "Room 1",
    ticketPrice: 120000,
    status: "Available",
  },
  {
    showtime_id: "st_013",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-11T09:00:00",
    endTime: "2025-11-11T10:54:00",
    room: "Room 1",
    ticketPrice: 80000,
    status: "Available",
  },
  {
    showtime_id: "st_014",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-11T12:00:00",
    endTime: "2025-11-11T13:54:00",
    room: "Room 1",
    ticketPrice: 90000,
    status: "Available",
  },
  {
    showtime_id: "st_015",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-11T15:00:00",
    endTime: "2025-11-11T16:54:00",
    room: "Room 1",
    ticketPrice: 100000,
    status: "Available",
  },
  {
    showtime_id: "st_016",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-11T18:00:00",
    endTime: "2025-11-11T19:54:00",
    room: "Room 1",
    ticketPrice: 120000,
    status: "Available",
  },
  {
    showtime_id: "st_017",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-12T09:00:00",
    endTime: "2025-11-12T10:54:00",
    room: "Room 1",
    ticketPrice: 80000,
    status: "Available",
  },
  {
    showtime_id: "st_018",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-12T12:00:00",
    endTime: "2025-11-12T13:54:00",
    room: "Room 1",
    ticketPrice: 90000,
    status: "Available",
  },
  {
    showtime_id: "st_019",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-12T15:00:00",
    endTime: "2025-11-12T16:54:00",
    room: "Room 1",
    ticketPrice: 100000,
    status: "Available",
  },
  {
    showtime_id: "st_020",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-12T18:00:00",
    endTime: "2025-11-12T19:54:00",
    room: "Room 1",
    ticketPrice: 120000,
    status: "Available",
  },
  {
    showtime_id: "st_021",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-13T09:00:00",
    endTime: "2025-11-13T10:54:00",
    room: "Room 1",
    ticketPrice: 80000,
    status: "Available",
  },
  {
    showtime_id: "st_022",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-13T12:00:00",
    endTime: "2025-11-13T13:54:00",
    room: "Room 1",
    ticketPrice: 90000,
    status: "Available",
  },
  {
    showtime_id: "st_023",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-13T15:00:00",
    endTime: "2025-11-13T16:54:00",
    room: "Room 1",
    ticketPrice: 100000,
    status: "Available",
  },
  {
    showtime_id: "st_024",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-13T18:00:00",
    endTime: "2025-11-13T19:54:00",
    room: "Room 1",
    ticketPrice: 120000,
    status: "Available",
  },
  {
    showtime_id: "st_025",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-14T09:00:00",
    endTime: "2025-11-14T10:54:00",
    room: "Room 1",
    ticketPrice: 80000,
    status: "Available",
  },
  {
    showtime_id: "st_026",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-14T12:00:00",
    endTime: "2025-11-14T13:54:00",
    room: "Room 1",
    ticketPrice: 90000,
    status: "Available",
  },
  {
    showtime_id: "st_027",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-14T15:00:00",
    endTime: "2025-11-14T16:54:00",
    room: "Room 1",
    ticketPrice: 100000,
    status: "Available",
  },
  {
    showtime_id: "st_028",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-14T18:00:00",
    endTime: "2025-11-14T19:54:00",
    room: "Room 1",
    ticketPrice: 120000,
    status: "Available",
  },
  {
    showtime_id: "st_029",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-15T09:00:00",
    endTime: "2025-11-15T10:54:00",
    room: "Room 1",
    ticketPrice: 80000,
    status: "Available",
  },
  {
    showtime_id: "st_030",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-15T12:00:00",
    endTime: "2025-11-15T13:54:00",
    room: "Room 1",
    ticketPrice: 90000,
    status: "Available",
  },
  {
    showtime_id: "st_031",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-15T15:00:00",
    endTime: "2025-11-15T16:54:00",
    room: "Room 1",
    ticketPrice: 100000,
    status: "Available",
  },
  {
    showtime_id: "st_032",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-15T18:00:00",
    endTime: "2025-11-15T19:54:00",
    room: "Room 1",
    ticketPrice: 120000,
    status: "Available",
  },
  {
    showtime_id: "st_033",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-16T09:00:00",
    endTime: "2025-11-16T10:54:00",
    room: "Room 1",
    ticketPrice: 80000,
    status: "Available",
  },
  {
    showtime_id: "st_034",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-16T12:00:00",
    endTime: "2025-11-16T13:54:00",
    room: "Room 1",
    ticketPrice: 90000,
    status: "Available",
  },
  {
    showtime_id: "st_035",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-16T15:00:00",
    endTime: "2025-11-16T16:54:00",
    room: "Room 1",
    ticketPrice: 100000,
    status: "Available",
  },
  {
    showtime_id: "st_036",
    movie_id: "movie_001",
    cinema_id: "cinema_001",
    startTime: "2025-11-16T18:00:00",
    endTime: "2025-11-16T19:54:00",
    room: "Room 1",
    ticketPrice: 120000,
    status: "Available",
  },
  // Additional showtimes for movie_001 across multiple cinemas to test grouping
  {
    showtime_id: "st_047",
    movie_id: "movie_001",
    cinema_id: "cinema_002",
    startTime: "2025-11-01T10:00:00",
    endTime: "2025-11-01T13:01:00",
    room: "Room 1",
    ticketPrice: 85000,
    status: "Available",
  },
  {
    showtime_id: "st_048",
    movie_id: "movie_001",
    cinema_id: "cinema_002",
    startTime: "2025-11-01T14:00:00",
    endTime: "2025-11-01T17:01:00",
    room: "Room 1",
    ticketPrice: 85000,
    status: "Available",
  },
  {
    showtime_id: "st_049",
    movie_id: "movie_001",
    cinema_id: "cinema_003",
    startTime: "2025-11-01T11:00:00",
    endTime: "2025-11-01T14:01:00",
    room: "IMAX",
    ticketPrice: 150000,
    status: "Available",
  },
  {
    showtime_id: "st_050",
    movie_id: "movie_001",
    cinema_id: "cinema_003",
    startTime: "2025-11-01T19:00:00",
    endTime: "2025-11-01T22:01:00",
    room: "IMAX",
    ticketPrice: 160000,
    status: "Available",
  },
  {
    showtime_id: "st_051",
    movie_id: "movie_001",
    cinema_id: "cinema_004",
    startTime: "2025-11-01T09:00:00",
    endTime: "2025-11-01T12:01:00",
    room: "Gold Class",
    ticketPrice: 200000,
    status: "Available",
  },
  // Showtimes for new cinemas (Hanoi, Da Nang, Can Tho, Thu Duc)
  // Cinema 005 (Hanoi)
  {
    showtime_id: "st_037",
    movie_id: "movie_002",
    cinema_id: "cinema_005",
    startTime: "2025-11-10T10:00:00",
    endTime: "2025-11-10T12:22:00",
    room: "IMAX 1",
    ticketPrice: 150000,
    status: "Available",
  },
  {
    showtime_id: "st_038",
    movie_id: "movie_002",
    cinema_id: "cinema_005",
    startTime: "2025-11-10T14:00:00",
    endTime: "2025-11-10T16:22:00",
    room: "IMAX 1",
    ticketPrice: 150000,
    status: "Available",
  },
  {
    showtime_id: "st_039",
    movie_id: "movie_003",
    cinema_id: "cinema_005",
    startTime: "2025-11-10T19:00:00",
    endTime: "2025-11-10T21:28:00",
    room: "Standard 2",
    ticketPrice: 110000,
    status: "Available",
  },
  // Cinema 006 (Da Nang)
  {
    showtime_id: "st_040",
    movie_id: "movie_001",
    cinema_id: "cinema_006",
    startTime: "2025-11-10T09:30:00",
    endTime: "2025-11-10T12:31:00",
    room: "Room 1",
    ticketPrice: 90000,
    status: "Available",
  },
  {
    showtime_id: "st_041",
    movie_id: "movie_004",
    cinema_id: "cinema_006",
    startTime: "2025-11-10T13:00:00",
    endTime: "2025-11-10T15:32:00",
    room: "Room 2",
    ticketPrice: 95000,
    status: "Available",
  },
  // Cinema 007 (Can Tho)
  {
    showtime_id: "st_042",
    movie_id: "movie_005",
    cinema_id: "cinema_007",
    startTime: "2025-11-10T18:30:00",
    endTime: "2025-11-10T21:19:00",
    room: "Room 1",
    ticketPrice: 85000,
    status: "Available",
  },
  // Cinema 008 (Thu Duc)
  {
    showtime_id: "st_043",
    movie_id: "movie_006",
    cinema_id: "cinema_008",
    startTime: "2025-11-10T15:00:00",
    endTime: "2025-11-10T17:22:00",
    room: "ScreenX 1",
    ticketPrice: 130000,
    status: "Available",
  },
  {
    showtime_id: "st_044",
    movie_id: "movie_001",
    cinema_id: "cinema_008",
    startTime: "2025-11-10T20:00:00",
    endTime: "2025-11-10T23:01:00",
    room: "Standard 3",
    ticketPrice: 100000,
    status: "Available",
  },
  // More dates for Cinema 005
  {
    showtime_id: "st_045",
    movie_id: "movie_002",
    cinema_id: "cinema_005",
    startTime: "2025-11-11T10:00:00",
    endTime: "2025-11-11T12:22:00",
    room: "IMAX 1",
    ticketPrice: 150000,
    status: "Available",
  },
  {
    showtime_id: "st_046",
    movie_id: "movie_003",
    cinema_id: "cinema_005",
    startTime: "2025-11-11T19:00:00",
    endTime: "2025-11-11T21:28:00",
    room: "Standard 2",
    ticketPrice: 110000,
    status: "Available",
  },
];

export const mockSeats: Seat[] = [
  // Standard Rows (A-D)
  ...Array.from({ length: 4 }, (_, r) => {
    const rowChar = String.fromCharCode(65 + r); // A, B, C, D
    return Array.from({ length: 14 }, (_, c) => ({
      seat_id: `seat_${rowChar}${c + 1}`,
      seatName: `${rowChar}${c + 1}`,
      row: rowChar,
      column: c + 1,
      seatType: "Standard" as const,
    }));
  }).flat(),

  // VIP Rows (E-H)
  ...Array.from({ length: 4 }, (_, r) => {
    const rowChar = String.fromCharCode(69 + r); // E, F, G, H
    return Array.from({ length: 14 }, (_, c) => ({
      seat_id: `seat_${rowChar}${c + 1}`,
      seatName: `${rowChar}${c + 1}`,
      row: rowChar,
      column: c + 1,
      seatType: "VIP" as const,
    }));
  }).flat(),

  // Couple Row (J) - Fewer seats, centered
  ...Array.from({ length: 6 }, (_, c) => ({
    seat_id: `seat_J${c + 1}`,
    seatName: `J${c + 1}`,
    row: "J",
    column: c + 1, // Will map to center columns visually
    seatType: "Couple" as const,
  })),
];

export const mockFoods: Food[] = [
  {
    food_id: "food_001",
    foodName: "Bắp mặn vừa",
    category: "Popcorn",
    price: 45000,
    image: "/popcorn-salty.jpg",
  },
  {
    food_id: "food_002",
    foodName: "Bắp mặn lớn",
    category: "Popcorn",
    price: 65000,
    image: "/popcorn-large-salty.jpg",
  },
  {
    food_id: "food_003",
    foodName: "Bắp bơ vừa",
    category: "Popcorn",
    price: 50000,
    image: "/popcorn-butter.jpg",
  },
  {
    food_id: "food_004",
    foodName: "Bắp bơ lớn",
    category: "Popcorn",
    price: 70000,
    image: "/popcorn-large-butter.jpg",
  },
  {
    food_id: "food_005",
    foodName: "Nước cam vừa",
    category: "Drink",
    price: 35000,
    image: "/vibrant-orange-juice.png",
  },
  {
    food_id: "food_006",
    foodName: "Nước cam lớn",
    category: "Drink",
    price: 45000,
    image: "/orange-juice-large.jpg",
  },
  {
    food_id: "food_007",
    foodName: "Coca-Cola vừa",
    category: "Drink",
    price: 30000,
    image: "/classic-coca-cola.png",
  },
  {
    food_id: "food_008",
    foodName: "Coca-Cola lớn",
    category: "Drink",
    price: 40000,
    image: "/coca-cola-large.jpg",
  },
  {
    food_id: "food_009",
    foodName: "Combo tiết kiệm",
    category: "Special",
    price: 120000,
    image: "/combo-popcorn-drink.jpg",
  },
  {
    food_id: "food_010",
    foodName: "Combo VIP",
    category: "Special",
    price: 180000,
    image: "/vip-combo.jpg",
  },
];

// ==========================================
// FOOD CATALOG - Catalog món ăn với shelf life
// ==========================================
export interface FoodCatalogItem {
  food_id: string;
  foodName: string;
  category: "Popcorn" | "Drink" | "Special";
  price: number;
  image: string;
  description?: string;
  shelfLifeDays: number; // Số ngày hết hạn kể từ ngày sản xuất
}

export const foodCatalog: FoodCatalogItem[] = [
  {
    food_id: "food_001",
    foodName: "Bắp mặn vừa",
    category: "Popcorn",
    price: 45000,
    image: "/popcorn-salty.jpg",
    description: "Bỏng ngô rang mặn truyền thống",
    shelfLifeDays: 3,
  },
  {
    food_id: "food_002",
    foodName: "Bắp mặn lớn",
    category: "Popcorn",
    price: 65000,
    image: "/popcorn-large-salty.jpg",
    description: "Bỏng ngô rang mặn size lớn",
    shelfLifeDays: 3,
  },
  {
    food_id: "food_003",
    foodName: "Bắp bơ vừa",
    category: "Popcorn",
    price: 50000,
    image: "/popcorn-butter.jpg",
    description: "Bỏng ngô bơ thơm ngon",
    shelfLifeDays: 3,
  },
  {
    food_id: "food_004",
    foodName: "Bắp bơ lớn",
    category: "Popcorn",
    price: 70000,
    image: "/popcorn-large-butter.jpg",
    description: "Bỏng ngô bơ size lớn",
    shelfLifeDays: 3,
  },
  {
    food_id: "food_005",
    foodName: "Nước cam vừa",
    category: "Drink",
    price: 35000,
    image: "/vibrant-orange-juice.png",
    description: "Nước cam tươi 100%",
    shelfLifeDays: 7,
  },
  {
    food_id: "food_006",
    foodName: "Nước cam lớn",
    category: "Drink",
    price: 45000,
    image: "/orange-juice-large.jpg",
    description: "Nước cam tươi 100% size lớn",
    shelfLifeDays: 7,
  },
  {
    food_id: "food_007",
    foodName: "Coca-Cola vừa",
    category: "Drink",
    price: 30000,
    image: "/classic-coca-cola.png",
    description: "Coca-Cola nguyên bản",
    shelfLifeDays: 365,
  },
  {
    food_id: "food_008",
    foodName: "Coca-Cola lớn",
    category: "Drink",
    price: 40000,
    image: "/coca-cola-large.jpg",
    description: "Coca-Cola nguyên bản size lớn",
    shelfLifeDays: 365,
  },
  {
    food_id: "food_009",
    foodName: "Combo tiết kiệm",
    category: "Special",
    price: 120000,
    image: "/combo-popcorn-drink.jpg",
    description: "1 Bắp vừa + 2 Nước ngọt",
    shelfLifeDays: 1,
  },
  {
    food_id: "food_010",
    foodName: "Combo VIP",
    category: "Special",
    price: 180000,
    image: "/vip-combo.jpg",
    description: "2 Bắp lớn + 2 Nước ngọt lớn + Snack",
    shelfLifeDays: 1,
  },
];

// Convert to Map for easy lookup
export const foodCatalogMap = new Map(
  foodCatalog.map((item) => [
    item.food_id,
    {
      name: item.foodName,
      description: item.description,
      price: item.price,
      shelfLifeDays: item.shelfLifeDays,
    },
  ])
);


export const mockCinemas: Cinema[] = [
  {
    cinema_id: "cinema_001",
    cinemaName: "CinemaHub - Tân Bình",
    address: "123 Nguyễn Hữu Cảnh, Quận Tân Bình",
  },
  {
    cinema_id: "cinema_002",
    cinemaName: "CinemaHub - Bình Thạnh",
    address: "456 Nguyễn Văn Trỗi, Quận Bình Thạnh",
  },
  {
    cinema_id: "cinema_003",
    cinemaName: "CinemaHub - Quận 1",
    address: "789 Lê Lợi, Quận 1",
  },
  {
    cinema_id: "cinema_004",
    cinemaName: "CinemaHub - Hà Nội",
    address: "321 Tô Vĩ Tử, Quận Đống Đa",
  },
  {
    cinema_id: "cinema_005",
    cinemaName: "CinemaHub - Cầu Giấy",
    address: "241 Xuân Thủy, Quận Cầu Giấy",
  },
  {
    cinema_id: "cinema_006",
    cinemaName: "CinemaHub - Đà Nẵng",
    address: "910 Ngô Quyền, Quận Sơn Trà",
  },
  {
    cinema_id: "cinema_007",
    cinemaName: "CinemaHub - Cần Thơ",
    address: "209 Đường 30/4, Quận Ninh Kiều",
  },
  {
    cinema_id: "cinema_008",
    cinemaName: "CinemaHub - Thủ Đức",
    address: "216 Võ Văn Ngân, TP. Thủ Đức",
  },
];

// STAFF - Nhân viên rạp
export interface Staff {
  staff_id: string;
  name: string;
  phone_number: string;
  email?: string;
  position: "Manager" | "Supervisor" | "Staff" | "Technician";
  manage_id?: string | null; // ID của người quản lý (self-reference)
  cinema_id: string;
  hire_date: string; // ISO date
  salary?: number;
  status: "active" | "inactive";
}

export const mockStaffs: Staff[] = [
  // CIN00001 - CinemaHub Tân Bình
  {
    staff_id: "STA00001",
    name: "Nguyễn Văn Minh",
    phone_number: "0901111111",
    email: "minh.nguyen@cinemahub.vn",
    position: "Manager",
    manage_id: null, // Manager không có người quản lý
    cinema_id: "cinema_001",
    hire_date: "2023-01-15",
    salary: 25000000,
    status: "active",
  },
  {
    staff_id: "STA00002",
    name: "Trần Thị Hương",
    phone_number: "0902222222",
    email: "huong.tran@cinemahub.vn",
    position: "Supervisor",
    manage_id: "STA00001", // Báo cáo cho Manager
    cinema_id: "cinema_001",
    hire_date: "2023-03-20",
    salary: 18000000,
    status: "active",
  },
  {
    staff_id: "STA00003",
    name: "Lê Văn Hùng",
    phone_number: "0903333333",
    email: "hung.le@cinemahub.vn",
    position: "Staff",
    manage_id: "STA00002", // Báo cáo cho Supervisor
    cinema_id: "cinema_001",
    hire_date: "2023-05-10",
    salary: 12000000,
    status: "active",
  },
  {
    staff_id: "STA00004",
    name: "Phạm Thị Lan",
    phone_number: "0904444444",
    email: "lan.pham@cinemahub.vn",
    position: "Staff",
    manage_id: "STA00002",
    cinema_id: "cinema_001",
    hire_date: "2023-06-15",
    salary: 12000000,
    status: "active",
  },
  {
    staff_id: "STA00005",
    name: "Hoàng Văn Đức",
    phone_number: "0905555555",
    email: "duc.hoang@cinemahub.vn",
    position: "Technician",
    manage_id: "STA00001",
    cinema_id: "cinema_001",
    hire_date: "2023-02-28",
    salary: 15000000,
    status: "active",
  },

  // CIN00002 - CinemaHub Bình Thạnh
  {
    staff_id: "STA00006",
    name: "Võ Thị Mai",
    phone_number: "0906666666",
    email: "mai.vo@cinemahub.vn",
    position: "Manager",
    manage_id: null,
    cinema_id: "cinema_002",
    hire_date: "2023-02-01",
    salary: 24000000,
    status: "active",
  },
  {
    staff_id: "STA00007",
    name: "Đặng Văn Tùng",
    phone_number: "0907777777",
    email: "tung.dang@cinemahub.vn",
    position: "Staff",
    manage_id: "STA00006",
    cinema_id: "cinema_002",
    hire_date: "2023-04-12",
    salary: 11000000,
    status: "active",
  },
  {
    staff_id: "STA00008",
    name: "Bùi Thị Ngọc",
    phone_number: "0908888888",
    email: "ngoc.bui@cinemahub.vn",
    position: "Staff",
    manage_id: "STA00006",
    cinema_id: "cinema_002",
    hire_date: "2023-05-20",
    salary: 11000000,
    status: "active",
  },

  // CIN00003 - CinemaHub Quận 1
  {
    staff_id: "STA00009",
    name: "Trương Văn Khoa",
    phone_number: "0909999999",
    email: "khoa.truong@cinemahub.vn",
    position: "Manager",
    manage_id: null,
    cinema_id: "cinema_003",
    hire_date: "2023-01-10",
    salary: 28000000,
    status: "active",
  },
  {
    staff_id: "STA00010",
    name: "Lý Thị Thu",
    phone_number: "0910101010",
    email: "thu.ly@cinemahub.vn",
    position: "Supervisor",
    manage_id: "STA00009",
    cinema_id: "cinema_003",
    hire_date: "2023-03-15",
    salary: 19000000,
    status: "active",
  },
  {
    staff_id: "STA00011",
    name: "Ngô Văn Bình",
    phone_number: "0911111110",
    email: "binh.ngo@cinemahub.vn",
    position: "Staff",
    manage_id: "STA00010",
    cinema_id: "cinema_003",
    hire_date: "2023-07-01",
    salary: 13000000,
    status: "active",
  },
  {
    staff_id: "STA00012",
    name: "Phan Thị Hoa",
    phone_number: "0912121212",
    position: "Staff",
    manage_id: "STA00010",
    cinema_id: "cinema_003",
    hire_date: "2023-08-15",
    salary: 13000000,
    status: "inactive", // Đã nghỉ việc
  },

  // CIN00004 - CinemaHub Hà Nội
  {
    staff_id: "STA00013",
    name: "Đinh Văn Nam",
    phone_number: "0913131313",
    email: "nam.dinh@cinemahub.vn",
    position: "Manager",
    manage_id: null,
    cinema_id: "cinema_004",
    hire_date: "2023-02-20",
    salary: 26000000,
    status: "active",
  },
  {
    staff_id: "STA00014",
    name: "Vũ Thị Linh",
    phone_number: "0914141414",
    email: "linh.vu@cinemahub.vn",
    position: "Technician",
    manage_id: "STA00013",
    cinema_id: "cinema_004",
    hire_date: "2023-04-25",
    salary: 16000000,
    status: "active",
  },
];

// Helper function: Get staff by cinema
export function getStaffByCinema(cinema_id: string): Staff[] {
  return mockStaffs.filter((staff) => staff.cinema_id === cinema_id);
}

// Helper function: Get manager of a staff
export function getStaffManager(staffId: string): Staff | null {
  const staff = mockStaffs.find((s) => s.staff_id === staffId);
  if (!staff || !staff.manage_id) return null;
  return mockStaffs.find((s) => s.staff_id === staff.manage_id) || null;
}

// Helper function: Get subordinates of a manager
export function getSubordinates(managerId: string): Staff[] {
  return mockStaffs.filter((staff) => staff.manage_id === managerId);
}

// Helper function: Build staff hierarchy tree
export function buildStaffHierarchy(cinema_id: string): Staff[] {
  const cinemaStaff = getStaffByCinema(cinema_id);
  // Return only top-level managers (no manage_id)
  return cinemaStaff.filter((staff) => !staff.manage_id);
}

export interface User {
  user_id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  phoneNumber: string;
  avatar: string;
  birthDate: string; // ISO date
  createdDate: string; // ISO date
  gender: "male" | "female" | "unknown";
  membershipPoints: number; // Tích lũy điểm
  registrationDate: string; // ISO datetime
}

export interface Booking {
  booking_id: string;
  user_id: string | null; // null for guest bookings
  showtime_id: string;
  seatList: string[]; // Array of seat_id
  foodList: Array<{ food_id: string; quantity: number }>;
  totalAmount: number;
  status: "Pending_Confirmation" | "Confirmed" | "Cancelled";
  paymentMethod: "Credit_Card" | "Cash" | "E_Wallet";
  bookingDate: string; // ISO datetime
  ticketCode: string;
}

export const mockUsers: User[] = [
  {
    user_id: "user_001",
    email: "john.doe@gmail.com",
    passwordHash: "hashed_password_123", // In real app, use proper hashing
    fullName: "John Doe",
    phoneNumber: "0912345678",
    avatar: "https://avatar.vercel.sh/john",
    birthDate: "1990-05-15",
    createdDate: "2025-10-01T10:00:00",
    registrationDate: "2025-10-01T10:00:00",
    gender: "male",
    membershipPoints: 1560, // Gold tier (>= 1000)
  },
  {
    user_id: "user_002",
    email: "jane.smith@gmail.com",
    passwordHash: "hashed_password_456",
    fullName: "Jane Smith",
    phoneNumber: "0987654321",
    avatar: "https://avatar.vercel.sh/jane",
    birthDate: "1992-08-22",
    createdDate: "2025-09-15T14:30:00",
    registrationDate: "2025-09-15T14:30:00",
    gender: "female",
    membershipPoints: 3200, // Diamond tier (>= 2500)
  },
];

export const mockBookings: Booking[] = [
  {
    booking_id: "booking_001",
    user_id: "user_001",
    showtime_id: "st_001",
    seatList: ["seat_A1", "seat_A2"],
    foodList: [
      { food_id: "food_001", quantity: 1 },
      { food_id: "food_007", quantity: 2 },
    ],
    totalAmount: 185000,
    status: "Confirmed",
    paymentMethod: "Credit_Card",
    bookingDate: "2025-10-25T15:30:00",
    ticketCode: "CV-20251025-001",
  },
  {
    booking_id: "booking_002",
    user_id: "user_001",
    showtime_id: "st_003",
    seatList: ["seat_C5", "seat_C6"],
    foodList: [
      { food_id: "food_003", quantity: 1 },
      { food_id: "food_006", quantity: 1 },
    ],
    totalAmount: 245000,
    status: "Confirmed",
    paymentMethod: "E_Wallet",
    bookingDate: "2025-10-20T10:15:00",
    ticketCode: "CV-20251020-002",
  },
  {
    booking_id: "booking_003",
    user_id: "user_002",
    showtime_id: "st_002",
    seatList: ["seat_B5", "seat_B6"],
    foodList: [{ food_id: "food_009", quantity: 1 }],
    totalAmount: 280000,
    status: "Confirmed",
    paymentMethod: "Credit_Card",
    bookingDate: "2025-10-18T16:45:00",
    ticketCode: "CV-20251018-003",
  },
  {
    booking_id: "booking_004",
    user_id: "user_001",
    showtime_id: "st_005",
    seatList: ["seat_A3"],
    foodList: [],
    totalAmount: 80000,
    status: "Pending_Confirmation",
    paymentMethod: "Cash",
    bookingDate: "2025-10-31T11:00:00",
    ticketCode: "CV-20251031-004",
  },
];

// ==========================================
// SQL SCHEMA COMPLIANT DATA
// Bills, Tickets (per seat), Foods (with dates), Promotional Bills
// ==========================================

/**
 * BILLS - Hóa đơn tổng (tương đương Booking trong SQL)
 */
export const mockBills: Bill[] = [
  {
    bill_id: "bill_001",
    phone_number: "0912345678",
    creation_date: "2025-10-25T15:30:00",
    total_price: 245000, // 2 tickets (80k each) + foods (45k + 40k)
  },
  {
    bill_id: "bill_002",
    phone_number: "0912345678",
    creation_date: "2025-10-20T10:15:00",
    total_price: 295000, // 2 tickets (100k each) + foods (50k + 45k)
  },
  {
    bill_id: "bill_003",
    phone_number: "0987654321",
    creation_date: "2025-10-18T16:45:00",
    total_price: 280000, // 2 tickets (80k each) + combo (120k)
  },
  {
    bill_id: "bill_004",
    phone_number: "0912345678",
    creation_date: "2025-10-31T11:00:00",
    total_price: 80000, // 1 ticket only
  },
];

/**
 * TICKETS - Vé riêng lẻ cho TỪNG GHẾ
 * Quan trọng: Mỗi ghế = 1 ticket (không gộp chung)
 */
export const mockTickets: Ticket[] = [
  // Bill 001: 2 tickets for seats A1, A2
  {
    ticket_id: "ticket_001_A1",
    movie_name: "Avengers: Endgame",
    price: 80000,
    purchase_date: "2025-10-25T15:30:00",
    expiration_date: "2025-11-24T15:30:00", // 30 days validity
    bill_id: "bill_001",
    room_id: "room_001",
    seat_row: "A",
    seat_column: 1,
    showtime_id: "st_001",
  },
  {
    ticket_id: "ticket_001_A2",
    movie_name: "Avengers: Endgame",
    price: 80000,
    purchase_date: "2025-10-25T15:30:00",
    expiration_date: "2025-11-24T15:30:00",
    bill_id: "bill_001",
    room_id: "room_001",
    seat_row: "A",
    seat_column: 2,
    showtime_id: "st_001",
  },

  // Bill 002: 2 tickets for seats C5, C6
  {
    ticket_id: "ticket_002_C5",
    movie_name: "Avengers: Endgame",
    price: 100000,
    purchase_date: "2025-10-20T10:15:00",
    expiration_date: "2025-11-19T10:15:00",
    bill_id: "bill_002",
    room_id: "room_001",
    seat_row: "C",
    seat_column: 5,
    showtime_id: "st_003",
  },
  {
    ticket_id: "ticket_002_C6",
    movie_name: "Avengers: Endgame",
    price: 100000,
    purchase_date: "2025-10-20T10:15:00",
    expiration_date: "2025-11-19T10:15:00",
    bill_id: "bill_002",
    room_id: "room_001",
    seat_row: "C",
    seat_column: 6,
    showtime_id: "st_003",
  },

  // Bill 003: 2 tickets for seats B5, B6
  {
    ticket_id: "ticket_003_B5",
    movie_name: "Avengers: Endgame",
    price: 80000,
    purchase_date: "2025-10-18T16:45:00",
    expiration_date: "2025-11-17T16:45:00",
    bill_id: "bill_003",
    room_id: "room_002",
    seat_row: "B",
    seat_column: 5,
    showtime_id: "st_002",
  },
  {
    ticket_id: "ticket_003_B6",
    movie_name: "Avengers: Endgame",
    price: 80000,
    purchase_date: "2025-10-18T16:45:00",
    expiration_date: "2025-11-17T16:45:00",
    bill_id: "bill_003",
    room_id: "room_002",
    seat_row: "B",
    seat_column: 6,
    showtime_id: "st_002",
  },

  // Bill 004: 1 ticket for seat A3
  {
    ticket_id: "ticket_004_A3",
    movie_name: "The Shawshank Redemption",
    price: 80000,
    purchase_date: "2025-10-31T11:00:00",
    expiration_date: "2025-11-30T11:00:00",
    bill_id: "bill_004",
    room_id: "room_002",
    seat_row: "A",
    seat_column: 3,
    showtime_id: "st_005",
  },
];

/**
 * FOODS - Món ăn trong hóa đơn với NGÀY SẢN XUẤT & HẠN SỬ DỤNG
 * LƯU Ý: Database KHÔNG có field quantity
 * Mỗi món ăn = 1 record riêng (ví dụ: 2 Coca = 2 records)
 */
export const mockFoodTrackings: FoodTracking[] = [
  // Bill 001 foods: 1x Bắp mặn vừa + 2x Coca-Cola vừa
  {
    food_id: "food_track_001_001_1",
    bill_id: "bill_001",
    name: "Bắp mặn vừa",
    description: "Bỏng ngô rang mặn truyền thống",
    price: 45000,
    production_date: "2025-10-25",
    expiration_date: "2025-10-28", // 3 days shelf life
  },
  // 2x Coca-Cola → 2 records riêng
  {
    food_id: "food_track_001_007_1",
    bill_id: "bill_001",
    name: "Coca-Cola vừa",
    description: "Coca-Cola nguyên bản",
    price: 30000,
    production_date: "2025-10-25",
    expiration_date: "2026-10-25", // 365 days shelf life
  },
  {
    food_id: "food_track_001_007_2",
    bill_id: "bill_001",
    name: "Coca-Cola vừa",
    description: "Coca-Cola nguyên bản",
    price: 30000,
    production_date: "2025-10-25",
    expiration_date: "2026-10-25", // 365 days shelf life
  },

  // Bill 002 foods: 1x Bắp bơ vừa + 1x Nước cam lớn
  {
    food_id: "food_track_002_003_1",
    bill_id: "bill_002",
    name: "Bắp bơ vừa",
    description: "Bỏng ngô bơ thơm ngon",
    price: 50000,
    production_date: "2025-10-20",
    expiration_date: "2025-10-23", // 3 days
  },
  {
    food_id: "food_track_002_006_1",
    bill_id: "bill_002",
    name: "Nước cam lớn",
    description: "Nước cam tươi 100% size lớn",
    price: 45000,
    production_date: "2025-10-20",
    expiration_date: "2025-10-27", // 7 days
  },

  // Bill 003 foods: 1x Combo tiết kiệm
  {
    food_id: "food_track_003_009_1",
    bill_id: "bill_003",
    name: "Combo tiết kiệm",
    description: "1 Bắp vừa + 2 Nước ngọt",
    price: 120000,
    production_date: "2025-10-18",
    expiration_date: "2025-10-19", // 1 day shelf life (combo)
  },
];

// Helper functions for Bill, Ticket, Food tracking
export function getBillById(billId: string): Bill | undefined {
  return mockBills.find(b => b.bill_id === billId);
}

export function getTicketsByBillId(billId: string): Ticket[] {
  return mockTickets.filter(t => t.bill_id === billId);
}

export function getFoodsByBillId(billId: string): FoodTracking[] {
  return mockFoodTrackings.filter(f => f.bill_id === billId);
}


export interface Review {
  review_id: string;
  movie_id: string;
  user_id: string;
  rating: number; // 1-10
  title: string;
  content: string;
  tags: string[];
  likeCount: number;
  createdDate: string; // ISO datetime
}

// Import types from services/types.ts for Promotional-Event system
import type {
  Event,
  Promotional,
  Voucher,
  Gift,
  Discount,
  PromotionalBill,
  MemberLevel,
  Bill,
  Ticket,
  Food as FoodTracking,
} from "@/services/types";

export type {
  Event,
  Promotional,
  Voucher,
  Gift,
  Discount,
  PromotionalBill,
  MemberLevel,
  Bill,
  Ticket,
};

export const mockReviews: Review[] = [
  {
    review_id: "review_001",
    movie_id: "movie_001",
    user_id: "user_001",
    rating: 9,
    title: "Tuyệt vời! Đáng xem",
    content:
      "Avengers Endgame là bộ phim hoành tráng với cách kết thúc hoàn hảo cho saga Infinity Stones. Diễn xuất tuyệt vời, cốt truyện hấp dẫn.",
    tags: ["Tuyệt vời", "Hành động", "Cảm động"],
    likeCount: 245,
    createdDate: "2025-10-20T10:30:00",
  },
  {
    review_id: "review_002",
    movie_id: "movie_001",
    user_id: "user_002",
    rating: 8,
    title: "Rất hay nhưng hơi dài",
    content:
      "Phim rất tốt nhưng độ dài 3 giờ khiến tôi hơi mệt. Tuy nhiên mọi cảnh quay đều đáng xem.",
    tags: ["Hay", "Hành động"],
    likeCount: 156,
    createdDate: "2025-10-18T15:45:00",
  },
  {
    review_id: "review_003",
    movie_id: "movie_002",
    user_id: "user_001",
    rating: 10,
    title: "Kiệt tác điện ảnh",
    content:
      "Shawshank Redemption là một trong những bộ phim hay nhất mọi thời đại. Diễn xuất của Tim Robbins và Morgan Freeman đều xuất sắc.",
    tags: ["Kiệt tác", "Drama", "Cảm động"],
    likeCount: 512,
    createdDate: "2025-10-15T08:00:00",
  },
  {
    review_id: "review_004",
    movie_id: "movie_002",
    user_id: "user_002",
    rating: 9,
    title: "Chắc chắn xem lại",
    content:
      "Câu chuyện về hy vọng và tự do rất ý nghĩa. Tôi sẽ xem lại bộ phim này nhiều lần.",
    tags: ["Drama", "Hy vọng"],
    likeCount: 389,
    createdDate: "2025-10-10T14:20:00",
  },
  {
    review_id: "review_005",
    movie_id: "movie_003",
    user_id: "user_001",
    rating: 8,
    title: "Hoa mắt sau khi xem",
    content:
      "Inception là bộ phim đòi hỏi sự tập trung cao. Cốt truyện phức tạp nhưng logic. Xứng đáng xem lại.",
    tags: ["Viễn tưởng", "Khó hiểu"],
    likeCount: 234,
    createdDate: "2025-10-08T19:00:00",
  },
];

// ========================================
// PROMOTIONAL-EVENT SYSTEM (SQL Schema)
// ========================================

// Mock Events - Sự kiện khuyến mãi lớn
export const mockEvents: Event[] = [
  {
    event_id: "event_001",
    name: "Lễ Hội Phim Mùa Hè 2025",
    description: "Sự kiện lớn nhất năm với hàng trăm ưu đãi hấp dẫn dành cho thành viên",
    start_date: "2025-06-01",
    end_date: "2025-08-31"
  },
  {
    event_id: "event_002",
    name: "Black Friday Cinema 2025",
    description: "Giảm giá sốc mọi suất chiếu - Cơ hội vàng không thể bỏ lỡ",
    start_date: "2025-11-20",
    end_date: "2025-11-30"
  },
  {
    event_id: "event_003",
    name: "Tết Nguyên Đán 2026",
    description: "Chương trình ưu đãi đặc biệt mừng Xuân mới",
    start_date: "2026-01-15",
    end_date: "2026-02-15"
  },
  {
    event_id: "event_004",
    name: "Khuyến Mãi Cuối Năm",
    description: "Tri ân khách hàng thân thiết dịp cuối năm",
    start_date: "2025-11-01",
    end_date: "2025-12-31"
  }
];

// Mock Promotionals - Chương trình ưu đãi trong event (phân theo level)
export const mockPromotionals: Promotional[] = [
  // EVENT 001 - Lễ Hội Phim Mùa Hè
  {
    promotional_id: "promo_001",
    event_id: "event_001",
    description: "Giảm 20% cho thành viên Đồng - Hè vui tẹt ga",
    start_date: "2025-06-01",
    end_date: "2025-08-31",
    level: "copper"
  },
  {
    promotional_id: "promo_002",
    event_id: "event_001",
    description: "Giảm 30% cho thành viên Vàng - Ưu đãi đặc biệt",
    start_date: "2025-06-01",
    end_date: "2025-08-31",
    level: "gold"
  },
  {
    promotional_id: "promo_003",
    event_id: "event_001",
    description: "Tặng Combo Bắp Nước cho Kim Cương",
    start_date: "2025-06-01",
    end_date: "2025-08-31",
    level: "diamond"
  },
  {
    promotional_id: "promo_004",
    event_id: "event_001",
    description: "VIP - Giảm 50% + Tặng Gấu Bông Limited",
    start_date: "2025-06-01",
    end_date: "2025-08-31",
    level: "vip"
  },
  // EVENT 002 - Black Friday
  {
    promotional_id: "promo_005",
    event_id: "event_002",
    description: "Flash Sale 50% - Áp dụng cho tất cả thành viên",
    start_date: "2025-11-20",
    end_date: "2025-11-30",
    level: "copper" // Tất cả đều được hưởng
  },
  {
    promotional_id: "promo_006",
    event_id: "event_002",
    description: "Black Friday VIP - Giảm 60% + Quà tặng",
    start_date: "2025-11-20",
    end_date: "2025-11-30",
    level: "vip"
  },
  // EVENT 004 - Cuối năm
  {
    promotional_id: "promo_007",
    event_id: "event_004",
    description: "Giảm 15% cho thành viên Đồng - Cuối năm sum vầy",
    start_date: "2025-11-01",
    end_date: "2025-12-31",
    level: "copper"
  },
  {
    promotional_id: "promo_008",
    event_id: "event_004",
    description: "Tặng vé xem phim miễn phí cho Diamond",
    start_date: "2025-11-01",
    end_date: "2025-12-31",
    level: "diamond"
  }
];

// Mock Gifts - Quà tặng (loại promotional)
export const mockGifts: Gift[] = [
  {
    promotional_id: "promo_003",
    name: "Combo Bắp Nước Size L",
    quantity: 100
  },
  {
    promotional_id: "promo_004",
    name: "Gấu Bông Pikachu Limited Edition",
    quantity: 50
  },
  {
    promotional_id: "promo_006",
    name: "Túi Tote Canvas CinemaHub",
    quantity: 200
  },
  {
    promotional_id: "promo_008",
    name: "Vé Xem Phim Miễn Phí (1 vé)",
    quantity: 75
  }
];

// Mock Discounts - Giảm giá (loại promotional)
export const mockDiscounts: Discount[] = [
  {
    promotional_id: "promo_001",
    percent_reduce: 20,
    max_price_can_reduce: 50000
  },
  {
    promotional_id: "promo_002",
    percent_reduce: 30,
    max_price_can_reduce: 100000
  },
  {
    promotional_id: "promo_004",
    percent_reduce: 50,
    max_price_can_reduce: 150000
  },
  {
    promotional_id: "promo_005",
    percent_reduce: 50,
    max_price_can_reduce: 200000
  },
  {
    promotional_id: "promo_006",
    percent_reduce: 60,
    max_price_can_reduce: 250000
  },
  {
    promotional_id: "promo_007",
    percent_reduce: 15,
    max_price_can_reduce: 40000
  }
];

// Mock Vouchers - Mã voucher (chuẩn SQL schema)
export const mockVouchers: Voucher[] = [
  // Vouchers cho promo_001 (Discount 20% - Copper)
  {
    code: "SUMMER20-COPPER-001",
    promotional_id: "promo_001",
    start_date: "2025-06-01",
    end_date: "2025-08-31",
    state: "active",
    phone_number: "0912345678"
  },
  {
    code: "SUMMER20-COPPER-002",
    promotional_id: "promo_001",
    start_date: "2025-06-01",
    end_date: "2025-08-31",
    state: "active",
    phone_number: "0987654321"
  },

  // Vouchers cho promo_002 (Discount 30% - Gold)
  {
    code: "SUMMER30-GOLD-001",
    promotional_id: "promo_002",
    start_date: "2025-06-01",
    end_date: "2025-08-31",
    state: "active",
    phone_number: "0912345678"
  },
  {
    code: "SUMMER30-GOLD-002",
    promotional_id: "promo_002",
    start_date: "2025-06-01",
    end_date: "2025-08-31",
    state: "used",
    phone_number: "0987654321"
  },

  // Vouchers cho promo_003 (Gift - Diamond)
  {
    code: "SUMMER-GIFT-DIAMOND-001",
    promotional_id: "promo_003",
    start_date: "2025-06-01",
    end_date: "2025-08-31",
    state: "active",
    phone_number: "0987654321"
  },

  // Vouchers cho promo_005 (Black Friday 50% - All)
  {
    code: "BF50-ALL-001",
    promotional_id: "promo_005",
    start_date: "2025-11-20",
    end_date: "2025-11-30",
    state: "active",
    phone_number: "0912345678"
  },
  {
    code: "BF50-ALL-002",
    promotional_id: "promo_005",
    start_date: "2025-11-20",
    end_date: "2025-11-30",
    state: "active",
    phone_number: "0987654321"
  },

  // Vouchers cho promo_007 (Cuối năm 15% - Copper)
  {
    code: "YEAREND15-COPPER-001",
    promotional_id: "promo_007",
    start_date: "2025-11-01",
    end_date: "2025-12-31",
    state: "active",
    phone_number: "0912345678"
  },

  // Vouchers đã hết hạn (expired)
  {
    code: "OLD-PROMO-EXPIRED",
    promotional_id: "promo_001",
    start_date: "2025-01-01",
    end_date: "2025-05-31",
    state: "expired",
    phone_number: "0912345678"
  }
];

// Mock Promotional Bills
export const mockPromotionalBills: PromotionalBill[] = [
  {
    promotional_bill_id: "pb_001",
    bill_id: "bill_001" // Giả sử có bill_001 trong hệ thống
  },
  {
    promotional_bill_id: "pb_002",
    bill_id: "bill_002"
  }
];

// ========================================
// HELPER FUNCTIONS - Join data for UI
// ========================================

// Extended type for UI (with full details)
export interface VoucherWithDetails extends Voucher {
  promotional: Promotional;
  event: Event;
  discountInfo?: Discount;
  giftInfo?: Gift;
  type: 'gift' | 'discount';
}

/**
 * Lấy voucher với đầy đủ thông tin (join Event, Promotional, Gift/Discount)
 */
export function getVoucherWithDetails(code: string): VoucherWithDetails | null {
  const voucher = mockVouchers.find(v => v.code === code);
  if (!voucher) return null;

  const promotional = mockPromotionals.find(p => p.promotional_id === voucher.promotional_id);
  if (!promotional) return null;

  const event = mockEvents.find(e => e.event_id === promotional.event_id);
  if (!event) return null;

  const discount = mockDiscounts.find(d => d.promotional_id === promotional.promotional_id);
  const gift = mockGifts.find(g => g.promotional_id === promotional.promotional_id);

  return {
    ...voucher,
    promotional,
    event,
    discountInfo: discount,
    giftInfo: gift,
    type: discount ? 'discount' : 'gift'
  };
}

/**
 * Lấy tất cả vouchers của user với filter theo member level
 * User chỉ thấy voucher của promotional có level <= level của user
 */
export function getUserVouchers(
  phoneNumber: string,
  userLevel: MemberLevel
): VoucherWithDetails[] {
  const memberLevels: MemberLevel[] = ['copper', 'gold', 'diamond', 'vip'];
  const userLevelIndex = memberLevels.indexOf(userLevel);

  return mockVouchers
    .filter(v => v.phone_number === phoneNumber)
    .map(v => getVoucherWithDetails(v.code))
    .filter((v): v is VoucherWithDetails => v !== null)
    .filter(v => {
      const promoLevelIndex = memberLevels.indexOf(v.promotional.level);
      return promoLevelIndex <= userLevelIndex; // User level >= promo level
    });
}

/**
 * Lấy tất cả vouchers available (active) cho user theo level
 */
export function getAvailableVouchersForUser(
  phoneNumber: string,
  userLevel: MemberLevel
): VoucherWithDetails[] {
  return getUserVouchers(phoneNumber, userLevel)
    .filter(v => v.state === 'active')
    .filter(v => {
      const now = new Date();
      const startDate = new Date(v.start_date);
      const endDate = new Date(v.end_date);
      return now >= startDate && now <= endDate;
    });
}

/**
 * Lấy tất cả events đang diễn ra
 */
export function getActiveEvents(): Event[] {
  const now = new Date();
  return mockEvents.filter(e => {
    const startDate = new Date(e.start_date);
    const endDate = new Date(e.end_date);
    return now >= startDate && now <= endDate;
  });
}

/**
 * Lấy tất cả promotionals của một event
 */
export function getPromotionalsByEvent(eventId: string): Promotional[] {
  return mockPromotionals.filter(p => p.event_id === eventId);
}

/**
 * Lấy promotional info với type (gift or discount)
 */
export function getPromotionalWithType(promotionalId: string): {
  promotional: Promotional;
  type: 'gift' | 'discount';
  info: Gift | Discount;
} | null {
  const promotional = mockPromotionals.find(p => p.promotional_id === promotionalId);
  if (!promotional) return null;

  const discount = mockDiscounts.find(d => d.promotional_id === promotionalId);
  if (discount) {
    return {
      promotional,
      type: 'discount',
      info: discount
    };
  }

  const gift = mockGifts.find(g => g.promotional_id === promotionalId);
  if (gift) {
    return {
      promotional,
      type: 'gift',
      info: gift
    };
  }

  return null;
}

// ========================================
// MEMBERSHIP SYSTEM (Based on SQL Schema)
// ========================================
// Note: MemberLevel is imported from services/types.ts


export interface Member {
  level: MemberLevel;
  minimum_point: number;
  benefits: string[]; // Quyền lợi của hạng
  discount_percent: number; // % giảm giá
  priority_booking: boolean; // Đặt vé ưu tiên
  free_items: string[]; // Quà tặng miễn phí
  color: string; // Màu đại diện
  badge_icon: string; // Icon huy hiệu
}

export interface AccountMembership {
  phone_number: string;
  level: MemberLevel;
  join_date: string; // ISO date
  upgrade_reason?: string; // Lý do thăng hạng
}

// Mock data cho cấu hình Member tiers (ánh xạ từ bảng MEMBER)
export const mockMemberTiers: Member[] = [
  {
    level: "copper",
    minimum_point: 0,
    benefits: [
      "Tích điểm mỗi giao dịch",
      "Nhận tin khuyến mãi qua email",
      "Sinh nhật tặng voucher 50K",
    ],
    discount_percent: 0,
    priority_booking: false,
    free_items: [],
    color: "#CD7F32", // Bronze color
    badge_icon: "🥉",
  },
  {
    level: "gold",
    minimum_point: 1000,
    benefits: [
      "Giảm 5% mọi đơn hàng",
      "Đặt vé ưu tiên trước 24h",
      "Tích điểm x1.5",
      "Nước uống miễn phí size M",
      "Voucher sinh nhật 100K",
    ],
    discount_percent: 5,
    priority_booking: true,
    free_items: ["Nước cam vừa"],
    color: "#FFD700", // Gold color
    badge_icon: "🥇",
  },
  {
    level: "diamond",
    minimum_point: 2500,
    benefits: [
      "Giảm 10% mọi đơn hàng",
      "Đặt vé ưu tiên trước 48h",
      "Tích điểm x2",
      "Combo bắp nước miễn phí",
      "Nâng hạng ghế miễn phí (Standard → VIP)",
      "Voucher sinh nhật 200K",
      "Phòng chờ VIP",
    ],
    discount_percent: 10,
    priority_booking: true,
    free_items: ["Combo tiết kiệm"],
    color: "#B9F2FF", // Diamond color
    badge_icon: "💎",
  },
  {
    level: "vip",
    minimum_point: 5000,
    benefits: [
      "Giảm 15% mọi đơn hàng",
      "Đặt vé ưu tiên trước 72h",
      "Tích điểm x3",
      "Combo VIP miễn phí",
      "Nâng hạng ghế miễn phí lên Couple",
      "Voucher sinh nhật 500K",
      "Phòng chờ VIP + Massage",
      "Vé xem phim sớm (Early Access)",
      "Đưa đón miễn phí (trong bán kính 5km)",
    ],
    discount_percent: 15,
    priority_booking: true,
    free_items: ["Combo VIP", "Nước cam lớn"],
    color: "#9333EA", // Purple/VIP color
    badge_icon: "👑",
  },
];

// Mock data cho lịch sử thăng hạng (ánh xạ từ bảng ACCOUNT_MEMBERSHIP)
export const mockAccountMemberships: AccountMembership[] = [
  {
    phone_number: "0912345678",
    level: "copper",
    join_date: "2025-10-01",
    upgrade_reason: "Đăng ký tài khoản",
  },
  {
    phone_number: "0912345678",
    level: "gold",
    join_date: "2025-10-15",
    upgrade_reason: "Đạt 1000 điểm tích lũy",
  },
  {
    phone_number: "0987654321",
    level: "copper",
    join_date: "2025-09-15",
    upgrade_reason: "Đăng ký tài khoản",
  },
  {
    phone_number: "0987654321",
    level: "gold",
    join_date: "2025-09-25",
    upgrade_reason: "Đạt 1000 điểm tích lũy",
  },
  {
    phone_number: "0987654321",
    level: "diamond",
    join_date: "2025-10-20",
    upgrade_reason: "Đạt 2500 điểm tích lũy",
  },
];

// Helper function: Lấy hạng thành viên hiện tại dựa trên điểm
export function getCurrentMemberTier(points: number): Member {
  const sortedTiers = [...mockMemberTiers].sort(
    (a, b) => b.minimum_point - a.minimum_point
  );

  for (const tier of sortedTiers) {
    if (points >= tier.minimum_point) {
      return tier;
    }
  }

  return mockMemberTiers[0]; // Default: copper
}

// Helper function: Lấy hạng tiếp theo
export function getNextMemberTier(currentLevel: MemberLevel): Member | null {
  const levels: MemberLevel[] = ["copper", "gold", "diamond", "vip"];
  const currentIndex = levels.indexOf(currentLevel);

  if (currentIndex >= levels.length - 1) {
    return null; // Đã đạt hạng cao nhất
  }

  const nextLevel = levels[currentIndex + 1];
  return mockMemberTiers.find((tier) => tier.level === nextLevel) || null;
}

// Helper function: Tính tiến độ đến hạng tiếp theo
export function getMembershipProgress(points: number): {
  currentTier: Member;
  nextTier: Member | null;
  progress: number; // 0-100
  pointsToNext: number;
} {
  const currentTier = getCurrentMemberTier(points);
  const nextTier = getNextMemberTier(currentTier.level);

  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      progress: 100,
      pointsToNext: 0,
    };
  }

  const pointsInCurrentTier = points - currentTier.minimum_point;
  const pointsNeededForNext = nextTier.minimum_point - currentTier.minimum_point;
  const progress = Math.min(
    100,
    Math.round((pointsInCurrentTier / pointsNeededForNext) * 100)
  );

  return {
    currentTier,
    nextTier,
    progress,
    pointsToNext: nextTier.minimum_point - points,
  };
}
