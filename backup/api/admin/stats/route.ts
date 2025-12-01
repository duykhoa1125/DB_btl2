import { NextResponse } from 'next/server';
import { MOCK_BILLS, MOCK_TICKETS, MOCK_SHOWTIMES, MOCK_MOVIES } from '@/services/mock-data';

// GET /api/admin/stats/monthly-revenue
function getMonthlyRevenue(year: number, month: number): number {
    const billsInMonth = MOCK_BILLS.filter((bill) => {
        const billDate = new Date(bill.creation_date);
        return (
            billDate.getFullYear() === year &&
            billDate.getMonth() + 1 === month
        );
    });

    return billsInMonth.reduce((sum, bill) => sum + bill.total_price, 0);
}

// GET /api/admin/stats/bookings-this-month
function getTotalBookingsThisMonth(): number {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    return MOCK_BILLS.filter((bill) => {
        const billDate = new Date(bill.creation_date);
        return (
            billDate.getFullYear() === currentYear &&
            billDate.getMonth() + 1 === currentMonth
        );
    }).length;
}

// GET /api/admin/stats/top-movies
function getTopMoviesByRevenue(limit: number = 5) {
    // Group ticket revenue by movie
    const revenueByMovie = new Map<string, number>();

    MOCK_TICKETS.forEach((ticket) => {
        // Find showtime to get movie_id
        const showtime = MOCK_SHOWTIMES.find(
            (s) => s.showtime_id === ticket.showtime_id
        );
        if (showtime) {
            const current = revenueByMovie.get(showtime.movie_id) || 0;
            revenueByMovie.set(showtime.movie_id, current + ticket.price);
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

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Check query param for 'type' to determine which stats to return
        const type = searchParams.get('type') || 'dashboard';

        if (type === 'monthly-revenue') {
            const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));
            const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1));
            return NextResponse.json(getMonthlyRevenue(year, month));
        }

        if (type === 'bookings-this-month') {
            return NextResponse.json(getTotalBookingsThisMonth());
        }

        if (type === 'top-movies') {
            const limit = parseInt(searchParams.get('limit') || '5');
            return NextResponse.json(getTopMoviesByRevenue(limit));
        }

        // Default: return full dashboard stats
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        const stats = {
            totalRevenue: getMonthlyRevenue(currentYear, currentMonth),
            totalBookings: getTotalBookingsThisMonth(),
            topMovies: getTopMoviesByRevenue(5),
            monthlyRevenue: getMonthlyRevenue(currentYear, currentMonth),
        };

        return NextResponse.json(stats);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}

