import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt';
import { User, ApiResponse } from '../types';
import { HybridAuthService } from '../services/system/hybridAuthService';
import { twilioSmsService } from '../infrastructure/common/twilioSmsService';
import { getServices } from '../infrastructure/di/injector';
import { Logger } from '../utils/logger';

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { name, email, password, phone, address } = req.body;
    const { userService } = getServices(req);

    // Check if user already exists
    const existingUser = await userService.getUserByEmail(email);

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
      return;
    }

    // Create user (password will be hashed in user service)
    const user = await userService.createUser({
      name,
      email,
      password,
      phone,
      address
    });

    if (!user) {
      res.status(500).json({
        success: false,
        message: 'Failed to create user'
      });
      return;
    }

    // Generate tokens
    const tokens = generateTokenPair(user!.id, user!.email, user!.role);

    Logger.info('User registered successfully', { userId: user!.id, email });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user!.id,
          name: user!.name,
          email: user!.email,
          phone: user.phone,
          address: user!.address,
          avatar: user.avatar,
          emailVerified: user!.emailVerified,
          phoneVerified: user.phoneVerified,
          role: user.role,
          loyaltyPoints: user.loyaltyPoints,
          totalBookings: user.totalBookings,
          memberSince: user.memberSince
        },
        tokens
      }
    });
  } catch (error) {
    Logger.logError(error as Error, 'Register error:');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { email, password } = req.body;
    const { userService } = getServices(req);

    // Find user by email
    const { user, password: hashedPassword } = await userService.getUserByEmailWithPassword(email);

    if (!user || !hashedPassword) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, hashedPassword);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    // Generate tokens
    const tokens = generateTokenPair(user!.id, user!.email, user!.role);

    Logger.info('User logged in successfully', { userId: user!.id, email });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user!.id,
          name: user!.name,
          email: user!.email,
          phone: user.phone,
          address: user!.address,
          avatar: user.avatar,
          emailVerified: user!.emailVerified,
          phoneVerified: user.phoneVerified,
          role: user.role,
          loyaltyPoints: user.loyaltyPoints,
          totalBookings: user.totalBookings,
          memberSince: user.memberSince
        },
        tokens
      }
    });
  } catch (error) {
    Logger.logError(error as Error, 'Login error:');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { userService } = getServices(req);
    const user = await userService.getUserById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        id: user!.id,
        name: user!.name,
        email: user!.email,
        phone: user.phone,
        address: user!.address,
        avatar: user.avatar,
        emailVerified: user!.emailVerified,
        phoneVerified: user.phoneVerified,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints,
        totalBookings: user.totalBookings,
        memberSince: user.memberSince
      }
    });
  } catch (error) {
    Logger.logError(error as Error, 'Get profile error:');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const userId = (req as any).user?.userId;
    const { name, phone, address } = req.body;
    const { userService } = getServices(req);

    const user = await userService.updateUserProfile(userId!, { name, phone, address });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    Logger.info('User profile updated', { userId: user!.id });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user!.id,
        name: user!.name,
        email: user!.email,
        phone: user.phone,
        address: user!.address,
        avatar: user.avatar,
        emailVerified: user!.emailVerified,
        phoneVerified: user.phoneVerified,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints,
        totalBookings: user.totalBookings,
        memberSince: user.memberSince
      }
    });
  } catch (error) {
    Logger.logError(error as Error, 'Update profile error:');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Change password
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const userId = (req as any).user?.userId;
    const { currentPassword, newPassword } = req.body;
    const { userService } = getServices(req);

    // Get user to verify current password
    const user = userId ? await userService.getUserById(userId) : null;
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Get user with password for verification
    const { password: hashedPassword } = await userService.getUserByEmailWithPassword(user!.email);
    if (!hashedPassword) {
      res.status(500).json({
        success: false,
        message: 'Password verification failed'
      });
      return;
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, hashedPassword);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
      return;
    }

    // Update password (will be hashed in user service)
    await userService.updateUserPassword(userId!, newPassword);

    Logger.info('User password changed', { userId });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    Logger.logError(error as Error, 'Change password error:');
    res.status(500).json({
      success: false,
      message: 'Internal server error(s)'
    });
  }
};

