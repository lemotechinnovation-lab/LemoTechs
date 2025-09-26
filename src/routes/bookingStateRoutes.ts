import { Router } from 'express';
import { injectServices } from '../infrastructure/di/injector';
import {
  saveBookingState,
  loadBookingState,
  deleteBookingState,
  transferSessionToUser,
  recordBookingStep
} from '../controllers/bookingStateController';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = Router();

// All routes require authentication except save/load which work with sessions
router.post('/save', injectServices, saveBookingState);
router.get('/load', injectServices, optionalAuth, loadBookingState);
router.delete('/delete', injectServices, authenticateToken, deleteBookingState);

// These routes require authentication
router.post('/transfer-session', injectServices, authenticateToken, transferSessionToUser);
router.post('/record-step', injectServices, authenticateToken, recordBookingStep);

export default router;
