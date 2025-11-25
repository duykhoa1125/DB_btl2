import {
    Cinema, Room, Seat, Movie, Showtime, Account,
    MovieStatus, SeatType, SeatPhysicalState, EntityState,
    MemberLevel, Gender, MovieLanguage, Director, Actor,
    Voucher, Event, Promotional, MovieReview, Food,
    SeatLayoutItem, BookingSeatState, MovieDetail
} from './types';

// --- HELPERS ---

const generateSeats = (roomId: string, rows: number, cols: number): Seat[] => {
    const seats: Seat[] = [];
    const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

    for (let r = 0; r < rows; r++) {
        for (let c = 1; c <= cols; c++) {
            let type: SeatType = 'normal';
            if (r >= rows - 2) type = 'couple';
            else if (r >= rows - 5) type = 'vip';

            seats.push({
                room_id: roomId,
                seat_row: rowLabels[r],
                seat_column: c,
                seat_type: type,
                state: 'available'
            });
        }
    }
    return seats;
};

const addDays = (date: Date, days: number): string => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
};

// --- 1. CINEMAS ---

export const MOCK_CINEMAS: Cinema[] = [
    { cinema_id: 'CNM001', name: 'CineStar Central', state: 'active', address: '123 Nguyen Hue, Dist 1, HCMC' },
    { cinema_id: 'CNM002', name: 'CineStar Riverside', state: 'active', address: '456 Ben Van Don, Dist 4, HCMC' },
    { cinema_id: 'CNM003', name: 'CineStar Crescent', state: 'active', address: '101 Ton Dat Tien, Dist 7, HCMC' },
    { cinema_id: 'CNM004', name: 'CineStar Landmark', state: 'active', address: '208 Nguyen Huu Canh, Binh Thanh, HCMC' },
    { cinema_id: 'CNM005', name: 'CineStar Plaza', state: 'inactive', address: '99 Le Duan, Da Nang' }, // Inactive for testing
];

// --- 2. ROOMS & SEATS ---

export const MOCK_ROOMS: Room[] = [];
export const MOCK_SEATS: Seat[] = [];

MOCK_CINEMAS.forEach(cinema => {
    // Each cinema has 3-5 rooms
    const roomCount = 4;
    for (let i = 1; i <= roomCount; i++) {
        const roomId = `${cinema.cinema_id}_R${i}`;
        const room: Room = {
            room_id: roomId,
            cinema_id: cinema.cinema_id,
            name: `Room ${i} ${i === 1 ? '(IMAX)' : ''}`,
            state: 'active'
        };
        MOCK_ROOMS.push(room);

        // Generate seats for each room (10 rows, 12 cols)
        MOCK_SEATS.push(...generateSeats(roomId, 10, 12));
    }
});

// --- 3. MOVIES ---


