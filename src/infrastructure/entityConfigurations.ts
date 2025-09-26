// Entity Configurations for LemoTech Domain Models
// This provides code-first configuration for all entities

import { EntityConfiguration, RelationshipConfig } from './advancedLinqQueryBuilder';
import { 
  User, Driver, Shop, Booking, PaymentTransaction, ServiceItem,
  File, PhoneVerification, BookingStep, BookingHistory, InProgressBooking,
  PaymentMethod, CleaningItem
} from './entities/databaseSchema';

// Additional entity interfaces for missing tables
export interface DriverJob {
  id: string;
  driverId: string;
  bookingId: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DriverLocation {
  id: string;
  driverId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: Date;
  createdAt: Date;
}

export interface PaymentRefund {
  id: string;
  transactionId: string;
  stripeRefundId: string;
  amount: number;
  reason?: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShopInventory {
  id: string;
  shopId: string;
  itemName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShopOrder {
  id: string;
  shopId: string;
  bookingId: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: Record<string, any>;
  totalAmount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// User Entity Configuration
export const UserConfiguration: EntityConfiguration<User> = {
  tableName: 'users',
  primaryKey: 'id',
  columns: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    firebaseUid: 'VARCHAR(255) UNIQUE',
    email: 'VARCHAR(255) UNIQUE NOT NULL',
    password: 'VARCHAR(255)',
    name: 'VARCHAR(255) NOT NULL',
    phone: 'VARCHAR(20)',
    address: 'TEXT',
    avatar: 'VARCHAR(500)',
    emailVerified: 'BOOLEAN DEFAULT FALSE',
    phoneVerified: 'BOOLEAN DEFAULT FALSE',
    provider: 'VARCHAR(50) DEFAULT \'email\'',
    role: 'VARCHAR(20) DEFAULT \'user\'',
    loyaltyPoints: 'INTEGER DEFAULT 0',
    totalBookings: 'INTEGER DEFAULT 0',
    memberSince: 'TIMESTAMP DEFAULT NOW()',
    createdAt: 'TIMESTAMP DEFAULT NOW()',
    updatedAt: 'TIMESTAMP DEFAULT NOW()'
  },
  relationships: {
    drivers: {
      type: 'one-to-many',
      targetTable: 'drivers',
      foreignKey: 'user_id',
      localKey: 'id'
    },
    shops: {
      type: 'one-to-many',
      targetTable: 'shops',
      foreignKey: 'user_id',
      localKey: 'id'
    },
    bookings: {
      type: 'one-to-many',
      targetTable: 'bookings',
      foreignKey: 'user_id',
      localKey: 'id'
    },
    paymentTransactions: {
      type: 'one-to-many',
      targetTable: 'payment_transactions',
      foreignKey: 'user_id',
      localKey: 'id'
    }
  }
};

// Driver Entity Configuration
export const DriverConfiguration: EntityConfiguration<Driver> = {
  tableName: 'drivers',
  primaryKey: 'id',
  columns: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    userId: 'UUID REFERENCES users(id) ON DELETE CASCADE',
    vehicle: 'VARCHAR(255) NOT NULL',
    licenseNumber: 'VARCHAR(50) NOT NULL',
    licenseExpiry: 'DATE',
    vehicleRegistration: 'VARCHAR(20)',
    vehicleModel: 'VARCHAR(100)',
    vehicleColor: 'VARCHAR(50)',
    rating: 'DECIMAL(3,2) DEFAULT 0.00',
    totalJobs: 'INTEGER DEFAULT 0',
    totalEarnings: 'DECIMAL(10,2) DEFAULT 0.00',
    isActive: 'BOOLEAN DEFAULT TRUE',
    isVerified: 'BOOLEAN DEFAULT FALSE',
    currentLocation: 'JSONB',
    status: 'VARCHAR(20) DEFAULT \'offline\'',
    lastActive: 'TIMESTAMP',
    createdAt: 'TIMESTAMP DEFAULT NOW()',
    updatedAt: 'TIMESTAMP DEFAULT NOW()'
  },
  relationships: {
    user: {
      type: 'one-to-one',
      targetTable: 'users',
      foreignKey: 'user_id',
      localKey: 'id'
    },
    bookings: {
      type: 'one-to-many',
      targetTable: 'bookings',
      foreignKey: 'driver_id',
      localKey: 'id'
    }
  }
};

// Shop Entity Configuration
export const ShopConfiguration: EntityConfiguration<Shop> = {
  tableName: 'shops',
  primaryKey: 'id',
  columns: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    userId: 'UUID REFERENCES users(id) ON DELETE CASCADE',
    name: 'VARCHAR(255) NOT NULL',
    description: 'TEXT',
    address: 'TEXT NOT NULL',
    coordinates: 'JSONB',
    phone: 'VARCHAR(20)',
    email: 'VARCHAR(255)',
    operatingHours: 'JSONB',
    services: 'JSONB',
    rating: 'DECIMAL(3,2) DEFAULT 0.00',
    totalBookings: 'INTEGER DEFAULT 0',
    totalRevenue: 'DECIMAL(10,2) DEFAULT 0.00',
    isActive: 'BOOLEAN DEFAULT TRUE',
    isVerified: 'BOOLEAN DEFAULT FALSE',
    capacity: 'INTEGER DEFAULT 100',
    currentLoad: 'INTEGER DEFAULT 0',
    createdAt: 'TIMESTAMP DEFAULT NOW()',
    updatedAt: 'TIMESTAMP DEFAULT NOW()'
  },
  relationships: {
    user: {
      type: 'one-to-one',
      targetTable: 'users',
      foreignKey: 'user_id',
      localKey: 'id'
    },
    bookings: {
      type: 'one-to-many',
      targetTable: 'bookings',
      foreignKey: 'shop_id',
      localKey: 'id'
    }
  }
};

// Booking Entity Configuration
export const BookingConfiguration: EntityConfiguration<Booking> = {
  tableName: 'bookings',
  primaryKey: 'id',
  columns: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    userId: 'UUID REFERENCES users(id) ON DELETE CASCADE',
    pickupLocation: 'TEXT NOT NULL',
    pickupCoords: 'JSONB',
    items: 'JSONB NOT NULL',
    driverId: 'UUID REFERENCES drivers(id) ON DELETE SET NULL',
    shopId: 'UUID REFERENCES shops(id) ON DELETE SET NULL',
    status: 'VARCHAR(20) DEFAULT \'pending\'',
    paymentMethod: 'VARCHAR(10) NOT NULL',
    paymentId: 'VARCHAR(255)',
    amount: 'DECIMAL(10,2) NOT NULL',
    contactPhone: 'VARCHAR(20) NOT NULL',
    specialInstructions: 'TEXT',
    estimatedPickupTime: 'TIMESTAMP',
    estimatedDeliveryTime: 'TIMESTAMP',
    actualPickupTime: 'TIMESTAMP',
    actualDeliveryTime: 'TIMESTAMP',
    cleaningStartedAt: 'TIMESTAMP',
    cleaningCompletedAt: 'TIMESTAMP',
    createdAt: 'TIMESTAMP DEFAULT NOW()',
    updatedAt: 'TIMESTAMP DEFAULT NOW()'
  },
  relationships: {
    user: {
      type: 'many-to-one',
      targetTable: 'users',
      foreignKey: 'user_id',
      localKey: 'id'
    },
    driver: {
      type: 'many-to-one',
      targetTable: 'drivers',
      foreignKey: 'driver_id',
      localKey: 'id'
    },
    shop: {
      type: 'many-to-one',
      targetTable: 'shops',
      foreignKey: 'shop_id',
      localKey: 'id'
    },
    paymentTransaction: {
      type: 'one-to-one',
      targetTable: 'payment_transactions',
      foreignKey: 'booking_id',
      localKey: 'id'
    }
  }
};

