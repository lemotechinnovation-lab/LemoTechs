// Simple Payment Method Model - Data Transfer Objects only
// This file contains simple data models without business logic

export interface CreatePaymentMethodRequest {
  userId: string;
  stripePaymentMethodId?: string;
  type: 'card' | 'bank_account' | 'digital_wallet';
  provider: 'stripe' | 'paypal' | 'yoco' | 'payfast' | 'ozow' | 'snapscan';
  displayName: string;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault?: boolean;
  metadata?: Record<string, any>;
}

export interface UpdatePaymentMethodRequest {
  displayName?: string;
  isDefault?: boolean;
  metadata?: Record<string, any>;
}

export interface PaymentMethodProfile {
  id: string;
  userId: string;
  stripePaymentMethodId?: string;
  type: 'card' | 'bank_account' | 'digital_wallet';
  provider: 'stripe' | 'paypal' | 'yoco' | 'payfast' | 'ozow' | 'snapscan';
  displayName: string;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethodSearchFilters {
  userId?: string;
  type?: 'card' | 'bank_account' | 'digital_wallet';
  provider?: 'stripe' | 'paypal' | 'yoco' | 'payfast' | 'ozow' | 'snapscan';
  isDefault?: boolean;
}
