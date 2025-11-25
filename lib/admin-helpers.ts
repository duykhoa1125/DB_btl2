// Admin helper functions for CRUD operations on mock data
import {
    mockMovies,
    mockCinemas,
    mockShowtimes,
    mockBookings,
    type Movie,
    type Cinema,
    type Showtime,
} from "./mock-data";

// ============ MOVIES CRUD ============

export function getAllMovies(): Movie[] {
    return [...mockMovies];
}

export function getMovieById(id: string): Movie | undefined {
    return mockMovies.find((m) => m.movieId === id);
}

export function createMovie(movieData: Omit<Movie, "movieId">): Movie {
    const newMovie: Movie = {
        ...movieData,
        movieId: `movie_${Date.now()}`,
    };
    mockMovies.push(newMovie);
    return newMovie;
}

export function updateMovie(
    id: string,
    updates: Partial<Omit<Movie, "movieId">>
): Movie | null {
    const index = mockMovies.findIndex((m) => m.movieId === id);
    if (index === -1) return null;

    mockMovies[index] = { ...mockMovies[index], ...updates };
    return mockMovies[index];
}

export function deleteMovie(id: string): boolean {
    const index = mockMovies.findIndex((m) => m.movieId === id);
    if (index === -1) return false;

    mockMovies.splice(index, 1);
    return true;
}

// ============ CINEMAS CRUD ============

export function getAllCinemas(): Cinema[] {
    return [...mockCinemas];
}

export function getCinemaById(id: string): Cinema | undefined {
    return mockCinemas.find((c) => c.cinemaId === id);
}

export function createCinema(cinemaData: Omit<Cinema, "cinemaId">): Cinema {
    const newCinema: Cinema = {
        ...cinemaData,
        cinemaId: `cinema_${Date.now()}`,
    };
    mockCinemas.push(newCinema);
    return newCinema;
}

export function updateCinema(
    id: string,
    updates: Partial<Omit<Cinema, "cinemaId">>
): Cinema | null {
    const index = mockCinemas.findIndex((c) => c.cinemaId === id);
    if (index === -1) return null;

    mockCinemas[index] = { ...mockCinemas[index], ...updates };
    return mockCinemas[index];
}

export function deleteCinema(id: string): boolean {
    const index = mockCinemas.findIndex((c) => c.cinemaId === id);
    if (index === -1) return false;

    mockCinemas.splice(index, 1);
    return true;
}

// ============ SHOWTIMES CRUD ============

export function getAllShowtimes(): Showtime[] {
    return [...mockShowtimes];
}

export function getShowtimeById(id: string): Showtime | undefined {
    return mockShowtimes.find((s) => s.showtimeId === id);
}

export function createShowtime(
    showtimeData: Omit<Showtime, "showtimeId">
): Showtime {
    const newShowtime: Showtime = {
        ...showtimeData,
        showtimeId: `st_${Date.now()}`,
    };
    mockShowtimes.push(newShowtime);
    return newShowtime;
}

export function updateShowtime(
    id: string,
    updates: Partial<Omit<Showtime, "showtimeId">>
): Showtime | null {
    const index = mockShowtimes.findIndex((s) => s.showtimeId === id);
    if (index === -1) return null;

    mockShowtimes[index] = { ...mockShowtimes[index], ...updates };
    return mockShowtimes[index];
}

export function deleteShowtime(id: string): boolean {
    const index = mockShowtimes.findIndex((s) => s.showtimeId === id);
    if (index === -1) return false;

    mockShowtimes.splice(index, 1);
    return true;
}

// ============ STATISTICS ============

export function calculateMonthlyRevenue(year: number, month: number): number {
    const bookingsInMonth = mockBookings.filter((booking) => {
        const bookingDate = new Date(booking.bookingDate);
        return (
            bookingDate.getFullYear() === year &&
            bookingDate.getMonth() + 1 === month &&
            booking.status === "Confirmed"
        );
    });

    return bookingsInMonth.reduce((sum, booking) => sum + booking.totalAmount, 0);
}

export function getTotalBookingsThisMonth(): number {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    return mockBookings.filter((booking) => {
        const bookingDate = new Date(booking.bookingDate);
        return (
            bookingDate.getFullYear() === currentYear &&
            bookingDate.getMonth() + 1 === currentMonth
        );
    }).length;
}

export function getTopMoviesByRevenue(limit: number = 5) {
    // Group bookings by movie
    const revenueByMovie = new Map<string, number>();

    mockBookings
        .filter((b) => b.status === "Confirmed")
        .forEach((booking) => {
            const showtime = mockShowtimes.find(
                (s) => s.showtimeId === booking.showtimeId
            );
            if (showtime) {
                const current = revenueByMovie.get(showtime.movieId) || 0;
                revenueByMovie.set(showtime.movieId, current + booking.totalAmount);
            }
        });

    // Convert to array and sort
    const sorted = Array.from(revenueByMovie.entries())
        .map(([movieId, revenue]) => ({
            movie: mockMovies.find((m) => m.movieId === movieId)!,
            revenue,
        }))
        .filter((item) => item.movie)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, limit);

    return sorted;
}
