# Backend API Requirements for Ticket Booking System

This document outlines the API endpoints required by the frontend application, based on the existing MySQL database schema and TypeScript type definitions.

## General Conventions

*   **Base URL**: `/api/v1`
*   **Data Format**: JSON
*   **Naming Convention**: The API **MUST** return JSON objects with **snake_case** keys to match the database schema and frontend TypeScript interfaces (e.g., `cinema_id`, `phone_number`, `start_date`).
*   **Date Formats**:
    *   Dates: `YYYY-MM-DD` (e.g., "2024-05-25")
    *   Times: `HH:mm:ss` (e.g., "09:00:00")
    *   Datetimes: ISO 8601 or `YYYY-MM-DD HH:mm:ss`
*   **Authentication**: Bearer Token (JWT) in `Authorization` header for protected routes.

---

## 1. Authentication & User (`/auth`, `/users`)

### Login
*   **Endpoint**: `POST /auth/login`
*   **Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
*   **Response**:
    ```json
    {
      "token": "jwt_token_string",
      "user": {
        "phone_number": "0912345678",
        "email": "user@example.com",
        "fullname": "Nguyen Van A",
        "role": "user" // or "admin"
        // ... other Account fields
      }
    }
    ```

### Register
*   **Endpoint**: `POST /auth/register`
*   **Body**:
    ```json
    {
      "phone_number": "0912345678",
      "email": "user@example.com",
      "password": "password123",
      "fullname": "Nguyen Van A",
      "birth_date": "1990-01-01",
      "gender": "male"
    }
    ```

### Get Current User Profile
*   **Endpoint**: `GET /auth/me`
*   **Headers**: `Authorization: Bearer <token>`
*   **Response**: Returns `Account` object joined with `ACCOUNT_MEMBERSHIP` to get `level`.

---

## 2. Movies (`/movies`)

### Get All Movies
*   **Endpoint**: `GET /movies`
*   **Query Params**:
    *   `status`: 'showing' | 'upcoming' | 'ended' (optional)
*   **Response**: Array of `Movie` objects.

### Get Movie Details
*   **Endpoint**: `GET /movies/:id`
*   **Response**: `Movie` object extended with:
    *   `directors`: Array of strings (names)
    *   `actors`: Array of strings (names)
    *   `avg_rating`: Number (calculated from `MOVIE_REVIEW`)
    *   `reviews`: Array of `MovieReview` objects (optional, or separate endpoint)

### Get Top Revenue Movies (Admin)
*   **Endpoint**: `GET /movies/top-revenue`
*   **Response**:
    ```json
    [
      {
        "movie": { ...MovieObject },
        "revenue": 15000000
      }
    ]
    ```

---

## 3. Cinemas (`/cinemas`)

### Get All Cinemas
*   **Endpoint**: `GET /cinemas`
*   **Response**: Array of `Cinema` objects.

### Get Cinema Details
*   **Endpoint**: `GET /cinemas/:id`
*   **Response**: `Cinema` object.

---

## 4. Showtimes (`/showtimes`)

### Get Showtimes for Movie
*   **Endpoint**: `GET /showtimes`
*   **Query Params**:
    *   `movie_id`: string (required)
    *   `date`: string (YYYY-MM-DD) (optional)
    *   `cinema_id`: string (optional)
*   **Response**: Array of `Showtime` objects.
    *   *Note*: Frontend groups these by date and cinema.
    *   Should include joined info: `room_name`, `cinema_name`.

### Get Showtime Details (Seat Layout)
*   **Endpoint**: `GET /showtimes/:id/seats`
*   **Description**: Returns the seat layout for a specific showtime, including status (available/occupied).
*   **Response**:
    ```json
    {
      "showtime_id": "SHO00001",
      "room": { "room_id": "...", "name": "..." },
      "seats": [
        {
          "room_id": "...",
          "seat_row": "A",
          "seat_column": 1,
          "seat_type": "normal",
          "state": "occupied", // Calculated: if ticket exists for this showtime+seat, then 'occupied', else 'available' (or 'broken' from SEAT table)
          "price": 85000 // Calculated based on seat_type and showtime rules
        },
        ...
      ]
    }
    ```

---

## 5. Booking & Tickets (`/bookings`)

### Create Booking (Purchase Ticket)
*   **Endpoint**: `POST /bookings`
*   **Headers**: `Authorization: Bearer <token>`
*   **Body**:
    ```json
    {
      "showtime_id": "SHO00001",
      "seats": [
        { "row": "A", "col": 1, "price": 85000 },
        { "row": "A", "col": 2, "price": 85000 }
      ],
      "foods": [ // Optional
        { "name": "Popcorn", "quantity": 1, "price": 50000 }
      ],
      "voucher_code": "VOU00001" // Optional
    }
    ```
*   **Logic**:
    1.  Create `BILL`.
    2.  Create `TICKET` records.
    3.  Create `FOOD` records (if any).
    4.  Update `VOUCHER` status (if used).
    5.  Calculate totals.
*   **Response**: Created `Bill` object with `bill_id`.

### Get User Order History
*   **Endpoint**: `GET /bookings/history`
*   **Headers**: `Authorization: Bearer <token>`
*   **Response**: Array of `Bill` objects, each containing nested `tickets` array.

---

## 6. Admin Dashboard (`/admin`)

### Get Dashboard Stats
*   **Endpoint**: `GET /admin/stats`
*   **Description**: Returns statistics for the dashboard.
*   **Requirement**: This endpoint **MUST** call a Stored Procedure (e.g., `sp_GetMonthlyRevenue`) to calculate the revenue, as per the assignment requirements.
*   **Response**:
    ```json
    {
      "total_movies": 10,
      "now_showing": 5,
      "coming_soon": 2,
      "total_cinemas": 5,
      "monthly_revenue": 50000000,
      "bookings_this_month": 120
    }
    ```

---

## 9. Admin Management (CRUD)

### Movies Management
*   **Create Movie**: `POST /admin/movies`
*   **Update Movie**: `PUT /admin/movies/:id`
*   **Delete Movie**: `DELETE /admin/movies/:id`
*   **Body**: `Movie` object (excluding ID).

### Cinemas Management
*   **Create Cinema**: `POST /admin/cinemas`
*   **Update Cinema**: `PUT /admin/cinemas/:id`
*   **Delete Cinema**: `DELETE /admin/cinemas/:id`
*   **Body**: `Cinema` object.

### Showtimes Management
*   **Create Showtime**: `POST /admin/showtimes`
*   **Update Showtime**: `PUT /admin/showtimes/:id`
*   **Delete Showtime**: `DELETE /admin/showtimes/:id`
*   **Body**: `Showtime` object.
    *   *Validation*: Must check if `room_id` is free at the given time.


---

## 7. Other Master Data

### Get Foods/Concessions
*   **Endpoint**: `GET /foods/menu` (Note: DB structure for 'Menu' is not explicit, currently `FOOD` table is linked to `BILL`. You might need a separate `MENU_ITEM` table or hardcode menu items in backend/frontend. If `FOOD` table is strictly for sold items, then the menu needs to be defined somewhere).

### Get Vouchers
*   **Endpoint**: `GET /vouchers/check/:code`
*   **Description**: Validate a voucher code.

---

## 8. Promotions & Events (`/promotions`)

### Get Active Events
*   **Endpoint**: `GET /events`
*   **Query Params**: `active=true`
*   **Response**: Array of `Event` objects.

### Get Promotions for Event
*   **Endpoint**: `GET /events/:id/promotions`
*   **Response**: Array of `Promotional` objects (including discount/gift details).

