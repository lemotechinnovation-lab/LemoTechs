// Payment Service for LemoTech
// This service provides integration with multiple payment providers
// including Stripe, PayPal, and local South African payment methods

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'digital_wallet' | 'mobile_money';
  provider: 'stripe' | 'paypal' | 'yoco' | 'payfast' | 'ozow' | 'snapscan';
  displayName: string;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  metadata?: Record<string, any>;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  clientSecret?: string;
  paymentMethodId?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: {
    code: string;
    message: string;
    type: 'card_error' | 'validation_error' | 'api_error';
  };
  requiresAction?: boolean;
  actionUrl?: string;
}

export interface BillingDetails {
  name: string;
  email: string;
  phone?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface CreatePaymentMethodData {
  type: 'card' | 'bank_account' | 'digital_wallet';
  card?: {
    number: string;
    expMonth: number;
    expYear: number;
    cvc: string;
  };
  bankAccount?: {
    accountNumber: string;
    routingNumber: string;
    accountType: 'checking' | 'savings';
  };
  billingDetails: BillingDetails;
}

class PaymentService {
  private static instance: PaymentService;
  private stripe: any = null;
  private stripePromise: Promise<any> | null = null;

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  // Initialize payment providers
  public async initialize(): Promise<void> {
    await this.initializeStripe();
    // Add other payment provider initializations here
  }

  private async initializeStripe(): Promise<void> {
    if (typeof window !== 'undefined') {
      // Load Stripe.js dynamically
      if (!this.stripePromise) {
        this.stripePromise = this.loadStripe();
      }
      this.stripe = await this.stripePromise;
    }
  }

  private async loadStripe(): Promise<any> {
    // In production, use your actual Stripe publishable key
    const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_key';
    
    // Dynamically import Stripe
    const { loadStripe } = await import('@stripe/stripe-js');
    return loadStripe(stripePublishableKey);
  }

