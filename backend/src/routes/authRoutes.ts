import { Router } from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  sendPhoneVerification,
  verifyPhoneCode,
  refreshToken,
  firebaseAuth
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { injectServices } from '../infrastructure/di/injector';

const router = Router();

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('phone')
    .optional()
    .matches(/^(\+27|0)[0-9]{9}$/)
    .withMessage('Please provide a valid South African phone number'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address must not exceed 500 characters')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const updateProfileValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phone')
    .optional()
    .matches(/^(\+27|0)[0-9]{9}$/)
    .withMessage('Please provide a valid South African phone number'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address must not exceed 500 characters')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

const phoneVerificationValidation = [
  body('phoneNumber')
    .matches(/^\+27[0-9]{9}$/)
    .withMessage('Please provide a valid South African phone number in +27xxxxxxxxx format')
];

const verifyPhoneValidation = [
  body('phoneNumber')
    .matches(/^\+27[0-9]{9}$/)
    .withMessage('Please provide a valid South African phone number in +27xxxxxxxxx format'),
  body('verificationCode')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('Verification code must be exactly 6 digits')
];

const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
];

const firebaseTokenValidation = [
  body('firebaseToken')
    .notEmpty()
    .withMessage('Firebase token is required')
];

// Routes with DI middleware
router.post('/register', injectServices, registerValidation, register);
router.post('/login', injectServices, loginValidation, login);
router.get('/profile', injectServices, authenticateToken, getProfile);
router.put('/profile', injectServices, authenticateToken, updateProfileValidation, updateProfile);
router.post('/change-password', injectServices, authenticateToken, changePasswordValidation, changePassword);

// Phone authentication routes
router.post('/phone/send-verification', injectServices, phoneVerificationValidation, sendPhoneVerification);
router.post('/phone/verify', injectServices, verifyPhoneValidation, verifyPhoneCode);

// Firebase authentication
router.post('/firebase/verify', injectServices, firebaseTokenValidation, firebaseAuth);

// Token management
router.post('/refresh-token', injectServices, refreshTokenValidation, refreshToken);

export default router;
