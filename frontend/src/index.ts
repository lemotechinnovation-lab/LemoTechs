// Main Application Barrel Export
// This file provides centralized access to all major modules

// Re-export main modules (avoiding conflicts)
export * from './components';
export * from './pages';
export * from './services';
export * from './utils';

// Specific exports to avoid conflicts
export { useAnalytics, useNavigationAnalytics, useBooking, usePayment, useAuth } from './hooks';
export { APP_NAME, CONTACT_INFO, PUBLIC_ROUTES, PROTECTED_ROUTES } from './constants';
export type { BookingDetails, Driver, LocationCoordinates } from './types/booking';
export type { City, ExpansionPlan } from './types/cities';
export type { RevenueStream, MarketplaceProduct } from './types/revenue';

// Context exports
export { BookingProvider } from './context/BookingContext';
