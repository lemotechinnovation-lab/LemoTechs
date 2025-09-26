import { body, param, query } from 'express-validator';

/**
 * Validation rules for driver assignment operations
 */
export const assignDriverValidation = [
  body('bookingId').isUUID().withMessage('Valid booking ID is required'),
  body('pickupLocation.lat').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
  body('pickupLocation.lng').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required'),
  body('priority').optional().isIn(['low', 'normal', 'high', 'urgent']).withMessage('Invalid priority'),
  body('estimatedPickupTime').isISO8601().withMessage('Valid pickup time is required'),
  body('customerTier').optional().isIn(['regular', 'premium', 'vip']).withMessage('Invalid customer tier')
];

export const updateLocationValidation = [
  body('lat').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
  body('lng').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required'),
  body('heading').optional().isFloat({ min: 0, max: 360 }).withMessage('Valid heading is required'),
  body('speed').optional().isFloat({ min: 0 }).withMessage('Valid speed is required')
];

export const rejectAssignmentValidation = [
  body('bookingId').isUUID().withMessage('Valid booking ID is required'),
  body('reason').optional().isString().withMessage('Reason must be a string')
];

export const batchAssignValidation = [
  body('requests').isArray({ min: 1 }).withMessage('Requests array is required'),
  body('requests.*.bookingId').isUUID().withMessage('Valid booking ID is required'),
  body('requests.*.pickupLocation.lat').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
  body('requests.*.pickupLocation.lng').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required')
];

/**
 * Common validation rules that can be reused across controllers
 */
export const commonValidation = {
  // UUID validation
  uuid: (field: string) => body(field).isUUID().withMessage(`Valid ${field} is required`),
  uuidParam: (field: string) => param(field).isUUID().withMessage(`Valid ${field} is required`),
  
  // Location validation
  latitude: (field: string) => body(field).isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
  longitude: (field: string) => body(field).isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required'),
  
  // Phone validation
  phone: (field: string) => body(field).isMobilePhone('any').withMessage('Valid phone number is required'),
  
  // Email validation
  email: (field: string) => body(field).isEmail().withMessage('Valid email is required'),
  
  // Password validation
  password: (field: string) => body(field).isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  
  // Name validation
  name: (field: string) => body(field).isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  // Optional string validation
  optionalString: (field: string) => body(field).optional().isString().withMessage(`${field} must be a string`),
  
  // Pagination validation
  page: () => query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  limit: () => query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  // Status validation
  status: (field: string, allowedValues: string[]) => body(field).isIn(allowedValues).withMessage(`Status must be one of: ${allowedValues.join(', ')}`),
  
  // Amount validation
  amount: (field: string) => body(field).isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  
  // Date validation
  date: (field: string) => body(field).isISO8601().withMessage('Valid date is required'),
  
  // Array validation
  array: (field: string, minLength: number = 1) => body(field).isArray({ min: minLength }).withMessage(`Array with at least ${minLength} items is required`)
};

/**
 * Specific validation rules for different entities
 */
export const entityValidation = {
  // User validation
  user: {
    register: [
      body('email').isEmail().withMessage('Valid email is required'),
      body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
      body('firstName').isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
      body('lastName').isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
      body('phone').isMobilePhone('any').withMessage('Valid phone number is required')
    ],
    login: [
      body('email').isEmail().withMessage('Valid email is required'),
      body('password').notEmpty().withMessage('Password is required')
    ],
    updateProfile: [
      body('firstName').optional().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
      body('lastName').optional().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
      body('phone').optional().isMobilePhone('any').withMessage('Valid phone number is required')
    ]
  },

  // Driver validation
  driver: {
    createProfile: [
      body('vehicle').isLength({ min: 2, max: 50 }).withMessage('Vehicle must be between 2 and 50 characters'),
      body('licenseNumber').isLength({ min: 5, max: 20 }).withMessage('License number must be between 5 and 20 characters'),
      body('vehicleType').isIn(['car', 'motorcycle', 'bicycle']).withMessage('Invalid vehicle type')
    ],
    updateLocation: [
      body('lat').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
      body('lng').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required')
    ]
  },

  // Shop validation
  shop: {
    createProfile: [
      body('shopName').isLength({ min: 2, max: 100 }).withMessage('Shop name must be between 2 and 100 characters'),
      body('address').isLength({ min: 10, max: 200 }).withMessage('Address must be between 10 and 200 characters'),
      body('phone').isMobilePhone('any').withMessage('Valid phone number is required'),
      body('services').isArray({ min: 1 }).withMessage('At least one service is required')
    ]
  },

  // Booking validation
  booking: {
    create: [
      body('pickupLocation').isLength({ min: 10, max: 200 }).withMessage('Pickup location must be between 10 and 200 characters'),
      body('pickupCoords.lat').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
      body('pickupCoords.lng').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required'),
      body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
      body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
      body('contactPhone').isMobilePhone('any').withMessage('Valid phone number is required')
    ]
  },

  // File upload validation
  file: {
    upload: [
      body('filename').optional().isString().withMessage('Filename must be a string'),
      body('fileType').optional().isIn(['image', 'document']).withMessage('File type must be image or document')
    ]
  }
};
