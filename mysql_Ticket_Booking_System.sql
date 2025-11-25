CREATE DATABASE TicketBookingSystem;
USE TicketBookingSystem;

-- Tạo tables
CREATE TABLE CINEMA (
    cinema_id VARCHAR(8) PRIMARY KEY,
    name NVARCHAR(50) NOT NULL,
    state VARCHAR(8) NOT NULL DEFAULT('active') CHECK(state IN('active','inactive')),
    address NVARCHAR(50)
);

CREATE TABLE STAFF (
    staff_id VARCHAR(8) PRIMARY KEY,
    name NVARCHAR(50) NOT NULL,
    phone_number VARCHAR(10) UNIQUE CHECK (phone_number REGEXP '^0[0-9]{9}$'),
    manage_id VARCHAR(8),
    cinema_id VARCHAR(8) NOT NULL
);

CREATE TABLE ROOM (
     room_id VARCHAR(8) PRIMARY KEY,
     cinema_id VARCHAR(8) NOT NULL,
     name VARCHAR(5) NOT NULL,
     state VARCHAR(8) NOT NULL DEFAULT('active') CHECK(state IN('active','inactive','full'))
);

CREATE TABLE SEAT (
    room_id VARCHAR(8) NOT NULL,
    seat_row CHAR(1) NOT NULL,
    seat_column INT NOT NULL CHECK(seat_column > 0),
    seat_type VARCHAR(10) NOT NULL DEFAULT('normal') CHECK(seat_type IN('normal','vip','couple')),
    state VARCHAR(15) NOT NULL DEFAULT('available') CHECK(state IN('available','occupied','unavailable','reserved')),
    PRIMARY KEY(room_id, seat_row, seat_column)
);

CREATE TABLE MOVIE (
    movie_id VARCHAR(8) PRIMARY KEY,
    name NVARCHAR(50) NOT NULL,
    duration INT NOT NULL CHECK(duration > 0),
    release_date DATE NOT NULL,
    end_date DATE NOT NULL,
    age_rating INT NOT NULL DEFAULT(0) CHECK(age_rating >= 0),
    trailer VARCHAR(500),
    language VARCHAR(10) NOT NULL DEFAULT('vi'),
    status VARCHAR(15) DEFAULT('upcoming') CHECK(status IN('upcoming', 'showing', 'ended')),
    synopsis NVARCHAR(500),
    CHECK (end_date >= release_date)
);

CREATE TABLE DIRECTOR (
    movie_id VARCHAR(8) NOT NULL,
    name NVARCHAR(50) NOT NULL,
    PRIMARY KEY(movie_id, name)
);

CREATE TABLE ACTOR (
    movie_id VARCHAR(8) NOT NULL,
    name NVARCHAR(50) NOT NULL,
    PRIMARY KEY(movie_id, name)
);

CREATE TABLE SHOWTIME (
     showtime_id VARCHAR(8) PRIMARY KEY,
     room_id VARCHAR(8) NOT NULL,
     movie_id VARCHAR(8) NOT NULL,
     start_date DATE NOT NULL,
     start_time TIME NOT NULL,
     end_time TIME NOT NULL,
     CHECK(start_time < end_time)
);

