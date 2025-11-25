-- MySQL Version of Ticket Booking System

DROP DATABASE IF EXISTS TicketBookingSystem;
CREATE DATABASE TicketBookingSystem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE TicketBookingSystem;

-- Note: MySQL doesn't have SEQUENCE objects like SQL Server
-- We'll use AUTO_INCREMENT instead with separate tables for ID generation

CREATE TABLE Cinema_sequence (id INT AUTO_INCREMENT PRIMARY KEY);
CREATE TABLE Room_sequence (id INT AUTO_INCREMENT PRIMARY KEY);
CREATE TABLE Ticket_sequence (id INT AUTO_INCREMENT PRIMARY KEY);
CREATE TABLE Showtime_sequence (id INT AUTO_INCREMENT PRIMARY KEY);
CREATE TABLE Movie_sequence (id INT AUTO_INCREMENT PRIMARY KEY);
CREATE TABLE Bill_sequence (id INT AUTO_INCREMENT PRIMARY KEY);
CREATE TABLE Promotional_bill_sequence (id INT AUTO_INCREMENT PRIMARY KEY);
CREATE TABLE Food_sequence (id INT AUTO_INCREMENT PRIMARY KEY);
CREATE TABLE Event_sequence (id INT AUTO_INCREMENT PRIMARY KEY);
CREATE TABLE Code_sequence (id INT AUTO_INCREMENT PRIMARY KEY);
CREATE TABLE Promotional_sequence (id INT AUTO_INCREMENT PRIMARY KEY);
CREATE TABLE Staff_sequence (id INT AUTO_INCREMENT PRIMARY KEY);

DELIMITER $$

-- Function to generate Cinema ID
CREATE FUNCTION get_next_cinema_id() RETURNS VARCHAR(8)
DETERMINISTIC
BEGIN
    DECLARE next_id INT;
    INSERT INTO Cinema_sequence VALUES (NULL);
    SET next_id = LAST_INSERT_ID();
    RETURN CONCAT('CIN', LPAD(next_id, 5, '0'));
END$$

-- Function to generate Staff ID
CREATE FUNCTION get_next_staff_id() RETURNS VARCHAR(8)
DETERMINISTIC
BEGIN
    DECLARE next_id INT;
    INSERT INTO Staff_sequence VALUES (NULL);
    SET next_id = LAST_INSERT_ID();
    RETURN CONCAT('STA', LPAD(next_id, 5, '0'));
END$$

-- Function to generate Room ID
CREATE FUNCTION get_next_room_id() RETURNS VARCHAR(8)
DETERMINISTIC
BEGIN
    DECLARE next_id INT;
    INSERT INTO Room_sequence VALUES (NULL);
    SET next_id = LAST_INSERT_ID();
    RETURN CONCAT('ROO', LPAD(next_id, 5, '0'));
END$$

-- Function to generate Movie ID
CREATE FUNCTION get_next_movie_id() RETURNS VARCHAR(8)
DETERMINISTIC
BEGIN
    DECLARE next_id INT;
    INSERT INTO Movie_sequence VALUES (NULL);
    SET next_id = LAST_INSERT_ID();
    RETURN CONCAT('MOV', LPAD(next_id, 5, '0'));
END$$

-- Function to generate Showtime ID
CREATE FUNCTION get_next_showtime_id() RETURNS VARCHAR(8)
DETERMINISTIC
BEGIN
    DECLARE next_id INT;
    INSERT INTO Showtime_sequence VALUES (NULL);
    SET next_id = LAST_INSERT_ID();
    RETURN CONCAT('SHO', LPAD(next_id, 5, '0'));
END$$

-- Function to generate Bill ID
CREATE FUNCTION get_next_bill_id() RETURNS VARCHAR(8)
DETERMINISTIC
BEGIN
    DECLARE next_id INT;
    INSERT INTO Bill_sequence VALUES (NULL);
    SET next_id = LAST_INSERT_ID();
    RETURN CONCAT('BIL', LPAD(next_id, 5, '0'));