  // Create payment intent
  public async createPaymentIntent(
    amount: number,
    currency: string = 'ZAR',
    metadata?: Record<string, any>
  ): Promise<PaymentIntent> {
    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('lemotech_token')}`
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency.toLowerCase(),
          metadata
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      return {
        id: data.id,
        amount: data.amount / 100, // Convert back from cents
        currency: data.currency.toUpperCase(),
        status: data.status,
        clientSecret: data.client_secret,
        metadata: data.metadata
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  // Process payment with Stripe
  public async processStripePayment(
    paymentIntent: PaymentIntent,
    paymentMethodId: string
  ): Promise<PaymentResult> {
    try {
      if (!this.stripe) {
        await this.initializeStripe();
      }

      const result = await this.stripe.confirmCardPayment(paymentIntent.clientSecret, {
        payment_method: paymentMethodId
      });

      if (result.error) {
        return {
          success: false,
          error: {
            code: result.error.code,
            message: result.error.message,
            type: result.error.type
          }
        };
      }

      return {
        success: true,
        paymentIntentId: result.paymentIntent.id
      };
    } catch (error) {
      console.error('Error processing Stripe payment:', error);
      return {
        success: false,
        error: {
          code: 'unknown_error',
          message: 'An unexpected error occurred',
          type: 'api_error'
        }
      };
    }
  }

  // Create payment method
  public async createPaymentMethod(data: CreatePaymentMethodData): Promise<PaymentMethod | null> {
    try {
      if (!this.stripe) {
        await this.initializeStripe();
      }

      let stripePaymentMethod;

      if (data.type === 'card' && data.card) {
        const result = await this.stripe.createPaymentMethod({
          type: 'card',
          card: {
            number: data.card.number,
            exp_month: data.card.expMonth,
            exp_year: data.card.expYear,
            cvc: data.card.cvc,
          },
          billing_details: {
            name: data.billingDetails.name,
            email: data.billingDetails.email,
            phone: data.billingDetails.phone,
            address: data.billingDetails.address
          }
        });

        if (result.error) {
          throw new Error(result.error.message);
        }

        stripePaymentMethod = result.paymentMethod;
      }

      // Save payment method to backend
      const response = await fetch('/api/payments/methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('lemotech_token')}`
        },
        body: JSON.stringify({
          stripePaymentMethodId: stripePaymentMethod?.id,
          type: data.type,
          billingDetails: data.billingDetails
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save payment method');
      }

      const savedMethod = await response.json();
      
      return {
        id: savedMethod.id,
        type: data.type,
        provider: 'stripe',
        displayName: this.getPaymentMethodDisplayName(stripePaymentMethod),
        last4: stripePaymentMethod?.card?.last4,
        brand: stripePaymentMethod?.card?.brand,
        expiryMonth: stripePaymentMethod?.card?.exp_month,
        expiryYear: stripePaymentMethod?.card?.exp_year,
        isDefault: savedMethod.isDefault,
        metadata: savedMethod.metadata
      };
    } catch (error) {
      console.error('Error creating payment method:', error);
      return null;
    }
  }

  // Get saved payment methods
  public async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await fetch('/api/payments/methods', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('lemotech_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }

      const data = await response.json();
      return data.paymentMethods || [];
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
  }

  // Delete payment method
  public async deletePaymentMethod(paymentMethodId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/payments/methods/${paymentMethodId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('lemotech_token')}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting payment method:', error);
      return false;
    }
  }

  // Set default payment method
  public async setDefaultPaymentMethod(paymentMethodId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/payments/methods/${paymentMethodId}/default`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('lemotech_token')}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error setting default payment method:', error);
      return false;
    }
  }

  // Process PayFast payment (South African payment gateway)
  public async processPayFastPayment(
    amount: number,
    orderId: string,
    customerInfo: {
      name: string;
      email: string;
      phone?: string;
    }
  ): Promise<PaymentResult> {
    try {
      const response = await fetch('/api/payments/payfast/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('lemotech_token')}`
        },
        body: JSON.stringify({
          amount,
          orderId,
          customerInfo
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create PayFast payment');
      }

      const data = await response.json();
      
      return {
        success: true,
        requiresAction: true,
        actionUrl: data.paymentUrl
      };
    } catch (error) {
      console.error('Error processing PayFast payment:', error);
      return {
        success: false,
        error: {
          code: 'payfast_error',
          message: 'Failed to process PayFast payment',
          type: 'api_error'
        }
      };
    }
  }

  // Process Yoco payment (South African card processor)
  public async processYocoPayment(
    amount: number,
    token: string,
    metadata?: Record<string, any>
  ): Promise<PaymentResult> {
    try {
      const response = await fetch('/api/payments/yoco/charge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('lemotech_token')}`
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          token,
          metadata
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process Yoco payment');
      }

      const data = await response.json();
      
      return {
        success: data.status === 'successful',
        paymentIntentId: data.id,
        error: data.status !== 'successful' ? {
          code: data.failureReason || 'unknown_error',
          message: data.displayMessage || 'Payment failed',
          type: 'card_error'
        } : undefined
      };
    } catch (error) {
      console.error('Error processing Yoco payment:', error);
      return {
        success: false,
        error: {
          code: 'yoco_error',
          message: 'Failed to process Yoco payment',
          type: 'api_error'
        }
      };
    }
  }

  // Process SnapScan payment (South African QR code payment)
  public async processSnapScanPayment(
    amount: number,
    orderId: string,
    metadata?: Record<string, any>
  ): Promise<PaymentResult> {
    try {
      const response = await fetch('/api/payments/snapscan/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('lemotech_token')}`
        },
        body: JSON.stringify({
          amount,
          orderId,
          metadata
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create SnapScan payment');
      }

      const data = await response.json();
      
      return {
        success: true,
        requiresAction: true,
        actionUrl: data.qrCodeUrl,
        paymentIntentId: data.paymentId
      };
    } catch (error) {
      console.error('Error processing SnapScan payment:', error);
      return {
        success: false,
        error: {
          code: 'snapscan_error',
          message: 'Failed to process SnapScan payment',
          type: 'api_error'
        }
      };
    }
  }

  // Get payment status
  public async getPaymentStatus(paymentIntentId: string): Promise<PaymentIntent | null> {
    try {
      const response = await fetch(`/api/payments/${paymentIntentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('lemotech_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment status');
      }

      const data = await response.json();
      return {
        id: data.id,
        amount: data.amount / 100,
        currency: data.currency.toUpperCase(),
        status: data.status,
        metadata: data.metadata
      };
    } catch (error) {
      console.error('Error fetching payment status:', error);
      return null;
    }
  }

  // Refund payment
  public async refundPayment(
    paymentIntentId: string,
    amount?: number,
    reason?: string
  ): Promise<boolean> {
    try {
      const response = await fetch(`/api/payments/${paymentIntentId}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('lemotech_token')}`
        },
        body: JSON.stringify({
          amount: amount ? Math.round(amount * 100) : undefined,
          reason
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Error processing refund:', error);
      return false;
    }
  }

  // Helper methods
  private getPaymentMethodDisplayName(paymentMethod: any): string {
    if (paymentMethod?.card) {
      const brand = paymentMethod.card.brand?.charAt(0).toUpperCase() + paymentMethod.card.brand?.slice(1);
      return `${brand} •••• ${paymentMethod.card.last4}`;
    }
    return 'Payment Method';
  }

  // Validate card number using Luhn algorithm
  public validateCardNumber(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\s+/g, '');
    
    if (!/^\d+$/.test(cleaned)) {
      return false;
    }

    let sum = 0;
    let shouldDouble = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }

  // Get card type from number
  public getCardType(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s+/g, '');
    
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/,
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(cleaned)) {
        return type;
      }
    }

    return 'unknown';
  }

  // Format card number for display
  public formatCardNumber(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s+/g, '');
    const groups = cleaned.match(/.{1,4}/g) || [];
    return groups.join(' ');
  }

  // Calculate processing fee (example: 2.9% + R2.90)
  public calculateProcessingFee(amount: number, provider: string = 'stripe'): number {
    const fees = {
      stripe: { percentage: 0.029, fixed: 2.90 },
      payfast: { percentage: 0.035, fixed: 2.00 },
      yoco: { percentage: 0.029, fixed: 0 },
      snapscan: { percentage: 0.035, fixed: 0 }
    };

    const fee = fees[provider as keyof typeof fees] || fees.stripe;
    return Math.round((amount * fee.percentage + fee.fixed) * 100) / 100;
  }
}

export const paymentService = PaymentService.getInstance();
export default paymentService;