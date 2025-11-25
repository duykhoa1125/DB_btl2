// Admin helper functions for CRUD operations on mock data
import {
    mockMovies,
    mockCinemas,
    mockBookings,
    type Movie,
    type Cinema,
} from "./mock-data";
import { MOCK_SHOWTIMES } from "@/services/mock-data";
import type { Showtime } from "@/services/types";

// ============ MOVIES CRUD ============

export function getAllMovies(): Movie[] {
    return [...mockMovies];
}

export function getMovieById(id: string): Movie | undefined {
    return mockMovies.find((m) => m.movie_id === id);
}

export function createMovie(movieData: Omit<Movie, "movie_id">): Movie {
    const newMovie: Movie = {
        ...movieData,
        movie_id: `movie_${Date.now()}`,
    };
    mockMovies.push(newMovie);
    return newMovie;
}

export function updateMovie(
    id: string,
    updates: Partial<Omit<Movie, "movie_id">>
): Movie | null {
    const index = mockMovies.findIndex((m) => m.movie_id === id);
    if (index === -1) return null;

    mockMovies[index] = { ...mockMovies[index], ...updates };
    return mockMovies[index];
}

export function deleteMovie(id: string): boolean {
    const index = mockMovies.findIndex((m) => m.movie_id === id);
    if (index === -1) return false;

    mockMovies.splice(index, 1);
    return true;
}

// ============ CINEMAS CRUD ============

export function getAllCinemas(): Cinema[] {
    return [...mockCinemas];
}

export function getCinemaById(id: string): Cinema | undefined {
    return mockCinemas.find((c) => c.cinema_id === id);
}

export function createCinema(cinemaData: Omit<Cinema, "cinema_id">): Cinema {
    const newCinema: Cinema = {
        ...cinemaData,
        cinema_id: `cinema_${Date.now()}`,
    };
    mockCinemas.push(newCinema);
    return newCinema;
}

export function updateCinema(
    id: string,
    updates: Partial<Omit<Cinema, "cinema_id">>
): Cinema | null {
    const index = mockCinemas.findIndex((c) => c.cinema_id === id);
    if (index === -1) return null;

    mockCinemas[index] = { ...mockCinemas[index], ...updates };
    return mockCinemas[index];
}

export function deleteCinema(id: string): boolean {
    const index = mockCinemas.findIndex((c) => c.cinema_id === id);
    if (index === -1) return false;

    mockCinemas.splice(index, 1);
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
            movie: mockMovies.find((m) => m.movie_id === movie_id)!,
            revenue,
        }))
        .filter((item) => item.movie)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, limit);

    return sorted;
}