END$$

-- Function to generate Ticket ID
CREATE FUNCTION get_next_ticket_id() RETURNS VARCHAR(8)
DETERMINISTIC
BEGIN
    DECLARE next_id INT;
    INSERT INTO Ticket_sequence VALUES (NULL);
    SET next_id = LAST_INSERT_ID();
    RETURN CONCAT('TIC', LPAD(next_id, 5, '0'));
END$$

-- Function to generate Promotional Bill ID
CREATE FUNCTION get_next_promotional_bill_id() RETURNS VARCHAR(8)
DETERMINISTIC
BEGIN
    DECLARE next_id INT;
    INSERT INTO Promotional_bill_sequence VALUES (NULL);
    SET next_id = LAST_INSERT_ID();
    RETURN CONCAT('PRB', LPAD(next_id, 5, '0'));
END$$

-- Function to generate Food ID
CREATE FUNCTION get_next_food_id() RETURNS VARCHAR(8)
DETERMINISTIC
BEGIN
    DECLARE next_id INT;
    INSERT INTO Food_sequence VALUES (NULL);
    SET next_id = LAST_INSERT_ID();
    RETURN CONCAT('FOO', LPAD(next_id, 5, '0'));
END$$

-- Function to generate Event ID
CREATE FUNCTION get_next_event_id() RETURNS VARCHAR(8)
DETERMINISTIC
BEGIN
    DECLARE next_id INT;
    INSERT INTO Event_sequence VALUES (NULL);
    SET next_id = LAST_INSERT_ID();
    RETURN CONCAT('EVE', LPAD(next_id, 5, '0'));
END$$

-- Function to generate Promotional ID
CREATE FUNCTION get_next_promotional_id() RETURNS VARCHAR(8)
DETERMINISTIC
BEGIN
    DECLARE next_id INT;
    INSERT INTO Promotional_sequence VALUES (NULL);
    SET next_id = LAST_INSERT_ID();
    RETURN CONCAT('PRO', LPAD(next_id, 5, '0'));
END$$

-- Function to generate Voucher Code
CREATE FUNCTION get_next_voucher_code() RETURNS VARCHAR(8)
DETERMINISTIC
BEGIN
    DECLARE next_id INT;
    INSERT INTO Code_sequence VALUES (NULL);
    SET next_id = LAST_INSERT_ID();
    RETURN CONCAT('VOU', LPAD(next_id, 5, '0'));
END$$

DELIMITER ;

-- Create Tables
CREATE TABLE CINEMA (
    cinema_id VARCHAR(8) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    state VARCHAR(8) NOT NULL DEFAULT 'active' CHECK(state IN('active','inactive')),
    address VARCHAR(50)
);

CREATE TABLE STAFF (
    staff_id VARCHAR(8) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(10) UNIQUE CHECK (phone_number REGEXP '^0[0-9]{9}$'),
    manage_id VARCHAR(8),
    cinema_id VARCHAR(8) NOT NULL
);

CREATE TABLE ROOM (
    room_id VARCHAR(8) PRIMARY KEY,
    cinema_id VARCHAR(8) NOT NULL,
    name VARCHAR(5) NOT NULL,
    state VARCHAR(8) NOT NULL DEFAULT 'active' CHECK(state IN('active','inactive','full'))
);

CREATE TABLE SEAT (
    room_id VARCHAR(8) NOT NULL,
    seat_row CHAR(1) NOT NULL,
    seat_column INT NOT NULL CHECK(seat_column > 0),
    seat_type VARCHAR(10) NOT NULL DEFAULT 'normal' CHECK(seat_type IN('normal','vip','couple')),
    state VARCHAR(15) NOT NULL DEFAULT 'available' CHECK(state IN('available','occupied','unavailable','reserved')),
    PRIMARY KEY(room_id, seat_row, seat_column)
);