CREATE TABLE ACCOUNT (
    phone_number VARCHAR(10) PRIMARY KEY CHECK (phone_number REGEXP '^0[0-9]{9}$'),
    email VARCHAR(100) UNIQUE NOT NULL CHECK(email LIKE '%_@__%.__%'),
    password VARCHAR(500) NOT NULL CHECK(CHAR_LENGTH(password) >= 6),
    fullname NVARCHAR(50) NOT NULL,
    birth_date DATE NOT NULL,
    gender VARCHAR(7) NOT NULL DEFAULT('unknown') CHECK(gender IN('male','female','unknown')),
    avatar VARCHAR(500),
    membership_points INT NOT NULL DEFAULT(0) CHECK(membership_points >= 0),
    registration_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE BILL (
    bill_id VARCHAR(8) PRIMARY KEY,
    phone_number VARCHAR(10) NOT NULL,
    creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_price INT NOT NULL CHECK(total_price >= 0)
);

CREATE TABLE TICKET (
    ticket_id VARCHAR(8) PRIMARY KEY,
    movie_name NVARCHAR(50) NOT NULL,
    price INT NOT NULL CHECK(price >= 0),
    purchase_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiration_date DATETIME NOT NULL,
    bill_id VARCHAR(8) NOT NULL,
    room_id VARCHAR(8) NOT NULL,
    seat_row CHAR(1) NOT NULL,
    seat_column INT NOT NULL CHECK(seat_column > 0),
    showtime_id VARCHAR(8) NOT NULL
);

CREATE TABLE MOVIE_REVIEW (
    phone_number VARCHAR(10) NOT NULL,
    movie_id VARCHAR(8) NOT NULL,
    date_written DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    star_rating INT NOT NULL CHECK(star_rating >= 1 AND star_rating <= 5),
    review_content NVARCHAR(500) NOT NULL,
    PRIMARY KEY(phone_number, movie_id, date_written)
);

CREATE TABLE PROMOTIONAL_BILL (
    promotional_bill_id VARCHAR(8) PRIMARY KEY,
    bill_id VARCHAR(8) NOT NULL UNIQUE
);

CREATE TABLE FOOD (
    food_id VARCHAR(8) PRIMARY KEY,
    bill_id VARCHAR(8) NOT NULL,
    name NVARCHAR(50) NOT NULL,
    description NVARCHAR(500),
    price INT NOT NULL DEFAULT 0 CHECK(price >= 0),
    production_date DATE NOT NULL,
    expiration_date DATE NOT NULL,
    CHECK(production_date < expiration_date)
);

CREATE TABLE EVENT (
    event_id VARCHAR(8) PRIMARY KEY,
    name NVARCHAR(50) NOT NULL,
    description NVARCHAR(500),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    CHECK(start_date < end_date)
);

CREATE TABLE MEMBER (
    level VARCHAR(10) PRIMARY KEY CHECK(level IN('copper','gold','diamond','vip')),
    minimum_point INT NOT NULL DEFAULT 0 CHECK(minimum_point >= 0)
);

CREATE TABLE PROMOTIONAL (
    promotional_id VARCHAR(8) PRIMARY KEY,
    event_id VARCHAR(8) NOT NULL,
    description NVARCHAR(500),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    level VARCHAR(10) NOT NULL CHECK(level IN('copper','gold','diamond','vip')),
    CHECK(start_date < end_date)
);

CREATE TABLE ACCOUNT_MEMBERSHIP (
    phone_number VARCHAR(10) NOT NULL,
    level VARCHAR(10) NOT NULL,
    join_date DATE NOT NULL DEFAULT (CURDATE()),
    PRIMARY KEY(phone_number, level)
);

CREATE TABLE VOUCHER (
    code VARCHAR(8) PRIMARY KEY,
    promotional_id VARCHAR(8) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    state VARCHAR(10) NOT NULL CHECK(state IN('active','used','expired')),
    phone_number VARCHAR(10) NOT NULL,
    CHECK(start_date <= end_date)
);

CREATE TABLE GIFT (
    promotional_id VARCHAR(8) PRIMARY KEY,
    name NVARCHAR(50) NOT NULL,
    quantity INT NOT NULL DEFAULT 0 CHECK(quantity >= 0)
);

CREATE TABLE DISCOUNT (
    promotional_id VARCHAR(8) PRIMARY KEY,
    percent_reduce DECIMAL(5,2) NOT NULL CHECK(percent_reduce >= 0 AND percent_reduce <= 100),
    max_price_can_reduce INT NOT NULL CHECK(max_price_can_reduce >= 0)
);

-- Tạo triggers sinh ID,để ID = NULL để trigger tự động sinh ID
DELIMITER //

CREATE TRIGGER before_insert_cinema
BEFORE INSERT ON CINEMA
FOR EACH ROW
BEGIN
    DECLARE next_val INT;
    IF NEW.cinema_id IS NULL THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(cinema_id, 4) AS UNSIGNED)), 0) + 1 INTO next_val FROM CINEMA;
        SET NEW.cinema_id = CONCAT('CIN', LPAD(next_val, 5, '0'));
    END IF;
END//

CREATE TRIGGER before_insert_staff
BEFORE INSERT ON STAFF
FOR EACH ROW
BEGIN
    DECLARE next_val INT;
    IF NEW.staff_id IS NULL THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(staff_id, 4) AS UNSIGNED)), 0) + 1 INTO next_val FROM STAFF;
        SET NEW.staff_id = CONCAT('STA', LPAD(next_val, 5, '0'));
    END IF;
END//