// Payment Transaction Entity Configuration
export const PaymentTransactionConfiguration: EntityConfiguration<PaymentTransaction> = {
  tableName: 'payment_transactions',
  primaryKey: 'id',
  columns: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    userId: 'UUID REFERENCES users(id) ON DELETE CASCADE',
    bookingId: 'UUID REFERENCES bookings(id) ON DELETE SET NULL',
    paymentMethodId: 'VARCHAR(255)',
    stripePaymentIntentId: 'VARCHAR(255)',
    payfastPaymentId: 'VARCHAR(255)',
    amount: 'INTEGER NOT NULL',
    currency: 'VARCHAR(3) NOT NULL DEFAULT \'ZAR\'',
    status: 'VARCHAR(50) NOT NULL',
    description: 'TEXT',
    metadata: 'JSONB DEFAULT \'{}\'',
    createdAt: 'TIMESTAMP DEFAULT NOW()',
    updatedAt: 'TIMESTAMP DEFAULT NOW()'
  },
  relationships: {
    user: {
      type: 'many-to-one',
      targetTable: 'users',
      foreignKey: 'user_id',
      localKey: 'id'
    },
    booking: {
      type: 'one-to-one',
      targetTable: 'bookings',
      foreignKey: 'booking_id',
      localKey: 'id'
    }
  }
};

