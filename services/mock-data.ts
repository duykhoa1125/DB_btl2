import {
    Cinema, Room, Seat, Movie, Showtime, Account,
    MovieStatus, SeatType, SeatPhysicalState, EntityState,
    MemberLevel, Gender, MovieLanguage, Director, Actor,
    Voucher, Event, Promotional, MovieReview, Food,
    SeatLayoutItem, BookingSeatState, MovieDetail,
    Discount, Gift, Bill, Ticket, Staff
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
        image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=500&q=60',
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
        image: 'https://images.unsplash.com/photo-1761839257874-e56dfa2260cb?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        duration: 94,
        release_date: '2024-03-08',
        end_date: '2024-05-08',
        age_rating: 0,
        trailer: 'https://www.youtube.com/watch?v=_inKs4eeHiI',
        language: 'en',
        status: 'showing',
        synopsis: 'Po is gearing up to become the spiritual leader of his Valley of Peace, but also needs someone to take his place as Dragon Warrior.'
    },
    {
        movie_id: 'MV003',
        name: 'Godzilla x Kong: The New Empire',
        image: 'https://images.unsplash.com/photo-1616530940355-351fabd9524b?auto=format&fit=crop&w=500&q=60',
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
        image: 'https://images.unsplash.com/photo-1761839257874-e56dfa2260cb?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
        image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=500&q=60',
        duration: 131,
        release_date: '2024-02-10',
        end_date: '2024-04-10',
        age_rating: 18,
        trailer: 'https://www.youtube.com/watch?v=kGlL1Dn6yTQ',
        language: 'vi',
        status: 'ended',
        synopsis: 'A touching story about love and family during Tet holiday.'
    },
    {
        movie_id: 'MV006',
        name: 'Civil War',
        image: 'https://images.unsplash.com/photo-1533613220915-609f661a6fe1?auto=format&fit=crop&w=500&q=60',
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
        image: 'https://images.unsplash.com/photo-1761839257874-e56dfa2260cb?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
        image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=500&q=60',
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
        image: 'https://images.unsplash.com/photo-1568876694728-451bbf694b83?auto=format&fit=crop&w=500&q=60',
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
        image: 'https://images.unsplash.com/photo-1761839257874-e56dfa2260cb?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
        image: 'https://images.unsplash.com/photo-1608889476561-6242cfdbf622?auto=format&fit=crop&w=500&q=60',
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
        image: 'https://images.unsplash.com/photo-1761839257874-e56dfa2260cb?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
        image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=500&q=60',
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
        image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=60',
        duration: 110,
        release_date: '2024-06-07',
        end_date: '2024-08-07',
        age_rating: 16,
        trailer: 'https://www.youtube.com/watch?v=hZVd5lr_Zxs',
        language: 'en',
        status: 'upcoming',
        synopsis: 'This Summer, the world\'s favorite Bad Boys are back with their iconic mix of edge-of-your seat action and outrageous comedy.'
    },
    {
        movie_id: 'MV015',
        name: 'Haikyuu!! The Dumpster Battle',
        image: 'https://images.unsplash.com/photo-1515634928627-2a4e0dae3ddf?auto=format&fit=crop&w=500&q=60',
        duration: 85,
        release_date: '2024-05-31',
        end_date: '2024-07-31',
        age_rating: 0,
        trailer: 'https://www.youtube.com/watch?v=e8y3o3rF44g',
        language: 'ja',
        status: 'upcoming',
        synopsis: 'Shoyo Hinata joins Karasuno High\'s volleyball club to be like his idol, a former Karasuno player known as the "Little Giant".'
    },
    {
        movie_id: 'MV016',
        name: 'The Garfield Movie',
        image: 'https://images.unsplash.com/photo-1761839257874-e56dfa2260cb?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        duration: 101,
        release_date: '2024-05-24',
        end_date: '2024-07-24',
        age_rating: 0,
        trailer: 'https://www.youtube.com/watch?v=IeFWNtMo1Fs',
        language: 'en',
        status: 'upcoming',
        synopsis: 'Garfield, the world-famous, Monday-hating, lasagna-loving indoor cat, is about to have a wild outdoor adventure.'
    },
    {
        movie_id: 'MV017',
        name: 'IF',
        image: 'https://images.unsplash.com/photo-1761839257874-e56dfa2260cb?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        duration: 104,
        release_date: '2024-05-17',
        end_date: '2024-07-17',
        age_rating: 0,
        trailer: 'https://www.youtube.com/watch?v=mb2187ZtPZM',
        language: 'en',
        status: 'upcoming',
        synopsis: 'A young girl who goes through a difficult experience begins to see everyone\'s imaginary friends who have been left behind.'
    },
    {
        movie_id: 'MV018',
        name: 'Challengers',
        image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=500&q=60',
        duration: 131,
        release_date: '2024-04-26',
        end_date: '2024-06-26',
        age_rating: 18,
        trailer: 'https://www.youtube.com/watch?v=VobTZ-pA3c0',
        language: 'en',
        status: 'showing',
        synopsis: 'Tashi, a tennis player turned coach, has taken her husband, Art, and transformed him from a mediocre player into a world-famous grand slam champion.'
    },
    {
        movie_id: 'MV019',
        name: 'Joker: Folie à Deux',
        image: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=500&q=60',
        duration: 138,
        release_date: '2024-10-04',
        end_date: '2024-12-04',
        age_rating: 18,
        trailer: 'https://www.youtube.com/watch?v=xy8aJw1vYHo',
        language: 'en',
        status: 'upcoming',
        synopsis: 'Failed comedian Arthur Fleck meets the love of his life, Harley Quinn, while in Arkham State Hospital.'
    },
    {
        movie_id: 'MV020',
        name: 'Venom: The Last Dance',
        image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=500&q=60',
        duration: 110,
        release_date: '2024-10-25',
        end_date: '2024-12-25',
        age_rating: 13,
        trailer: 'https://www.youtube.com/watch?v=__2bjWbet5I',
        language: 'en',
        status: 'upcoming',
        synopsis: 'Eddie and Venom are on the run. Hunted by both of their worlds and with the net closing in, the duo are forced into a devastating decision.'
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
    { movie_id: 'MV011', name: 'Shawn Levy' },
    { movie_id: 'MV012', name: 'Chris Renaud' },
    { movie_id: 'MV013', name: 'Michael Sarnoski' },
    { movie_id: 'MV014', name: 'Adil El Arbi' },
    { movie_id: 'MV014', name: 'Bilall Fallah' },
    { movie_id: 'MV015', name: 'Susumu Mitsunaka' },
    { movie_id: 'MV016', name: 'Mark Dindal' },
    { movie_id: 'MV017', name: 'John Krasinski' },
    { movie_id: 'MV018', name: 'Luca Guadagnino' },
    { movie_id: 'MV019', name: 'Todd Phillips' },
    { movie_id: 'MV020', name: 'Kelly Marcel' }
];