CREATE TRIGGER before_insert_room
BEFORE INSERT ON ROOM
FOR EACH ROW
BEGIN
    DECLARE next_val INT;
    IF NEW.room_id IS NULL THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(room_id, 4) AS UNSIGNED)), 0) + 1 INTO next_val FROM ROOM;
        SET NEW.room_id = CONCAT('ROO', LPAD(next_val, 5, '0'));
    END IF;
END//

CREATE TRIGGER before_insert_movie
BEFORE INSERT ON MOVIE
FOR EACH ROW
BEGIN
    DECLARE next_val INT;
    IF NEW.movie_id IS NULL THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(movie_id, 4) AS UNSIGNED)), 0) + 1 INTO next_val FROM MOVIE;
        SET NEW.movie_id = CONCAT('MOV', LPAD(next_val, 5, '0'));
    END IF;
END//

CREATE TRIGGER before_insert_showtime
BEFORE INSERT ON SHOWTIME
FOR EACH ROW
BEGIN
    DECLARE next_val INT;
    IF NEW.showtime_id IS NULL THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(showtime_id, 4) AS UNSIGNED)), 0) + 1 INTO next_val FROM SHOWTIME;
        SET NEW.showtime_id = CONCAT('SHO', LPAD(next_val, 5, '0'));
    END IF;
END//

CREATE TRIGGER before_insert_ticket
BEFORE INSERT ON TICKET
FOR EACH ROW
BEGIN
    DECLARE next_val INT;
    IF NEW.ticket_id IS NULL THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_id, 4) AS UNSIGNED)), 0) + 1 INTO next_val FROM TICKET;
        SET NEW.ticket_id = CONCAT('TIC', LPAD(next_val, 5, '0'));
    END IF;
END//

CREATE TRIGGER before_insert_bill
BEFORE INSERT ON BILL
FOR EACH ROW
BEGIN
    DECLARE next_val INT;
    IF NEW.bill_id IS NULL THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(bill_id, 4) AS UNSIGNED)), 0) + 1 INTO next_val FROM BILL;
        SET NEW.bill_id = CONCAT('BIL', LPAD(next_val, 5, '0'));
    END IF;
END//

CREATE TRIGGER before_insert_promotional_bill
BEFORE INSERT ON PROMOTIONAL_BILL
FOR EACH ROW
BEGIN
    DECLARE next_val INT;
    IF NEW.promotional_bill_id IS NULL THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(promotional_bill_id, 4) AS UNSIGNED)), 0) + 1 INTO next_val FROM PROMOTIONAL_BILL;
        SET NEW.promotional_bill_id = CONCAT('PRB', LPAD(next_val, 5, '0'));
    END IF;
END//

CREATE TRIGGER before_insert_food
BEFORE INSERT ON FOOD
FOR EACH ROW
BEGIN
    DECLARE next_val INT;
    IF NEW.food_id IS NULL THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(food_id, 4) AS UNSIGNED)), 0) + 1 INTO next_val FROM FOOD;
        SET NEW.food_id = CONCAT('FOO', LPAD(next_val, 5, '0'));
    END IF;
END//

CREATE TRIGGER before_insert_event
BEFORE INSERT ON EVENT
FOR EACH ROW
BEGIN
    DECLARE next_val INT;
    IF NEW.event_id IS NULL THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(event_id, 4) AS UNSIGNED)), 0) + 1 INTO next_val FROM EVENT;
        SET NEW.event_id = CONCAT('EVE', LPAD(next_val, 5, '0'));
    END IF;
END//

CREATE TRIGGER before_insert_promotional
BEFORE INSERT ON PROMOTIONAL
FOR EACH ROW
BEGIN
    DECLARE next_val INT;
    IF NEW.promotional_id IS NULL THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(promotional_id, 4) AS UNSIGNED)), 0) + 1 INTO next_val FROM PROMOTIONAL;
        SET NEW.promotional_id = CONCAT('PRO', LPAD(next_val, 5, '0'));
    END IF;
END//

CREATE TRIGGER before_insert_voucher
BEFORE INSERT ON VOUCHER
FOR EACH ROW
BEGIN
    DECLARE next_val INT;
    IF NEW.code IS NULL THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(code, 4) AS UNSIGNED)), 0) + 1 INTO next_val FROM VOUCHER;
        SET NEW.code = CONCAT('VOU', LPAD(next_val, 5, '0'));
    END IF;