CREATE TABLE MOVIE (
    movie_id VARCHAR(8) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    duration INT NOT NULL CHECK(duration > 0),
    release_date DATE NOT NULL,
    end_date DATE NOT NULL,
    age_rating INT NOT NULL DEFAULT 0 CHECK(age_rating >= 0),
    trailer VARCHAR(500),
    language VARCHAR(10) NOT NULL DEFAULT 'vi',
    status VARCHAR(15) DEFAULT 'upcoming' CHECK(status IN('upcoming', 'showing', 'ended')),
    synopsis VARCHAR(500),
    CONSTRAINT release_end_date_CK CHECK (end_date >= release_date)
);

CREATE TABLE DIRECTOR (
    movie_id VARCHAR(8) NOT NULL,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY(movie_id, name)
);

CREATE TABLE ACTOR (
    movie_id VARCHAR(8) NOT NULL,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY(movie_id, name)
);

CREATE TABLE SHOWTIME (
    showtime_id VARCHAR(8) PRIMARY KEY,
    room_id VARCHAR(8) NOT NULL,
    movie_id VARCHAR(8) NOT NULL,
    start_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    CONSTRAINT starttime_endtime_CK CHECK(start_time < end_time)
);

CREATE TABLE ACCOUNT (
    phone_number VARCHAR(10) PRIMARY KEY CHECK (phone_number REGEXP '^0[0-9]{9}$'),
    email VARCHAR(100) UNIQUE NOT NULL CHECK(email REGEXP '^.+@.+\\..+$'),
    password VARCHAR(500) NOT NULL CHECK(CHAR_LENGTH(password) >= 6),
    fullname VARCHAR(50) NOT NULL,
    birth_date DATE NOT NULL CHECK(birth_date <= CURDATE()),
    gender VARCHAR(7) NOT NULL DEFAULT 'unknown' CHECK(gender IN('male','female','unknown')),
    avatar VARCHAR(500),
    membership_points INT NOT NULL DEFAULT 0 CHECK(membership_points >= 0),
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
    movie_name VARCHAR(50) NOT NULL,
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
    review_content VARCHAR(500) NOT NULL,
    PRIMARY KEY(phone_number, movie_id, date_written)
);

CREATE TABLE PROMOTIONAL_BILL (
    promotional_bill_id VARCHAR(8) PRIMARY KEY,
    bill_id VARCHAR(8) NOT NULL UNIQUE
);

CREATE TABLE FOOD (
    food_id VARCHAR(8) PRIMARY KEY,
    bill_id VARCHAR(8) NOT NULL,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(500),
    price INT NOT NULL DEFAULT 0 CHECK(price >= 0),
    production_date DATE NOT NULL,
    expiration_date DATE NOT NULL,
    CONSTRAINT food_date_CK CHECK(production_date < expiration_date)
);

CREATE TABLE EVENT (
    event_id VARCHAR(8) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(500),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    CONSTRAINT event_date_CK CHECK(start_date < end_date)
);

CREATE TABLE MEMBER (
    level VARCHAR(10) PRIMARY KEY CHECK(level IN('copper','gold','diamond','vip')),
    minimum_point INT NOT NULL DEFAULT 0 CHECK(minimum_point >= 0)
);

CREATE TABLE PROMOTIONAL (
    promotional_id VARCHAR(8) PRIMARY KEY,
    event_id VARCHAR(8) NOT NULL,
    description VARCHAR(500),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    level VARCHAR(10) NOT NULL CHECK(level IN('copper','gold','diamond','vip')),
    CONSTRAINT promotional_date_CK CHECK(start_date < end_date)
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
    CONSTRAINT voucher_date_CK CHECK(start_date <= end_date)
);

CREATE TABLE GIFT (
    promotional_id VARCHAR(8) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    quantity INT NOT NULL DEFAULT 0 CHECK(quantity >= 0)
);