export const MOCK_ACTORS: Actor[] = [
    // Dune 2
    { movie_id: 'MV001', name: 'Timothée Chalamet' },
    { movie_id: 'MV001', name: 'Zendaya' },
    { movie_id: 'MV001', name: 'Rebecca Ferguson' },
    { movie_id: 'MV001', name: 'Austin Butler' },
    { movie_id: 'MV001', name: 'Florence Pugh' },
    // Kung Fu Panda 4
    { movie_id: 'MV002', name: 'Jack Black' },
    { movie_id: 'MV002', name: 'Awkwafina' },
    { movie_id: 'MV002', name: 'Viola Davis' },
    // Godzilla x Kong
    { movie_id: 'MV003', name: 'Rebecca Hall' },
    { movie_id: 'MV003', name: 'Brian Tyree Henry' },
    { movie_id: 'MV003', name: 'Dan Stevens' },
    // Exhuma
    { movie_id: 'MV004', name: 'Choi Min-sik' },
    { movie_id: 'MV004', name: 'Kim Go-eun' },
    { movie_id: 'MV004', name: 'Lee Do-hyun' },
    // Mai
    { movie_id: 'MV005', name: 'Phuong Anh Dao' },
    { movie_id: 'MV005', name: 'Tuan Tran' },
    { movie_id: 'MV005', name: 'Hong Dao' },
    // Civil War
    { movie_id: 'MV006', name: 'Kirsten Dunst' },
    { movie_id: 'MV006', name: 'Wagner Moura' },
    { movie_id: 'MV006', name: 'Cailee Spaeny' },
    // The Fall Guy
    { movie_id: 'MV007', name: 'Ryan Gosling' },
    { movie_id: 'MV007', name: 'Emily Blunt' },
    { movie_id: 'MV007', name: 'Aaron Taylor-Johnson' },
    // Planet of the Apes
    { movie_id: 'MV008', name: 'Owen Teague' },
    { movie_id: 'MV008', name: 'Freya Allan' },
    { movie_id: 'MV008', name: 'Kevin Durand' },
    // Furiosa
    { movie_id: 'MV009', name: 'Anya Taylor-Joy' },
    { movie_id: 'MV009', name: 'Chris Hemsworth' },
    { movie_id: 'MV009', name: 'Tom Burke' },
    // Inside Out 2
    { movie_id: 'MV010', name: 'Amy Poehler' },
    { movie_id: 'MV010', name: 'Maya Hawke' },
    { movie_id: 'MV010', name: 'Phyllis Smith' },
    // Deadpool 3
    { movie_id: 'MV011', name: 'Ryan Reynolds' },
    { movie_id: 'MV011', name: 'Hugh Jackman' },
    { movie_id: 'MV011', name: 'Emma Corrin' },
    // Despicable Me 4
    { movie_id: 'MV012', name: 'Steve Carell' },
    { movie_id: 'MV012', name: 'Kristen Wiig' },
    { movie_id: 'MV012', name: 'Will Ferrell' },
    // A Quiet Place: Day One
    { movie_id: 'MV013', name: 'Lupita Nyong\'o' },
    { movie_id: 'MV013', name: 'Joseph Quinn' },
    { movie_id: 'MV013', name: 'Alex Wolff' },
    // Bad Boys 4
    { movie_id: 'MV014', name: 'Will Smith' },
    { movie_id: 'MV014', name: 'Martin Lawrence' },
    { movie_id: 'MV014', name: 'Vanessa Hudgens' },
    // Haikyuu
    { movie_id: 'MV015', name: 'Ayumu Murase' },
    { movie_id: 'MV015', name: 'Kaito Ishikawa' },
    { movie_id: 'MV015', name: 'Yuki Kaji' },
    // Garfield
    { movie_id: 'MV016', name: 'Chris Pratt' },
    { movie_id: 'MV016', name: 'Samuel L. Jackson' },
    { movie_id: 'MV016', name: 'Hannah Waddingham' },
    // IF
    { movie_id: 'MV017', name: 'Ryan Reynolds' },
    { movie_id: 'MV017', name: 'John Krasinski' },
    { movie_id: 'MV017', name: 'Cailey Fleming' },
    // Challengers
    { movie_id: 'MV018', name: 'Zendaya' },
    { movie_id: 'MV018', name: 'Josh O\'Connor' },
    { movie_id: 'MV018', name: 'Mike Faist' },
    // Joker 2
    { movie_id: 'MV019', name: 'Joaquin Phoenix' },
    { movie_id: 'MV019', name: 'Lady Gaga' },
    { movie_id: 'MV019', name: 'Zazie Beetz' },
    // Venom 3
    { movie_id: 'MV020', name: 'Tom Hardy' },
    { movie_id: 'MV020', name: 'Juno Temple' },
    { movie_id: 'MV020', name: 'Chiwetel Ejiofor' }
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

// Add static showtimes for testing
MOCK_SHOWTIMES.push(
    // Simple IDs for testing book-ticket page (uppercase)
    { showtime_id: 'ST001', room_id: 'CNM001_R1', movie_id: 'MV001', start_date: addDays(today, 0), start_time: '14:00:00', end_time: '17:00:00' },
    { showtime_id: 'ST002', room_id: 'CNM001_R2', movie_id: 'MV002', start_date: addDays(today, 0), start_time: '16:00:00', end_time: '18:00:00' },
    { showtime_id: 'ST003', room_id: 'CNM002_R1', movie_id: 'MV003', start_date: addDays(today, 1), start_time: '18:00:00', end_time: '20:30:00' },
    { showtime_id: 'ST004', room_id: 'CNM003_R1', movie_id: 'MV004', start_date: addDays(today, 1), start_time: '20:00:00', end_time: '22:30:00' },
    { showtime_id: 'ST005', room_id: 'CNM001_R1', movie_id: 'MV018', start_date: addDays(today, 2), start_time: '19:00:00', end_time: '21:00:00' },

    // Lowercase variants for case-insensitive support
    { showtime_id: 'st_001', room_id: 'CNM001_R1', movie_id: 'MV001', start_date: addDays(today, 0), start_time: '14:00:00', end_time: '17:00:00' },
    { showtime_id: 'st_002', room_id: 'CNM001_R2', movie_id: 'MV002', start_date: addDays(today, 0), start_time: '16:00:00', end_time: '18:00:00' },
    { showtime_id: 'st_003', room_id: 'CNM002_R1', movie_id: 'MV003', start_date: addDays(today, 1), start_time: '18:00:00', end_time: '20:30:00' },
    { showtime_id: 'st_004', room_id: 'CNM003_R1', movie_id: 'MV004', start_date: addDays(today, 1), start_time: '20:00:00', end_time: '22:30:00' },
    { showtime_id: 'st_005', room_id: 'CNM001_R1', movie_id: 'MV018', start_date: addDays(today, 2), start_time: '19:00:00', end_time: '21:00:00' },

    // Historical showtimes for order history
    { showtime_id: 'ST_PAST_001', room_id: 'CNM001_R1', movie_id: 'MV001', start_date: '2024-03-01', start_time: '10:00:00', end_time: '13:00:00' },
    { showtime_id: 'ST_PAST_002', room_id: 'CNM001_R1', movie_id: 'MV002', start_date: '2024-03-05', start_time: '14:30:00', end_time: '16:30:00' },
    { showtime_id: 'ST_PAST_003', room_id: 'CNM002_R2', movie_id: 'MV003', start_date: '2024-03-10', start_time: '18:00:00', end_time: '20:00:00' },
    { showtime_id: 'ST_PAST_004', room_id: 'CNM003_R3', movie_id: 'MV006', start_date: '2024-04-15', start_time: '19:00:00', end_time: '21:00:00' },
    { showtime_id: 'ST_PAST_005', room_id: 'CNM001_R1', movie_id: 'MV005', start_date: '2024-04-20', start_time: '20:00:00', end_time: '22:30:00' },
    { showtime_id: 'ST_FUTURE_001', room_id: 'CNM004_R1', movie_id: 'MV008', start_date: '2024-05-01', start_time: '09:00:00', end_time: '11:30:00' },
    { showtime_id: 'ST_FUTURE_002', room_id: 'CNM001_R2', movie_id: 'MV009', start_date: '2024-05-10', start_time: '15:00:00', end_time: '18:00:00' },

    // User requested test showtime
    {
        showtime_id: 'ST_TEST_USER',
        room_id: 'CNM001_R1',
        movie_id: 'MV001',
        start_date: '2025-11-27',
        start_time: '09:30:00',
        end_time: '12:15:00'
    }
);

// --- 5. USERS ---
// ... (existing users)

// Add tickets for the test showtime at the end of MOCK_TICKETS (which is likely further down or I need to find where MOCK_TICKETS is defined/populated)
// Wait, MOCK_TICKETS was defined earlier or later? 
// I need to check where MOCK_TICKETS is. 
// Based on previous edits, MOCK_TICKETS is likely at the end of the file or I need to append to it.
// The previous edit appended to MOCK_TICKETS.
// Let's look at the file content again to be sure where to add tickets.


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
        email: 'user1@gmail.com',
        fullname: 'Nguyễn Văn An',
        birth_date: '1990-05-15',
        gender: 'male',
        membership_points: 1500,
        registration_date: '2024-01-01',
        avatar: 'https://avatar.vercel.sh/user1'
    },
    {
        phone_number: '0988888888',
        email: 'john.doe@gmail.com',
        fullname: 'John Doe',
        birth_date: '1990-01-01',
        gender: 'male',
        membership_points: 2000,
        registration_date: '2025-01-01',
        avatar: 'https://i.pravatar.cc/150?u=johndoe'
    },
    {
        phone_number: '0999111222', // New test account
        email: 'test.user@example.com',
        fullname: 'Test User',
        birth_date: '2000-01-01',
        gender: 'unknown',
        membership_points: 0,
        registration_date: '2025-11-27',
        avatar: ''
    }
];