END//

DELIMITER ;

-- Thêm FOREIGN KEY constraints
ALTER TABLE STAFF ADD CONSTRAINT staff_cinema_id_FK FOREIGN KEY(cinema_id) REFERENCES CINEMA(cinema_id);
ALTER TABLE STAFF ADD CONSTRAINT staff_manage_id_FK FOREIGN KEY(manage_id) REFERENCES STAFF(staff_id);
ALTER TABLE ROOM ADD CONSTRAINT room_cinema_id_FK FOREIGN KEY(cinema_id) REFERENCES CINEMA(cinema_id);
ALTER TABLE SEAT ADD CONSTRAINT seat_room_id_FK FOREIGN KEY(room_id) REFERENCES ROOM(room_id);
ALTER TABLE DIRECTOR ADD CONSTRAINT director_movie_id_FK FOREIGN KEY(movie_id) REFERENCES MOVIE(movie_id);
ALTER TABLE ACTOR ADD CONSTRAINT actor_movie_id_FK FOREIGN KEY(movie_id) REFERENCES MOVIE(movie_id);
ALTER TABLE SHOWTIME ADD CONSTRAINT showtime_movie_id_FK FOREIGN KEY(movie_id) REFERENCES MOVIE(movie_id);
ALTER TABLE SHOWTIME ADD CONSTRAINT showtime_room_id_FK FOREIGN KEY(room_id) REFERENCES ROOM(room_id);
ALTER TABLE TICKET ADD CONSTRAINT ticket_room_seat_FK FOREIGN KEY(room_id, seat_row, seat_column) REFERENCES SEAT(room_id, seat_row, seat_column);
ALTER TABLE TICKET ADD CONSTRAINT ticket_showtime_FK FOREIGN KEY(showtime_id) REFERENCES SHOWTIME(showtime_id);
ALTER TABLE TICKET ADD CONSTRAINT ticket_bill_id_FK FOREIGN KEY(bill_id) REFERENCES BILL(bill_id);
ALTER TABLE MOVIE_REVIEW ADD CONSTRAINT movie_review_movie_id_FK FOREIGN KEY(movie_id) REFERENCES MOVIE(movie_id);
ALTER TABLE MOVIE_REVIEW ADD CONSTRAINT movie_review_phone_number_FK FOREIGN KEY(phone_number) REFERENCES ACCOUNT(phone_number);
ALTER TABLE BILL ADD CONSTRAINT bill_phone_number_FK FOREIGN KEY(phone_number) REFERENCES ACCOUNT(phone_number);
ALTER TABLE PROMOTIONAL_BILL ADD CONSTRAINT promotional_bill_bill_id_FK FOREIGN KEY(bill_id) REFERENCES BILL(bill_id);
ALTER TABLE FOOD ADD CONSTRAINT food_bill_id_FK FOREIGN KEY(bill_id) REFERENCES BILL(bill_id);
ALTER TABLE PROMOTIONAL ADD CONSTRAINT promotional_event_id_FK FOREIGN KEY(event_id) REFERENCES EVENT(event_id);
ALTER TABLE PROMOTIONAL ADD CONSTRAINT promotional_level_FK FOREIGN KEY(level) REFERENCES MEMBER(level);
ALTER TABLE ACCOUNT_MEMBERSHIP ADD CONSTRAINT account_membership_phone_FK FOREIGN KEY(phone_number) REFERENCES ACCOUNT(phone_number);
ALTER TABLE ACCOUNT_MEMBERSHIP ADD CONSTRAINT account_membership_level_FK FOREIGN KEY(level) REFERENCES MEMBER(level);
ALTER TABLE VOUCHER ADD CONSTRAINT voucher_promotional_id_FK FOREIGN KEY(promotional_id) REFERENCES PROMOTIONAL(promotional_id);
ALTER TABLE VOUCHER ADD CONSTRAINT voucher_phone_number_FK FOREIGN KEY(phone_number) REFERENCES ACCOUNT(phone_number);
ALTER TABLE GIFT ADD CONSTRAINT gift_promotional_id_FK FOREIGN KEY(promotional_id) REFERENCES PROMOTIONAL(promotional_id);
ALTER TABLE DISCOUNT ADD CONSTRAINT discount_promotional_id_FK FOREIGN KEY(promotional_id) REFERENCES PROMOTIONAL(promotional_id);