CREATE TABLE DISCOUNT (
    promotional_id VARCHAR(8) PRIMARY KEY,
    percent_reduce DECIMAL(5,2) NOT NULL CHECK(percent_reduce >= 0 AND percent_reduce <= 100),
    max_price_can_reduce INT NOT NULL CHECK(max_price_can_reduce >= 0)
);

-- Add FOREIGN KEY constraints
ALTER TABLE STAFF ADD CONSTRAINT staff_cinema_id_FK 
FOREIGN KEY(cinema_id) REFERENCES CINEMA(cinema_id)
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE STAFF ADD CONSTRAINT staff_manage_id_FK 
FOREIGN KEY(manage_id) REFERENCES STAFF(staff_id)
ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE ROOM ADD CONSTRAINT room_cinema_id_FK 
FOREIGN KEY(cinema_id) REFERENCES CINEMA(cinema_id)
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE SEAT ADD CONSTRAINT seat_room_id_FK 
FOREIGN KEY(room_id) REFERENCES ROOM(room_id)
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE DIRECTOR ADD CONSTRAINT director_movie_id_FK 
FOREIGN KEY(movie_id) REFERENCES MOVIE(movie_id)
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE ACTOR ADD CONSTRAINT actor_movie_id_FK 
FOREIGN KEY(movie_id) REFERENCES MOVIE(movie_id)
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE SHOWTIME ADD CONSTRAINT showtime_movie_id_FK 
FOREIGN KEY(movie_id) REFERENCES MOVIE(movie_id)
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE SHOWTIME ADD CONSTRAINT showtime_room_id_FK 
FOREIGN KEY(room_id) REFERENCES ROOM(room_id)
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE TICKET ADD CONSTRAINT ticket_room_seat_FK 
FOREIGN KEY(room_id, seat_row, seat_column) REFERENCES SEAT(room_id, seat_row, seat_column)
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE TICKET ADD CONSTRAINT ticket_showtime_FK 
FOREIGN KEY(showtime_id) REFERENCES SHOWTIME(showtime_id)
ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE TICKET ADD CONSTRAINT ticket_bill_id_FK 
FOREIGN KEY(bill_id) REFERENCES BILL(bill_id)
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE MOVIE_REVIEW ADD CONSTRAINT movie_review_movie_id_FK 
FOREIGN KEY(movie_id) REFERENCES MOVIE(movie_id)
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE MOVIE_REVIEW ADD CONSTRAINT movie_review_phone_number_FK 
FOREIGN KEY(phone_number) REFERENCES ACCOUNT(phone_number)
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE BILL ADD CONSTRAINT bill_phone_number_FK 
FOREIGN KEY(phone_number) REFERENCES ACCOUNT(phone_number)
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE PROMOTIONAL_BILL ADD CONSTRAINT promotional_bill_bill_id_FK 
FOREIGN KEY(bill_id) REFERENCES BILL(bill_id)
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE FOOD ADD CONSTRAINT food_bill_id_FK 
FOREIGN KEY(bill_id) REFERENCES BILL(bill_id)
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE PROMOTIONAL ADD CONSTRAINT promotional_event_id_FK 
FOREIGN KEY(event_id) REFERENCES EVENT(event_id)
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE PROMOTIONAL ADD CONSTRAINT promotional_level_FK 
FOREIGN KEY(level) REFERENCES MEMBER(level)
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE ACCOUNT_MEMBERSHIP ADD CONSTRAINT account_membership_phone_FK 
FOREIGN KEY(phone_number) REFERENCES ACCOUNT(phone_number)
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE ACCOUNT_MEMBERSHIP ADD CONSTRAINT account_membership_level_FK 
FOREIGN KEY(level) REFERENCES MEMBER(level)
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE VOUCHER ADD CONSTRAINT voucher_promotional_id_FK 
FOREIGN KEY(promotional_id) REFERENCES PROMOTIONAL(promotional_id)
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE VOUCHER ADD CONSTRAINT voucher_phone_number_FK 
FOREIGN KEY(phone_number) REFERENCES ACCOUNT(phone_number)
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE GIFT ADD CONSTRAINT gift_promotional_id_FK 
FOREIGN KEY(promotional_id) REFERENCES PROMOTIONAL(promotional_id)
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE DISCOUNT ADD CONSTRAINT discount_promotional_id_FK 
FOREIGN KEY(promotional_id) REFERENCES PROMOTIONAL(promotional_id)
ON DELETE RESTRICT ON UPDATE CASCADE;