// --- 6. REVIEWS ---

export const MOCK_REVIEWS: MovieReview[] = [
    // Dune: Part Two (MV001)
    {
        phone_number: '0901234567',
        movie_id: 'MV001',
        date_written: '2024-03-05',
        star_rating: 5,
        review_content: 'Tuyệt phẩm điện ảnh! Hình ảnh sa mạc hoành tráng, âm thanh chấn động. Denis Villeneuve đã tạo nên một kiệt tác sci-fi thực thụ!'
    },
    {
        phone_number: '0909876543',
        movie_id: 'MV001',
        date_written: '2024-03-06',
        star_rating: 4,
        review_content: 'Phim hay và hoành tráng nhưng hơi dài. Diễn xuất của Timothée Chalamet và Zendaya rất thuyết phục.'
    },
    {
        phone_number: '0912345678',
        movie_id: 'MV001',
        date_written: '2024-03-07',
        star_rating: 5,
        review_content: 'Phần 2 hay hơn phần 1 rất nhiều! Cảnh chiến đấu hoành tráng, CGI đẹp mắt. Must-watch trên màn hình lớn!'
    },
    {
        phone_number: '0923456789',
        movie_id: 'MV001',
        date_written: '2024-03-08',
        star_rating: 5,
        review_content: 'Xứng đáng 5 sao! Câu chuyện sâu sắc, hình ảnh choáng ngợp. Đáng xem ở rạp IMAX!'
    },
    {
        phone_number: '0934567890',
        movie_id: 'MV001',
        date_written: '2024-03-09',
        star_rating: 4,
        review_content: 'Phim rất tốt nhưng cần xem phần 1 trước mới hiểu hết. Nhạc phim của Hans Zimmer đỉnh cao.'
    },
    {
        phone_number: '0945678901',
        movie_id: 'MV001',
        date_written: '2024-03-10',
        star_rating: 5,
        review_content: 'Masterpiece! Mỗi khung hình đều như tranh vẽ. Rebecca Ferguson diễn xuất quá đỉnh!'
    },
    {
        phone_number: '0956789012',
        movie_id: 'MV001',
        date_written: '2024-03-11',
        star_rating: 5,
        review_content: 'Phim hay nhất năm 2024! Cảnh cưỡi giun cát epic nhất từng thấy. Recommend 10/10!'
    },
    {
        phone_number: '0967890123',
        movie_id: 'MV001',
        date_written: '2024-03-12',
        star_rating: 4,
        review_content: 'Phim tuyệt vời! Chỉ trừ việc hơi khó hiểu với người chưa đọc sách. Nhưng vẫn rất đáng xem.'
    },
    {
        phone_number: '0978901234',
        movie_id: 'MV001',
        date_written: '2024-03-13',
        star_rating: 5,
        review_content: 'Không có gì để chê! Visual stunning, story compelling, acting excellent. Best sci-fi ever!'
    },
    {
        phone_number: '0989012345',
        movie_id: 'MV001',
        date_written: '2024-03-14',
        star_rating: 3,
        review_content: 'Phim hay nhưng hơi chậm ở một số đoạn. Tuy nhiên hình ảnh đẹp bù lại.'
    },

    // Kung Fu Panda 4 (MV002)
    {
        phone_number: '0912345678',
        movie_id: 'MV002',
        date_written: '2024-03-10',
        star_rating: 4,
        review_content: 'Vui nhộn, thích hợp giải trí cuối tuần. Po vẫn dễ thương như ngày nào.'
    },
    {
        phone_number: '0901234567',
        movie_id: 'MV002',
        date_written: '2024-03-11',
        star_rating: 3,
        review_content: 'Cốt truyện hơi đơn giản so với các phần trước, nhưng hình ảnh đẹp.'
    },
    {
        phone_number: '0909876543',
        movie_id: 'MV002',
        date_written: '2024-03-12',
        star_rating: 5,
        review_content: 'Cười bể bụng! Jack Black lồng tiếng quá đỉnh. Phản diện tắc kè hoa rất ấn tượng.'
    },
    {
        phone_number: '0988888888',
        movie_id: 'MV002',
        date_written: '2024-03-13',
        star_rating: 4,
        review_content: 'Phim gia đình tuyệt vời. Các bé nhà mình rất thích.'
    },
    {
        phone_number: '0902222222',
        movie_id: 'MV002',
        date_written: '2024-03-14',
        star_rating: 4,
        review_content: 'Hành động mãn nhãn, hài hước duyên dáng. Một cái kết đẹp cho Po.'
    },

    // Godzilla x Kong: The New Empire (MV003)
    {
        phone_number: '0903333333',
        movie_id: 'MV003',
        date_written: '2024-03-30',
        star_rating: 5,
        review_content: 'Đánh nhau sướng mắt! Godzilla hồng quá ngầu. Kong có thêm găng tay đấm phát chết luôn.'
    },
    {
        phone_number: '0904444444',
        movie_id: 'MV003',
        date_written: '2024-03-31',
        star_rating: 3,
        review_content: 'Kịch bản hơi yếu, chủ yếu xem kỹ xảo và đánh nhau. Con Scar King nhìn hơi phèn.'
    },
    {
        phone_number: '0905555555',
        movie_id: 'MV003',
        date_written: '2024-04-01',
        star_rating: 4,
        review_content: 'Giải trí tốt. Âm thanh hình ảnh đỉnh cao. Xem IMAX bao phê.'
    },
    {
        phone_number: '0906666666',
        movie_id: 'MV003',
        date_written: '2024-04-02',
        star_rating: 5,
        review_content: 'Team Godzilla điểm danh! Màn combat cuối phim quá đã.'
    },

    // Exhuma (MV004)
    {
        phone_number: '0901234567',
        movie_id: 'MV004',
        date_written: '2024-03-20',
        star_rating: 5,
        review_content: 'Sợ thật sự, diễn xuất đỉnh cao. Kim Go-eun đóng vai pháp sư quá đạt.'
    },
    {
        phone_number: '0907777777',
        movie_id: 'MV004',
        date_written: '2024-03-21',
        star_rating: 4,
        review_content: 'Phim kinh dị Hàn Quốc hay nhất gần đây. Cốt truyện lôi cuốn, nhiều plot twist.'
    },
    {
        phone_number: '0908888888',
        movie_id: 'MV004',
        date_written: '2024-03-22',
        star_rating: 5,
        review_content: 'Không khí phim u ám, rùng rợn. Đoạn làm lễ quật mộ xem nổi da gà.'
    },

    // Mai (MV005)
    {
        phone_number: '0909999999',
        movie_id: 'MV005',
        date_written: '2024-02-15',
        star_rating: 4,
        review_content: 'Phim Trấn Thành làm ngày càng lên tay. Phương Anh Đào diễn xuất sắc.'
    },
    {
        phone_number: '0911111111',
        movie_id: 'MV005',
        date_written: '2024-02-16',
        star_rating: 5,
        review_content: 'Khóc hết nước mắt. Câu chuyện đời thường nhưng chạm đến trái tim.'
    },
    {
        phone_number: '0912222222',
        movie_id: 'MV005',
        date_written: '2024-02-17',
        star_rating: 3,
        review_content: 'Phim hơi dài dòng, thoại nhiều chỗ chưa tự nhiên. Nhưng tổng thể ổn.'
    },

    // Inside Out 2 (MV010)
    {
        phone_number: '0913333333',
        movie_id: 'MV010',
        date_written: '2024-06-15',
        star_rating: 5,
        review_content: 'Pixar không bao giờ làm thất vọng. Anxiety là nhân vật mình thích nhất.'
    },
    {
        phone_number: '0914444444',
        movie_id: 'MV010',
        date_written: '2024-06-16',
        star_rating: 5,
        review_content: 'Phim ý nghĩa cho cả người lớn và trẻ em. Bài học về việc chấp nhận mọi cảm xúc.'
    }
];

