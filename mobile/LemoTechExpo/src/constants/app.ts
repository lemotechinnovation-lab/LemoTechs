/**
 * Application-wide constants for LemoTech Mobile
 * Matching frontend constants with mobile-specific adjustments
 */

// App Information
export const APP_NAME = 'LemoTech';
export const APP_DESCRIPTION = 'On-demand cleaning services for shoes, clothing, and more';
export const APP_VERSION = '1.0.0';
export const APP_DOMAIN = 'lemotech.co.za';

// Contact Information
export const CONTACT_INFO = {
  email: 'hello@lemotech.co.za',
  phone: '+27 11 123 4567',
  whatsapp: '+27 82 123 4567',
  address: '123 Business District, Sandton, Johannesburg, 2196',
  coordinates: {
    lat: -26.1076,
    lng: 28.0567
  }
} as const;

// Social Media
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/lemotechza',
  twitter: 'https://twitter.com/lemotechza',
  instagram: 'https://instagram.com/lemotechza',
  linkedin: 'https://linkedin.com/company/lemotech-za',
  youtube: 'https://youtube.com/@lemotechza'
} as const;

// Business Hours
export const BUSINESS_HOURS = {
  monday: { open: '08:00', close: '18:00', isOpen: true },
  tuesday: { open: '08:00', close: '18:00', isOpen: true },
  wednesday: { open: '08:00', close: '18:00', isOpen: true },
  thursday: { open: '08:00', close: '18:00', isOpen: true },
  friday: { open: '08:00', close: '18:00', isOpen: true },
  saturday: { open: '09:00', close: '16:00', isOpen: true },
  sunday: { open: '10:00', close: '15:00', isOpen: true }
} as const;

// Service Areas (South African Cities)
export const SERVICE_AREAS = [
  'Johannesburg',
  'Cape Town',
  'Durban',
  'Pretoria',
  'Port Elizabeth',
  'Bloemfontein',
  'East London',
  'Kimberley',
  'Polokwane',
  'Nelspruit'
] as const;

// Supported Languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇿🇦' },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
  { code: 'zu', name: 'Zulu', flag: '🇿🇦' },
  { code: 'xh', name: 'Xhosa', flag: '🇿🇦' }
] as const;

// Default Language
export const DEFAULT_LANGUAGE = 'en';

// Currency
export const DEFAULT_CURRENCY = 'ZAR';
export const CURRENCY_SYMBOL = 'R';

// Date/Time Formats
export const DATE_FORMATS = {
  short: 'DD/MM/YYYY',
  long: 'DD MMMM YYYY',
  withTime: 'DD/MM/YYYY HH:mm',
  time: 'HH:mm'
} as const;

// File Upload Limits
export const FILE_UPLOAD = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.pdf']
} as const;

// Pagination
export const PAGINATION = {
  defaultPageSize: 10,
  maxPageSize: 100,
  pageSizeOptions: [10, 25, 50, 100]
} as const;

// Animation Durations (in milliseconds)
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  page: 800
} as const;

// Z-Index Values
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1010,
  fixed: 1020,
  modal: 1030,
  popover: 1040,
  tooltip: 1050,
  notification: 1060
} as const;

// Mobile-specific breakpoints
export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536
} as const;

// Theme Colors - Matching frontend
export const COLORS = {
  primary: '#FF6B35',
  secondary: '#1A1040',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  white: '#FFFFFF',
  black: '#000000',
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121'
  }
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection.',
  unauthorized: 'You are not authorized to perform this action.',
  notFound: 'The requested resource was not found.',
  validation: 'Please check your input and try again.',
  server: 'Server error. Please try again later.',
  timeout: 'Request timed out. Please try again.',
  generic: 'An unexpected error occurred. Please try again.'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  login: 'Successfully logged in!',
  logout: 'Successfully logged out!',
  register: 'Account created successfully!',
  profileUpdate: 'Profile updated successfully!',
  passwordChange: 'Password changed successfully!',
  bookingCreated: 'Booking created successfully!',
  paymentProcessed: 'Payment processed successfully!',
  messageSent: 'Message sent successfully!'
} as const;

// Loading Messages
export const LOADING_MESSAGES = {
  login: 'Signing in...',
  register: 'Creating account...',
  booking: 'Processing booking...',
  payment: 'Processing payment...',
  loading: 'Loading...',
  saving: 'Saving...',
  uploading: 'Uploading...'
} as const;

// Mobile-specific constants
export const MOBILE_CONFIG = {
  splashDuration: 3000,
  animationDuration: 300,
  hapticFeedback: true,
  biometricAuth: true,
  pushNotifications: true,
  locationServices: true,
  cameraAccess: true,
  contactsAccess: false
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  baseUrl: 'https://api.lemotech.co.za',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    verify: '/auth/verify',
    refresh: '/auth/refresh',
    logout: '/auth/logout'
  },
  booking: {
    create: '/bookings',
    list: '/bookings',
    get: '/bookings/:id',
    update: '/bookings/:id',
    cancel: '/bookings/:id/cancel',
    track: '/bookings/:id/track'
  },
  user: {
    profile: '/user/profile',
    update: '/user/profile',
    preferences: '/user/preferences'
  },
  services: {
    list: '/services',
    categories: '/services/categories',
    pricing: '/services/pricing'
  }
} as const;
