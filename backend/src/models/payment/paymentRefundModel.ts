// Simple Payment Refund Model - Data Transfer Objects only
// This file contains simple data models without business logic

export interface CreatePaymentRefundRequest {
  transactionId: string;
  stripeRefundId: string;
  amount: number;
  reason?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface UpdatePaymentRefundRequest {
  status?: 'pending' | 'succeeded' | 'failed' | 'canceled';
  metadata?: Record<string, any>;
}

export interface PaymentRefundProfile {
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

export interface PaymentRefundSearchFilters {
  transactionId?: string;
  status?: 'pending' | 'succeeded' | 'failed' | 'canceled';
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

export interface PaymentRefundStats {
  totalRefunds: number;
  successfulRefunds: number;
  failedRefunds: number;
  totalRefundAmount: number;
}