-- 1. CINEMA (insert với ID rỗng để trigger tự sinh)
INSERT INTO CINEMA (cinema_id, name, address) VALUES
(NULL, N'CGV Hùng Vương Plaza', N'126 Hùng Vương, Quận 5, TP.HCM'),
(NULL, N'Lotte Cinema Đà Nẵng', N'CH1-01, Tầng 4, TTTM Lotte Mart, Đà Nẵng'),
(NULL, N'BHD Star Cineplex 3/2', N'Lầu 5, TTTM Vincom, 3/2, Quận 10, TP.HCM'),
(NULL, N'Galaxy Nguyễn Du', N'116 Nguyễn Du, Quận 1, TP.HCM'),
(NULL, N'CGV Vĩnh Trung Plaza', N'255-257 Hùng Vương, Quận Thanh Khê, Đà Nẵng');

-- 2. STAFF
INSERT INTO STAFF (staff_id, name, phone_number, cinema_id) VALUES
(NULL, N'Nguyễn Văn A', '0901111111', 'CIN00001'),
(NULL, N'Trần Thị B', '0902222222', 'CIN00001'),
(NULL, N'Lê Văn C', '0903333333', 'CIN00002'),
(NULL, N'Phạm Thị D', '0904444444', 'CIN00002'),
(NULL, N'Hoàng Văn E', '0905555555', 'CIN00003');

-- Cập nhật manage_id
UPDATE STAFF SET manage_id = 'STA00001' WHERE staff_id = 'STA00002';
UPDATE STAFF SET manage_id = 'STA00003' WHERE staff_id = 'STA00004';

-- 3. ROOM
INSERT INTO ROOM (room_id, cinema_id, name) VALUES
(NULL, 'CIN00001', 'R01'), (NULL, 'CIN00001', 'R02'), (NULL, 'CIN00001', 'R03'),
(NULL, 'CIN00002', 'R01'), (NULL, 'CIN00002', 'R02'),
(NULL, 'CIN00003', 'R01'), (NULL, 'CIN00003', 'R02');

-- 4. SEAT
INSERT INTO SEAT (room_id, seat_row, seat_column, seat_type) VALUES
('ROO00001', 'A', 1, 'normal'), ('ROO00001', 'A', 2, 'normal'), ('ROO00001', 'A', 3, 'normal'), ('ROO00001', 'A', 4, 'normal'), ('ROO00001', 'A', 5, 'normal'), ('ROO00001', 'A', 6, 'normal'),
('ROO00001', 'B', 1, 'normal'), ('ROO00001', 'B', 2, 'normal'), ('ROO00001', 'B', 3, 'normal'), ('ROO00001', 'B', 4, 'vip'), ('ROO00001', 'B', 5, 'vip'), ('ROO00001', 'B', 6, 'vip'),
('ROO00001', 'C', 1, 'normal'), ('ROO00001', 'C', 2, 'normal'), ('ROO00001', 'C', 3, 'normal'), ('ROO00001', 'C', 4, 'vip'), ('ROO00001', 'C', 5, 'vip'), ('ROO00001', 'C', 6, 'vip'),
('ROO00001', 'D', 1, 'couple'), ('ROO00001', 'D', 2, 'couple'), ('ROO00001', 'D', 3, 'couple'), ('ROO00001', 'D', 4, 'couple'), ('ROO00001', 'D', 5, 'couple'), ('ROO00001', 'D', 6, 'couple'),

('ROO00002', 'A', 1, 'normal'), ('ROO00002', 'A', 2, 'normal'), ('ROO00002', 'A', 3, 'normal'), ('ROO00002', 'A', 4, 'normal'), ('ROO00002', 'A', 5, 'normal'), ('ROO00002', 'A', 6, 'normal'),
('ROO00002', 'B', 1, 'normal'), ('ROO00002', 'B', 2, 'normal'), ('ROO00002', 'B', 3, 'normal'), ('ROO00002', 'B', 4, 'vip'), ('ROO00002', 'B', 5, 'vip'), ('ROO00002', 'B', 6, 'vip'),

