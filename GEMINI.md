# Tổng quan dự án Hệ thống Đặt vé Xem phim

Đây là một dự án full-stack được xây dựng bằng Next.js, TypeScript, và sử dụng MySQL cho cơ sở dữ liệu. Dưới đây là phân tích chi tiết về cấu trúc và công nghệ của dự án.

## 1. Công nghệ sử dụng

- **Frontend:**
  - **Framework:** [Next.js](https://nextjs.org/) (sử dụng App Router).
  - **Ngôn ngữ:** [TypeScript](https://www.typescriptlang.org/).
  - **Thư viện UI:** [shadcn/ui](https://ui.shadcn.com/) - Một tập hợp các component có thể tái sử dụng, được xây dựng trên Radix UI và Tailwind CSS.
  - **Styling:** [Tailwind CSS](https://tailwindcss.com/).
  - **Quản lý Form:** [React Hook Form](https://react-hook-form.com/) kết hợp với [Zod](https://zod.dev/) để validation schema.
  - **Data Fetching:** [Axios](https://axios-http.com/) được sử dụng để thực hiện các yêu cầu HTTP đến backend.

- **Backend (Dựa trên yêu cầu và schema):**
  - **Cơ sở dữ liệu:** [MySQL](https://www.mysql.com/). File `mysql_Ticket_Booking_System.sql` định nghĩa toàn bộ schema, bao gồm tables, relationships, triggers để tự động sinh ID (ví dụ: `CIN00001`), và dữ liệu mẫu.
  - **API:** Yêu cầu backend cung cấp một RESTful API theo tài liệu `BACKEND_API_REQUIREMENTS.md`. Các API endpoints được thiết kế để quản lý các tài nguyên như phim, rạp chiếu, suất chiếu, và người dùng.

## 2. Cấu trúc thư mục

Dự án tuân theo cấu trúc tiêu chuẩn của Next.js App Router, với sự phân chia rõ ràng về chức năng:

- **`app/`**: Chứa toàn bộ các trang và API routes của ứng dụng.
  - **`app/api/`**: Các API routes của Next.js, hoạt động như một lớp Backend-for-Frontend (BFF), xử lý các yêu cầu từ client trước khi tương tác với cơ sở dữ liệu hoặc một backend service khác.
  - **`app/(user-pages)/`**: Các thư mục con như `movie`, `cinemas`, `book-ticket` định nghĩa các trang cho người dùng cuối.
  - **`app/admin/`**: Khu vực quản trị, chứa các trang để quản lý dữ liệu hệ thống (phim, rạp, nhân viên, v.v.).
  - **`layout.tsx` & `page.tsx`**: Các file layout và trang chính của ứng dụng.

- **`components/`**: Chứa các React component có thể tái sử dụng.
  - **`components/ui/`**: Các UI component cơ bản được cung cấp bởi `shadcn/ui` (Button, Card, Dialog, v.v.).
  - **`components/*.tsx`**: Các component phức tạp hơn, dành riêng cho các tính năng của ứng dụng như `seat-map.tsx`, `showtime-selector.tsx`.

- **`services/`**: Tách biệt logic gọi API. Mỗi file (ví dụ: `movieService.ts`, `cinemaService.ts`) chịu trách nhiệm cho việc tương tác với một nhóm API endpoint cụ thể, giúp mã nguồn ở các component gọn gàng hơn.

- **`lib/`**: Chứa các hàm tiện ích (`utils.ts`), context providers (`auth-context.tsx`), và các logic chung khác.

- **`public/`**: Chứa các tài sản tĩnh như hình ảnh (poster phim, logo, v.v.).

## 3. Phân tích Cơ sở dữ liệu

File `mysql_Ticket_Booking_System.sql` cho thấy một thiết kế CSDL quan hệ chi tiết (not edit this file):

- **Các thực thể chính:** `CINEMA`, `ROOM`, `SEAT`, `MOVIE`, `SHOWTIME`.
- **Quản lý người dùng:** `ACCOUNT` (khách hàng) và `STAFF` (nhân viên).
- **Quy trình đặt vé:** `BILL` (hóa đơn), `TICKET` (vé), `FOOD` (đồ ăn kèm).
- **Khuyến mãi và thành viên:** `EVENT`, `PROMOTIONAL`, `VOUCHER`, `MEMBER`, `ACCOUNT_MEMBERSHIP`.
- **Tự động hóa:** Sử dụng **Triggers** để tự động tạo ID theo một định dạng chuẩn (ví dụ: `MOV` + số thứ tự) trước khi `INSERT`, đảm bảo tính nhất quán của dữ liệu.
- **Ràng buộc:** Toàn bộ các mối quan hệ (Foreign Keys) được định nghĩa rõ ràng, đảm bảo tính toàn vẹn dữ liệu.

## 4. Luồng hoạt động chính (dự đoán)

1.  **Người dùng:**
    - Đăng ký, đăng nhập tài khoản.
    - Xem danh sách phim đang chiếu, sắp chiếu.
    - Xem chi tiết một bộ phim (thông tin, trailer, đánh giá).
    - Xem danh sách rạp chiếu và thông tin chi tiết.
    - Chọn phim, sau đó chọn suất chiếu (ngày, giờ) và rạp.
    - Chuyển đến giao diện chọn ghế (`seat-map`), chọn đồ ăn (`food-selection`).
    - Áp dụng voucher khuyến mãi.
    - Thanh toán và nhận vé (lưu trong lịch sử đơn hàng).
    - Xem lại lịch sử đặt vé.

2.  **Quản trị viên (Admin):**
    - Đăng nhập vào trang quản trị.
    - Xem dashboard thống kê (doanh thu, số lượng vé bán ra).
    - Thực hiện các thao tác CRUD (Create, Read, Update, Delete) trên các tài nguyên: Phim, Rạp, Phòng chiếu, Suất chiếu, Nhân viên, v.v.
