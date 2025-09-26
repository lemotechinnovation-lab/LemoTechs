// Simple Payment Model - Data Transfer Objects only
// This file contains simple data models without business logic

export interface CreatePaymentTransactionRequest {
  userId: string;
  bookingId?: string;
  paymentMethodId?: string;
  stripePaymentIntentId?: string;
  payfastPaymentId?: string;
  amount: number;
  currency: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface UpdatePaymentTransactionRequest {
  status?: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled' | 'refunded';
  stripePaymentIntentId?: string;
  payfastPaymentId?: string;
  metadata?: Record<string, any>;
}

export interface PaymentTransactionProfile {
  id: string;
  userId: string;
  bookingId?: string;
  paymentMethodId?: string;
  stripePaymentIntentId?: string;
  payfastPaymentId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled' | 'refunded';
  description?: string;
  metadata?: Record<string, any>;
}

export interface PaymentStats {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  totalAmount: number;
}

export interface PaymentSearchFilters {
  userId?: string;
  bookingId?: string;
  status?: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled' | 'refunded';
  provider?: 'stripe' | 'paypal' | 'yoco' | 'payfast' | 'ozow' | 'snapscan';
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}