('ROO00003', 'A', 1, 'normal'), ('ROO00003', 'A', 2, 'normal'), ('ROO00003', 'A', 3, 'normal'), 
('ROO00003', 'B', 1, 'normal'), ('ROO00003', 'B', 2, 'normal'), ('ROO00003', 'B', 3, 'normal'),
('ROO00003', 'C', 1, 'normal'), ('ROO00003', 'C', 2, 'normal'), ('ROO00003', 'C', 3, 'normal'), 
('ROO00003', 'D', 1, 'couple'), ('ROO00003', 'D', 2, 'couple'), ('ROO00003', 'D', 3, 'couple'),

('ROO00004', 'A', 1, 'normal'), ('ROO00004', 'A', 2, 'normal'), 
('ROO00004', 'B', 1, 'normal'), ('ROO00004', 'B', 2, 'normal'), 
('ROO00004', 'C', 1, 'vip'), ('ROO00004', 'C', 2, 'vip'),
('ROO00004', 'D', 1, 'couple'), ('ROO00004', 'D', 2, 'couple'),

('ROO00005', 'A', 1, 'normal'), ('ROO00005', 'A', 2, 'normal'), ('ROO00005', 'A', 3, 'normal'), 
('ROO00005', 'B', 1, 'normal'), ('ROO00005', 'B', 2, 'normal'), ('ROO00005', 'B', 3, 'normal'),

('ROO00006', 'A', 1, 'normal'), ('ROO00006', 'A', 2, 'normal'), 
('ROO00006', 'B', 1, 'normal'), ('ROO00006', 'B', 2, 'normal'), 
('ROO00006', 'C', 1, 'vip'), ('ROO00006', 'C', 2, 'vip'),

('ROO00007', 'A', 1, 'normal'), ('ROO00007', 'A', 2, 'normal'), 
('ROO00007', 'B', 1, 'vip'), ('ROO00007', 'B', 2, 'vip'), ('ROO00007', 'B', 3, 'vip'), ('ROO00007', 'B', 4, 'vip'), ('ROO00007', 'B', 5, 'vip');

-- 5. MOVIE
INSERT INTO MOVIE (movie_id, name, duration, release_date, end_date, age_rating, language, status, synopsis) VALUES
(NULL, N'Avengers: Endgame', 181, '2024-04-26', '2024-06-26', 13, 'en', 'showing', N'Phim siêu anh hùng của Marvel'),
(NULL, N'Tình Người Duyên Ma', 120, '2024-05-10', '2024-07-10', 16, 'vi', 'showing', N'Phim tâm lý tình cảm Việt Nam'),
(NULL, N'Spider-Man: No Way Home', 148, '2024-04-15', '2024-06-15', 13, 'en', 'showing', N'Spider-Man đa vũ trụ'),
(NULL, N'Fast & Furious 10', 141, '2024-05-19', '2024-07-19', 13, 'en', 'upcoming', N'Phim hành động tốc độ'),
(NULL, N'Bố Già', 128, '2024-03-01', '2024-05-01', 16, 'vi', 'ended', N'Phim hài gia đình Việt Nam');

-- 6. DIRECTOR
INSERT INTO DIRECTOR (movie_id, name) VALUES
('MOV00001', N'Anthony Russo'), ('MOV00001', N'Joe Russo'),
('MOV00002', N'Trấn Thành'),
('MOV00003', N'Jon Watts'),
('MOV00004', N'Louis Leterrier'),
('MOV00005', N'Trấn Thành'), ('MOV00005', N'Vũ Ngọc Đãng');

-- 7. ACTOR
INSERT INTO ACTOR (movie_id, name) VALUES
('MOV00001', N'Robert Downey Jr.'), ('MOV00001', N'Chris Evans'), ('MOV00001', N'Scarlett Johansson'),
('MOV00002', N'Trấn Thành'), ('MOV00002', N'Tuấn Trần'), ('MOV00002', N'Lan Phương'),
('MOV00003', N'Tom Holland'), ('MOV00003', N'Zendaya'), ('MOV00003', N'Benedict Cumberbatch'),
('MOV00004', N'Vin Diesel'), ('MOV00004', N'Jason Momoa'), ('MOV00004', N'Michelle Rodriguez'),
('MOV00005', N'Trấn Thành'), ('MOV00005', N'Tuấn Trần'), ('MOV00005', N'Ngọc Giàu');

