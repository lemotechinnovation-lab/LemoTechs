/**
 * Application routes constants
 */

// Public Routes
export const PUBLIC_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  PORTFOLIO: '/portfolio',
  CONTACT: '/contact',
  BLOG: '/blog',
  LEGAL: '/legal',
  COMPETITORS: '/competitors',
  NOT_FOUND: '/404'
} as const;

// Auth Routes
export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  VERIFY_PHONE: '/verify-phone'
} as const;

// Protected Routes (require authentication)
export const PROTECTED_ROUTES = {
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  BOOKINGS: '/bookings',
  BOOKING_DETAILS: '/bookings/:id',
  PAYMENT_HISTORY: '/payments',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications'
} as const;

// Booking Flow Routes
export const BOOKING_ROUTES = {
  BOOKING: '/book',
  BOOKING_LOCATION: '/book/location',
  BOOKING_ITEMS: '/book/items',
  BOOKING_DRIVER: '/book/driver',
  BOOKING_PAYMENT: '/book/payment',
  BOOKING_CONFIRMATION: '/book/confirmation',
  BOOKING_TRACKING: '/book/tracking/:id'
} as const;

// Admin Routes (for future admin panel)
export const ADMIN_ROUTES = {
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_DRIVERS: '/admin/drivers',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_SETTINGS: '/admin/settings'
} as const;

// Driver Routes (for future driver app)
export const DRIVER_ROUTES = {
  DRIVER: '/driver',
  DRIVER_DASHBOARD: '/driver/dashboard',
  DRIVER_BOOKINGS: '/driver/bookings',
  DRIVER_SCHEDULE: '/driver/schedule',
  DRIVER_EARNINGS: '/driver/earnings',
  DRIVER_PROFILE: '/driver/profile'
} as const;

// External Routes
export const EXTERNAL_ROUTES = {
  SUPPORT: 'https://support.lemotech.co.za',
  HELP_CENTER: 'https://help.lemotech.co.za',
  STATUS_PAGE: 'https://status.lemotech.co.za',
  CAREERS: 'https://careers.lemotech.co.za',
  PRESS: 'https://press.lemotech.co.za'
} as const;

// Social Media Routes
export const SOCIAL_ROUTES = {
  FACEBOOK: 'https://facebook.com/lemotechza',
  TWITTER: 'https://twitter.com/lemotechza',
  INSTAGRAM: 'https://instagram.com/lemotechza',
  LINKEDIN: 'https://linkedin.com/company/lemotech-za',
  YOUTUBE: 'https://youtube.com/@lemotechza'
} as const;

// Navigation Menu Structure
export const NAVIGATION_MENU = [
  {
    label: 'Services',
    route: PUBLIC_ROUTES.SERVICES,
    type: 'primary'
  },
  {
    label: 'Portfolio',
    route: PUBLIC_ROUTES.PORTFOLIO,
    type: 'primary'
  },
  {
    label: 'About',
    route: PUBLIC_ROUTES.ABOUT,
    type: 'primary'
  },
  {
    label: 'Blog',
    route: PUBLIC_ROUTES.BLOG,
    type: 'secondary'
  },
  {
    label: 'Contact',
    route: PUBLIC_ROUTES.CONTACT,
    type: 'secondary'
  }
] as const;

