/**
 * Booking-specific constants
 */

// Booking Steps
export const BOOKING_STEPS = [
  'location',
  'items',
  'driver',
  'payment',
  'confirmation'
] as const;

export type BookingStep = typeof BOOKING_STEPS[number];

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PICKUP: 'pickup',
  CLEANING: 'cleaning',
  DELIVERY: 'delivery',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
} as const;

// Driver Status
export const DRIVER_STATUS = {
  AVAILABLE: 'available',
  EN_ROUTE: 'en-route',
  ARRIVED: 'arrived',
  PICKED_UP: 'picked-up',
  CLEANING: 'cleaning',
  DELIVERING: 'delivering',
  COMPLETED: 'completed',
  OFFLINE: 'offline'
} as const;

// Payment Methods
export const PAYMENT_METHODS = [
  { id: 'card', name: 'Credit/Debit Card', icon: '💳', fees: 2.9 },
  { id: 'cash', name: 'Cash on Delivery', icon: '💰', fees: 0 },
  { id: 'mobile', name: 'Mobile Payment', icon: '📱', fees: 1.5 }
] as const;

// Service Items with pricing
export const SERVICE_ITEMS = [
  {
    id: 'sneakers',
    name: 'Sneakers',
    basePrice: 25,
    icon: '👟',
    category: 'shoes',
    description: 'Professional sneaker cleaning and restoration',
    estimatedTime: 120 // minutes
  },
  {
    id: 'dress-shoes',
    name: 'Dress Shoes',
    basePrice: 35,
    icon: '👞',
    category: 'shoes',
    description: 'Premium leather shoe care and polishing',
    estimatedTime: 90
  },
  {
    id: 'boots',
    name: 'Boots',
    basePrice: 40,
    icon: '🥾',
    category: 'shoes',
    description: 'Deep cleaning for all types of boots',
    estimatedTime: 150
  },
  {
    id: 'shirt',
    name: 'Shirt/Blouse',
    basePrice: 15,
    icon: '👔',
    category: 'clothing',
    description: 'Professional shirt cleaning and pressing',
    estimatedTime: 60
  },
  {
    id: 'pants',
    name: 'Pants/Trousers',
    basePrice: 20,
    icon: '👖',
    category: 'clothing',
    description: 'Complete trouser cleaning service',
    estimatedTime: 75
  },
  {
    id: 'jacket',
    name: 'Jacket/Blazer',
    basePrice: 50,
    icon: '🧥',
    category: 'clothing',
    description: 'Specialized jacket and blazer care',
    estimatedTime: 180
  },
  {
    id: 'dress',
    name: 'Dress',
    basePrice: 30,
    icon: '👗',
    category: 'clothing',
    description: 'Delicate dress cleaning and care',
    estimatedTime: 120
  },
  {
    id: 'handbag',
    name: 'Handbag',
    basePrice: 45,
    icon: '👜',
    category: 'accessories',
    description: 'Luxury handbag restoration and cleaning',
    estimatedTime: 150
  }
] as const;

// Service Categories
export const SERVICE_CATEGORIES = [
  { id: 'shoes', name: 'Shoes', icon: '👟' },
  { id: 'clothing', name: 'Clothing', icon: '👔' },
  { id: 'accessories', name: 'Accessories', icon: '👜' }
] as const;

// Time Slots
export const TIME_SLOTS = [
  { id: 'morning', label: '8:00 - 12:00', hours: [8, 9, 10, 11] },
  { id: 'afternoon', label: '12:00 - 17:00', hours: [12, 13, 14, 15, 16] },
  { id: 'evening', label: '17:00 - 20:00', hours: [17, 18, 19] }
] as const;

// Delivery Options
export const DELIVERY_OPTIONS = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    description: '24-48 hours',
    price: 0,
    estimatedTime: '24-48 hours'
  },
  {
    id: 'express',
    name: 'Express Delivery',
    description: '4-8 hours',
    price: 25,
    estimatedTime: '4-8 hours'
  },
  {
    id: 'urgent',
    name: 'Urgent Delivery',
    description: '1-2 hours',
    price: 50,
    estimatedTime: '1-2 hours'
  }
] as const;

// Special Instructions
export const SPECIAL_INSTRUCTIONS = [
  'Gentle cleaning only',
  'Extra care for delicate materials',
  'Stain removal focus',
  'Waterproofing treatment',
  'Color restoration',
  'Odor removal',
  'Rush service needed',
  'Call before pickup',
  'Leave at security/reception',
  'Handle with extra care'
] as const;

// Cleaning Methods
export const CLEANING_METHODS = [
  {
    id: 'basic',
    name: 'Basic Clean',
    description: 'Standard cleaning process',
    additionalCost: 0
  },
  {
    id: 'deep',
    name: 'Deep Clean',
    description: 'Intensive cleaning with specialized products',
    additionalCost: 15
  },
  {
    id: 'eco',
    name: 'Eco-Friendly',
    description: 'Environmental-friendly cleaning products',
    additionalCost: 10
  },
  {
    id: 'premium',
    name: 'Premium Care',
    description: 'Luxury treatment with premium products',
    additionalCost: 25
  }
] as const;

// Booking Limits
export const BOOKING_LIMITS = {
  minItems: 1,
  maxItems: 20,
  minAmount: 15,
  maxAmount: 2000,
  maxAdvanceBooking: 30, // days
  minPickupTime: 60 // minutes from now
} as const;

// Pricing Rules
export const PRICING_RULES = {
  bulkDiscount: {
    threshold: 5, // items
    discount: 0.1 // 10% discount
  },
  loyaltyDiscount: {
    threshold: 100, // loyalty points
    discount: 0.05 // 5% discount
  },
  firstTimeDiscount: {
    discount: 0.15 // 15% discount for first-time customers
  },
  serviceFees: {
    stripe: 0.029, // 2.9%
    stripeFlatFee: 2.90, // R2.90
    cash: 0,
    mobile: 0.015 // 1.5%
  }
} as const;

// Service Quality Levels
export const QUALITY_LEVELS = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Professional cleaning service',
    multiplier: 1.0
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Enhanced care with premium products',
    multiplier: 1.5
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'White-glove service with luxury treatment',
    multiplier: 2.0
  }
] as const;

// Estimated Completion Times
export const ESTIMATED_TIMES = {
  pickup: 30, // minutes
  cleaning: {
    shoes: 120,
    clothing: 90,
    accessories: 150
  },
  delivery: 30 // minutes
} as const;
