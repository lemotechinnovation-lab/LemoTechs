// PayFast Routes for LemoTech Backend
import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import { injectServices } from '../infrastructure/di/injector';
import {
  createPaymentRequest,
  verifyPaymentStatus,
  handleWebhookNotification,
  processRefund,
  getPaymentHistory,
  getPaymentStatistics
} from '../controllers/payfastController';

const router = Router();

// Validation rules
const createPaymentValidation = [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('itemName').optional().isString(),
  body('itemDescription').optional().isString(),
  body('returnUrl').optional().isURL().withMessage('Valid return URL is required'),
  body('cancelUrl').optional().isURL().withMessage('Valid cancel URL is required'),
  body('customerEmail').optional().isEmail().withMessage('Valid email is required'),
  body('customerName').optional().isString(),
  body('customerPhone').optional().isString(),
  body('metadata').optional().isObject()
];

const refundValidation = [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('reason').notEmpty().withMessage('Refund reason is required')
];

// Routes
router.post('/create-payment', 
  authenticateToken, 
  injectServices, 
  createPaymentValidation,
  createPaymentRequest
);

router.get('/verify/:transactionId', 
  authenticateToken, 
  injectServices,
  param('transactionId').notEmpty().withMessage('Transaction ID is required'),
  verifyPaymentStatus
);

router.post('/notify', 
  injectServices, 
  handleWebhookNotification
);

router.post('/refund/:transactionId',
  authenticateToken,
  injectServices,
  param('transactionId').notEmpty().withMessage('Transaction ID is required'),
  refundValidation,
  processRefund
);

router.get('/history',
  authenticateToken,
  injectServices,
  query('startDate').optional().isISO8601().withMessage('Invalid start date format'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date format'),
  query('status').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 }),
  getPaymentHistory
);

router.get('/statistics',
  authenticateToken,
  injectServices,
  query('period').optional().isString(),
  getPaymentStatistics
);

export default router;