// --- 7. FOODS ---

export const MOCK_FOODS: Food[] = [
    {
        food_id: 'F001',
        bill_id: '',
        name: 'Bắp Ngọt (M)',
        description: 'Bắp rang bơ vị ngọt size vừa',
        price: 65000,
        production_date: '2024-01-01',
        expiration_date: '2024-12-31'
    },
    {
        food_id: 'F002',
        bill_id: '',
        name: 'Bắp Ngọt (L)',
        description: 'Bắp rang bơ vị ngọt size lớn',
        price: 75000,
        production_date: '2024-01-01',
        expiration_date: '2024-12-31'
    },
    {
        food_id: 'F003',
        bill_id: '',
        name: 'Bắp Phô Mai (M)',
        description: 'Bắp rang bơ vị phô mai size vừa',
        price: 75000,
        production_date: '2024-01-01',
        expiration_date: '2024-12-31'
    },
    {
        food_id: 'F004',
        bill_id: '',
        name: 'Bắp Phô Mai (L)',
        description: 'Bắp rang bơ vị phô mai size lớn',
        price: 85000,
        production_date: '2024-01-01',
        expiration_date: '2024-12-31'
    },
    {
        food_id: 'F005',
        bill_id: '',
        name: 'Bắp Caramel (M)',
        description: 'Bắp rang bơ vị caramel size vừa',
        price: 75000,
        production_date: '2024-01-01',
        expiration_date: '2024-12-31'
    },
    {
        food_id: 'F006',
        bill_id: '',
        name: 'Bắp Caramel (L)',
        description: 'Bắp rang bơ vị caramel size lớn',
        price: 85000,
        production_date: '2024-01-01',
        expiration_date: '2024-12-31'
    },
    {
        food_id: 'F007',
        bill_id: '',
        name: 'Coca Cola (M)',
        description: 'Nước ngọt có ga size vừa',
        price: 35000,
        production_date: '2024-01-01',
        expiration_date: '2024-12-31'
    },
    {
        food_id: 'F008',
        bill_id: '',
        name: 'Coca Cola (L)',
        description: 'Nước ngọt có ga size lớn',
        price: 45000,
        production_date: '2024-01-01',
        expiration_date: '2024-12-31'
    },
    {
        food_id: 'F009',
        bill_id: '',
        name: 'Pepsi (M)',
        description: 'Nước ngọt có ga size vừa',
        price: 35000,
        production_date: '2024-01-01',
        expiration_date: '2024-12-31'
    },
    {
        food_id: 'F010',
        bill_id: '',
        name: 'Pepsi (L)',
        description: 'Nước ngọt có ga size lớn',
        price: 45000,
        production_date: '2024-01-01',
        expiration_date: '2024-12-31'
    },
    {
        food_id: 'F011',
        bill_id: '',
        name: 'Combo Solo',
        description: '1 Bắp (M) + 1 Nước (M)',
        price: 95000,
        production_date: '2024-01-01',
        expiration_date: '2024-12-31'
    },
    {
        food_id: 'F012',
        bill_id: '',
        name: 'Combo Couple',
        description: '1 Bắp (L) + 2 Nước (L)',
        price: 155000,
        production_date: '2024-01-01',
        expiration_date: '2024-12-31'
    },
    {
        food_id: 'F013',
        bill_id: '',
        name: 'Hotdog',
        description: 'Xúc xích nóng hổi',
        price: 40000,
        production_date: '2024-01-01',
        expiration_date: '2024-12-31'
    }
];

// --- 8. VOUCHERS ---

export const MOCK_VOUCHERS: Voucher[] = [
    {
        code: 'WELCOME50',
        promotional_id: 'PROMO001',
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        state: 'active',
        phone_number: '0901234567'
    },
    {
        code: 'SUMMER2025',
        promotional_id: 'PROMO002',
        start_date: '2025-06-01',
        end_date: '2025-08-31',
        state: 'active',
        phone_number: '0909876543'
    },
    {
        code: 'VIPGIFT',
        promotional_id: 'PROMO003',
        start_date: '2025-05-01',
        end_date: '2025-05-31',
        state: 'used',
        phone_number: '0912345678'
    },
    {
        code: 'EXPIRED2024',
        promotional_id: 'PROMO001',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        state: 'expired',
        phone_number: '0901234567'
    },
    {
        code: 'NEWUSER2025',
        promotional_id: 'PROMO001',
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        state: 'active',
        phone_number: '0912345678'
    },
    // John Doe's Vouchers
    {
        code: 'JOHNWELCOME',
        promotional_id: 'PROMO001',
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        state: 'active',
        phone_number: '0988888888'
    },
    {
        code: 'NEWBIEGIFT',
        promotional_id: 'PROMO005',
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        state: 'active',
        phone_number: '0988888888'
    },
    {
        code: 'WEEKEND10',
        promotional_id: 'PROMO006',
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        state: 'active',
        phone_number: '0988888888'
    },
    // --- TEST VOUCHERS (User: 0912345678 - user1@gmail.com) ---
    {
        code: 'TEST_EXPIRED',
        promotional_id: 'PROMO_TEST_EXPIRED',
        start_date: '2023-01-01',
        end_date: '2023-12-31',
        state: 'expired',
        phone_number: '0912345678'
    },
    {
        code: 'TEST_SOON',
        promotional_id: 'PROMO_TEST_SOON',
        start_date: '2024-01-01',
        end_date: addDays(new Date(), 3),
        state: 'active',
        phone_number: '0912345678'
    },
    {
        code: 'TEST_PERCENT',
        promotional_id: 'PROMO_TEST_PERCENT',
        start_date: '2024-01-01',
        end_date: '2025-12-31',
        state: 'active',
        phone_number: '0912345678'
    },
    {
        code: 'TEST_FIXED',
        promotional_id: 'PROMO_TEST_FIXED',
        start_date: '2024-01-01',
        end_date: '2025-12-31',
        state: 'active',
        phone_number: '0912345678'
    },
    {
        code: 'TEST_FOOD',
        promotional_id: 'PROMO_TEST_FOOD',
        start_date: '2024-01-01',
        end_date: '2025-12-31',
        state: 'active',
        phone_number: '0912345678'
    },
    {
        code: 'TEST_COMBO',
        promotional_id: 'PROMO_TEST_COMBO',
        start_date: '2024-01-01',
        end_date: '2025-12-31',
        state: 'active',
        phone_number: '0912345678'
    }
];