-- 8. ACCOUNT
INSERT INTO ACCOUNT (phone_number, email, password, fullname, birth_date, gender, membership_points) VALUES
('0912345678', 'user1@gmail.com', 'password123', N'Nguyễn Văn An', '1990-05-15', 'male', 1500),
('0923456789', 'user2@gmail.com', 'password123', N'Trần Thị Bình', '1995-08-20', 'female', 800),
('0934567890', 'user3@gmail.com', 'password123', N'Lê Văn Cường', '1988-12-10', 'male', 2500),
('0945678901', 'user4@gmail.com', 'password123', N'Phạm Thị Dung', '1992-03-25', 'female', 3500),
('0956789012', 'user5@gmail.com', 'password123', N'Hoàng Văn Em', '1985-11-30', 'male', 5200);

-- 9. MEMBER
INSERT INTO MEMBER (level, minimum_point) VALUES
('copper', 0),
('gold', 1000),
('diamond', 2500),
('vip', 5000);

-- 10. ACCOUNT_MEMBERSHIP
INSERT INTO ACCOUNT_MEMBERSHIP (phone_number, level) VALUES
('0912345678', 'gold'),
('0923456789', 'copper'),
('0934567890', 'diamond'),
('0945678901', 'diamond'),
('0956789012', 'vip');

-- 11. EVENT
INSERT INTO EVENT (event_id, name, description, start_date, end_date) VALUES
(NULL, N'Khuyến mãi tháng 5', N'Ưu đãi đặc biệt cho khách hàng trong tháng 5', '2024-05-01', '2024-05-31'),
(NULL, N'Giờ vàng cuối tuần', N'Giảm giá vé các suất chiếu cuối tuần', '2024-05-20', '2024-06-20'),
(NULL, N'Sinh nhật rạp', N'Khuyến mãi lớn nhân dịp sinh nhật rạp', '2024-06-01', '2024-06-30');

-- 12. PROMOTIONAL
INSERT INTO PROMOTIONAL (promotional_id, event_id, description, start_date, end_date, level) VALUES
(NULL, 'EVE00001', N'Giảm 20% cho tất cả các suất chiếu', '2024-05-01', '2024-05-31', 'copper'),
(NULL, 'EVE00001', N'Giảm 30% + bỏng nước miễn phí', '2024-05-01', '2024-05-31', 'gold'),
(NULL, 'EVE00002', N'Giảm 15% các suất chiếu sau 18h', '2024-05-20', '2024-06-20', 'copper'),
(NULL, 'EVE00003', N'Giảm 50% cho khách hàng VIP', '2024-06-01', '2024-06-30', 'vip');

-- 13. VOUCHER
INSERT INTO VOUCHER (code, promotional_id, start_date, end_date, state, phone_number) VALUES
(NULL, 'PRO00001', '2024-05-01', '2024-05-31', 'active', '0912345678'),
(NULL, 'PRO00002', '2024-05-01', '2024-05-31', 'active', '0934567890'),
(NULL, 'PRO00003', '2024-05-20', '2024-06-20', 'active', '0923456789'),
(NULL, 'PRO00004', '2024-06-01', '2024-06-30', 'active', '0956789012');

-- 14. DISCOUNT
INSERT INTO DISCOUNT (promotional_id, percent_reduce, max_price_can_reduce) VALUES
('PRO00001', 20.00, 50000),
('PRO00002', 30.00, 75000),
('PRO00003', 15.00, 30000),
('PRO00004', 50.00, 100000);

-- 15. GIFT
INSERT INTO GIFT (promotional_id, name, quantity) VALUES
('PRO00002', N'Combo bỏng nước size M', 1000),
('PRO00004', N'Vé xem phim miễn phí', 500);

-- 16. SHOWTIME
INSERT INTO SHOWTIME (showtime_id, room_id, movie_id, start_date, start_time, end_time) VALUES
(NULL, 'ROO00001', 'MOV00001', '2024-05-25', '09:00:00', '12:01:00'),
(NULL, 'ROO00001', 'MOV00001', '2024-05-25', '13:00:00', '16:01:00'),
(NULL, 'ROO00003', 'MOV00002', '2024-05-25', '14:00:00', '16:00:00'),
(NULL, 'ROO00005', 'MOV00003', '2024-05-25', '11:00:00', '13:28:00'),
(NULL, 'ROO00006', 'MOV00003', '2024-05-25', '15:00:00', '17:28:00'),
(NULL, 'ROO00007', 'MOV00001', '2024-05-25', '12:00:00', '15:01:00'),
(NULL, 'ROO00002', 'MOV00004', '2024-05-26', '10:00:00', '12:21:00'),
(NULL, 'ROO00004', 'MOV00002', '2024-05-26', '16:00:00', '18:00:00');