// Service Item Entity Configuration
export const ServiceItemConfiguration: EntityConfiguration<ServiceItem> = {
  tableName: 'service_items',
  primaryKey: 'id',
  columns: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    name: 'VARCHAR(255) NOT NULL UNIQUE',
    category: 'VARCHAR(100) NOT NULL',
    basePrice: 'DECIMAL(8,2) NOT NULL',
    description: 'TEXT',
    estimatedTime: 'INTEGER',
    icon: 'VARCHAR(10)',
    isActive: 'BOOLEAN DEFAULT TRUE',
    createdAt: 'TIMESTAMP DEFAULT NOW()',
    updatedAt: 'TIMESTAMP DEFAULT NOW()'
  }
};

// File Entity Configuration
export const FileConfiguration: EntityConfiguration<File> = {
  tableName: 'files',
  primaryKey: 'id',
  columns: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    filename: 'VARCHAR(255) NOT NULL',
    originalName: 'VARCHAR(255) NOT NULL',
    mimetype: 'VARCHAR(100) NOT NULL',
    size: 'INTEGER NOT NULL',
    url: 'VARCHAR(500) NOT NULL',
    userId: 'UUID REFERENCES users(id) ON DELETE CASCADE',
    createdAt: 'TIMESTAMP DEFAULT NOW()'
  },
  relationships: {
    user: {
      type: 'many-to-one',
      targetTable: 'users',
      foreignKey: 'user_id',
      localKey: 'id'
    }
  }
};

// Phone Verification Entity Configuration
export const PhoneVerificationConfiguration: EntityConfiguration<PhoneVerification> = {
  tableName: 'phone_verifications',
  primaryKey: 'id',
  columns: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    phoneNumber: 'VARCHAR(20) NOT NULL UNIQUE',
    verificationCode: 'VARCHAR(10) NOT NULL',
    expiresAt: 'TIMESTAMP NOT NULL',
    createdAt: 'TIMESTAMP DEFAULT NOW()'
  }
};

// Booking Step Entity Configuration
export const BookingStepConfiguration: EntityConfiguration<BookingStep> = {
  tableName: 'booking_steps',
  primaryKey: 'id',
  columns: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    stepName: 'VARCHAR(50) NOT NULL UNIQUE',
    stepOrder: 'INTEGER NOT NULL',
    description: 'TEXT',
    createdAt: 'TIMESTAMP DEFAULT NOW()'
  }
};

// Booking History Entity Configuration
export const BookingHistoryConfiguration: EntityConfiguration<BookingHistory> = {
  tableName: 'booking_history',
  primaryKey: 'id',
  columns: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    bookingId: 'UUID REFERENCES bookings(id) ON DELETE CASCADE',
    stepId: 'UUID REFERENCES booking_steps(id) ON DELETE CASCADE',
    userId: 'UUID REFERENCES users(id) ON DELETE CASCADE',
    stepData: 'JSONB',
    completedAt: 'TIMESTAMP DEFAULT NOW()',
    createdAt: 'TIMESTAMP DEFAULT NOW()'
  },
  relationships: {
    booking: {
      type: 'many-to-one',
      targetTable: 'bookings',
      foreignKey: 'booking_id',
      localKey: 'id'
    },
    step: {
      type: 'many-to-one',
      targetTable: 'booking_steps',
      foreignKey: 'step_id',
      localKey: 'id'
    },
    user: {
      type: 'many-to-one',
      targetTable: 'users',
      foreignKey: 'user_id',
      localKey: 'id'
    }
  }
};