// --- 9. EVENTS ---
export const MOCK_EVENTS: Event[] = [
    {
        event_id: 'EVT001',
        name: 'Chào Hè Rực Rỡ 2025',
        description: 'Chuỗi sự kiện chào đón mùa hè với nhiều ưu đãi hấp dẫn cho học sinh, sinh viên. Giảm ngay 20% khi mua vé nhóm từ 4 người trở lên.',
        start_date: '2025-06-01',
        end_date: '2025-08-31'
    },
    {
        event_id: 'EVT002',
        name: 'Thứ 3 Vui Vẻ',
        description: 'Đồng giá 50k cho mọi suất chiếu, mọi loại ghế vào ngày thứ 3 hàng tuần. Áp dụng cho tất cả các rạp trên toàn quốc.',
        start_date: '2025-01-01',
        end_date: '2025-12-31'
    },
    {
        event_id: 'EVT003',
        name: 'Đại Tiệc Điện Ảnh - Mừng Quốc Khánh',
        description: 'Giảm 30% giá vé cho tất cả các phim Việt Nam nhân dịp 2/9. Tặng kèm cờ tổ quốc mini cho 100 khách hàng đầu tiên.',
        start_date: '2025-08-25',
        end_date: '2025-09-05'
    },
    {
        event_id: 'EVT004',
        name: 'Halloween Kinh Hoàng',
        description: 'Tặng bắp nước miễn phí khi xem phim kinh dị vào khung giờ khuya (sau 22h). Trải nghiệm không gian rùng rợn tại rạp.',
        start_date: '2025-10-25',
        end_date: '2025-10-31'
    },
    {
        event_id: 'EVT005',
        name: 'Tháng Phim Bom Tấn',
        description: 'Cơ hội trúng iPhone 16 Pro Max khi xem 3 phim bom tấn trong tháng. Tích lũy vé ngay hôm nay!',
        start_date: '2025-05-01',
        end_date: '2025-05-31'
    },
    {
        event_id: 'EVT006',
        name: 'Tuần Lễ Anime',
        description: 'Chiếu lại các siêu phẩm Anime đình đám: Your Name, Spirited Away, Demon Slayer. Tặng poster giới hạn.',
        start_date: '2025-07-15',
        end_date: '2025-07-21'
    },
    {
        event_id: 'EVT007',
        name: 'Ngày Hội Thành Viên Mới',
        description: 'Đăng ký thành viên ngay hôm nay để nhận ngay 1 bắp ngọt miễn phí.',
        start_date: '2025-01-01',
        end_date: '2025-12-31'
    },
    {
        event_id: 'EVT008',
        name: 'Cuối Tuần Bùng Nổ',
        description: 'Giảm 10% giá vé cho tất cả các suất chiếu vào thứ 7 và Chủ Nhật.',
        start_date: '2025-01-01',
        end_date: '2025-12-31'
    }
];

// --- 10. PROMOTIONALS, DISCOUNTS, GIFTS ---

// --- 10. PROMOTIONALS, DISCOUNTS, GIFTS ---

export const MOCK_PROMOTIONALS: Promotional[] = [
    {
        promotional_id: 'PROMO001',
        event_id: 'EVT002',
        description: 'Giảm 50% vé cho thành viên mới. Áp dụng cho lần đầu tiên mua vé online.',
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        level: 'copper'
    },
    {
        promotional_id: 'PROMO002',
        event_id: 'EVT001',
        description: 'Giảm 20% vé cho nhóm từ 4 người. Combo bắp nước giá ưu đãi.',
        start_date: '2025-06-01',
        end_date: '2025-08-31',
        level: 'copper'
    },
    {
        promotional_id: 'PROMO003',
        event_id: 'EVT005',
        description: 'Tặng Combo Bắp Nước khi xem phim vào thứ 5. Trị giá 100.000đ.',
        start_date: '2025-05-01',
        end_date: '2025-05-31',
        level: 'gold'
    },
    {
        promotional_id: 'PROMO004',
        event_id: 'EVT003',
        description: 'Giảm 30% cho ghế VIP từ thứ 2 đến thứ 5. Áp dụng tất cả suất chiếu.',
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        level: 'vip'
    },
    {
        promotional_id: 'PROMO005',
        event_id: 'EVT007',
        description: 'Tặng 1 bắp ngọt miễn phí khi đăng ký thành viên đồng. Nhận ngay sau 24h.',
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        level: 'copper'
    },
    {
        promotional_id: 'PROMO006',
        event_id: 'EVT008',
        description: 'Giảm 10% vé cuối tuần. Áp dụng thứ 7 và Chủ Nhật, tất cả suất chiếu.',
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        level: 'copper'
    },
    {
        promotional_id: 'PROMO007',
        event_id: 'EVT004',
        description: 'Tặng bắp nước khi xem phim kinh dị sau 22h. Halloween đáng sợ hơn với CinemaHub!',
        start_date: '2025-10-25',
        end_date: '2025-10-31',
        level: 'copper'
    },
    {
        promotional_id: 'PROMO008',
        event_id: 'EVT006',
        description: 'Mua 2 vé tặng 1 poster anime giới hạn. Chỉ có trong tuần lễ anime!',
        start_date: '2025-07-15',
        end_date: '2025-07-21',
        level: 'copper'
    },
    {
        promotional_id: 'PROMO009',
        event_id: 'EVT001',
        description: 'Học sinh - Sinh viên giảm ngay 25% khi xuất trình thẻ. Áp dụng tất cả phim.',
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        level: 'copper'
    },
    {
        promotional_id: 'PROMO010',
        event_id: 'EVT002',
        description: 'Đồng giá 50k mọi suất chiếu vào thứ 3. Tất cả ghế, tất cả phim!',
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        level: 'copper'
    },
    {
        promotional_id: 'PROMO011',
        event_id: 'EVT005',
        description: 'Tích 3 vé trúng iPhone 16 Pro Max. Tháng phim bom tấn - May mắn vô cùng!',
        start_date: '2025-05-01',
        end_date: '2025-05-31',
        level: 'gold'
    },
    {
        promotional_id: 'PROMO012',
        event_id: 'EVT003',
        description: 'Phim Việt giảm 30% nhân dịp Quốc Khánh 2/9. Tự hào dân tộc Việt Nam!',
        start_date: '2025-08-25',
        end_date: '2025-09-05',
        level: 'copper'
    },
    {
        promotional_id: 'PROMO013',
        event_id: 'EVT008',
        description: 'Combo đôi: 2 vé + 2 bắp + 2 nước chỉ 299k. Tiết kiệm đến 40%!',
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        level: 'copper'
    },
    {
        promotional_id: 'PROMO014',
        event_id: 'EVT004',
        description: 'Trải nghiệm 4DX giảm 15%. Cảm giác chân thực, hành trình bùng nổ!',
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        level: 'gold'
    },
    {
        promotional_id: 'PROMO015',
        event_id: 'EVT007',
        description: 'Tặng 50 điểm thành viên khi mua vé qua app. Tích điểm đổi quà siêu hấp dẫn!',
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        level: 'vip'
    },
    // --- TEST PROMOTIONS ---
    {
        promotional_id: 'PROMO_TEST_EXPIRED',
        event_id: 'EVT001',
        description: 'Khuyến mãi đã hết hạn (Test Case)',
        start_date: '2023-01-01',
        end_date: '2023-12-31',
        level: 'copper'
    },
    {
        promotional_id: 'PROMO_TEST_SOON',
        event_id: 'EVT002',
        description: 'Khuyến mãi sắp hết hạn (3 ngày nữa)',
        start_date: '2024-01-01',
        end_date: addDays(new Date(), 3), // Expire in 3 days
        level: 'copper'
    },
    {
        promotional_id: 'PROMO_TEST_PERCENT',
        event_id: 'EVT005',
        description: 'Siêu giảm giá 75% vé xem phim',
        start_date: '2024-01-01',
        end_date: '2025-12-31',
        level: 'gold'
    },
    {
        promotional_id: 'PROMO_TEST_FIXED',
        event_id: 'EVT003',
        description: 'Giảm trực tiếp 50K cho đơn hàng',
        start_date: '2024-01-01',
        end_date: '2025-12-31',
        level: 'copper'
    },
    {
        promotional_id: 'PROMO_TEST_FOOD',
        event_id: 'EVT004',
        description: 'Tặng 1 Hotdog miễn phí',
        start_date: '2024-01-01',
        end_date: '2025-12-31',
        level: 'copper'
    },
    {
        promotional_id: 'PROMO_TEST_COMBO',
        event_id: 'EVT008',
        description: 'Combo Hủy Diệt: Giảm 50% + Tặng Bắp',
        start_date: '2024-01-01',
        end_date: '2025-12-31',
        level: 'diamond'
    }
];