export const MOCK_MOVIES: Movie[] = [
    {
        movie_id: 'MV001',
        name: 'Dune: Part Two',
        image: 'https://image.tmdb.org/t/p/original/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
        duration: 166,
        release_date: '2024-03-01',
        end_date: '2024-05-01',
        age_rating: 13,
        trailer: 'https://www.youtube.com/watch?v=Way9Dexny3w',
        language: 'en',
        status: 'showing',
        synopsis: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.'
    },
    {
        movie_id: 'MV002',
        name: 'Kung Fu Panda 4',
        image: 'https://image.tmdb.org/t/p/original/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
        duration: 94,
        release_date: '2024-03-08',
        end_date: '2024-05-08',
        age_rating: 0, // All ages
        trailer: 'https://www.youtube.com/watch?v=_inKs4eeHiI',
        language: 'en',
        status: 'showing',
        synopsis: 'Po is gearing up to become the spiritual leader of his Valley of Peace, but also needs someone to take his place as Dragon Warrior.'
    },
    {
        movie_id: 'MV003',
        name: 'Godzilla x Kong: The New Empire',
        image: 'https://image.tmdb.org/t/p/original/tMefBSflv6PGwM5ZtBe8xwQCoDe.jpg',
        duration: 115,
        release_date: '2024-03-29',
        end_date: '2024-05-29',
        age_rating: 13,
        trailer: 'https://www.youtube.com/watch?v=lV1OOlGwExM',
        language: 'en',
        status: 'showing',
        synopsis: 'Two ancient titans, Godzilla and Kong, clash in an epic battle as humans unravel their intertwined origins and connection to Skull Island\'s mysteries.'
    },
    {
        movie_id: 'MV004',
        name: 'Exhuma',
        image: 'https://image.tmdb.org/t/p/original/pQYHouPsDf32FhIKYB72laNSAQo.jpg',
        duration: 134,
        release_date: '2024-03-15',
        end_date: '2024-05-15',
        age_rating: 16,
        trailer: 'https://www.youtube.com/watch?v=M5S6d6g2g2k',
        language: 'ko',
        status: 'showing',
        synopsis: 'A wealthy family in LA experiences a series of supernatural events and contacts young shamans Hwa-rim and Bong-gil.'
    },
    {
        movie_id: 'MV005',
        name: 'Mai',
        image: 'https://upload.wikimedia.org/wikipedia/vi/8/86/Mai_film_poster.jpg',
        duration: 131,
        release_date: '2024-02-10',
        end_date: '2024-04-10',
        age_rating: 18,
        trailer: 'https://www.youtube.com/watch?v=example',
        language: 'vi',
        status: 'ended',
        synopsis: 'A touching story about love and family during Tet holiday.'
    },
    {
        movie_id: 'MV006',
        name: 'Civil War',
        image: 'https://image.tmdb.org/t/p/original/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg',
        duration: 109,
        release_date: '2024-04-12',
        end_date: '2024-06-12',
        age_rating: 16,
        trailer: 'https://www.youtube.com/watch?v=aDyQxtgKW5s',
        language: 'en',
        status: 'upcoming',
        synopsis: 'A journey across a dystopian future America, following a team of military-embedded journalists as they race against time to reach DC before rebel factions descend upon the White House.'
    },
    {
        movie_id: 'MV007',
        name: 'The Fall Guy',
        image: 'https://image.tmdb.org/t/p/original/tSz1qsmSJon0rqkHBxXZmrotuse.jpg',
        duration: 126,
        release_date: '2024-05-03',
        end_date: '2024-07-03',
        age_rating: 13,
        trailer: 'https://www.youtube.com/watch?v=j7jPnwVGdZ8',
        language: 'en',
        status: 'upcoming',
        synopsis: 'A battered and past-his-prime stuntman finds himself working on a movie set with the star for whom he doubled long ago, who has gone missing.'
    },
    {
        movie_id: 'MV008',
        name: 'Kingdom of the Planet of the Apes',
        image: 'https://image.tmdb.org/t/p/original/gKkl37BQuKTanygYQG1pyYgLVgf.jpg',
        duration: 145,
        release_date: '2024-05-10',
        end_date: '2024-07-10',
        age_rating: 13,
        trailer: 'https://www.youtube.com/watch?v=XtFI7SNtVpY',
        language: 'en',
        status: 'upcoming',
        synopsis: 'Several generations in the future following Caesar\'s reign, in which apes are the dominant species living harmoniously and humans have been reduced to living in the shadows.'
    },
    {
        movie_id: 'MV009',
        name: 'Furiosa: A Mad Max Saga',
        image: 'https://image.tmdb.org/t/p/original/iADOJ8Zymht2JPMoy3R7xceZprc.jpg',
        duration: 148,
        release_date: '2024-05-24',
        end_date: '2024-07-24',
        age_rating: 16,
        trailer: 'https://www.youtube.com/watch?v=XJMuhwVlca4',
        language: 'en',
        status: 'upcoming',
        synopsis: 'As the world fell, young Furiosa is snatched from the Green Place of Many Mothers and falls into the hands of a great Biker Horde led by the Warlord Dementus.'
    },
    {
        movie_id: 'MV010',
        name: 'Inside Out 2',
        image: 'https://image.tmdb.org/t/p/original/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
        duration: 100,
        release_date: '2024-06-14',
        end_date: '2024-08-14',
        age_rating: 0,
        trailer: 'https://www.youtube.com/watch?v=LEjhY15eCx0',
        language: 'en',
        status: 'upcoming',
        synopsis: 'Teenager Riley\'s mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions!'
    },
    {
        movie_id: 'MV011',
        name: 'Deadpool & Wolverine',
        image: 'https://image.tmdb.org/t/p/original/jbwYaoYWSoYi7WCB84LFUi9D5I.jpg',
        duration: 120,
        release_date: '2024-07-26',
        end_date: '2024-09-26',
        age_rating: 18,
        trailer: 'https://www.youtube.com/watch?v=uJMCNJP2ipI',
        language: 'en',
        status: 'upcoming',
        synopsis: 'Wolverine is recovering from his injuries when he crosses paths with the loudmouth, Deadpool. They team up to defeat a common enemy.'
    },
    {
        movie_id: 'MV012',
        name: 'Despicable Me 4',
        image: 'https://image.tmdb.org/t/p/original/wWba3TaojhY7Nirs9D0GLXthdfZ.jpg',
        duration: 95,
        release_date: '2024-07-03',
        end_date: '2024-09-03',
        age_rating: 0,
        trailer: 'https://www.youtube.com/watch?v=qQdBZXy15p0',
        language: 'en',
        status: 'upcoming',
        synopsis: 'Gru, Lucy, Margo, Edith, and Agnes welcome a new member to the family, Gru Jr., who is intent on tormenting his dad.'
    },
    {
        movie_id: 'MV013',
        name: 'A Quiet Place: Day One',
        image: 'https://image.tmdb.org/t/p/original/yrpPYKijjsMeq46h965xIGe7C5r.jpg',
        duration: 100,
        release_date: '2024-06-28',
        end_date: '2024-08-28',
        age_rating: 16,
        trailer: 'https://www.youtube.com/watch?v=YPY7J-flzE8',
        language: 'en',
        status: 'upcoming',
        synopsis: 'Experience the day the world went quiet.'
    },
    {
        movie_id: 'MV014',
        name: 'Bad Boys: Ride or Die',
        image: 'https://image.tmdb.org/t/p/original/nP6RliHjxsz4irTKsxe8FRhKZYl.jpg',
        duration: 110,
        release_date: '2024-06-07',
        end_date: '2024-08-07',
        age_rating: 16,
        trailer: 'https://www.youtube.com/watch?v=hZVd5lr_Zxs',
        language: 'en',
        status: 'upcoming',
        synopsis: 'This Summer, the world\'s favorite Bad Boys are back with their iconic mix of edge-of-your seat action and outrageous comedy but this time with a twist: Miami\'s finest are now on the run.'
    },
    {
        movie_id: 'MV015',
        name: 'Haikyuu!! The Dumpster Battle',
        image: 'https://image.tmdb.org/t/p/original/qjGrUmKW78MCPG8PTL4pBevwoCD.jpg',
        duration: 85,
        release_date: '2024-05-31',
        end_date: '2024-07-31',
        age_rating: 0,
        trailer: 'https://www.youtube.com/watch?v=e8y3o3rF44g',
        language: 'ja',
        status: 'upcoming',
        synopsis: 'Shoyo Hinata joins Karasuno High\'s volleyball club to be like his idol, a former Karasuno player known as the "Little Giant".'
    }
];