// In Progress Booking Entity Configuration
export const InProgressBookingConfiguration: EntityConfiguration<InProgressBooking> = {
  tableName: 'in_progress_bookings',
  primaryKey: 'id',
  columns: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    userId: 'UUID REFERENCES users(id) ON DELETE CASCADE',
    sessionId: 'VARCHAR(255)',
    currentStep: 'VARCHAR(50) NOT NULL',
    bookingData: 'JSONB NOT NULL',
    expiresAt: 'TIMESTAMP NOT NULL',
    createdAt: 'TIMESTAMP DEFAULT NOW()',
    updatedAt: 'TIMESTAMP DEFAULT NOW()'
  },
  relationships: {
    user: {
      type: 'many-to-one',
      targetTable: 'users',
      foreignKey: 'user_id',
      localKey: 'id'
    }
  }
};

// Payment Method Entity Configuration
export const PaymentMethodConfiguration: EntityConfiguration<PaymentMethod> = {
  tableName: 'payment_methods',
  primaryKey: 'id',
  columns: {
    id: 'VARCHAR(255) PRIMARY KEY',
    userId: 'UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE',
    stripePaymentMethodId: 'VARCHAR(255) NOT NULL',
    type: 'VARCHAR(50) NOT NULL',
    provider: 'VARCHAR(50) NOT NULL DEFAULT \'stripe\'',
    displayName: 'VARCHAR(255) NOT NULL',
    last4: 'VARCHAR(4)',
    brand: 'VARCHAR(50)',
    expiryMonth: 'INTEGER',
    expiryYear: 'INTEGER',
    isDefault: 'BOOLEAN NOT NULL DEFAULT false',
    metadata: 'JSONB DEFAULT \'{}\'',
    createdAt: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
    updatedAt: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()'
  },
  relationships: {
    user: {
      type: 'many-to-one',
      targetTable: 'users',
      foreignKey: 'user_id',
      localKey: 'id'
    }
  }
};

// Driver Job Entity Configuration
export const DriverJobConfiguration: EntityConfiguration<DriverJob> = {
  tableName: 'driver_jobs',
  primaryKey: 'id',
  columns: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    driverId: 'UUID REFERENCES drivers(id) ON DELETE CASCADE',
    bookingId: 'UUID REFERENCES bookings(id) ON DELETE CASCADE',
    status: 'VARCHAR(20) NOT NULL DEFAULT \'assigned\'',
    assignedAt: 'TIMESTAMP DEFAULT NOW()',
    startedAt: 'TIMESTAMP',
    completedAt: 'TIMESTAMP',
    notes: 'TEXT',
    createdAt: 'TIMESTAMP DEFAULT NOW()',
    updatedAt: 'TIMESTAMP DEFAULT NOW()'
  },
  relationships: {
    driver: {
      type: 'many-to-one',
      targetTable: 'drivers',
      foreignKey: 'driver_id',
      localKey: 'id'
    },
    booking: {
      type: 'many-to-one',
      targetTable: 'bookings',
      foreignKey: 'booking_id',
      localKey: 'id'
    }
  }
};

// Driver Location Entity Configuration
export const DriverLocationConfiguration: EntityConfiguration<DriverLocation> = {
  tableName: 'driver_locations',
  primaryKey: 'id',
  columns: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    driverId: 'UUID REFERENCES drivers(id) ON DELETE CASCADE',
    latitude: 'DECIMAL(10,8) NOT NULL',
    longitude: 'DECIMAL(11,8) NOT NULL',
    accuracy: 'DECIMAL(8,2)',
    timestamp: 'TIMESTAMP DEFAULT NOW()',
    createdAt: 'TIMESTAMP DEFAULT NOW()'
  },
  relationships: {
    driver: {
      type: 'many-to-one',
      targetTable: 'drivers',
      foreignKey: 'driver_id',
      localKey: 'id'
    }
  }
};

