// Common types for the backend

export interface User {
  id: string;
  firebaseUid?: string;
  email: string;
  password?: string;
  name: string;
  phone: string;
  address: string;
  avatar?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  provider: string;
  role: 'user' | 'driver' | 'shop' | 'admin';
  loyaltyPoints: number;
  totalBookings: number;
  memberSince: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  userId: string;
  pickupLocation: string;
  pickupCoords?: {
    lat: number;
    lng: number;
  };
  items: string[];
  driverId?: string;
  shopId?: string;
  status: 'pending' | 'confirmed' | 'pickup' | 'cleaning' | 'delivery' | 'completed' | 'cancelled';
  paymentMethod: 'card' | 'cash' | 'mobile';
  paymentId?: string;
  amount: number;
  contactPhone: string;
  specialInstructions?: string;
  estimatedPickupTime?: Date;
  estimatedDeliveryTime?: Date;
  actualPickupTime?: Date;
  actualDeliveryTime?: Date;
  cleaningStartedAt?: Date;
  cleaningCompletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Driver {
  id: string;
  userId: string;
  vehicle: string;
  licenseNumber: string;
  licenseExpiry?: Date;
  vehicleRegistration?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  rating: number;
  totalJobs: number;
  totalEarnings: number;
  isActive: boolean;
  isVerified: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  status: 'offline' | 'available' | 'busy';
  lastActive?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Shop {
  id: string;
  userId: string;
  name: string;
  description?: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  phone?: string;
  email?: string;
  operatingHours?: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
  services?: string[];
  rating: number;
  totalBookings: number;
  totalRevenue: number;
  isActive: boolean;
  isVerified: boolean;
  capacity: number;
  currentLoad: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface JWTPayload {
  userId: string;
  email: string;
  role?: string;
  type: 'access' | 'refresh';
}

// Narrow DB row shapes used by controllers for list mappings
export interface DriverBookingRow {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  pickup_location: string | null;
  pickup_coords: unknown;
  items: unknown;
  status: string;
  payment_method: string | null;
  amount: string | number | null;
  contact_phone: string | null;
  special_instructions: string | null;
  estimated_pickup_time: string | null;
  estimated_delivery_time: string | null;
  actual_pickup_time: string | null;
  actual_delivery_time: string | null;
  created_at: string;
}

export interface AvailableJobRow {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  pickup_location: string | null;
  pickup_coords: unknown;
  items: unknown;
  amount: string | number | null;
  contact_phone: string | null;
  special_instructions: string | null;
  estimated_pickup_time: string | null;
  estimated_delivery_time: string | null;
  distance: number | string | null;
  created_at: string;
}

export interface ShopBookingRow {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  pickup_location: string | null;
  items: unknown;
  status: string;
  payment_method: string | null;
  amount: string | number | null;
  contact_phone: string | null;
  special_instructions: string | null;
  estimated_pickup_time: string | null;
  estimated_delivery_time: string | null;
  actual_pickup_time: string | null;
  actual_delivery_time: string | null;
  cleaning_started_at: string | null;
  cleaning_completed_at: string | null;
  created_at: string;
}

// New types for shop order management (cleaning services)
export interface CleaningItem {
  id: string;
  name: string;
  type: 'clothing' | 'shoes' | 'accessories' | 'furniture' | 'other';
  condition: 'good' | 'fair' | 'poor' | 'damaged';
  cleaningMethod: 'dry_clean' | 'wash' | 'hand_wash' | 'specialty';
  photos?: string[];
  notes?: string;
}

export interface ShopOrder {
  id: string;
  bookingId: string;
  shopId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCoordinates: { lat: number; lng: number };
  items: CleaningItem[];
  status: 'pending' | 'received' | 'in_progress' | 'completed' | 'ready_for_pickup';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  estimatedCompletion: Date;
  actualCompletion?: Date;
  specialInstructions?: string;
  driverId?: string;
  driverName?: string;
  shopNotes?: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShopInventory {
  id: string;
  shopId: string;
  name: string;
  category: 'detergent' | 'equipment' | 'supplies' | 'tools';
  quantity: number;
  minQuantity: number;
  unit: string;
  supplier: string;
  lastRestocked: Date;
  createdAt: Date;
  updatedAt: Date;
}

// New types for driver job management
export interface DeliveryItem {
  id: string;
  name: string;
  type: 'clothing' | 'shoes' | 'accessories' | 'furniture' | 'other';
  condition: 'good' | 'fair' | 'poor' | 'damaged';
  photos?: string[];
  notes?: string;
}

export interface DriverJob {
  id: string;
  bookingId: string;
  driverId: string;
  shopId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCoordinates: { lat: number; lng: number };
  shopName: string;
  shopAddress: string;
  shopCoordinates: { lat: number; lng: number };
  pickupLocation: { lat: number; lng: number };
  deliveryLocation: { lat: number; lng: number };
  items: DeliveryItem[];
  status: 'assigned' | 'accepted' | 'en_route_pickup' | 'arrived_pickup' | 'items_collected' | 'en_route_shop' | 'arrived_shop' | 'items_dropped' | 'waiting_cleaning' | 'items_ready' | 'en_route_delivery' | 'arrived_delivery' | 'delivered' | 'completed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  estimatedPickupTime: Date;
  estimatedDeliveryTime: Date;
  estimatedDuration: number;
  actualPickupTime?: Date;
  actualDeliveryTime?: Date;
  specialInstructions?: string;
  paymentMethod: 'card' | 'cash' | 'mobile';
  totalAmount: number;
  driverEarnings: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DriverLocation {
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  timestamp: Date;
}

export interface DriverStats {
  totalJobs: number;
  completedJobs: number;
  totalEarnings: number;
  averageRating: number;
  totalDistance: number;
  averageJobTime: number;
  currentStreak: number;
}

export interface RouteOptimization {
  jobIds: string[];
  optimizedOrder: string[];
  totalDistance: number;
  estimatedDuration: number;
  waypoints: Array<{
    lat: number;
    lng: number;
    type: 'pickup' | 'delivery';
  }>;
}