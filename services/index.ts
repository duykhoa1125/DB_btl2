/**
 * Centralized export for all services
 * Import services using: import { movieService, authService } from '@/services'
 */

// Export all services
export { default as movieService } from './movieService';
export { default as cinemaService } from './cinemaService';
export { default as showtimeService } from './showtimeService';
export { default as roomService } from './roomService';
export { default as seatService } from './seatService';
export { default as authService } from './authService';
export { default as accountService } from './accountService';
export { default as bookingService } from './bookingService';
export { default as billService } from './billService';
export { default as ticketService } from './ticketService';
export { default as foodService, type FoodMenuItem } from './foodService';
export { default as voucherService } from './voucherService';
export { default as eventService } from './eventService';
export { default as promotionalService } from './promotionalService';
export { default as reviewService } from './reviewService';
export { default as staffService } from './staffService';
export { default as directorService } from './directorService';
export { default as actorService } from './actorService';
export { default as membershipService } from './membershipService';

// Export all types
export * from './types';

// Re-export mock data for backward compatibility (will be removed when UI is migrated)
// export * from './mock-data';
