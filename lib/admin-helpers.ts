// Admin helper functions for CRUD operations on mock data
import {
    MOCK_MOVIES,
    MOCK_CINEMAS,
    MOCK_SHOWTIMES,
} from "@/services/mock-data";
import type { Movie, Cinema, Showtime } from "@/services/types";

// ============ MOVIES CRUD ============

export function getAllMovies(): Movie[] {
    return [...MOCK_MOVIES];
}

export function getMovieById(id: string): Movie | undefined {
    return MOCK_MOVIES.find((m) => m.movie_id === id);
}

export function createMovie(movieData: Omit<Movie, "movie_id">): Movie {
    const newMovie: Movie = {
        ...movieData,
        movie_id: `MV${Date.now()}`, // Generate ID compatible with services format
    };
    MOCK_MOVIES.push(newMovie);
    return newMovie;
}

export function updateMovie(
    id: string,
    updates: Partial<Omit<Movie, "movie_id">>
): Movie | null {
    const index = MOCK_MOVIES.findIndex((m) => m.movie_id === id);
    if (index === -1) return null;

    MOCK_MOVIES[index] = { ...MOCK_MOVIES[index], ...updates };
    return MOCK_MOVIES[index];
}

export function deleteMovie(id: string): boolean {
    const index = MOCK_MOVIES.findIndex((m) => m.movie_id === id);
    if (index === -1) return false;

    MOCK_MOVIES.splice(index, 1);
    return true;
}

// ============ CINEMAS CRUD ============

export function getAllCinemas(): Cinema[] {
    return [...MOCK_CINEMAS];
}

export function getCinemaById(id: string): Cinema | undefined {
    return MOCK_CINEMAS.find((c) => c.cinema_id === id);
}

export function createCinema(cinemaData: Omit<Cinema, "cinema_id">): Cinema {
    const newCinema: Cinema = {
        ...cinemaData,
        cinema_id: `CN${Date.now()}`, // Generate ID compatible with services format
    };
    MOCK_CINEMAS.push(newCinema);
    return newCinema;
}

export function updateCinema(
    id: string,
    updates: Partial<Omit<Cinema, "cinema_id">>
): Cinema | null {
    const index = MOCK_CINEMAS.findIndex((c) => c.cinema_id === id);
    if (index === -1) return null;

    MOCK_CINEMAS[index] = { ...MOCK_CINEMAS[index], ...updates };
    return MOCK_CINEMAS[index];
}

export function deleteCinema(id: string): boolean {
    const index = MOCK_CINEMAS.findIndex((c) => c.cinema_id === id);
    if (index === -1) return false;

    MOCK_CINEMAS.splice(index, 1);
    return true;
}

// ============ SHOWTIMES CRUD ============

export function getAllShowtimes(): Showtime[] {
    return [...MOCK_SHOWTIMES];
}

export function getShowtimeById(id: string): Showtime | undefined {
    return MOCK_SHOWTIMES.find((s) => s.showtime_id === id);
}

export function createShowtime(
    showtimeData: Omit<Showtime, "showtime_id">
): Showtime {
    const newShowtime: Showtime = {
        ...showtimeData,
        showtime_id: `st_${Date.now()}`,
    };
    MOCK_SHOWTIMES.push(newShowtime);
    return newShowtime;
}

export function updateShowtime(
    id: string,
    updates: Partial<Omit<Showtime, "showtime_id">>
): Showtime | null {
    const index = MOCK_SHOWTIMES.findIndex((s) => s.showtime_id === id);
    if (index === -1) return null;

    MOCK_SHOWTIMES[index] = { ...MOCK_SHOWTIMES[index], ...updates };
    return MOCK_SHOWTIMES[index];
}

export function deleteShowtime(id: string): boolean {
    const index = MOCK_SHOWTIMES.findIndex((s) => s.showtime_id === id);
    if (index === -1) return false;

    MOCK_SHOWTIMES.splice(index, 1);
    return true;
}

// ============ STATISTICS ============

// Import mockBookings for statistics (Note: This uses old data structure for now)
import { mockBookings } from "./mock-data";

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
            // Note: This lookup might fail if booking.showtime_id doesn't exist in MOCK_SHOWTIMES
            // But we keep it for compilation. In real app, bookings should be migrated too.
            const showtime = MOCK_SHOWTIMES.find(
                (s) => s.showtime_id === booking.showtime_id
            );
            if (showtime) {
                const current = revenueByMovie.get(showtime.movie_id) || 0;
                revenueByMovie.set(showtime.movie_id, current + booking.totalAmount);
            }
        });

    // Convert to array and sort
    const sorted = Array.from(revenueByMovie.entries())
        .map(([movie_id, revenue]) => ({
            movie: MOCK_MOVIES.find((m) => m.movie_id === movie_id)!,
            revenue,
        }))
        .filter((item) => item.movie)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, limit);

    return sorted;
}