// Footer Links Structure
export const FOOTER_LINKS = {
  company: [
    { label: 'About Us', route: PUBLIC_ROUTES.ABOUT },
    { label: 'Our Team', route: `${PUBLIC_ROUTES.ABOUT}#team` },
    { label: 'Careers', route: EXTERNAL_ROUTES.CAREERS },
    { label: 'Press Kit', route: EXTERNAL_ROUTES.PRESS }
  ],
  services: [
    { label: 'Shoe Cleaning', route: `${PUBLIC_ROUTES.SERVICES}#shoes` },
    { label: 'Clothing Care', route: `${PUBLIC_ROUTES.SERVICES}#clothing` },
    { label: 'Accessories', route: `${PUBLIC_ROUTES.SERVICES}#accessories` },
    { label: 'Express Service', route: `${PUBLIC_ROUTES.SERVICES}#express` }
  ],
  support: [
    { label: 'Help Center', route: EXTERNAL_ROUTES.HELP_CENTER },
    { label: 'Contact Us', route: PUBLIC_ROUTES.CONTACT },
    { label: 'Service Status', route: EXTERNAL_ROUTES.STATUS_PAGE },
    { label: 'Report Issue', route: `${PUBLIC_ROUTES.CONTACT}#report` }
  ],
  legal: [
    { label: 'Terms of Service', route: `${PUBLIC_ROUTES.LEGAL}#terms` },
    { label: 'Privacy Policy', route: `${PUBLIC_ROUTES.LEGAL}#privacy` },
    { label: 'Cookie Policy', route: `${PUBLIC_ROUTES.LEGAL}#cookies` },
    { label: 'Refund Policy', route: `${PUBLIC_ROUTES.LEGAL}#refunds` }
  ]
} as const;

// Breadcrumb Configurations
export const BREADCRUMB_CONFIG = {
  [PUBLIC_ROUTES.HOME]: { label: 'Home', showHome: false },
  [PUBLIC_ROUTES.ABOUT]: { label: 'About Us', showHome: true },
  [PUBLIC_ROUTES.SERVICES]: { label: 'Services', showHome: true },
  [PUBLIC_ROUTES.PORTFOLIO]: { label: 'Portfolio', showHome: true },
  [PUBLIC_ROUTES.CONTACT]: { label: 'Contact', showHome: true },
  [PUBLIC_ROUTES.BLOG]: { label: 'Blog', showHome: true },
  [PUBLIC_ROUTES.LEGAL]: { label: 'Legal', showHome: true },
  [BOOKING_ROUTES.BOOKING]: { label: 'Book Service', showHome: true },
  [PROTECTED_ROUTES.DASHBOARD]: { label: 'Dashboard', showHome: true },
  [PROTECTED_ROUTES.PROFILE]: { label: 'Profile', showHome: true }
} as const;

// Route Permissions
export const ROUTE_PERMISSIONS = {
  public: Object.values(PUBLIC_ROUTES),
  authenticated: Object.values(PROTECTED_ROUTES),
  guest: Object.values(AUTH_ROUTES),
  admin: Object.values(ADMIN_ROUTES),
  driver: Object.values(DRIVER_ROUTES)
} as const;

// SEO Metadata for Routes
export const SEO_METADATA = {
  [PUBLIC_ROUTES.HOME]: {
    title: 'LemoTech - On-Demand Cleaning Services',
    description: 'Professional cleaning services for shoes, clothing, and accessories. Book online and get your items cleaned and delivered.',
    keywords: 'cleaning service, shoe cleaning, laundry, dry cleaning, South Africa'
  },
  [PUBLIC_ROUTES.ABOUT]: {
    title: 'About LemoTech - Professional Cleaning Experts',
    description: 'Learn about LemoTech\'s mission to provide convenient, high-quality cleaning services across South Africa.',
    keywords: 'about lemotech, cleaning company, professional cleaners'
  },
  [PUBLIC_ROUTES.SERVICES]: {
    title: 'Our Cleaning Services - Shoes, Clothing & More',
    description: 'Explore our comprehensive cleaning services including shoe restoration, clothing care, and accessory cleaning.',
    keywords: 'cleaning services, shoe cleaning, clothing care, dry cleaning'
  },
  [PUBLIC_ROUTES.PORTFOLIO]: {
    title: 'Portfolio - LemoTech Cleaning Results',
    description: 'See before and after examples of our professional cleaning work on shoes, clothing, and accessories.',
    keywords: 'cleaning portfolio, before after, cleaning results'
  },
  [PUBLIC_ROUTES.CONTACT]: {
    title: 'Contact LemoTech - Get in Touch',
    description: 'Contact LemoTech for inquiries, support, or to schedule a cleaning service. We\'re here to help.',
    keywords: 'contact lemotech, customer service, cleaning inquiry'
  }
} as const;