export const MOCK_DISCOUNTS: Discount[] = [
    {
        promotional_id: 'PROMO001',
        percent_reduce: 50,
        max_price_can_reduce: 100000
    },
    {
        promotional_id: 'PROMO002',
        percent_reduce: 20,
        max_price_can_reduce: 50000
    },
    {
        promotional_id: 'PROMO004',
        percent_reduce: 15,
        max_price_can_reduce: 200000
    },
    {
        promotional_id: 'PROMO006',
        percent_reduce: 10,
        max_price_can_reduce: 50000
    },
    // --- TEST DISCOUNTS ---
    {
        promotional_id: 'PROMO_TEST_EXPIRED',
        percent_reduce: 50,
        max_price_can_reduce: 50000
    },
    {
        promotional_id: 'PROMO_TEST_SOON',
        percent_reduce: 25,
        max_price_can_reduce: 100000
    },
    {
        promotional_id: 'PROMO_TEST_PERCENT',
        percent_reduce: 75,
        max_price_can_reduce: 300000
    },
    {
        promotional_id: 'PROMO_TEST_FIXED',
        percent_reduce: 100, // Simulate fixed amount by 100% up to cap
        max_price_can_reduce: 50000
    },
    {
        promotional_id: 'PROMO_TEST_COMBO',
        percent_reduce: 50,
        max_price_can_reduce: 150000
    }
];

export const MOCK_GIFTS: Gift[] = [
    {
        promotional_id: 'PROMO003',
        name: 'Combo Solo (1 Bắp M + 1 Nước M)',
        quantity: 100
    },
    {
        promotional_id: 'PROMO005',
        name: 'Bắp Ngọt (S)',
        quantity: 500
    },
    // --- TEST GIFTS ---
    {
        promotional_id: 'PROMO_TEST_FOOD',
        name: 'Hotdog',
        quantity: 100
    },
    {
        promotional_id: 'PROMO_TEST_COMBO',
        name: 'Bắp Ngọt (M)',
        quantity: 50
    }
];

export interface VoucherDetail extends Voucher {
    promotional?: Promotional;
    discount?: Discount;
    gift?: Gift;
}

/**
 * Get voucher with details (promotional, discount, gift)
 */
export function getVoucherDetail(code: string): VoucherDetail | undefined {
    const voucher = MOCK_VOUCHERS.find(v => v.code === code);
    if (!voucher) return undefined;

    const promotional = MOCK_PROMOTIONALS.find(p => p.promotional_id === voucher.promotional_id);
    const discount = MOCK_DISCOUNTS.find(d => d.promotional_id === voucher.promotional_id);
    const gift = MOCK_GIFTS.find(g => g.promotional_id === voucher.promotional_id);

    return { ...voucher, promotional, discount, gift };
}

// --- HELPER FUNCTIONS ---

/**
 * Get movie with details
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


/**
 * Get user by email
 */
export function getUserByEmail(email: string): Account | undefined {
    return MOCK_ACCOUNTS.find(a => a.email === email);
}

/**
 * Get user by phone number
 */
export function getUserByPhone(phone: string): Account | undefined {
    return MOCK_ACCOUNTS.find(a => a.phone_number === phone);
}

/**
 * Get voucher by code
 */
export function getVoucherByCode(code: string): Voucher | undefined {
    return MOCK_VOUCHERS.find(v => v.code === code);
}

/**
 * Get all active events
 */
export function getActiveEvents(): Event[] {
    const today = new Date().toISOString().split('T')[0];
    return MOCK_EVENTS.filter(e => e.end_date >= today);
}

/**
 * Get reviews by movie ID
 */
export function getReviewsByMovie(movieId: string): MovieReview[] {
    return MOCK_REVIEWS.filter(r => r.movie_id === movieId);
}

// --- 11. MEMBERSHIP ---

import { Member } from './types';

export const MOCK_MEMBERS: Member[] = [
    { level: 'copper', minimum_point: 0 },
    { level: 'gold', minimum_point: 1000 },
    { level: 'diamond', minimum_point: 5000 },
    { level: 'vip', minimum_point: 10000 }
];

import { AccountMembership } from './types';

export const MOCK_ACCOUNTS_MEMBERSHIP: AccountMembership[] = [
    { phone_number: '0901234567', level: 'copper', join_date: '2023-01-01' },
    { phone_number: '0909876543', level: 'gold', join_date: '2022-06-15' },
    { phone_number: '0912345678', level: 'vip', join_date: '2021-01-01' },
    { phone_number: '0988888888', level: 'copper', join_date: '2025-01-01' }
];

export function getMembershipProgress(points: number) {
    const sortedTiers = [...MOCK_MEMBERS].sort((a, b) => a.minimum_point - b.minimum_point);
    let currentTier = sortedTiers[0];
    let nextTier = sortedTiers[1];

    for (let i = 0; i < sortedTiers.length; i++) {
        if (points >= sortedTiers[i].minimum_point) {
            currentTier = sortedTiers[i];
            nextTier = sortedTiers[i + 1];
        } else {
            break;
        }
    }

    let progress = 0;
    let pointsToNext = 0;

    if (nextTier) {
        const range = nextTier.minimum_point - currentTier.minimum_point;
        const currentProgress = points - currentTier.minimum_point;
        progress = Math.min(100, Math.max(0, (currentProgress / range) * 100));
        pointsToNext = nextTier.minimum_point - points;
    } else {
        progress = 100;
        pointsToNext = 0;
    }

    return { currentTier, nextTier, progress, pointsToNext };
}

// --- 12. BILLS & TICKETS ---

export const MOCK_BILLS: Bill[] = [
    { bill_id: 'BILL001', phone_number: '0901234567', total_price: 150000, creation_date: '2024-03-01T10:00:00Z' },
    { bill_id: 'BILL002', phone_number: '0901234567', total_price: 200000, creation_date: '2024-03-05T14:30:00Z' },
    { bill_id: 'BILL003', phone_number: '0909876543', total_price: 300000, creation_date: '2024-03-10T18:00:00Z' },
    { bill_id: 'BILL004', phone_number: '0912345678', total_price: 450000, creation_date: '2024-04-15T19:00:00Z' },
    { bill_id: 'BILL005', phone_number: '0912345678', total_price: 180000, creation_date: '2024-04-20T20:00:00Z' },
    { bill_id: 'BILL006', phone_number: '0901234567', total_price: 220000, creation_date: '2024-05-01T09:00:00Z' }, // Upcoming/Recent
    { bill_id: 'BILL007', phone_number: '0912345678', total_price: 320000, creation_date: '2024-05-10T15:00:00Z' },  // Upcoming/Recent
    { bill_id: 'BILL008', phone_number: '0988888888', total_price: 150000, creation_date: '2025-01-15T10:00:00Z' },
    { bill_id: 'BILL009', phone_number: '0988888888', total_price: 200000, creation_date: '2025-02-20T14:30:00Z' },
    // New mock bills for pre-booked seats
    { bill_id: 'BILL_SEATS_001', phone_number: '0999111222', total_price: 225000, creation_date: '2025-11-27T10:00:00Z' }, // For ST001
    { bill_id: 'BILL_SEATS_002', phone_number: '0999111222', total_price: 100000, creation_date: '2025-11-27T10:10:00Z' }, // For ST002
    { bill_id: 'BILL_SEATS_003', phone_number: '0999111222', total_price: 75000, creation_date: '2025-11-27T10:20:00Z' }, // For st_001
    { bill_id: 'BILL_SEATS_004', phone_number: '0999111222', total_price: 200000, creation_date: '2025-11-27T10:30:00Z' }  // For ST_FUTURE_001
];

