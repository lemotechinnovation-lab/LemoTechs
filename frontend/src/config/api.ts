// API Configuration
export const API_CONFIG = {
  // Base API URL - defaults to localhost for development
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      PROFILE: '/auth/profile',
      REFRESH_TOKEN: '/auth/refresh-token',
      CHANGE_PASSWORD: '/auth/change-password',
      VERIFY_PHONE: '/auth/verify-phone',
      SEND_PHONE_VERIFICATION: '/auth/send-phone-verification',
      VERIFY_FIREBASE_TOKEN: '/auth/verify-firebase-token'
    },
    
    // Driver endpoints
    DRIVER: {
      PROFILE: '/drivers/profile',
      STATUS: '/drivers/status',
      JOBS: '/drivers/jobs',
      AVAILABLE_JOBS: '/drivers/available-jobs',
      ACCEPT_JOB: (jobId: string) => `/drivers/accept-job/${jobId}`,
      UPDATE_JOB_STATUS: (jobId: string) => `/drivers/jobs/${jobId}/status`
    },
    
    // Shop endpoints
    SHOP: {
      PROFILE: '/shops/profile',
      BOOKINGS: '/shops/bookings',
      ANALYTICS: '/shops/analytics',
      UPDATE_BOOKING_STATUS: (bookingId: string) => `/shops/bookings/${bookingId}/status`
    },
    
    // Booking endpoints
    BOOKING: {
      CREATE: '/bookings',
      GET: (id: string) => `/bookings/${id}`,
      UPDATE: (id: string) => `/bookings/${id}`,
      CANCEL: (id: string) => `/bookings/${id}/cancel`,
      TRACK: (id: string) => `/bookings/${id}/track`
    },
    
    // Upload endpoints
    UPLOAD: {
      IMAGE: '/upload/image',
      DOCUMENT: '/upload/document'
    },
    
    // Health check
    HEALTH: '/health'
  },
  
  // Request timeouts (in milliseconds)
  TIMEOUTS: {
    DEFAULT: 10000, // 10 seconds
    UPLOAD: 30000,  // 30 seconds
    LONG_RUNNING: 60000 // 60 seconds
  },
  
  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000, // 1 second
    BACKOFF_MULTIPLIER: 2
  }
};

// Environment-specific configurations
export const getApiConfig = () => {
  const environment = import.meta.env.MODE;
  
  switch (environment) {
    case 'development':
      return {
        ...API_CONFIG,
        BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
        DEBUG: true
      };
      
    case 'staging':
      return {
        ...API_CONFIG,
        BASE_URL: import.meta.env.VITE_API_URL || 'https://staging-api.lemotech.co.za/api',
        DEBUG: true
      };
      
    case 'production':
      return {
        ...API_CONFIG,
        BASE_URL: import.meta.env.VITE_API_URL || 'https://api.lemotech.co.za/api',
        DEBUG: false
      };
      
    default:
      return {
        ...API_CONFIG,
        BASE_URL: 'http://localhost:3001/api',
        DEBUG: true
      };
  }
};

// Export the current configuration
export const CURRENT_API_CONFIG = getApiConfig();