// Send phone verification code
export const sendPhoneVerification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber } = req.body;
    const { userService } = getServices(req);

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store verification code
    await userService.storePhoneVerification(phoneNumber, verificationCode, expiresAt);

    // Send SMS
    try {
      await twilioSmsService.sendVerificationSMS(phoneNumber, verificationCode);
    } catch (smsError) {
      Logger.logError(smsError as Error, 'SMS sending failed:');
      // Continue even if SMS fails - code is stored in database
    }

    Logger.info('Phone verification code sent', { phoneNumber });

    res.json({
      success: true,
      message: 'Verification code sent successfully'
    });
  } catch (error) {
    Logger.logError(error as Error, 'Send phone verification error:');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Verify phone code
export const verifyPhoneCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber, verificationCode } = req.body;
    const { userService } = getServices(req);

    // Verify the code
    const verificationRecord = await userService.verifyPhoneCode(phoneNumber, verificationCode);
    if (!verificationRecord) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
      return;
    }

    // Check if user already exists
    const existingUser = await userService.getUserByPhone(phoneNumber);
    let user = existingUser;

    if (existingUser) {
      // Update existing user's phone verification status
      await userService.updatePhoneVerificationStatus(user!.id, true);
    } else {
      // Create new user from phone verification
      user = await userService.createPhoneUser(phoneNumber);
      if (!user) {
        res.status(500).json({
          success: false,
          message: 'Failed to create user'
        });
        return;
      }
    }

    // Generate tokens
    const tokens = generateTokenPair(user!.id, user!.email, user!.role);

    Logger.info('Phone verification successful', { userId: user!.id, phoneNumber });

    res.json({
      success: true,
      message: 'Phone verification successful',
      data: {
        user: {
          id: user!.id,
          name: user!.name,
          email: user!.email,
          phone: user!.phone,
          address: user!.address,
          avatar: user!.avatar,
          emailVerified: user!.emailVerified,
          phoneVerified: user!.phoneVerified,
          role: user!.role,
          loyaltyPoints: user!.loyaltyPoints,
          totalBookings: user!.totalBookings,
          memberSince: user!.memberSince
        },
        tokens
      }
    });
  } catch (error) {
    Logger.logError(error as Error, 'Verify phone code error:');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Cleanup verification code
export const cleanupVerificationCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber } = req.body;
    const { userService } = getServices(req);

    await userService.cleanupVerificationCode(phoneNumber);

    Logger.info('Verification code cleaned up', { phoneNumber });

    res.json({
      success: true,
      message: 'Verification code cleaned up successfully'
    });
  } catch (error) {
    Logger.logError(error as Error, 'Cleanup verification code error:');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Refresh token
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
      return;
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
      return;
    }

    // Generate new tokens
    const tokens = generateTokenPair(decoded.userId, decoded.email, decoded.role);

    Logger.info('Token refreshed', { userId: decoded.userId });

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: { tokens }
    });
  } catch (error) {
    Logger.logError(error as Error, 'Refresh token error:');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Firebase authentication
export const firebaseAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firebaseToken } = req.body;

    if (!firebaseToken) {
      res.status(400).json({
        success: false,
        message: 'Firebase token is required'
      });
      return;
    }

    // Verify Firebase token and create/update user
    const { hybridAuthService } = getServices(req);
    const result = await hybridAuthService.verifyFirebaseToken(firebaseToken);

    if (!result.success) {
      res.status(401).json({
        success: false,
        message: result.message || 'Firebase authentication failed'
      });
      return;
    }

    Logger.info('Firebase authentication successful', { userId: result.user?.id });

    res.json({
      success: true,
      message: 'Firebase authentication successful',
      data: {
        user: result.user,
        tokens: result.tokens
      }
    });
  } catch (error) {
    Logger.logError(error as Error, 'Firebase auth error:');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};