-- Insert sample data
-- 1. CINEMA
INSERT INTO CINEMA (cinema_id, name, address) VALUES
(get_next_cinema_id(), 'CGV Hùng Vương Plaza', '126 Hùng Vương, Quận 5, TP.HCM'),
(get_next_cinema_id(), 'Lotte Cinema Đà Nẵng', 'CH1-01, Tầng 4, TTTM Lotte Mart, Đà Nẵng'),
(get_next_cinema_id(), 'BHD Star Cineplex 3/2', 'Lầu 5, TTTM Vincom, 3/2, Quận 10, TP.HCM'),
(get_next_cinema_id(), 'Galaxy Nguyễn Du', '116 Nguyễn Du, Quận 1, TP.HCM'),
(get_next_cinema_id(), 'CGV Vĩnh Trung Plaza', '255-257 Hùng Vương, Quận Thanh Khê, Đà Nẵng');

-- 2. STAFF
INSERT INTO STAFF (staff_id, name, phone_number, cinema_id) VALUES
(get_next_staff_id(), 'Nguyễn Văn A', '0901111111', 'CIN00001'),
(get_next_staff_id(), 'Trần Thị B', '0902222222', 'CIN00001'),
(get_next_staff_id(), 'Lê Văn C', '0903333333', 'CIN00002'),
(get_next_staff_id(), 'Phạm Thị D', '0904444444', 'CIN00002'),
(get_next_staff_id(), 'Hoàng Văn E', '0905555555', 'CIN00003');

-- Update manage_id AFTER staff records exist
UPDATE STAFF SET manage_id = 'STA00001' WHERE staff_id = 'STA00002';
UPDATE STAFF SET manage_id = 'STA00003' WHERE staff_id = 'STA00004';

-- 3. ROOM
INSERT INTO ROOM (room_id, cinema_id, name) VALUES
(get_next_room_id(), 'CIN00001', 'R01'), (get_next_room_id(), 'CIN00001', 'R02'), (get_next_room_id(), 'CIN00001', 'R03'),
(get_next_room_id(), 'CIN00002', 'R01'), (get_next_room_id(), 'CIN00002', 'R02'),
(get_next_room_id(), 'CIN00003', 'R01'), (get_next_room_id(), 'CIN00003', 'R02');

-- 4. SEAT
-- Room 1
INSERT INTO SEAT (room_id, seat_row, seat_column, seat_type) VALUES
('ROO00001', 'A', 1, 'normal'), ('ROO00001', 'A', 2, 'normal'), ('ROO00001', 'A', 3, 'normal'), ('ROO00001', 'A', 4, 'normal'), ('ROO00001', 'A', 5, 'normal'), ('ROO00001', 'A', 6, 'normal'),
('ROO00001', 'B', 1, 'normal'), ('ROO00001', 'B', 2, 'normal'), ('ROO00001', 'B', 3, 'normal'), ('ROO00001', 'B', 4, 'vip'), ('ROO00001', 'B', 5, 'vip'), ('ROO00001', 'B', 6, 'vip'),
('ROO00001', 'C', 1, 'normal'), ('ROO00001', 'C', 2, 'normal'), ('ROO00001', 'C', 3, 'normal'), ('ROO00001', 'C', 4, 'vip'), ('ROO00001', 'C', 5, 'vip'), ('ROO00001', 'C', 6, 'vip'),
('ROO00001', 'D', 1, 'couple'), ('ROO00001', 'D', 2, 'couple'), ('ROO00001', 'D', 3, 'couple'), ('ROO00001', 'D', 4, 'couple'), ('ROO00001', 'D', 5, 'couple'), ('ROO00001', 'D', 6, 'couple');

