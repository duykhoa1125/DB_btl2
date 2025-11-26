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
        image: 'https://placehold.co/300x450/png?text=Movie+1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
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
        image: 'https://placehold.co/300x450/png?text=Movie+kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
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
        image: 'https://placehold.co/300x450/png?text=Movie+tMefBSflv6PGwM5ZtBe8xwQCoDe.jpg',
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
        image: 'https://placehold.co/300x450/png?text=Movie+pQYHouPsDf32FhIKYB72laNSAQo.jpg',
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
        image: 'https://placehold.co/300x450/png?text=Movie+Mai',
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
        image: 'https://placehold.co/300x450/png?text=Movie+sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg',
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
        image: 'https://placehold.co/300x450/png?text=Movie+tSz1qsmSJon0rqkHBxXZmrotuse.jpg',
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
        image: 'https://placehold.co/300x450/png?text=Movie+gKkl37BQuKTanygYQG1pyYgLVgf.jpg',
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
        image: 'https://placehold.co/300x450/png?text=Movie+iADOJ8Zymht2JPMoy3R7xceZprc.jpg',
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
        image: 'https://placehold.co/300x450/png?text=Movie+vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
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
        image: 'https://placehold.co/300x450/png?text=Movie+jbwYaoYWSoYi7WCB84LFUi9D5I.jpg',
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
        image: 'https://placehold.co/300x450/png?text=Movie+wWba3TaojhY7Nirs9D0GLXthdfZ.jpg',
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
        image: 'https://placehold.co/300x450/png?text=Movie+yrpPYKijjsMeq46h965xIGe7C5r.jpg',
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
        image: 'https://placehold.co/300x450/png?text=Movie+nP6RliHjxsz4irTKsxe8FRhKZYl.jpg',
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
        image: 'https://placehold.co/300x450/png?text=Movie+qjGrUmKW78MCPG8PTL4pBevwoCD.jpg',
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
        image: 'https://placehold.co/300x450/png?text=Movie+t9XkeE7HzOsdQcDDDapDYh8lrmt.jpg',
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
        image: 'https://placehold.co/300x450/png?text=Movie+xbKFv4H3qIqGj1I3F5U38iI8.jpg',
        duration: 104,
        release_date: '2024-05-17',
        end_date: '2024-07-17',
        age_rating: 0,
        trailer: 'https://www.youtube.com/watch?v=mb2187ZtPZM',
        language: 'en',
        status: 'upcoming',
        synopsis: 'A young girl who goes through a difficult experience begins to see everyone\'s imaginary friends who have been left behind as their real-life friends have grown up.'
    },
    {
        movie_id: 'MV018',
        name: 'Challengers',
        image: 'https://placehold.co/300x450/png?text=Movie+H6vke7zGiuLsz4v4RPe2iyqe.jpg',
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
        name: 'Abigail',
        image: 'https://placehold.co/300x450/png?text=Movie+5Uq8P6MPj9Ppsns5tGSxUUNXUT.jpg',
        duration: 109,
        release_date: '2024-04-19',
        end_date: '2024-06-19',
        age_rating: 18,
        trailer: 'https://www.youtube.com/watch?v=3PsP8MfH8_0',
        language: 'en',
        status: 'showing',
        synopsis: 'After a group of would-be criminals kidnap the 12-year-old ballerina daughter of a powerful underworld figure, all they have to do to collect a $50 million ransom is watch the girl overnight.'
    },
    {
        movie_id: 'MV020',
        name: 'Monkey Man',
        image: 'https://placehold.co/300x450/png?text=Movie+4kxHB9pvMiMbCPZWpGtZfbh5.jpg',
        duration: 121,
        release_date: '2024-04-05',
        end_date: '2024-06-05',
        age_rating: 18,
        trailer: 'https://www.youtube.com/watch?v=g8zxiB5Qh_w',
        language: 'en',
        status: 'showing',
        synopsis: 'Kid, an anonymous young man who ekes out a meager living in an underground fight club where, night after night, wearing a gorilla mask, he is beaten bloody by more popular fighters for cash.'
    },
    {
        movie_id: 'MV021',
        name: 'Ghostbusters: Frozen Empire',
        image: 'https://placehold.co/300x450/png?text=Movie+e1J2oNzSBdou01sUvriVuoYp0pJ.jpg',
        duration: 115,
        release_date: '2024-03-22',
        end_date: '2024-05-22',
        age_rating: 13,
        trailer: 'https://www.youtube.com/watch?v=HpOBXnBgeiY',
        language: 'en',
        status: 'showing',
        synopsis: 'The Spengler family returns to where it all started – the iconic New York City firehouse – to team up with the original Ghostbusters.'
    },
    {
        movie_id: 'MV022',
        name: 'The First Omen',
        image: 'https://placehold.co/300x450/png?text=Movie+uQP0RklWqWpE3s8HmHUxn4CnN0.jpg',
        duration: 119,
        release_date: '2024-04-05',
        end_date: '2024-06-05',
        age_rating: 18,
        trailer: 'https://www.youtube.com/watch?v=QKOQ5q3toxs',
        language: 'en',
        status: 'showing',
        synopsis: 'A young American woman is sent to Rome to begin a life of service to the church.'
    },
    {
        movie_id: 'MV023',
        name: 'Late Night with the Devil',
        image: 'https://placehold.co/300x450/png?text=Movie+jEJw7C8yMbnaEW0auNYWdZdQCgG.jpg',
        duration: 93,
        release_date: '2024-03-22',
        end_date: '2024-05-22',
        age_rating: 18,
        trailer: 'https://www.youtube.com/watch?v=Yn9dWA16rT4',
        language: 'en',
        status: 'showing',
        synopsis: 'A live television broadcast in 1977 goes horribly wrong, unleashing evil into the nation\'s living rooms.'
    },
    {
        movie_id: 'MV024',
        name: 'Immaculate',
        image: 'https://placehold.co/300x450/png?text=Movie+fdZpvODTX5wwkD0ikZUb1h9O2j.jpg',
        duration: 89,
        release_date: '2024-03-22',
        end_date: '2024-05-22',
        age_rating: 18,
        trailer: 'https://www.youtube.com/watch?v=DetoHsKe73s',
        language: 'en',
        status: 'showing',
        synopsis: 'Cecilia, a woman of devout faith, is warmly welcomed to the picture-perfect Italian countryside where she is offered a new role at an illustrious convent.'
    },
    {
        movie_id: 'MV025',
        name: 'Arthur the King',
        image: 'https://placehold.co/300x450/png?text=Movie+gxVcBc4TbzPxZPy753VdPVqScE.jpg',
        duration: 107,
        release_date: '2024-03-15',
        end_date: '2024-05-15',
        age_rating: 13,
        trailer: 'https://www.youtube.com/watch?v=Eor022Y6Kz4',
        language: 'en',
        status: 'showing',
        synopsis: 'Over the course of ten days and 435 miles, an unbreakable bond is forged between pro adventure racer Michael Light and a scrappy street dog companion dubbed Arthur.'
    },
    {
        movie_id: 'MV026',
        name: 'Imaginary',
        image: 'https://placehold.co/300x450/png?text=Movie+9u6HELcdxY1yNkz5dFz0mMjkhLo.jpg',
        duration: 104,
        release_date: '2024-03-08',
        end_date: '2024-05-08',
        age_rating: 13,
        trailer: 'https://www.youtube.com/watch?v=UIGXL2lbFAg',
        language: 'en',
        status: 'showing',
        synopsis: 'A woman returns to her childhood home to discover that the imaginary friend she left behind is very real and unhappy that she abandoned him.'
    },
    {
        movie_id: 'MV027',
        name: 'Cabrini',
        image: 'https://placehold.co/300x450/png?text=Movie+5J2WyQUvDfZJxOmDPwsF5aFKxHu.jpg',
        duration: 145,
        release_date: '2024-03-08',
        end_date: '2024-05-08',
        age_rating: 13,
        trailer: 'https://www.youtube.com/watch?v=CZtFKDMy_NE',
        language: 'en',
        status: 'showing',
        synopsis: 'The story of Francesca Cabrini, a poor Italian immigrant who became one of the great entrepreneurs of the 19th century.'
    },
    {
        movie_id: 'MV028',
        name: 'Love Lies Bleeding',
        image: 'https://placehold.co/300x450/png?text=Movie+p7jyMfC5LYQzDFWmNx4zgXDCNv.jpg',
        duration: 104,
        release_date: '2024-03-08',
        end_date: '2024-05-08',
        age_rating: 18,
        trailer: 'https://www.youtube.com/watch?v=C7e_OaHQeZs',
        language: 'en',
        status: 'showing',
        synopsis: 'Reclusive gym manager Lou falls hard for Jackie, an ambitious bodybuilder headed through town to Vegas in pursuit of her dream.'
    },
    {
        movie_id: 'MV029',
        name: 'One Life',
        image: 'https://placehold.co/300x450/png?text=Movie+yQ7e8aIjyc6m7c6q3nBnUWaYeY.jpg',
        duration: 110,
        release_date: '2024-03-15',
        end_date: '2024-05-15',
        age_rating: 13,
        trailer: 'https://www.youtube.com/watch?v=rZkuR9HwPMc',
        language: 'en',
        status: 'showing',
        synopsis: 'Sir Nicholas \'Nicky\' Winton, a young London broker, rescues 669 children from the Nazis in the months leading up to World War II.'
    },
    {
        movie_id: 'MV030',
        name: 'The American Society of Magical Negroes',
        image: 'https://placehold.co/300x450/png?text=Movie+xtPB9cqx63Q2OBFbwk5Ep5JsqFz.jpg',
        duration: 104,
        release_date: '2024-03-15',
        end_date: '2024-05-15',
        age_rating: 13,
        trailer: 'https://www.youtube.com/watch?v=7hbzPiwGxyo',
        language: 'en',
        status: 'showing',
        synopsis: 'A young man, Aren, is recruited into a secret society of magical Black people who dedicate their lives to a cause of utmost importance: making white people\'s lives easier.'
    },
    {
        movie_id: 'MV031',
        name: 'Snack Shack',
        image: 'https://placehold.co/300x450/png?text=Movie+5PEjPwmBYx3IUqzMXwMjRU2yirU.jpg',
        duration: 112,
        release_date: '2024-03-15',
        end_date: '2024-05-15',
        age_rating: 16,
        trailer: 'https://www.youtube.com/watch?v=pMx2EaGQiAo',
        language: 'en',
        status: 'showing',
        synopsis: 'Nebraska City, 1991. Two best friends get the chance to run the swimming pool snack shack, that later comes to be the perfect scenario for transgression, fun, personal discovery and romance.'
    },
    {
        movie_id: 'MV032',
        name: 'Wicked Little Letters',
        image: 'https://placehold.co/300x450/png?text=Movie+scxBFKKqBRxNDUSQgPLJMzvqNr.jpg',
        duration: 100,
        release_date: '2024-03-29',
        end_date: '2024-05-29',
        age_rating: 16,
        trailer: 'https://www.youtube.com/watch?v=maNLJkzyQuA',
        language: 'en',
        status: 'showing',
        synopsis: 'When people in Littlehampton begin receiving letters full of hilarious profanities, rowdy Irish migrant Rose Gooding is charged with the crime.'
    },
    {
        movie_id: 'MV033',
        name: 'Asphalt City',
        image: 'https://placehold.co/300x450/png?text=Movie+rH3jY9JJkyXJ6kFAvJVdwgPKSOb.jpg',
        duration: 125,
        release_date: '2024-03-29',
        end_date: '2024-05-29',
        age_rating: 18,
        trailer: 'https://www.youtube.com/watch?v=wUHjf7JYG7E',
        language: 'en',
        status: 'showing',
        synopsis: 'A young paramedic is paired with a seasoned partner on the night shift in New York City revealing a city in crisis.'
    },
    {
        movie_id: 'MV034',
        name: 'In the Land of Saints and Sinners',
        image: 'https://placehold.co/300x450/png?text=Movie+jKhCS2MwL08IYKLhSt9p6TcDGaB.jpg',
        duration: 106,
        release_date: '2024-03-29',
        end_date: '2024-05-29',
        age_rating: 16,
        trailer: 'https://www.youtube.com/watch?v=7WJ_HUlX5cE',
        language: 'en',
        status: 'showing',
        synopsis: 'In a remote Irish village, a damaged Finbar Murphy is forced to fight for redemption after a lifetime of sins.'
    },
    {
        movie_id: 'MV035',
        name: 'La Chimera',
        image: 'https://placehold.co/300x450/png?text=Movie+t5M3k0LWMy9WzcakEMKPGQChEyN.jpg',
        duration: 130,
        release_date: '2024-03-29',
        end_date: '2024-05-29',
        age_rating: 13,
        trailer: 'https://www.youtube.com/watch?v=pHjdwbP0OOc',
        language: 'it',
        status: 'showing',
        synopsis: 'A group of archaeologists and the black market of historical artifacts.'
    },
    {
        movie_id: 'MV036',
        name: 'The Beast',
        image: 'https://placehold.co/300x450/png?text=Movie+yEOEP9p7TUzr7yYYsXuNRl7ecO.jpg',
        duration: 146,
        release_date: '2024-04-05',
        end_date: '2024-06-05',
        age_rating: 16,
        trailer: 'https://www.youtube.com/watch?v=vINLhxXEIpg',
        language: 'fr',
        status: 'showing',
        synopsis: 'In the near future where emotions have become a threat, Gabrielle finally decides to purify her DNA in a machine that will immerse her in her past lives.'
    },
    {
        movie_id: 'MV037',
        name: 'Housekeeping for Beginners',
        image: 'https://placehold.co/300x450/png?text=Movie+izmx3v5Q8ULgaCfELKvXr3r8k5.jpg',
        duration: 107,
        release_date: '2024-04-05',
        end_date: '2024-06-05',
        age_rating: 16,
        trailer: 'https://www.youtube.com/watch?v=HlWmTF2tDGw',
        language: 'mk',
        status: 'showing',
        synopsis: 'A woman is forced to raise her girlfriend\'s two daughters, who don\'t want to be a family.'
    },
    {
        movie_id: 'MV038',
        name: 'Someone Like You',
        image: 'https://placehold.co/300x450/png?text=Movie+oGDvlyBGPz4u4ztCc8z7z0c0P4h.jpg',
        duration: 118,
        release_date: '2024-04-02',
        end_date: '2024-06-02',
        age_rating: 13,
        trailer: 'https://www.youtube.com/watch?v=N9bRTx_F-Qk',
        language: 'en',
        status: 'showing',
        synopsis: 'After the tragic loss of his best friend, a young architect launches a search for her secret twin sister.'
    },
    {
        movie_id: 'MV039',
        name: 'The Long Game',
        image: 'https://placehold.co/300x450/png?text=Movie+pfmOl68gOmv7z1PomvL1xAZJPDA.jpg',
        duration: 112,
        release_date: '2024-04-12',
        end_date: '2024-06-12',
        age_rating: 13,
        trailer: 'https://www.youtube.com/watch?v=9hcEz3FjW_M',
        language: 'en',
        status: 'showing',
        synopsis: 'In 1955, five young Mexican-American caddies, out of the love for the game, were determined to learn how to play, so they created their own golf course in the middle of the South Texas brush country.'
    },
    {
        movie_id: 'MV040',
        name: 'Sasquatch Sunset',
        image: 'https://placehold.co/300x450/png?text=Movie+aDrWzwR9hQkPW8v1Mg6yjHww4DE.jpg',
        duration: 89,
        release_date: '2024-04-12',
        end_date: '2024-06-12',
        age_rating: 16,
        trailer: 'https://www.youtube.com/watch?v=Z2E7YUZQijg',
        language: 'en',
        status: 'showing',
        synopsis: 'A year in the life of a singular family. Sasquatch Sunset.'
    },
    {
        movie_id: 'MV041',
        name: 'Sting',
        image: 'https://placehold.co/300x450/png?text=Movie+s2Nqy2FE9H3W7PrxPLg8NrJMiFe.jpg',
        duration: 91,
        release_date: '2024-04-12',
        end_date: '2024-06-12',
        age_rating: 16,
        trailer: 'https://www.youtube.com/watch?v=2lMZlDRvqR4',
        language: 'en',
        status: 'showing',
        synopsis: 'After raising an unnervingly talented spider in secret, 12-year-old Charlotte must face the facts about her pet—and fight for her family\'s survival.'
    },
    {
        movie_id: 'MV042',
        name: 'Arcadian',
        image: 'https://placehold.co/300x450/png?text=Movie+d8PJJjJppjfxqUeEP7zKmwmhFQz.jpg',
        duration: 92,
        release_date: '2024-04-12',
        end_date: '2024-06-12',
        age_rating: 16,
        trailer: 'https://www.youtube.com/watch?v=0ZtiwzfWLN0',
        language: 'en',
        status: 'showing',
        synopsis: 'In a near future, normal life on Earth has been decimated. Paul and his two sons, Thomas and Joseph, have been living a half-life – tranquility by day and torment by night.'
    },
    {
        movie_id: 'MV043',
        name: 'Don\'t Tell Mom the Babysitter\'s Dead',
        image: 'https://placehold.co/300x450/png?text=Movie+fvEo5NP9yPaGzUzf1RWqFI8D3qR.jpg',
        duration: 99,
        release_date: '2024-04-12',
        end_date: '2024-06-12',
        age_rating: 13,
        trailer: 'https://www.youtube.com/watch?v=gLz5l0MX9gQ',
        language: 'en',
        status: 'showing',
        synopsis: 'Seventeen year old Tanya Crandell is looking forward to spending the summer with her friends in Europe, but her plans are cancelled when her mom decides to head to a wellness retreat in Thailand.'
    },
    {
        movie_id: 'MV044',
        name: 'Hard Miles',
        image: 'https://placehold.co/300x450/png?text=Movie+gTQiXUUpR32eadqdgDhw6xqHDdD.jpg',
        duration: 108,
        release_date: '2024-04-19',
        end_date: '2024-06-19',
        age_rating: 13,
        trailer: 'https://www.youtube.com/watch?v=wK-6u75mhzU',
        language: 'en',
        status: 'showing',
        synopsis: 'A strong-willed social worker at a youth prison assembles a cycling team of teenage convicts and takes them on a transformative 1000-mile ride.'
    },
    {
        movie_id: 'MV045',
        name: 'We Grown Now',
        image: 'https://placehold.co/300x450/png?text=Movie+h2OC7ZA5bRu4rEwNQg9O6xQwIAl.jpg',
        duration: 93,
        release_date: '2024-04-19',
        end_date: '2024-06-19',
        age_rating: 13,
        trailer: 'https://www.youtube.com/watch?v=dJDHcP0f7LE',
        language: 'en',
        status: 'showing',
        synopsis: 'In 1992 Chicago, as Michael Jordan cements himself as a champion, a story of two young legends in their own right begins.'
    },
    {
        movie_id: 'MV046',
        name: 'Stress Positions',
        image: 'https://placehold.co/300x450/png?text=Movie+jMQYb4oYP6nfjrtxdNlUr7FHCyO.jpg',
        duration: 95,
        release_date: '2024-04-19',
        end_date: '2024-06-19',
        age_rating: 16,
        trailer: 'https://www.youtube.com/watch?v=vI5YU7l7mK8',
        language: 'en',
        status: 'showing',
        synopsis: 'Terry Goon is keeping strict quarantine in his ex-husband\'s Brooklyn brownstone while caring for his nephew Bahlul, a 19-year-old model from Morocco.'
    },
    {
        movie_id: 'MV047',
        name: 'Boy Kills World',
        image: 'https://placehold.co/300x450/png?text=Movie+kRHfB22qdqiRkPdcfvl9m6LiEjy.jpg',
        duration: 111,
        release_date: '2024-04-26',
        end_date: '2024-06-26',
        age_rating: 18,
        trailer: 'https://www.youtube.com/watch?v=DR9UpN0gMKY',
        language: 'en',
        status: 'showing',
        synopsis: 'When his family is murdered, a deaf-mute named Boy escapes to the jungle and is trained by a mysterious shaman to repress his childish imagination and become an instrument of death.'
    },
    {
        movie_id: 'MV048',
        name: 'Unsung Hero',
        image: 'https://placehold.co/300x450/png?text=Movie+lxnx7o8PZcMdj5XFNfzEDNcFqzb.jpg',
        duration: 113,
        release_date: '2024-04-26',
        end_date: '2024-06-26',
        age_rating: 0,
        trailer: 'https://www.youtube.com/watch?v=JTzZN6AYQiE',
        language: 'en',
        status: 'showing',
        synopsis: 'Based on a remarkable true story, a mom\'s faith stands against all odds; and inspires her husband and children to hold onto theirs.'
    },
    {
        movie_id: 'MV049',
        name: 'Breathe',
        image: 'https://placehold.co/300x450/png?text=Movie+z6FpMYBnlLMHSKMvYGmHSXuuFQC.jpg',
        duration: 93,
        release_date: '2024-04-26',
        end_date: '2024-06-26',
        age_rating: 13,
        trailer: 'https://www.youtube.com/watch?v=VQq3_VEjvB0',
        language: 'en',
        status: 'showing',
        synopsis: 'Air-supply is scarce in the near future, forcing a mother and daughter to fight for survival when two strangers arrive desperate for an oxygenated haven.'
    },
    {
        movie_id: 'MV050',
        name: 'Humane',
        image: 'https://placehold.co/300x450/png?text=Movie+xdvYi5GvtKLgCBNPn0KMvcLfbEF.jpg',
        duration: 93,
        release_date: '2024-04-26',
        end_date: '2024-06-26',
        age_rating: 16,
        trailer: 'https://www.youtube.com/watch?v=kqAy1Sf4TvM',
        language: 'en',
        status: 'showing',
        synopsis: 'In the wake of an environmental collapse that is forcing humanity to shed 20% of its population, a family dinner erupts into chaos when a father\'s plan to enlist in the government\'s new euthanasia program goes horribly awry.'
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
        email: 'vip@example.com',
        fullname: 'Le Van VIP',
        birth_date: '1990-12-20',
        gender: 'male',
        membership_points: 15000,
        registration_date: '2021-01-01',
        avatar: 'https://i.pravatar.cc/150?u=vip'
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
        description: 'Giảm giá chào mừng thành viên mới',
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        level: 'copper'
    },
    {
        promotional_id: 'PROMO002',
        event_id: 'EVT001',
        description: 'Giảm giá mùa hè',
        start_date: '2025-06-01',
        end_date: '2025-08-31',
        level: 'copper'
    },
    {
        promotional_id: 'PROMO003',
        event_id: 'EVT005',
        description: 'Tặng Combo Bắp Nước',
        start_date: '2025-05-01',
        end_date: '2025-05-31',
        level: 'gold'
    },
    {
        promotional_id: 'PROMO004',
        event_id: 'EVT003',
        description: 'Giảm giá VIP',
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        level: 'vip'
    },
    {
        promotional_id: 'PROMO005',
        event_id: 'EVT007',
        description: 'Quà tặng thành viên mới',
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        level: 'copper'
    },
    {
        promotional_id: 'PROMO006',
        event_id: 'EVT008',
        description: 'Ưu đãi cuối tuần',
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        level: 'copper'
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
    { bill_id: 'BILL009', phone_number: '0988888888', total_price: 200000, creation_date: '2025-02-20T14:30:00Z' }
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
    { ticket_id: 'TK_TEST_04', bill_id: 'BILL_TEST', showtime_id: 'ST_TEST_USER', room_id: 'CNM001_R1', seat_row: 'G', seat_column: 8, price: 120000, movie_name: 'Dune: Part Two', purchase_date: '2025-11-26T10:00:00Z', expiration_date: '2025-11-27T12:15:00Z' }
];

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