export const MOCK_DIRECTORS: Director[] = [
    { movie_id: 'MV001', name: 'Denis Villeneuve' },
    { movie_id: 'MV002', name: 'Mike Mitchell' },
    { movie_id: 'MV003', name: 'Adam Wingard' },
    { movie_id: 'MV004', name: 'Jang Jae-hyun' },
    { movie_id: 'MV005', name: 'Tran Thanh' },
    { movie_id: 'MV006', name: 'Alex Garland' },
    { movie_id: 'MV007', name: 'David Leitch' },
    { movie_id: 'MV008', name: 'Wes Ball' },
    { movie_id: 'MV009', name: 'George Miller' },
    { movie_id: 'MV010', name: 'Kelsey Mann' },
];

export const MOCK_ACTORS: Actor[] = [
    { movie_id: 'MV001', name: 'Timothée Chalamet' },
    { movie_id: 'MV001', name: 'Zendaya' },
    { movie_id: 'MV001', name: 'Rebecca Ferguson' },
    { movie_id: 'MV002', name: 'Jack Black' },
    { movie_id: 'MV002', name: 'Awkwafina' },
    { movie_id: 'MV003', name: 'Rebecca Hall' },
    { movie_id: 'MV003', name: 'Brian Tyree Henry' },
    { movie_id: 'MV004', name: 'Choi Min-sik' },
    { movie_id: 'MV004', name: 'Kim Go-eun' },
    { movie_id: 'MV005', name: 'Phuong Anh Dao' },
    { movie_id: 'MV005', name: 'Tuan Tran' },
];