export const MOCK_TICKETS: Ticket[] = [
    // BILL001 - Dune (Past) - User 1
    { ticket_id: 'T001', bill_id: 'BILL001', showtime_id: 'ST_PAST_001', room_id: 'CNM001_R1', seat_row: 'F', seat_column: 5, price: 75000, movie_name: 'Dune: Part Two', purchase_date: '2024-03-01T10:00:00Z', expiration_date: '2024-03-01T13:00:00Z' },
    { ticket_id: 'T002', bill_id: 'BILL001', showtime_id: 'ST_PAST_001', room_id: 'CNM001_R1', seat_row: 'F', seat_column: 6, price: 75000, movie_name: 'Dune: Part Two', purchase_date: '2024-03-01T10:00:00Z', expiration_date: '2024-03-01T13:00:00Z' },

    // BILL002 - Kung Fu Panda 4 (Past) - User 1
    { ticket_id: 'T003', bill_id: 'BILL002', showtime_id: 'ST_PAST_002', room_id: 'CNM001_R1', seat_row: 'J', seat_column: 5, price: 100000, movie_name: 'Kung Fu Panda 4', purchase_date: '2024-03-05T14:30:00Z', expiration_date: '2024-03-05T16:30:00Z' },
    { ticket_id: 'T004', bill_id: 'BILL002', showtime_id: 'ST_PAST_002', room_id: 'CNM001_R1', seat_row: 'J', seat_column: 6, price: 100000, movie_name: 'Kung Fu Panda 4', purchase_date: '2024-03-05T14:30:00Z', expiration_date: '2024-03-05T16:30:00Z' },

    // BILL003 - Godzilla x Kong (Past) - User 2
    { ticket_id: 'T005', bill_id: 'BILL003', showtime_id: 'ST_PAST_003', room_id: 'CNM002_R2', seat_row: 'H', seat_column: 10, price: 150000, movie_name: 'Godzilla x Kong: The New Empire', purchase_date: '2024-03-10T18:00:00Z', expiration_date: '2024-03-10T20:00:00Z' },
    { ticket_id: 'T006', bill_id: 'BILL003', showtime_id: 'ST_PAST_003', room_id: 'CNM002_R2', seat_row: 'H', seat_column: 11, price: 150000, movie_name: 'Godzilla x Kong: The New Empire', purchase_date: '2024-03-10T18:00:00Z', expiration_date: '2024-03-10T20:00:00Z' },

    // BILL004 - Civil War (Past) - VIP
    { ticket_id: 'T007', bill_id: 'BILL004', showtime_id: 'ST_PAST_004', room_id: 'CNM003_R3', seat_row: 'E', seat_column: 5, price: 150000, movie_name: 'Civil War', purchase_date: '2024-04-15T19:00:00Z', expiration_date: '2024-04-15T21:00:00Z' },
    { ticket_id: 'T008', bill_id: 'BILL004', showtime_id: 'ST_PAST_004', room_id: 'CNM003_R3', seat_row: 'E', seat_column: 6, price: 150000, movie_name: 'Civil War', purchase_date: '2024-04-15T19:00:00Z', expiration_date: '2024-04-15T21:00:00Z' },
    { ticket_id: 'T009', bill_id: 'BILL004', showtime_id: 'ST_PAST_004', room_id: 'CNM003_R3', seat_row: 'E', seat_column: 7, price: 150000, movie_name: 'Civil War', purchase_date: '2024-04-15T19:00:00Z', expiration_date: '2024-04-15T21:00:00Z' },

    // BILL005 - Mai (Past) - VIP
    { ticket_id: 'T010', bill_id: 'BILL005', showtime_id: 'ST_PAST_005', room_id: 'CNM001_R1', seat_row: 'G', seat_column: 8, price: 90000, movie_name: 'Mai', purchase_date: '2024-04-20T20:00:00Z', expiration_date: '2024-04-20T22:30:00Z' },
    { ticket_id: 'T011', bill_id: 'BILL005', showtime_id: 'ST_PAST_005', room_id: 'CNM001_R1', seat_row: 'G', seat_column: 9, price: 90000, movie_name: 'Mai', purchase_date: '2024-04-20T20:00:00Z', expiration_date: '2024-04-20T22:30:00Z' },

    // BILL006 - Kingdom of the Planet of the Apes (Upcoming/Recent) - User 1
    { ticket_id: 'T012', bill_id: 'BILL006', showtime_id: 'ST_FUTURE_001', room_id: 'CNM004_R1', seat_row: 'F', seat_column: 10, price: 110000, movie_name: 'Kingdom of the Planet of the Apes', purchase_date: '2024-05-01T09:00:00Z', expiration_date: '2024-06-01T11:30:00Z' }, // Future date for testing "Upcoming"
    { ticket_id: 'T013', bill_id: 'BILL006', showtime_id: 'ST_FUTURE_001', room_id: 'CNM004_R1', seat_row: 'F', seat_column: 11, price: 110000, movie_name: 'Kingdom of the Planet of the Apes', purchase_date: '2024-05-01T09:00:00Z', expiration_date: '2024-06-01T11:30:00Z' },

    // BILL007 - Furiosa (Upcoming) - VIP
    { ticket_id: 'T014', bill_id: 'BILL007', showtime_id: 'ST_FUTURE_002', room_id: 'CNM001_R2', seat_row: 'D', seat_column: 5, price: 160000, movie_name: 'Furiosa: A Mad Max Saga', purchase_date: '2024-05-10T15:00:00Z', expiration_date: '2024-06-10T18:00:00Z' },
    { ticket_id: 'T015', bill_id: 'BILL007', showtime_id: 'ST_FUTURE_002', room_id: 'CNM001_R2', seat_row: 'D', seat_column: 6, price: 160000, movie_name: 'Furiosa: A Mad Max Saga', purchase_date: '2024-05-10T15:00:00Z', expiration_date: '2024-06-10T18:00:00Z' },

    // BILL008 - Dune (Past) - John Doe
    { ticket_id: 'T016', bill_id: 'BILL008', showtime_id: 'ST_PAST_001', room_id: 'CNM001_R1', seat_row: 'E', seat_column: 5, price: 75000, movie_name: 'Dune: Part Two', purchase_date: '2025-01-15T10:00:00Z', expiration_date: '2025-01-15T13:00:00Z' },
    { ticket_id: 'T017', bill_id: 'BILL008', showtime_id: 'ST_PAST_001', room_id: 'CNM001_R1', seat_row: 'E', seat_column: 6, price: 75000, movie_name: 'Dune: Part Two', purchase_date: '2025-01-15T10:00:00Z', expiration_date: '2025-01-15T13:00:00Z' },

    // BILL009 - Kung Fu Panda 4 (Past) - John Doe
    { ticket_id: 'T018', bill_id: 'BILL009', showtime_id: 'ST_PAST_002', room_id: 'CNM001_R1', seat_row: 'H', seat_column: 5, price: 100000, movie_name: 'Kung Fu Panda 4', purchase_date: '2025-02-20T14:30:00Z', expiration_date: '2025-02-20T16:30:00Z' },
    { ticket_id: 'T019', bill_id: 'BILL009', showtime_id: 'ST_PAST_002', room_id: 'CNM001_R1', seat_row: 'H', seat_column: 6, price: 100000, movie_name: 'Kung Fu Panda 4', purchase_date: '2025-02-20T14:30:00Z', expiration_date: '2025-02-20T16:30:00Z' },

    // Tickets for ST_TEST_USER (Dune: Part Two - 2025-11-27 09:30)
    { ticket_id: 'TK_TEST_01', bill_id: 'BILL_TEST', showtime_id: 'ST_TEST_USER', room_id: 'CNM001_R1', seat_row: 'F', seat_column: 5, price: 120000, movie_name: 'Dune: Part Two', purchase_date: '2025-11-26T10:00:00Z', expiration_date: '2025-11-27T12:15:00Z' },
    { ticket_id: 'TK_TEST_02', bill_id: 'BILL_TEST', showtime_id: 'ST_TEST_USER', room_id: 'CNM001_R1', seat_row: 'F', seat_column: 6, price: 120000, movie_name: 'Dune: Part Two', purchase_date: '2025-11-26T10:00:00Z', expiration_date: '2025-11-27T12:15:00Z' },
    { ticket_id: 'TK_TEST_03', bill_id: 'BILL_TEST', showtime_id: 'ST_TEST_USER', room_id: 'CNM001_R1', seat_row: 'G', seat_column: 7, price: 120000, movie_name: 'Dune: Part Two', purchase_date: '2025-11-26T10:00:00Z', expiration_date: '2025-11-27T12:15:00Z' },
    { ticket_id: 'TK_TEST_04', bill_id: 'BILL_TEST', showtime_id: 'ST_TEST_USER', room_id: 'CNM001_R1', seat_row: 'G', seat_column: 8, price: 120000, movie_name: 'Dune: Part Two', purchase_date: '2025-11-26T10:00:00Z', expiration_date: '2025-11-27T12:15:00Z' },
    // New tickets for testing pre-booked seats
    // ST001 (Dune: Part Two - CNM001_R1)
    { ticket_id: 'TEST_T001_01', bill_id: 'BILL_SEATS_001', showtime_id: 'ST001', room_id: 'CNM001_R1', seat_row: 'C', seat_column: 3, price: 75000, movie_name: 'Dune: Part Two', purchase_date: '2025-11-27T10:00:00Z', expiration_date: '2025-11-27T17:00:00Z' },
    { ticket_id: 'TEST_T001_02', bill_id: 'BILL_SEATS_001', showtime_id: 'ST001', room_id: 'CNM001_R1', seat_row: 'C', seat_column: 4, price: 75000, movie_name: 'Dune: Part Two', purchase_date: '2025-11-27T10:00:00Z', expiration_date: '2025-11-27T17:00:00Z' },
    { ticket_id: 'TEST_T001_03', bill_id: 'BILL_SEATS_001', showtime_id: 'ST001', room_id: 'CNM001_R1', seat_row: 'D', seat_column: 5, price: 75000, movie_name: 'Dune: Part Two', purchase_date: '2025-11-27T10:00:00Z', expiration_date: '2025-11-27T17:00:00Z' },

    // ST002 (Kung Fu Panda 4 - CNM001_R2)
    { ticket_id: 'TEST_T002_01', bill_id: 'BILL_SEATS_002', showtime_id: 'ST002', room_id: 'CNM001_R2', seat_row: 'A', seat_column: 1, price: 50000, movie_name: 'Kung Fu Panda 4', purchase_date: '2025-11-27T10:10:00Z', expiration_date: '2025-11-27T18:00:00Z' },
    { ticket_id: 'TEST_T002_02', bill_id: 'BILL_SEATS_002', showtime_id: 'ST002', room_id: 'CNM001_R2', seat_row: 'A', seat_column: 2, price: 50000, movie_name: 'Kung Fu Panda 4', purchase_date: '2025-11-27T10:10:00Z', expiration_date: '2025-11-27T18:00:00Z' },

    // st_001 (Dune: Part Two - CNM001_R1) - same as ST001, but lower case ID to test case insensitivity
    { ticket_id: 'TEST_T003_01', bill_id: 'BILL_SEATS_003', showtime_id: 'st_001', room_id: 'CNM001_R1', seat_row: 'E', seat_column: 8, price: 75000, movie_name: 'Dune: Part Two', purchase_date: '2025-11-27T10:20:00Z', expiration_date: '2025-11-27T17:00:00Z' },

    // ST_FUTURE_001 (Kingdom of the Planet of the Apes - CNM004_R1)
    { ticket_id: 'TEST_T004_01', bill_id: 'BILL_SEATS_004', showtime_id: 'ST_FUTURE_001', room_id: 'CNM004_R1', seat_row: 'F', seat_column: 1, price: 100000, movie_name: 'Kingdom of the Planet of the Apes', purchase_date: '2025-11-27T10:30:00Z', expiration_date: '2024-06-01T11:30:00Z' },
    { ticket_id: 'TEST_T004_02', bill_id: 'BILL_SEATS_004', showtime_id: 'ST_FUTURE_001', room_id: 'CNM004_R1', seat_row: 'F', seat_column: 2, price: 100000, movie_name: 'Kingdom of the Planet of the Apes', purchase_date: '2025-11-27T10:30:00Z', expiration_date: '2024-06-01T11:30:00Z' }
];

