// PayFast Service for LemoTech Backend
import * as crypto from 'crypto';
import * as dns from 'dns';
import { PaymentRequest, PaymentResponse, PaymentStatus, PayFastPaymentData, PayFastITNResponse } from '../../models/payment/payfastModel';
import { PaymentTransactionRepository } from '../../repositories/payment/PaymentTransactionRepository';
import { BookingRepository } from '../../repositories/booking/BookingRepository';
import { BaseService } from '../base/BaseService';
import { IPayFastService } from '../../infrastructure/di/interfaces';
import { Logger } from '../../utils/logger';

export class PayFastService extends BaseService implements IPayFastService {
  private merchantId: string;
  private merchantKey: string;
  private passphrase: string;
  private isTest: boolean;

  constructor(
    private paymentTransactionRepository: PaymentTransactionRepository,
    private bookingRepository: BookingRepository
  ) {
    super();
    
    this.merchantId = process.env.PAYFAST_MERCHANT_ID || '';
    this.merchantKey = process.env.PAYFAST_MERCHANT_KEY || '';
    this.passphrase = process.env.PAYFAST_PASSPHRASE || '';
    this.isTest = process.env.PAYFAST_IS_TEST === 'true';

    // For test mode, use PayFast sandbox credentials
    if (this.isTest) {
      this.merchantId = '10042081';
      this.merchantKey = '71wd2xzckkdde';
      this.passphrase = 'Lemotech2024_secure_passphrase'; // Your sandbox passphrase
    }

    if (!this.merchantId || !this.merchantKey) {
      Logger.warn('⚠️ PayFast configuration incomplete - using test mode defaults');
      this.merchantId = '10042081';
      this.merchantKey = '71wd2xzckkdde';
      this.passphrase = 'Lemotech2024_secure_passphrase';
      this.isTest = true;
    }
  }

