import { Request, Response } from 'express';
import { Logger } from '../utils/logger';
import { validationResult } from 'express-validator';
import { getServices } from '../infrastructure/di/injector';
import { PaymentRequest, PaymentResponse, PaymentStatus } from '../models/payment/payfastModel';

// ========================================
// PAYFAST PAYMENT CONTROLLER
// ========================================

/**
 * Create a payment request
 */
export const createPaymentRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { amount, itemName, itemDescription, returnUrl, cancelUrl, customerEmail, customerName, customerPhone, metadata } = req.body;

    // Validate required fields
    if (!amount) {
      res.status(400).json({
        success: false,
        message: 'Missing required field: amount'
      });
      return;
    }

    const { payfastService } = getServices(req);
    const transactionId = `lemotech_${Date.now()}_${userId}`;

    // Use provided values or defaults
    const customerEmailValue = customerEmail || req.user?.email || 'customer@lemotech.com';
    const customerNameValue = customerName || 'LemoTech Customer';
    const description = itemDescription || itemName || 'LemoTech Service Payment';

    const paymentRequest: PaymentRequest = {
      amount: amount * 100, // Convert to cents
      transactionId,
      customerEmail: customerEmailValue,
      customerName: customerNameValue,
      customerPhone: customerPhone || '',
      description,
      metadata: {
        userId,
        returnUrl,
        cancelUrl,
        itemName,
        ...metadata
      }
    };

    const result: PaymentResponse = await payfastService.createPaymentRequest(paymentRequest);

    res.json({
      success: true,
      message: 'Payment request created successfully',
      data: {
        paymentUrl: result.paymentUrl,
        transactionId: result.transactionId,
        formData: result.formData
      }
    });
  } catch (error) {
    Logger.error('Create payment request error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Verify payment status
 */
export const verifyPaymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { transactionId } = req.params;
    if (!transactionId) {
      res.status(400).json({
        success: false,
        message: 'Transaction ID is required'
      });
      return;
    }

    const { payfastService } = getServices(req);
    const paymentStatus: PaymentStatus = await payfastService.getPaymentStatus(transactionId);

    res.json({
      success: true,
      message: 'Payment status verified successfully',
      data: paymentStatus
    });
  } catch (error) {
    Logger.error('Verify payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Handle PayFast webhook notification (ITN)
 */
export const handleWebhookNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    Logger.info('PayFast ITN notification received', {
      headers: req.headers,
      body: req.body
    });

    const { payfastService } = getServices(req);
    const result = await payfastService.verifyITN(req.body);
    
    if (result) {
      Logger.info('PayFast ITN verification successful', { result });
      res.status(200).send('OK');
    } else {
      Logger.warn('PayFast ITN verification failed');
      res.status(400).send('Bad Request');
    }
  } catch (error) {
    Logger.error('PayFast webhook notification error:', error);
    res.status(500).send('Internal Server Error');
  }
};

/**
 * Process payment refund
 */
export const processRefund = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { transactionId } = req.params;
    const { amount, reason } = req.body;

    if (!transactionId || !amount || !reason) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: transactionId, amount, reason'
      });
      return;
    }

    const { payfastService } = getServices(req);
    const refundResult = await payfastService.processRefund(transactionId, amount, reason);

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: refundResult
    });
  } catch (error) {
    Logger.error('Process refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get payment history for user
 */
export const getPaymentHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { 
      startDate, 
      endDate, 
      status, 
      limit = 50, 
      offset = 0 
    } = req.query;

    const { payfastService } = getServices(req);
    
    // This would need to be implemented in the PayFastService
    // For now, we'll return a placeholder response
    const paymentHistory = await payfastService.getPaymentHistory(userId, {
      startDate: startDate as string,
      endDate: endDate as string,
      status: status as string,
      limit: Number(limit),
      offset: Number(offset)
    });

    res.json({
      success: true,
      message: 'Payment history retrieved successfully',
      data: paymentHistory
    });
  } catch (error) {
    Logger.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get payment statistics
 */
export const getPaymentStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { period = '30' } = req.query;

    const { payfastService } = getServices(req);
    
    // This would need to be implemented in the PayFastService
    // For now, we'll return a placeholder response
    const statistics = await payfastService.getPaymentStatistics(userId, {
      period: period as string
    });

    res.json({
      success: true,
      message: 'Payment statistics retrieved successfully',
      data: statistics
    });
  } catch (error) {
    Logger.error('Get payment statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