// --- GENERATE RANDOM BOOKED SEATS FOR ALL SHOWTIMES ---
MOCK_SHOWTIMES.forEach(showtime => {
    // Generate 5 to 10 random booked seats per showtime
    const numTickets = Math.floor(Math.random() * 6) + 5;
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const usedSeats = new Set<string>();

    // Pre-populate used seats from existing hardcoded tickets for this showtime to avoid collisions
    MOCK_TICKETS.filter(t => t.showtime_id === showtime.showtime_id).forEach(t => {
        usedSeats.add(`${t.seat_row}${t.seat_column}`);
    });

    for (let i = 0; i < numTickets; i++) {
        let row, col, seatId;
        let attempts = 0;
        // Try to find an empty seat
        do {
            row = rows[Math.floor(Math.random() * rows.length)];
            col = Math.floor(Math.random() * 12) + 1;
            seatId = `${row}${col}`;
            attempts++;
        } while (usedSeats.has(seatId) && attempts < 20);

        if (!usedSeats.has(seatId)) {
            usedSeats.add(seatId);
            MOCK_TICKETS.push({
                ticket_id: `AUTO_TK_${showtime.showtime_id}_${i}`,
                bill_id: `AUTO_BILL_${showtime.showtime_id}`,
                showtime_id: showtime.showtime_id,
                room_id: showtime.room_id,
                seat_row: row,
                seat_column: col,
                price: 95000,
                movie_name: 'Auto Generated Ticket',
                purchase_date: new Date().toISOString(),
                expiration_date: new Date().toISOString()
            });
        }
    }
});

export function getBillsByPhone(phone: string): Bill[] {
    return MOCK_BILLS.filter(b => b.phone_number === phone);
}

export function getTicketsByBill(billId: string): Ticket[] {
    return MOCK_TICKETS.filter(t => t.bill_id === billId);
}

// --- 13. STAFF ---

export const MOCK_STAFFS: Staff[] = [
    {
        staff_id: 'STA00001',
        cinema_id: 'CNM001',
        name: 'Nguyễn Văn Quản Lý',
        phone_number: '0909000001',
        manage_id: null
    },
    {
        staff_id: 'STA00002',
        cinema_id: 'CNM001',
        manage_id: 'STA00001',
        name: 'Trần Thị Giám Sát',
        phone_number: '0909000002'
    },
    {
        staff_id: 'STA00003',
        cinema_id: 'CNM001',
        manage_id: 'STA00002',
        name: 'Lê Văn Nhân Viên',
        phone_number: '0909000003'
    },
    {
        staff_id: 'STA00004',
        cinema_id: 'CNM002',
        name: 'Phạm Văn Kỹ Thuật',
        phone_number: '0909000004',
        manage_id: null
    }
];


export function getStaffByCinema(cinemaId: string): Staff[] {
    return MOCK_STAFFS.filter(s => s.cinema_id === cinemaId);
}

export function getStaffManager(staffId: string): Staff | undefined {
    const staff = MOCK_STAFFS.find(s => s.staff_id === staffId);
    if (!staff || !staff.manage_id) return undefined;
    return MOCK_STAFFS.find(s => s.staff_id === staff.manage_id);
}

export function getSubordinates(managerId: string): Staff[] {
    return MOCK_STAFFS.filter(s => s.manage_id === managerId);
}
