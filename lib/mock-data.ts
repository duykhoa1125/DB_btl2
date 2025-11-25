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
  description: string;
  imageUrl: string;
  facilities: string[];
  phone: string;
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
  // Additional showtimes for movie_001 across multiple cinemas to test grouping
  {
    showtimeId: "st_047",
    movieId: "movie_001",
    cinemaId: "cinema_002",
    startTime: "2025-11-01T10:00:00",
    endTime: "2025-11-01T13:01:00",
    room: "Room 1",
    ticketPrice: 85000,
    status: "Available",
  },
  {
    showtimeId: "st_048",
    movieId: "movie_001",
    cinemaId: "cinema_002",
    startTime: "2025-11-01T14:00:00",
    endTime: "2025-11-01T17:01:00",
    room: "Room 1",
    ticketPrice: 85000,
    status: "Available",
  },
  {
    showtimeId: "st_049",
    movieId: "movie_001",
    cinemaId: "cinema_003",
    startTime: "2025-11-01T11:00:00",
    endTime: "2025-11-01T14:01:00",
    room: "IMAX",
    ticketPrice: 150000,
    status: "Available",
  },
  {
    showtimeId: "st_050",
    movieId: "movie_001",
    cinemaId: "cinema_003",
    startTime: "2025-11-01T19:00:00",
    endTime: "2025-11-01T22:01:00",
    room: "IMAX",
    ticketPrice: 160000,
    status: "Available",
  },
  {
    showtimeId: "st_051",
    movieId: "movie_001",
    cinemaId: "cinema_004",
    startTime: "2025-11-01T09:00:00",
    endTime: "2025-11-01T12:01:00",
    room: "Gold Class",
    ticketPrice: 200000,
    status: "Available",
  },
  // Showtimes for new cinemas (Hanoi, Da Nang, Can Tho, Thu Duc)
  // Cinema 005 (Hanoi)
  {
    showtimeId: "st_037",
    movieId: "movie_002",
    cinemaId: "cinema_005",
    startTime: "2025-11-10T10:00:00",
    endTime: "2025-11-10T12:22:00",
    room: "IMAX 1",
    ticketPrice: 150000,
    status: "Available",
  },
  {
    showtimeId: "st_038",
    movieId: "movie_002",
    cinemaId: "cinema_005",
    startTime: "2025-11-10T14:00:00",
    endTime: "2025-11-10T16:22:00",
    room: "IMAX 1",
    ticketPrice: 150000,
    status: "Available",
  },
  {
    showtimeId: "st_039",
    movieId: "movie_003",
    cinemaId: "cinema_005",
    startTime: "2025-11-10T19:00:00",
    endTime: "2025-11-10T21:28:00",
    room: "Standard 2",
    ticketPrice: 110000,
    status: "Available",
  },
  // Cinema 006 (Da Nang)
  {
    showtimeId: "st_040",
    movieId: "movie_001",
    cinemaId: "cinema_006",
    startTime: "2025-11-10T09:30:00",
    endTime: "2025-11-10T12:31:00",
    room: "Room 1",
    ticketPrice: 90000,
    status: "Available",
  },
  {
    showtimeId: "st_041",
    movieId: "movie_004",
    cinemaId: "cinema_006",
    startTime: "2025-11-10T13:00:00",
    endTime: "2025-11-10T15:32:00",
    room: "Room 2",
    ticketPrice: 95000,
    status: "Available",
  },
  // Cinema 007 (Can Tho)
  {
    showtimeId: "st_042",
    movieId: "movie_005",
    cinemaId: "cinema_007",
    startTime: "2025-11-10T18:30:00",
    endTime: "2025-11-10T21:19:00",
    room: "Room 1",
    ticketPrice: 85000,
    status: "Available",
  },
  // Cinema 008 (Thu Duc)
  {
    showtimeId: "st_043",
    movieId: "movie_006",
    cinemaId: "cinema_008",
    startTime: "2025-11-10T15:00:00",
    endTime: "2025-11-10T17:22:00",
    room: "ScreenX 1",
    ticketPrice: 130000,
    status: "Available",
  },
  {
    showtimeId: "st_044",
    movieId: "movie_001",
    cinemaId: "cinema_008",
    startTime: "2025-11-10T20:00:00",
    endTime: "2025-11-10T23:01:00",
    room: "Standard 3",
    ticketPrice: 100000,
    status: "Available",
  },
  // More dates for Cinema 005
  {
    showtimeId: "st_045",
    movieId: "movie_002",
    cinemaId: "cinema_005",
    startTime: "2025-11-11T10:00:00",
    endTime: "2025-11-11T12:22:00",
    room: "IMAX 1",
    ticketPrice: 150000,
    status: "Available",
  },
  {
    showtimeId: "st_046",
    movieId: "movie_003",
    cinemaId: "cinema_005",
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
      seatId: `seat_${rowChar}${c + 1}`,
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
      seatId: `seat_${rowChar}${c + 1}`,
      seatName: `${rowChar}${c + 1}`,
      row: rowChar,
      column: c + 1,
      seatType: "VIP" as const,
    }));
  }).flat(),

  // Couple Row (J) - Fewer seats, centered
  ...Array.from({ length: 6 }, (_, c) => ({
    seatId: `seat_J${c + 1}`,
    seatName: `J${c + 1}`,
    row: "J",
    column: c + 1, // Will map to center columns visually
    seatType: "Couple" as const,
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
    description: "Rạp chiếu phim hiện đại với công nghệ âm thanh Dolby Atmos và màn hình cong kích thước lớn, mang lại trải nghiệm điện ảnh sống động nhất.",
    imageUrl: "https://images.unsplash.com/photo-1517604931442-710c8ef5ad25?q=80&w=2069&auto=format&fit=crop",
    facilities: ["Dolby Atmos", "Ghế đôi", "Bắp nước ngon", "Giữ xe miễn phí"],
    phone: "028 3812 3456",
  },
  {
    cinemaId: "cinema_002",
    cinemaName: "CinemaHub - Bình Thạnh",
    address: "456 Nguyễn Văn Trỗi, Quận Bình Thạnh",
    city: "TP. Hồ Chí Minh",
    numberOfRooms: 3,
    description: "Không gian sang trọng, ấm cúng, phù hợp cho các cặp đôi và gia đình. Hệ thống ghế ngồi êm ái, rộng rãi.",
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop",
    facilities: ["IMAX", "Ghế VIP", "Wifi miễn phí"],
    phone: "028 3512 7890",
  },
  {
    cinemaId: "cinema_003",
    cinemaName: "CinemaHub - Quận 1",
    address: "789 Lê Lợi, Quận 1",
    city: "TP. Hồ Chí Minh",
    numberOfRooms: 5,
    description: "Tọa lạc tại trung tâm thành phố, CinemaHub Quận 1 là điểm đến lý tưởng cho những tín đồ điện ảnh với các suất chiếu muộn.",
    imageUrl: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?q=80&w=1779&auto=format&fit=crop",
    facilities: ["4DX", "Dolby Atmos", "Nhà hàng", "Khu vui chơi trẻ em"],
    phone: "028 3912 3456",
  },
  {
    cinemaId: "cinema_004",
    cinemaName: "CinemaHub - Hà Nội",
    address: "321 Tô Vĩ Tử, Quận Đống Đa",
    city: "Hà Nội",
    numberOfRooms: 3,
    description: "Rạp chiếu phim tiêu chuẩn quốc tế đầu tiên tại khu vực, mang đến trải nghiệm xem phim đỉnh cao cho khán giả thủ đô.",
    imageUrl: "https://images.unsplash.com/photo-1586899028174-e7098604235b?q=80&w=2071&auto=format&fit=crop",
    facilities: ["Dolby 7.1", "Ghế Sweetbox", "Cà phê"],
    phone: "024 3812 9876",
  },
  {
    cinemaId: "cinema_005",
    cinemaName: "CinemaHub - Cầu Giấy",
    address: "241 Xuân Thủy, Quận Cầu Giấy",
    city: "Hà Nội",
    numberOfRooms: 6,
    description: "Tổ hợp giải trí cinema kết hợp với khu vui chơi, mua sắm. Hệ thống phòng chiếu hiện đại bậc nhất Hà Nội.",
    imageUrl: "https://images.unsplash.com/photo-1513106580091-1d82408b8cd8?q=80&w=2076&auto=format&fit=crop",
    facilities: ["IMAX Laser", "Dolby Atmos", "Ghế Massage", "Khu vui chơi"],
    phone: "024 3754 1234",
  },
  {
    cinemaId: "cinema_006",
    cinemaName: "CinemaHub - Đà Nẵng",
    address: "910 Ngô Quyền, Quận Sơn Trà",
    city: "Đà Nẵng",
    numberOfRooms: 4,
    description: "Điểm đến giải trí hàng đầu tại thành phố biển Đà Nẵng. Không gian thoáng đãng, view đẹp.",
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop",
    facilities: ["4DX", "Ghế đôi", "View biển"],
    phone: "0236 3987 654",
  },
  {
    cinemaId: "cinema_007",
    cinemaName: "CinemaHub - Cần Thơ",
    address: "209 Đường 30/4, Quận Ninh Kiều",
    city: "Cần Thơ",
    numberOfRooms: 3,
    description: "Rạp chiếu phim hiện đại nhất khu vực Đồng bằng sông Cửu Long. Phục vụ khán giả miền Tây với chất lượng tốt nhất.",
    imageUrl: "https://images.unsplash.com/photo-1524712245354-0c40c59b635f?q=80&w=2069&auto=format&fit=crop",
    facilities: ["Dolby 7.1", "Bắp nước đặc biệt", "Wifi mạnh"],
    phone: "0292 3812 345",
  },
  {
    cinemaId: "cinema_008",
    cinemaName: "CinemaHub - Thủ Đức",
    address: "216 Võ Văn Ngân, TP. Thủ Đức",
    city: "TP. Hồ Chí Minh",
    numberOfRooms: 5,
    description: "Rạp chiếu phim dành cho giới trẻ năng động tại thành phố mới Thủ Đức. Thiết kế trẻ trung, hiện đại.",
    imageUrl: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?q=80&w=1779&auto=format&fit=crop",
    facilities: ["ScreenX", "Ghế Beanbag", "Trà sữa"],
    phone: "028 3722 8888",
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
export function getStaffByCinema(cinemaId: string): Staff[] {
  return mockStaffs.filter((staff) => staff.cinema_id === cinemaId);
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
export function buildStaffHierarchy(cinemaId: string): Staff[] {
  const cinemaStaff = getStaffByCinema(cinemaId);
  // Return only top-level managers (no manage_id)
  return cinemaStaff.filter((staff) => !staff.manage_id);
}

export interface User {
  userId: string;
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
    registrationDate: "2025-10-01T10:00:00",
    gender: "male",
    membershipPoints: 1560, // Gold tier (>= 1000)
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
    registrationDate: "2025-09-15T14:30:00",
    gender: "female",
    membershipPoints: 3200, // Diamond tier (>= 2500)
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

// ========================================
// MEMBERSHIP SYSTEM (Based on SQL Schema)
// ========================================

export type MemberLevel = "copper" | "gold" | "diamond" | "vip";

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