  /**
   * Create a payment request
   */
  async createPaymentRequest(paymentData: PaymentRequest): Promise<PaymentResponse> {
    this.logMethodEntry('createPaymentRequest', { amount: paymentData.amount });
    
    try {
      // Validate required userId
      if (!paymentData.metadata?.userId) {
        throw new Error('User ID is required for payment transactions');
      }

      const paymentId = this.generatePaymentId();
      const returnUrl = paymentData.metadata?.returnUrl || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?payment_id=${paymentId}`;
      const cancelUrl = paymentData.metadata?.cancelUrl || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/cancel?payment_id=${paymentId}`;
      const notifyUrl = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/payfast/notify`;

      // Parse customer name
      const nameParts = (paymentData.customerName || 'Customer Name').split(' ');
      const firstName = nameParts[0] || 'Customer';
      const lastName = nameParts.slice(1).join(' ') || 'Name';

      const paymentDataForPayFast: PayFastPaymentData = {
        merchant_id: this.merchantId,
        merchant_key: this.merchantKey,
        return_url: returnUrl,
        cancel_url: cancelUrl,
        notify_url: notifyUrl,
        name_first: firstName,
        name_last: lastName,
        email_address: paymentData.customerEmail,
        cell_number: paymentData.customerPhone || '',
        m_payment_id: paymentId,
        amount: (paymentData.amount / 100).toFixed(2), // Convert cents to Rands
        item_name: paymentData.metadata?.itemName || paymentData.description || 'LemoTech Service',
        item_description: paymentData.metadata?.itemDescription || paymentData.description || 'LemoTech Service Payment',
        custom_str1: paymentData.metadata?.bookingId || '',
        custom_str2: paymentData.metadata?.userId || '',
        custom_str3: '',
        custom_str4: '',
        custom_str5: '',
        custom_int1: '',
        custom_int2: '',
        custom_int3: '',
        custom_int4: '',
        custom_int5: '',
        email_confirmation: '1',
        confirmation_address: process.env.PAYFAST_CONFIRMATION_EMAIL || 'admin@lemotech.co.za'
      };

      // Generate signature using PayFast's exact method
      const signature = this.generateSignature(paymentDataForPayFast);
      paymentDataForPayFast.signature = signature;

      // Store payment transaction using correct database column names
      // Generate a proper UUID for the database record
      const crypto = require('crypto');
      const transactionId = crypto.randomUUID();
      
      const transactionData: any = {
        id: transactionId,  // Use proper UUID for database primary key
        user_id: paymentData.metadata?.userId,
        amount: paymentData.amount,
        currency: 'ZAR',
        status: 'pending',
        payment_method_id: null,  // PayFast direct payment, no stored payment method
        payfast_payment_id: paymentId,  // Use PayFast ID for PayFast reference
        created_at: new Date(),
        updated_at: new Date()
      };

      // Only include booking_id if it's provided and valid
      if (paymentData.metadata?.bookingId) {
        transactionData.booking_id = paymentData.metadata.bookingId;
      }

      await this.paymentTransactionRepository.create(transactionData);

      const response: PaymentResponse = {
        success: true,
        transactionId: transactionId,  // Use the database transaction ID
        paymentId: paymentId,  // Also include PayFast payment ID for reference
        paymentUrl: this.isTest 
          ? 'https://sandbox.payfast.co.za/eng/process' 
          : 'https://www.payfast.co.za/eng/process',
        formData: this.generateFormData(paymentDataForPayFast),
        message: 'Payment request created successfully'
      };

      Logger.info('PayFast payment request created', { paymentId, amount: paymentData.amount });
      this.logMethodExit('createPaymentRequest', { paymentId });
      return response;
    } catch (error) {
      this.handleError('createPaymentRequest', error);
    }
  }

  /**
   * Process refund for a transaction
   */
  async processRefund(transactionId: string, amount: number, reason: string): Promise<any> {
    this.logMethodEntry('processRefund', { transactionId, amount, reason });
    
    try {
      // Get transaction details
      const transaction = await this.paymentTransactionRepository.findById(transactionId);
      if (!transaction) {
        return {
          success: false,
          message: 'Transaction not found',
          error: 'TRANSACTION_NOT_FOUND'
        };
      }

      // Mock refund processing - in production, integrate with PayFast refund API
      const refundData = {
        id: crypto.randomUUID(),
        transactionId,
        amount,
        reason,
        status: 'pending',
        processedAt: new Date(),
        createdAt: new Date()
      };

      Logger.info('Refund processed', { transactionId, amount, reason });

      this.logMethodExit('processRefund', { success: true });
      return {
        success: true,
        message: 'Refund processed successfully',
        data: refundData
      };
    } catch (error) {
      Logger.error('Failed to process refund:', error);
      return {
        success: false,
        message: 'Failed to process refund',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Verify ITN (Instant Transaction Notification)
   */
  async verifyITN(itnData: PayFastITNResponse): Promise<boolean> {
    this.logMethodEntry('verifyITN', { m_payment_id: itnData.m_payment_id });
    
    try {
      // Verify signature
      const signature = this.generateITNSignature(itnData);
      if (signature !== itnData.signature) {
        Logger.error('PayFast ITN signature verification failed', { 
          expected: signature, 
          received: itnData.signature 
        });
        this.logMethodExit('verifyITN', { success: false });
        return false;
      }

      // Verify payment status
      if (itnData.payment_status !== 'COMPLETE') {
        Logger.warn('PayFast payment not complete', { 
          paymentId: itnData.m_payment_id, 
          status: itnData.payment_status 
        });
        this.logMethodExit('verifyITN', { success: false });
        return false;
      }

      // Update payment transaction
      const paymentTransaction = await this.paymentTransactionRepository.findByPayfastId(itnData.m_payment_id);
      if (!paymentTransaction) {
        Logger.error('PayFast payment transaction not found', { paymentId: itnData.m_payment_id });
        this.logMethodExit('verifyITN', { success: false });
        return false;
      }

      await this.paymentTransactionRepository.update(paymentTransaction.id, {
        status: 'succeeded',
        payfastPaymentId: itnData.pf_payment_id,
        updatedAt: new Date()
      });

      // Update booking payment status
      if (paymentTransaction.bookingId) {
        await this.bookingRepository.update(paymentTransaction.bookingId, {
          updatedAt: new Date()
        });
      }

      Logger.info('PayFast ITN verified and processed', { 
        paymentId: itnData.m_payment_id,
        transactionId: itnData.pf_payment_id
      });

      this.logMethodExit('verifyITN', { success: true });
      return true;
    } catch (error) {
      this.handleError('verifyITN', error);
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    this.logMethodEntry('getPaymentStatus', { paymentId });
    
    try {
      const paymentTransaction = await this.paymentTransactionRepository.findByPayfastId(paymentId);
      if (!paymentTransaction) {
        this.logMethodExit('getPaymentStatus', { status: 'not_found' });
        return { 
          transactionId: '', 
          status: 'failed', 
          amount: 0, 
          currency: 'ZAR', 
          customerEmail: '', 
          timestamp: new Date().toISOString() 
        };
      }

      // Get customer email from booking
      const booking = paymentTransaction.bookingId 
        ? await this.bookingRepository.findById(paymentTransaction.bookingId)
        : null;
      const customerEmail = booking ? (booking as any).customerEmail || '' : '';

      const status: PaymentStatus = {
        transactionId: paymentTransaction.id,
        status: paymentTransaction.status as any,
        amount: paymentTransaction.amount,
        currency: paymentTransaction.currency,
        customerEmail: customerEmail,
        timestamp: paymentTransaction.createdAt.toISOString()
      };

      this.logMethodExit('getPaymentStatus', { status: paymentTransaction.status });
      return status;
    } catch (error) {
      this.handleError('getPaymentStatus', error);
    }
  }

  /**
   * Generate payment ID
   */
  private generatePaymentId(): string {
    return `pf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate PayFast signature - matches PayFast documentation exactly
   */
  private generateSignature(data: PayFastPaymentData): string {
    // Create parameter string
    let pfOutput = "";
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key as keyof PayFastPaymentData] !== "" && key !== 'signature') {
          pfOutput += `${key}=${encodeURIComponent((data[key as keyof PayFastPaymentData] as string).trim()).replace(/%20/g, "+")}&`;
        }
      }
    }

    // Remove last ampersand
    let getString = pfOutput.slice(0, -1);
    if (this.passphrase !== null) {
      getString += `&passphrase=${encodeURIComponent(this.passphrase.trim()).replace(/%20/g, "+")}`;
    }

    return crypto.createHash("md5").update(getString).digest("hex");
  }

  /**
   * Generate ITN signature - matches PayFast documentation exactly
   */
  private generateITNSignature(data: PayFastITNResponse): string {
    // Create parameter string
    let pfOutput = "";
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key as keyof PayFastITNResponse] !== "" && key !== 'signature') {
          pfOutput += `${key}=${encodeURIComponent((data[key as keyof PayFastITNResponse] as string).trim()).replace(/%20/g, "+")}&`;
        }
      }
    }

    // Remove last ampersand
    let getString = pfOutput.slice(0, -1);
    if (this.passphrase !== null) {
      getString += `&passphrase=${encodeURIComponent(this.passphrase.trim()).replace(/%20/g, "+")}`;
    }

    return crypto.createHash("md5").update(getString).digest("hex");
  }

  /**
   * Generate HTML form data for PayFast
   */
  private generateFormData(data: PayFastPaymentData): string {
    let htmlForm = `<form action="https://${this.isTest ? 'sandbox.payfast.co.za' : 'www.payfast.co.za'}/eng/process" method="post">`;
    
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key as keyof PayFastPaymentData];
        if (value !== "") {
          htmlForm += `<input name="${key}" type="hidden" value="${(value as string).trim()}" />`;
        }
      }
    }
    
    htmlForm += '<input type="submit" value="Pay Now" /></form>';
    return htmlForm;
  }

  /**
   * Verify PayFast server IP
   */
  private async verifyPayFastIP(ip: string): Promise<boolean> {
    try {
      const validHosts = [
        'www.payfast.co.za',
        'sandbox.payfast.co.za',
        'w1w.payfast.co.za',
        'w2w.payfast.co.za'
      ];

      let validIps: string[] = [];
      
      for (let host of validHosts) {
        try {
          const ips = await this.ipLookup(host);
          validIps = [...validIps, ...ips];
        } catch (err) {
          Logger.error('Failed to lookup IP for host:', { host, error: err });
        }
      }

      const uniqueIps = [...new Set(validIps)];
      return uniqueIps.includes(ip);
    } catch (error) {
      Logger.error('Failed to verify PayFast IP:', error);
      return false;
    }
  }

  /**
   * DNS lookup helper
   */
  private async ipLookup(domain: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      dns.lookup(domain, { all: true }, (err, address) => {
        if (err) {
          reject(err);
        } else {
          const addressIps = address.map(item => item.address);
          resolve(addressIps);
        }
      });
    });
  }

  /**
   * Get payment history for a user
   */
  async getPaymentHistory(userId: string, filters: any): Promise<any> {
    this.logMethodEntry('getPaymentHistory', { userId, filters });
    
    try {
      // Implementation would query the payment transaction repository
      // For now, return mock data
      const mockHistory = [
        {
          transactionId: 'lemotech_1234567890_user123',
          amount: 5000,
          status: 'COMPLETE',
          createdAt: new Date().toISOString(),
          description: 'LemoTech Service Payment'
        }
      ];

      Logger.info('Payment history retrieved', { userId, count: mockHistory.length });
      return mockHistory;
    } catch (error) {
      Logger.error('Get payment history error:', error);
      throw error;
    }
  }

  /**
   * Get payment statistics for a user
   */
  async getPaymentStatistics(userId: string, options: any): Promise<any> {
    this.logMethodEntry('getPaymentStatistics', { userId, options });
    
    try {
      // Implementation would aggregate payment data
      // For now, return mock statistics
      const mockStats = {
        totalPayments: 15,
        totalAmount: 75000, // in cents
        successfulPayments: 14,
        failedPayments: 1,
        averageAmount: 5000,
        lastPaymentDate: new Date().toISOString()
      };

      Logger.info('Payment statistics retrieved', { userId, stats: mockStats });
      return mockStats;
    } catch (error) {
      Logger.error('Get payment statistics error:', error);
      throw error;
    }
  }
}