// Payment Refund Entity Configuration
export const PaymentRefundConfiguration: EntityConfiguration<PaymentRefund> = {
  tableName: 'payment_refunds',
  primaryKey: 'id',
  columns: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    transactionId: 'UUID NOT NULL REFERENCES payment_transactions(id) ON DELETE CASCADE',
    stripeRefundId: 'VARCHAR(255) NOT NULL',
    amount: 'INTEGER NOT NULL',
    reason: 'VARCHAR(50)',
    status: 'VARCHAR(50) NOT NULL',
    description: 'TEXT',
    metadata: 'JSONB DEFAULT \'{}\'',
    createdAt: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
    updatedAt: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()'
  },
  relationships: {
    transaction: {
      type: 'many-to-one',
      targetTable: 'payment_transactions',
      foreignKey: 'transaction_id',
      localKey: 'id'
    }
  }
};

// Shop Inventory Entity Configuration
export const ShopInventoryConfiguration: EntityConfiguration<ShopInventory> = {
  tableName: 'shop_inventory',
  primaryKey: 'id',
  columns: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    shopId: 'UUID REFERENCES shops(id) ON DELETE CASCADE',
    itemName: 'VARCHAR(255) NOT NULL',
    category: 'VARCHAR(100) NOT NULL',
    quantity: 'INTEGER NOT NULL DEFAULT 0',
    unitPrice: 'DECIMAL(8,2) NOT NULL',
    description: 'TEXT',
    isActive: 'BOOLEAN DEFAULT TRUE',
    createdAt: 'TIMESTAMP DEFAULT NOW()',
    updatedAt: 'TIMESTAMP DEFAULT NOW()'
  },
  relationships: {
    shop: {
      type: 'many-to-one',
      targetTable: 'shops',
      foreignKey: 'shop_id',
      localKey: 'id'
    }
  }
};

// Shop Order Entity Configuration
export const ShopOrderConfiguration: EntityConfiguration<ShopOrder> = {
  tableName: 'shop_orders',
  primaryKey: 'id',
  columns: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    shopId: 'UUID REFERENCES shops(id) ON DELETE CASCADE',
    bookingId: 'UUID REFERENCES bookings(id) ON DELETE CASCADE',
    status: 'VARCHAR(20) NOT NULL DEFAULT \'pending\'',
    items: 'JSONB NOT NULL',
    totalAmount: 'DECIMAL(10,2) NOT NULL',
    notes: 'TEXT',
    createdAt: 'TIMESTAMP DEFAULT NOW()',
    updatedAt: 'TIMESTAMP DEFAULT NOW()'
  },
  relationships: {
    shop: {
      type: 'many-to-one',
      targetTable: 'shops',
      foreignKey: 'shop_id',
      localKey: 'id'
    },
    booking: {
      type: 'many-to-one',
      targetTable: 'bookings',
      foreignKey: 'booking_id',
      localKey: 'id'
    }
  }
};

// Cleaning Item Entity Configuration
export const CleaningItemConfiguration: EntityConfiguration<CleaningItem> = {
  tableName: 'cleaning_items',
  primaryKey: 'id',
  columns: {
    id: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
    bookingId: 'UUID REFERENCES bookings(id) ON DELETE CASCADE',
    name: 'VARCHAR(255) NOT NULL',
    type: 'VARCHAR(50) NOT NULL',
    condition: 'VARCHAR(50) NOT NULL',
    cleaningMethod: 'VARCHAR(50) NOT NULL',
    photos: 'JSONB DEFAULT \'[]\'',
    notes: 'TEXT',
    estimatedTime: 'INTEGER NOT NULL',
    actualTime: 'INTEGER',
    status: 'VARCHAR(50) DEFAULT \'received\'',
    createdAt: 'TIMESTAMP DEFAULT NOW()',
    updatedAt: 'TIMESTAMP DEFAULT NOW()'
  },
  relationships: {
    booking: {
      type: 'many-to-one',
      targetTable: 'bookings',
      foreignKey: 'booking_id',
      localKey: 'id'
    }
  }
};