-- Room 2
INSERT INTO SEAT (room_id, seat_row, seat_column, seat_type) VALUES
('ROO00002', 'A', 1, 'normal'), ('ROO00002', 'A', 2, 'normal'), ('ROO00002', 'A', 3, 'normal'), ('ROO00002', 'A', 4, 'normal'), ('ROO00002', 'A', 5, 'normal'), ('ROO00002', 'A', 6, 'normal'),
('ROO00002', 'B', 1, 'normal'), ('ROO00002', 'B', 2, 'normal'), ('ROO00002', 'B', 3, 'normal'), ('ROO00002', 'B', 4, 'vip'), ('ROO00002', 'B', 5, 'vip'), ('ROO00002', 'B', 6, 'vip');

-- Rooms 3-7
INSERT INTO SEAT (room_id, seat_row, seat_column, seat_type) VALUES
('ROO00003', 'A', 1, 'normal'), ('ROO00003', 'A', 2, 'normal'), ('ROO00003', 'A', 3, 'normal'), ('ROO00003', 'B', 1, 'normal'), ('ROO00003', 'B', 2, 'normal'), ('ROO00003', 'B', 3, 'normal'),
('ROO00003', 'C', 1, 'normal'), ('ROO00003', 'C', 2, 'normal'), ('ROO00003', 'C', 3, 'normal'), ('ROO00003', 'D', 1, 'couple'), ('ROO00003', 'D', 2, 'couple'), ('ROO00003', 'D', 3, 'couple'),

('ROO00004', 'A', 1, 'normal'), ('ROO00004', 'A', 2, 'normal'), ('ROO00004', 'B', 1, 'normal'), ('ROO00004', 'B', 2, 'normal'), ('ROO00004', 'C', 1, 'vip'), ('ROO00004', 'C', 2, 'vip'),
('ROO00004', 'D', 1, 'couple'), ('ROO00004', 'D', 2, 'couple'),

('ROO00005', 'A', 1, 'normal'), ('ROO00005', 'A', 2, 'normal'), ('ROO00005', 'A', 3, 'normal'), ('ROO00005', 'B', 1, 'normal'), ('ROO00005', 'B', 2, 'normal'), ('ROO00005', 'B', 3, 'normal'),

('ROO00006', 'A', 1, 'normal'), ('ROO00006', 'A', 2, 'normal'), ('ROO00006', 'B', 1, 'normal'), ('ROO00006', 'B', 2, 'normal'), ('ROO00006', 'C', 1, 'vip'), ('ROO00006', 'C', 2, 'vip'),

('ROO00007', 'A', 1, 'normal'), ('ROO00007', 'A', 2, 'normal'), ('ROO00007', 'B', 1, 'vip'), ('ROO00007', 'B', 2, 'vip'), ('ROO00007', 'B', 3, 'vip'), ('ROO00007', 'B', 4, 'vip'), ('ROO00007', 'B', 5, 'vip');

-- 5. MOVIE
INSERT INTO MOVIE (movie_id, name, duration, release_date, end_date, age_rating, language, status, synopsis) VALUES
(get_next_movie_id(), 'Avengers: Endgame', 181, '2024-04-26', '2024-06-26', 13, 'en', 'showing', 'Phim siêu anh hùng của Marvel'),
(get_next_movie_id(), 'Tình Người Duyên Ma', 120, '2024-05-10', '2024-07-10', 16, 'vi', 'showing', 'Phim tâm lý tình cảm Việt Nam'),
(get_next_movie_id(), 'Spider-Man: No Way Home', 148, '2024-04-15', '2024-06-15', 13, 'en', 'showing', 'Spider-Man đa vũ trụ');

