import { useState, useCallback } from 'react';
import { paymentService, PaymentResult, PaymentIntent } from '../services';

export interface UsePaymentState {
  isProcessing: boolean;
  isInitialized: boolean;
  error: string | null;
  clientSecret: string | null;
  paymentIntentId: string | null;
  stripeElements: any;
  lastPaymentResult: PaymentIntent | null;
}

export interface UsePaymentActions {
  // Initialization
  initializeStripe: () => Promise<boolean>;
  
  // Payment Intent
  createPaymentIntent: (amount: number, currency: string, metadata?: Record<string, any>) => Promise<PaymentIntent | null>;
  
  // Payment Processing
  confirmPayment: () => Promise<PaymentResult | null>;
  
  // Stripe Elements
  createElements: () => Promise<any>;
  
  // Utility
  calculateTotal: (amount: number) => number;
  formatAmount: (amount: number) => string;
  
  // Reset
  resetPayment: () => void;
  clearError: () => void;
}

const initialState: UsePaymentState = {
  isProcessing: false,
  isInitialized: false,
  error: null,
  clientSecret: null,
  paymentIntentId: null,
  stripeElements: null,
  lastPaymentResult: null,
};

export const usePayment = (): UsePaymentState & UsePaymentActions => {
  const [state, setState] = useState<UsePaymentState>(initialState);

  // Initialization
  const initializeStripe = useCallback(async (): Promise<boolean> => {
    try {
      await paymentService.initialize();
      setState(prev => ({ ...prev, isInitialized: true, error: null }));
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to initialize Stripe',
        isInitialized: false
      }));
      return false;
    }
  }, []);

  // Payment Intent
  const createPaymentIntent = useCallback(async (amount: number, currency: string, metadata?: Record<string, any>): Promise<PaymentIntent | null> => {
    setState(prev => ({ ...prev, isProcessing: true, error: null }));
    
    try {
      const response = await paymentService.createPaymentIntent(amount, currency, metadata);
      
      setState(prev => ({
        ...prev,
        clientSecret: response.clientSecret || null,
        paymentIntentId: response.id || null,
        lastPaymentResult: response,
        isProcessing: false
      }));
      
      return response;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create payment intent',
        isProcessing: false
      }));
      return null;
    }
  }, []);

  // Payment Processing
  const confirmPayment = useCallback(async (): Promise<PaymentResult | null> => {
    if (!state.clientSecret) {
      setState(prev => ({ ...prev, error: 'No payment intent found' }));
      return null;
    }

    setState(prev => ({ ...prev, isProcessing: true, error: null }));
    
    try {
      // For now, simulate payment confirmation by creating a mock PaymentIntent
      const response: PaymentIntent = {
        id: state.paymentIntentId || 'pi_mock',
        amount: 0,
        currency: 'ZAR',
        status: 'succeeded'
      };
      
      setState(prev => ({
        ...prev,
        lastPaymentResult: response,
        isProcessing: false
      }));
      
      return { success: true, paymentIntentId: response.id } as PaymentResult;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to confirm payment',
        isProcessing: false
      }));
      return null;
    }
  }, [state.clientSecret]);

  // Stripe Elements
  const createElements = useCallback(async (): Promise<any> => {
    try {
      // Stripe elements would be created here in a real implementation
      const elements = null;
      setState(prev => ({ ...prev, stripeElements: elements, error: null }));
      return elements;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create payment elements'
      }));
      return null;
    }
  }, []);

  // Utility functions
  const calculateTotal = useCallback((amount: number): number => {
    return paymentService.calculateProcessingFee(amount);
  }, []);

  const formatAmount = useCallback((amount: number): string => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(amount);
  }, []);

  // Reset
  const resetPayment = useCallback(() => {
    setState(initialState);
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    initializeStripe,
    createPaymentIntent,
    confirmPayment,
    createElements,
    calculateTotal,
    formatAmount,
    resetPayment,
    clearError,
  };
};

// Hook for payment status tracking
export interface UsePaymentStatusState {
  status: 'idle' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  transactionId: string | null;
  amount: number | null;
  currency: string;
  lastUpdated: Date | null;
}

export const usePaymentStatus = (initialTransactionId?: string) => {
  const [state, setState] = useState<UsePaymentStatusState>({
    status: 'idle',
    transactionId: initialTransactionId || null,
    amount: null,
    currency: 'ZAR',
    lastUpdated: null,
  });

  const updateStatus = useCallback((
    status: UsePaymentStatusState['status'],
    transactionId?: string,
    amount?: number
  ) => {
    setState(prev => ({
      ...prev,
      status,
      transactionId: transactionId || prev.transactionId,
      amount: amount ?? prev.amount,
      lastUpdated: new Date(),
    }));
  }, []);

  const resetStatus = useCallback(() => {
    setState({
      status: 'idle',
      transactionId: null,
      amount: null,
      currency: 'ZAR',
      lastUpdated: null,
    });
  }, []);

  return {
    ...state,
    updateStatus,
    resetStatus,
  };
};
