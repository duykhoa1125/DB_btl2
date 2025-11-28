# CinemaHub Project Documentation

This document serves as the single source of truth for the CinemaHub project. It contains comprehensive information about the project's architecture, database, design system, and logic. **AI Assistants must read this file to understand the project context.**

## 1. Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 (using CSS-first configuration in `globals.css`)
- **UI Library:** shadcn/ui (Radix UI based)
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Database:** MySQL (Schema defined in `mysql_Ticket_Booking_System.sql`)
- **Fonts:** Be Vietnam Pro (Body), Outfit (Headings)

## 2. Architecture & Folder Structure

The project follows a modular architecture using Next.js App Router.

### Directory Structure

- **`app/`**: Application routes and API endpoints.
  - **`api/`**: Backend-for-Frontend (BFF) API routes. Organized by resource (e.g., `api/movies`, `api/auth`).
  - **`(user-pages)/`**: User-facing pages (e.g., movie details, booking flow).
  - **`admin/`**: Admin dashboard and management pages.
  - **`layout.tsx`**: Root layout with providers (`AuthProvider`, `Toaster`, `Analytics`).
  - **`globals.css`**: Global styles and Tailwind 4 configuration.
- **`components/`**: React components.
  - **`ui/`**: Reusable UI components from shadcn/ui.
  - **`header.tsx`, `footer.tsx`**: Layout components.
- **`services/`**: Service layer for data fetching.
  - **`mock-data.ts`**: Contains all mock data for the application.
  - **`types.ts`**: TypeScript interfaces matching the DB schema.
  - **`*Service.ts`**: Service modules (e.g., `movieService.ts`) that abstract data fetching logic. Currently switching between mock data and API calls.
- **`lib/`**: Utilities and contexts (e.g., `auth-context.tsx`, `utils.ts`).

### Service Layer Pattern

Data access is abstracted through "Services". Components should **never** fetch data directly. They should call methods from `services/*Service.ts`.

- **Current State**: Services primarily return data from `mock-data.ts` or call internal API routes.
- **Goal**: Services will eventually call the real Backend API.

## 3. Database Schema (MySQL)

The database schema is defined in `mysql_Ticket_Booking_System.sql`.

### Key Tables & Prefixes

- **CINEMA** (`CIN...`): Cinema locations.
- **ROOM** (`ROO...`): Screening rooms within a cinema.
- **SEAT**: Seats in a room (Composite PK: `room_id`, `seat_row`, `seat_column`).
- **MOVIE** (`MOV...`): Movie information.
- **SHOWTIME** (`SHO...`): Specific screening of a movie in a room.
- **ACCOUNT**: User accounts (PK: `phone_number`).
- **STAFF** (`STA...`): Staff members.
- **TICKET** (`TIC...`): Issued tickets.
- **BILL** (`BIL...`): Transaction records.
- **FOOD** (`FOO...`): Food items ordered.
- **VOUCHER** (`VOU...`): Discount codes.

### ID Generation

Triggers are used to automatically generate IDs with prefixes (e.g., `MOV00001`) when inserting with `NULL` ID.

## 4. Design System & UI

### Tailwind CSS 4 Configuration

Configuration is inline in `app/globals.css` using `@theme`.

- **Colors**: OKLCH color space for vibrant and accessible colors.
  - Primary: `oklch(58% 0.24 264)` (Deep Blue/Purple)
  - Accent: `oklch(75% 0.15 85)` (Warm Orange/Gold)
  - Background: `oklch(98% 0.005 264)` (Light) / `oklch(10% 0.015 264)` (Dark)
- **Fonts**:
  - Sans: `Be Vietnam Pro`
  - Heading: `Outfit`

### Custom Utilities

- `.glow-primary`, `.glow-accent`: Box-shadow glow effects.
- `.glass`: Glassmorphism effect (blur + transparency).
- `.animate-shimmer`: Loading/highlight animation.

## 5. Logic & Data Flow

### Booking Flow

1.  **Select Movie**: User chooses a movie from the homepage or list.
2.  **Select Showtime**: User selects a cinema, date, and time.
3.  **Select Seats**: User picks seats from a visual map (`seat-map.tsx`).
    - Seat types: Normal, VIP, Couple.
    - State: Available, Occupied, Selected.
4.  **Select Food**: Optional food & drink selection.
5.  **Payment**: Review order, apply voucher, and "pay" (mock payment).
6.  **Ticket**: Ticket is generated and saved to `TICKET` table (mock).

### Authentication

- **Context**: `AuthProvider` (`lib/auth-context.tsx`) manages user state.
- **Roles**: `user` (Customer) and `admin` (Staff).
- **Mock Auth**: Supports login with phone number/password from `MOCK_ACCOUNTS`.

## 6. API Routes (BFF)

Located in `app/api/`. These routes simulate a real backend.

- `GET /api/movies`: List movies.
- `GET /api/showtimes`: Get showtimes.
- `POST /api/auth/login`: Authenticate user.
- `GET /api/account/profile`: Get user profile.

## 7. Mock Data (`services/mock-data.ts`)

Contains static arrays for all entities.

- `MOCK_MOVIES`: Array of `Movie` objects.
- `MOCK_SHOWTIMES`: Generated programmatically for the next 14 days.
- `MOCK_SEATS`: Generated based on room layout.
- **Note**: When "saving" data (e.g., booking a ticket), we currently push to these in-memory arrays (reset on server restart).

## 8. Development Rules for AI

1.  **Update Documentation**: If you change the architecture, add a new table, or modify a core logic flow, **YOU MUST UPDATE THIS FILE**.
2.  **Use Services**: Always use `services/` for data fetching. Do not import `mock-data` directly in components.
3.  **Type Safety**: Strictly adhere to types in `services/types.ts`.
4.  **UI Consistency**: Use `shadcn/ui` components and Tailwind utility classes. Do not write custom CSS unless absolutely necessary.
5.  **Mobile First**: Ensure all designs are responsive.