// --- 4. SHOWTIMES ---

export const MOCK_SHOWTIMES: Showtime[] = [];

const today = new Date();
const moviesShowing = MOCK_MOVIES.filter(m => m.status === 'showing' || m.status === 'upcoming');

// Generate showtimes for next 14 days
for (let d = 0; d < 14; d++) {
    const dateStr = addDays(today, d);

    MOCK_ROOMS.forEach(room => {
        // Randomly assign 3-5 movies to this room for the day
        const dailyMovies = moviesShowing.sort(() => 0.5 - Math.random()).slice(0, 4);

        let currentHour = 9; // Start at 9 AM

        dailyMovies.forEach((movie, idx) => {
            if (currentHour >= 23) return;

            const startHour = currentHour;
            const startMinute = Math.random() > 0.5 ? 0 : 30;

            const startTime = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}:00`;

            // Calculate end time
            const durationMinutes = movie.duration + 20; // +20 mins for cleaning/ads
            const endDateObj = new Date(`2000-01-01T${startTime}`);
            endDateObj.setMinutes(endDateObj.getMinutes() + durationMinutes);
            const endTime = endDateObj.toTimeString().split(' ')[0];

            MOCK_SHOWTIMES.push({
                showtime_id: `ST_${dateStr.replace(/-/g, '')}_${room.room_id}_${idx}`,
                room_id: room.room_id,
                movie_id: movie.movie_id,
                start_date: dateStr,
                start_time: startTime,
                end_time: endTime
            });

            currentHour += Math.ceil(durationMinutes / 60);
        });
    });
}

// --- 5. USERS ---

export const MOCK_ACCOUNTS: Account[] = [
    {
        phone_number: '0901234567',
        email: 'user1@example.com',
        fullname: 'Nguyen Van A',
        birth_date: '1995-01-01',
        gender: 'male',
        membership_points: 1200,
        registration_date: '2023-01-01',
        avatar: 'https://i.pravatar.cc/150?u=user1'
    },
    {
        phone_number: '0909876543',
        email: 'user2@example.com',
        fullname: 'Tran Thi B',
        birth_date: '1998-05-15',
        gender: 'female',
        membership_points: 5000,
        registration_date: '2022-06-15',
        avatar: 'https://i.pravatar.cc/150?u=user2'
    },
    {
        phone_number: '0912345678',
        email: 'vip@example.com',
        fullname: 'Le Van VIP',
        birth_date: '1990-12-20',
        gender: 'male',
        membership_points: 15000,
        registration_date: '2021-01-01',
        avatar: 'https://i.pravatar.cc/150?u=vip'
    }
];

// --- 6. REVIEWS ---

export const MOCK_REVIEWS: MovieReview[] = [
    {
        phone_number: '0901234567',
        movie_id: 'MV001',
        date_written: '2024-03-05',
        star_rating: 5,
        review_content: 'Tuyệt phẩm! Hình ảnh và âm thanh quá đỉnh.'
    },
    {
        phone_number: '0909876543',
        movie_id: 'MV001',
        date_written: '2024-03-06',
        star_rating: 4,
        review_content: 'Phim hay nhưng hơi dài.'
    },
    {
        phone_number: '0912345678',
        movie_id: 'MV002',
        date_written: '2024-03-10',
        star_rating: 4,
        review_content: 'Vui nhộn, thích hợp giải trí cuối tuần.'
    },
    {
        phone_number: '0901234567',
        movie_id: 'MV004',
        date_written: '2024-03-20',
        star_rating: 5,
        review_content: 'Sợ thật sự, diễn xuất đỉnh cao.'
    }
];

// --- 7. FOODS ---

export const MOCK_FOODS: Food[] = [
    {
        food_id: 'F001',
        bill_id: '', // Placeholder
        name: 'Bắp Ngọt (L)',
        description: 'Bắp rang bơ vị ngọt size lớn',
        price: 75000,
        production_date: '2024-01-01',
        expiration_date: '2024-12-31'
    },
    {
        food_id: 'F002',
        bill_id: '',
        name: 'Bắp Phô Mai (L)',
        description: 'Bắp rang bơ vị phô mai size lớn',
        price: 85000,
        production_date: '2024-01-01',
        expiration_date: '2024-12-31'
    },
    {
        food_id: 'F003',
        bill_id: '',
        name: 'Coca Cola (L)',
        description: 'Nước ngọt có ga size lớn',
        price: 45000,
        production_date: '2024-01-01',
        expiration_date: '2024-12-31'
    },
    {
        food_id: 'F004',
        bill_id: '',
        name: 'Combo Solo',
        description: '1 Bắp (M) + 1 Nước (M)',
        price: 95000,
        production_date: '2024-01-01',
        expiration_date: '2024-12-31'
    },
    {
        food_id: 'F005',
        bill_id: '',
        name: 'Combo Couple',
        description: '1 Bắp (L) + 2 Nước (L)',
        price: 150000,
        production_date: '2024-01-01',
        expiration_date: '2024-12-31'
    }
];

// --- 8. VOUCHERS ---

export const MOCK_VOUCHERS: Voucher[] = [
    {
        code: 'WELCOME50',
        promotional_id: 'PROMO001',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        state: 'active',
        phone_number: '0901234567'
    },
    {
        code: 'SUMMER2024',
        promotional_id: 'PROMO002',
        start_date: '2024-06-01',
        end_date: '2024-08-31',
        state: 'active',
        phone_number: '0909876543'
    }
];

// --- 9. EVENTS ---
export const MOCK_EVENTS: Event[] = [
    {
        event_id: 'EVT001',
        name: 'Chào Hè Rực Rỡ',
        description: 'Chuỗi sự kiện chào đón mùa hè với nhiều ưu đãi hấp dẫn.',
        start_date: '2024-06-01',
        end_date: '2024-08-31'
    },
    {
        event_id: 'EVT002',
        name: 'Thứ 3 Vui Vẻ',
        description: 'Giảm giá vé mọi suất chiếu vào thứ 3 hàng tuần.',
        start_date: '2024-01-01',
        end_date: '2024-12-31'
    }
];

// --- HELPER FUNCTIONS ---

/**
 * Get movie with aggregated directors and actors
 */
export function getMovieWithDetails(movieId: string): MovieDetail | undefined {
    const movie = MOCK_MOVIES.find(m => m.movie_id === movieId);
    if (!movie) return undefined;

    const directors = MOCK_DIRECTORS
        .filter(d => d.movie_id === movieId)
        .map(d => d.name);

    const actors = MOCK_ACTORS
        .filter(a => a.movie_id === movieId)
        .map(a => a.name);

    const avg_rating = calculateAverageRating(movieId);

    return { ...movie, directors, actors, avg_rating };
}

/**
 * Get all movies with their details (directors, actors, ratings)
 */
export function getAllMoviesWithDetails(): MovieDetail[] {
    return MOCK_MOVIES.map(movie => {
        const directors = MOCK_DIRECTORS
            .filter(d => d.movie_id === movie.movie_id)
            .map(d => d.name);

        const actors = MOCK_ACTORS
            .filter(a => a.movie_id === movie.movie_id)
            .map(a => a.name);

        const avg_rating = calculateAverageRating(movie.movie_id);

        return { ...movie, directors, actors, avg_rating };
    });
}

/**
 * Calculate average star rating from reviews (1-5 scale)
 */
export function calculateAverageRating(movieId: string): number {
    const reviews = MOCK_REVIEWS.filter(r => r.movie_id === movieId);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.star_rating, 0);
    return sum / reviews.length;
}