-- 17. BILL
INSERT INTO BILL (bill_id, phone_number, total_price) VALUES
(NULL, '0912345678', 250000),
(NULL, '0923456789', 180000),
(NULL, '0934567890', 320000),
(NULL, '0945678901', 195000),
(NULL, '0956789012', 280000);

-- 18. TICKET
INSERT INTO TICKET (ticket_id, movie_name, price, expiration_date, bill_id, room_id, seat_row, seat_column, showtime_id) VALUES
(NULL, N'Avengers: Endgame', 85000, '2024-05-25 12:01:00', 'BIL00001', 'ROO00001', 'B', 4, 'SHO00001'),
(NULL, N'Avengers: Endgame', 85000, '2024-05-25 12:01:00', 'BIL00001', 'ROO00001', 'B', 5, 'SHO00001'),
(NULL, N'Tình Người Duyên Ma', 75000, '2024-05-25 16:00:00', 'BIL00002', 'ROO00003', 'B', 2, 'SHO00003'),
(NULL, N'Spider-Man: No Way Home', 80000, '2024-05-25 13:28:00', 'BIL00003', 'ROO00005', 'A', 3, 'SHO00004'),
(NULL, N'Fast & Furious 10', 90000, '2024-05-26 12:21:00', 'BIL00004', 'ROO00002', 'A', 1, 'SHO00007'),
(NULL, N'Tình Người Duyên Ma', 75000, '2024-05-26 18:00:00', 'BIL00005', 'ROO00004', 'C', 1, 'SHO00008');

-- 19. MOVIE_REVIEW
INSERT INTO MOVIE_REVIEW (phone_number, movie_id, star_rating, review_content) VALUES
('0912345678', 'MOV00001', 5, N'Phim hay tuyệt vời! Hiệu ứng đỉnh cao'),
('0923456789', 'MOV00002', 4, N'Phim hài hước, cảm động'),
('0934567890', 'MOV00001', 5, N'Siêu phẩm không thể bỏ lỡ'),
('0945678901', 'MOV00004', 4, N'Hành động mãn nhãn'),
('0956789012', 'MOV00002', 5, N'Diễn xuất xuất sắc');

-- 20. FOOD
INSERT INTO FOOD (food_id, bill_id, name, description, price, production_date, expiration_date) VALUES
(NULL, 'BIL00001', N'Combo A', N'1 bỏng + 1 nước', 60000, '2024-05-24', '2024-05-26'),
(NULL, 'BIL00001', N'Bỏng caramel', N'Bỏng ngọt vị caramel', 45000, '2024-05-24', '2024-05-26'),
(NULL, 'BIL00003', N'Combo B', N'2 bỏng + 2 nước', 110000, '2024-05-25', '2024-05-27'),
(NULL, 'BIL00004', N'Combo C', N'1 bỏng + 1 nước + 1 snack', 75000, '2024-05-25', '2024-05-27'),
(NULL, 'BIL00005', N'Nước ngọt', N'Coca cola size L', 25000, '2024-05-25', '2024-05-30');

-- 21. PROMOTIONAL_BILL
INSERT INTO PROMOTIONAL_BILL (promotional_bill_id, bill_id) VALUES
(NULL, 'BIL00001'),
(NULL, 'BIL00003'),
(NULL, 'BIL00005');

-- Cập nhật trạng thái ghế thành occupied
UPDATE SEAT SET state = 'occupied' 
WHERE (room_id = 'ROO00001' AND seat_row = 'B' AND seat_column = 4)
   OR (room_id = 'ROO00001' AND seat_row = 'B' AND seat_column = 5)
   OR (room_id = 'ROO00003' AND seat_row = 'B' AND seat_column = 2)
   OR (room_id = 'ROO00005' AND seat_row = 'A' AND seat_column = 3)
   OR (room_id = 'ROO00002' AND seat_row = 'A' AND seat_column = 1)
   OR (room_id = 'ROO00004' AND seat_row = 'C' AND seat_column = 1);

-- Cập nhật trạng thái phòng nếu cần
UPDATE ROOM SET state = 'full' WHERE room_id IN ('ROO00001', 'ROO00003');
UPDATE ROOM SET state = 'active' WHERE room_id IN ('ROO00002', 'ROO00004', 'ROO00005', 'ROO00006', 'ROO00007');