// Entity Mappers
export const userMapper = (row: any): User => ({
  id: row.id,
  firebaseUid: row.firebase_uid,
  email: row.email,
  password: row.password,
  name: row.name,
  phone: row.phone,
  address: row.address,
  avatar: row.avatar,
  emailVerified: row.email_verified,
  phoneVerified: row.phone_verified,
  provider: row.provider,
  role: row.role,
  loyaltyPoints: row.loyalty_points,
  totalBookings: row.total_bookings,
  isActive: row.is_active !== undefined ? row.is_active : true,
  memberSince: row.member_since,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const driverMapper = (row: any): Driver => ({
  id: row.id,
  userId: row.user_id,
  vehicle: row.vehicle,
  licenseNumber: row.license_number,
  licenseExpiry: row.license_expiry,
  vehicleRegistration: row.vehicle_registration,
  vehicleModel: row.vehicle_model,
  vehicleColor: row.vehicle_color,
  rating: row.rating,
  totalJobs: row.total_jobs,
  totalEarnings: row.total_earnings,
  isActive: row.is_active,
  isVerified: row.is_verified,
  currentLocation: row.current_location,
  status: row.status,
  lastActive: row.last_active,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const shopMapper = (row: any): Shop => ({
  id: row.id,
  userId: row.user_id,
  name: row.name,
  description: row.description,
  address: row.address,
  coordinates: row.coordinates,
  phone: row.phone,
  email: row.email,
  operatingHours: row.operating_hours,
  services: row.services,
  rating: row.rating,
  totalBookings: row.total_bookings,
  totalRevenue: row.total_revenue,
  isActive: row.is_active,
  isVerified: row.is_verified,
  capacity: row.capacity,
  currentLoad: row.current_load,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const bookingMapper = (row: any): Booking => ({
  id: row.id,
  userId: row.user_id,
  pickupLocation: row.pickup_location,
  pickupCoords: row.pickup_coords,
  items: row.items,
  driverId: row.driver_id,
  shopId: row.shop_id,
  status: row.status,
  paymentMethod: row.payment_method,
  paymentId: row.payment_id,
  amount: row.amount,
  contactPhone: row.contact_phone,
  specialInstructions: row.special_instructions,
  estimatedPickupTime: row.estimated_pickup_time,
  estimatedDeliveryTime: row.estimated_delivery_time,
  actualPickupTime: row.actual_pickup_time,
  actualDeliveryTime: row.actual_delivery_time,
  cleaningStartedAt: row.cleaning_started_at,
  cleaningCompletedAt: row.cleaning_completed_at,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const paymentTransactionMapper = (row: any): PaymentTransaction => ({
  id: row.id,
  userId: row.user_id || row.userId,
  bookingId: row.booking_id || row.bookingId,
  paymentMethodId: row.payment_method_id || row.paymentMethodId,
  stripePaymentIntentId: row.stripe_payment_intent_id || row.stripePaymentIntentId,
  payfastPaymentId: row.payfast_payment_id || row.payfastPaymentId,
  amount: row.amount,
  currency: row.currency,
  status: row.status,
  description: row.description,
  metadata: row.metadata,
  createdAt: row.created_at || row.createdAt,
  updatedAt: row.updated_at || row.updatedAt
});

export const serviceItemMapper = (row: any): ServiceItem => ({
  id: row.id,
  name: row.name,
  category: row.category,
  basePrice: row.base_price,
  description: row.description,
  estimatedTime: row.estimated_time,
  icon: row.icon,
  isActive: row.is_active,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const fileMapper = (row: any): File => ({
  id: row.id,
  filename: row.filename,
  originalName: row.original_name,
  mimetype: row.mimetype,
  size: row.size,
  url: row.url,
  userId: row.user_id,
  createdAt: row.created_at,
  updatedAt: row.created_at // Files don't have updated_at, use created_at
});

export const phoneVerificationMapper = (row: any): PhoneVerification => ({
  id: row.id,
  phoneNumber: row.phone_number,
  verificationCode: row.verification_code,
  expiresAt: row.expires_at,
  createdAt: row.created_at,
  updatedAt: row.created_at // Phone verifications don't have updated_at, use created_at
});

export const bookingStepMapper = (row: any): BookingStep => ({
  id: row.id,
  stepName: row.step_name,
  stepOrder: row.step_order,
  description: row.description,
  createdAt: row.created_at,
  updatedAt: row.created_at // Booking steps don't have updated_at, use created_at
});

export const bookingHistoryMapper = (row: any): BookingHistory => ({
  id: row.id,
  bookingId: row.booking_id,
  stepId: row.step_id,
  userId: row.user_id,
  stepData: row.step_data,
  completedAt: row.completed_at,
  createdAt: row.created_at,
  updatedAt: row.created_at // Booking history doesn't have updated_at, use created_at
});

export const inProgressBookingMapper = (row: any): InProgressBooking => ({
  id: row.id,
  userId: row.user_id,
  sessionId: row.session_id,
  currentStep: row.current_step,
  bookingData: row.booking_data,
  expiresAt: row.expires_at,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const paymentMethodMapper = (row: any): PaymentMethod => ({
  id: row.id,
  userId: row.user_id,
  stripePaymentMethodId: row.stripe_payment_method_id,
  type: row.type,
  provider: row.provider,
  displayName: row.display_name,
  last4: row.last4,
  brand: row.brand,
  expiryMonth: row.expiry_month,
  expiryYear: row.expiry_year,
  isDefault: row.is_default,
  metadata: row.metadata,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const driverJobMapper = (row: any): DriverJob => ({
  id: row.id,
  driverId: row.driver_id,
  bookingId: row.booking_id,
  status: row.status,
  assignedAt: row.assigned_at,
  startedAt: row.started_at,
  completedAt: row.completed_at,
  notes: row.notes,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const driverLocationMapper = (row: any): DriverLocation => ({
  id: row.id,
  driverId: row.driver_id,
  latitude: row.latitude,
  longitude: row.longitude,
  accuracy: row.accuracy,
  timestamp: row.timestamp,
  createdAt: row.created_at
});

export const paymentRefundMapper = (row: any): PaymentRefund => ({
  id: row.id,
  transactionId: row.transaction_id,
  stripeRefundId: row.stripe_refund_id,
  amount: row.amount,
  reason: row.reason,
  status: row.status,
  description: row.description,
  metadata: row.metadata,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const shopInventoryMapper = (row: any): ShopInventory => ({
  id: row.id,
  shopId: row.shop_id,
  itemName: row.item_name,
  category: row.category,
  quantity: row.quantity,
  unitPrice: row.unit_price,
  description: row.description,
  isActive: row.is_active,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const shopOrderMapper = (row: any): ShopOrder => ({
  id: row.id,
  shopId: row.shop_id,
  bookingId: row.booking_id,
  status: row.status,
  items: row.items,
  totalAmount: row.total_amount,
  notes: row.notes,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const cleaningItemMapper = (row: any): CleaningItem => ({
  id: row.id,
  bookingId: row.booking_id,
  name: row.name,
  type: row.type,
  condition: row.condition,
  cleaningMethod: row.cleaning_method,
  photos: row.photos,
  notes: row.notes,
  estimatedTime: row.estimated_time,
  actualTime: row.actual_time,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

// Export all configurations
export const EntityConfigurations = {
  User: UserConfiguration,
  Driver: DriverConfiguration,
  Shop: ShopConfiguration,
  Booking: BookingConfiguration,
  PaymentTransaction: PaymentTransactionConfiguration,
  ServiceItem: ServiceItemConfiguration,
  File: FileConfiguration,
  PhoneVerification: PhoneVerificationConfiguration,
  BookingStep: BookingStepConfiguration,
  BookingHistory: BookingHistoryConfiguration,
  InProgressBooking: InProgressBookingConfiguration,
  PaymentMethod: PaymentMethodConfiguration,
  DriverJob: DriverJobConfiguration,
  DriverLocation: DriverLocationConfiguration,
  PaymentRefund: PaymentRefundConfiguration,
  ShopInventory: ShopInventoryConfiguration,
  ShopOrder: ShopOrderConfiguration,
  CleaningItem: CleaningItemConfiguration
};

// Export all mappers
// Shop Queue Configuration
export const ShopQueueConfiguration = {
  tableName: 'shop_queue',
  primaryKey: 'id',
  columns: {
    id: 'id',
    shopId: 'shop_id',
    bookingId: 'booking_id',
    cleaningItemId: 'cleaning_item_id',
    priority: 'priority',
    status: 'status',
    estimatedDuration: 'estimated_duration',
    actualDuration: 'actual_duration',
    assignedTo: 'assigned_to',
    queuedAt: 'queued_at',
    startedAt: 'started_at',
    completedAt: 'completed_at',
    notes: 'notes',
    specialInstructions: 'special_instructions',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
};

export const shopQueueMapper = (row: any): any => ({
  id: row.id,
  shopId: row.shop_id,
  bookingId: row.booking_id,
  cleaningItemId: row.cleaning_item_id,
  priority: row.priority,
  status: row.status,
  estimatedDuration: row.estimated_duration,
  actualDuration: row.actual_duration,
  assignedTo: row.assigned_to,
  queuedAt: row.queued_at,
  startedAt: row.started_at,
  completedAt: row.completed_at,
  notes: row.notes,
  specialInstructions: row.special_instructions,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

// Shop Inventory Tracking Configuration
export const ShopInventoryTrackingConfiguration = {
  tableName: 'shop_inventory_tracking',
  primaryKey: 'id',
  columns: {
    id: 'id',
    shopId: 'shop_id',
    itemName: 'item_name',
    category: 'category',
    subcategory: 'subcategory',
    sku: 'sku',
    barcode: 'barcode',
    quantity: 'quantity',
    minQuantity: 'min_quantity',
    maxQuantity: 'max_quantity',
    unitPrice: 'unit_price',
    costPrice: 'cost_price',
    description: 'description',
    specifications: 'specifications',
    supplier: 'supplier',
    supplierContact: 'supplier_contact',
    lastRestocked: 'last_restocked',
    expiryDate: 'expiry_date',
    isActive: 'is_active',
    isTrackable: 'is_trackable',
    location: 'location',
    condition: 'condition',
    notes: 'notes',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
};

export const shopInventoryTrackingMapper = (row: any): any => ({
  id: row.id,
  shopId: row.shop_id,
  itemName: row.item_name,
  category: row.category,
  subcategory: row.subcategory,
  sku: row.sku,
  barcode: row.barcode,
  quantity: row.quantity,
  minQuantity: row.min_quantity,
  maxQuantity: row.max_quantity,
  unitPrice: row.unit_price,
  costPrice: row.cost_price,
  description: row.description,
  specifications: row.specifications ? JSON.parse(row.specifications) : undefined,
  supplier: row.supplier,
  supplierContact: row.supplier_contact,
  lastRestocked: row.last_restocked,
  expiryDate: row.expiry_date,
  isActive: row.is_active,
  isTrackable: row.is_trackable,
  location: row.location,
  condition: row.condition,
  notes: row.notes,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const EntityMappers = {
  user: userMapper,
  driver: driverMapper,
  shop: shopMapper,
  booking: bookingMapper,
  paymentTransaction: paymentTransactionMapper,
  serviceItem: serviceItemMapper,
  file: fileMapper,
  phoneVerification: phoneVerificationMapper,
  bookingStep: bookingStepMapper,
  bookingHistory: bookingHistoryMapper,
  inProgressBooking: inProgressBookingMapper,
  paymentMethod: paymentMethodMapper,
  driverJob: driverJobMapper,
  driverLocation: driverLocationMapper,
  paymentRefund: paymentRefundMapper,
  shopInventory: shopInventoryMapper,
  shopOrder: shopOrderMapper,
  cleaningItem: cleaningItemMapper,
  shopQueue: shopQueueMapper,
  shopInventoryTracking: shopInventoryTrackingMapper
};