-- 6. DIRECTOR & ACTOR
INSERT INTO DIRECTOR (movie_id, name) VALUES
('MOV00001', 'Anthony Russo'), ('MOV00001', 'Joe Russo'),
('MOV00002', 'Trấn Thành'),
('MOV00003', 'Jon Watts');

INSERT INTO ACTOR (movie_id, name) VALUES
('MOV00001', 'Robert Downey Jr.'), ('MOV00001', 'Chris Evans'),
('MOV00002', 'Trấn Thành'), ('MOV00002', 'Tuấn Trần'),
('MOV00003', 'Tom Holland'), ('MOV00003', 'Zendaya');

-- 7. SHOWTIME
INSERT INTO SHOWTIME (showtime_id, room_id, movie_id, start_date, start_time, end_time) VALUES
(get_next_showtime_id(), 'ROO00001', 'MOV00001', '2024-05-25', '09:00:00', '12:01:00'),
(get_next_showtime_id(), 'ROO00001', 'MOV00001', '2024-05-25', '13:00:00', '16:01:00'),
(get_next_showtime_id(), 'ROO00003', 'MOV00002', '2024-05-25', '14:00:00', '16:00:00'),
(get_next_showtime_id(), 'ROO00005', 'MOV00003', '2024-05-25', '11:00:00', '13:28:00'),
(get_next_showtime_id(), 'ROO00006', 'MOV00003', '2024-05-25', '15:00:00', '17:28:00'),
(get_next_showtime_id(), 'ROO00007', 'MOV00001', '2024-05-25', '12:00:00', '15:01:00');

-- 8. ACCOUNT
INSERT INTO ACCOUNT (phone_number, email, password, fullname, birth_date, gender, membership_points) VALUES
('0912345678', 'user1@gmail.com', 'password123', 'Nguyễn Văn An', '1990-05-15', 'male', 1500),
('0923456789', 'user2@gmail.com', 'password123', 'Trần Thị Bình', '1995-08-20', 'female', 800),
('0934567890', 'user3@gmail.com', 'password123', 'Lê Văn Cường', '1988-12-10', 'male', 2500);

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
('0934567890', 'diamond');

-- 11. EVENT
INSERT INTO EVENT (event_id, name, description, start_date, end_date) VALUES
(get_next_event_id(), 'Khuyến mãi tháng 5', 'Ưu đãi đặc biệt cho khách hàng trong tháng 5', '2024-05-01', '2024-05-31'),
(get_next_event_id(), 'Giờ vàng cuối tuần', 'Giảm giá vé các suất chiếu cuối tuần', '2024-05-20', '2024-06-20');

-- 12. PROMOTIONAL
INSERT INTO PROMOTIONAL (promotional_id, event_id, description, start_date, end_date, level) VALUES
(get_next_promotional_id(), 'EVE00001', 'Giảm 20% cho tất cả các suất chiếu', '2024-05-01', '2024-05-31', 'copper'),
(get_next_promotional_id(), 'EVE00001', 'Giảm 30% + bỏng nước miễn phí', '2024-05-01', '2024-05-31', 'gold'),
(get_next_promotional_id(), 'EVE00002', 'Giảm 15% các suất chiếu sau 18h', '2024-05-20', '2024-06-20', 'copper');

-- 13. VOUCHER
INSERT INTO VOUCHER (code, promotional_id, start_date, end_date, state, phone_number) VALUES
(get_next_voucher_code(), 'PRO00001', '2024-05-01', '2024-05-31', 'active', '0912345678'),
(get_next_voucher_code(), 'PRO00002', '2024-05-01', '2024-05-31', 'active', '0934567890'),
(get_next_voucher_code(), 'PRO00003', '2024-05-20', '2024-06-20', 'active', '0923456789');

-- 14. DISCOUNT
INSERT INTO DISCOUNT (promotional_id, percent_reduce, max_price_can_reduce) VALUES
('PR