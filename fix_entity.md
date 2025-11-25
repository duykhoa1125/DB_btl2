1. Movie (Phim)
Đặc điểm	
lib/mock-data.ts
services/mock-data.ts
Tên phim	title	name
Mô tả	description	synopsis
Ngày phát hành	releaseYear (chỉ có năm)	release_date (ngày đầy đủ), end_date
Đánh giá/Tuổi	rating (điểm số 0-10)	age_rating (độ tuổi 13, 16, 18...)
Trailer	trailerUrl	trailer
Thông tin khác	Chứa trực tiếp producer, director, actors, genres	Tách riêng Director, Actor (quan hệ bảng), thêm language
Naming Case	camelCase (releaseYear)	snake_case (release_date, age_rating)
2. Showtime (Suất chiếu)
Đặc điểm	
lib/mock-data.ts
services/mock-data.ts
Thời gian	startTime, endTime (ISO datetime string)	start_date, start_time, end_time (tách riêng ngày/giờ)
Phòng chiếu	room (tên phòng, string)	room_id (liên kết với bảng Room)
Giá vé	ticketPrice (nằm trong suất chiếu)	Không thấy trực tiếp (có thể tính toán hoặc nằm ở chỗ khác)
Cách tạo	Hardcoded từng object	Sinh tự động bằng vòng lặp (
generateSeats
, logic random giờ)
3. Cinema (Rạp)
Đặc điểm	
lib/mock-data.ts
services/mock-data.ts
Tên rạp	cinemaName	name
Trạng thái	Không có	state ('active', 'inactive')
Số lượng	Ít thông tin hơn	Có danh sách rạp cụ thể và địa chỉ chi tiết
4. Các dữ liệu khác
lib/mock-data.ts
: Chỉ có Movie, Showtime, Seat, Food, Invoice, Cinema.
services/mock-data.ts
: Đầy đủ hơn, bao gồm thêm Account (User), MovieReview, Voucher, Event, Director, Actor.
Kết luận & Đề xuất
Hiện tại dự án đang tồn tại 2 nguồn dữ liệu không đồng bộ về cấu trúc và quy tắc đặt tên (naming convention).

Vấn đề: lib dùng camelCase (title, startTime) trong khi services dùng snake_case (name, start_time). Điều này sẽ gây lỗi type khi bạn cố gắng dùng lẫn lộn giữa các component.
Đề xuất: Nên migrated hoàn toàn sang 
services/mock-data.ts
 vì:
Cấu trúc giống Database thật hơn (quan hệ ID, snake_case).
Dữ liệu đầy đủ và có logic sinh động (dynamic) giúp test các trường hợp edge case tốt hơn.
Tách biệt Type ra file riêng (types.ts) giúp quản lý code tốt hơn.
Bạn có muốn tôi giúp refactor các component đang dùng 
lib/mock-data.ts
 để chuyển sang dùng 
services/mock-data.ts
 không?