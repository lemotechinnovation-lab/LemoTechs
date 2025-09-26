/**
 * Example: Refactored Auth Controller with Dependency Injection
 * This shows how controllers should be structured with DI
 */

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { injectServices, getServices } from '../infrastructure/di/injector';
import { Logger } from '../utils/logger';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Register the middleware to inject services
export const authControllerWithDI = {
  // Register user
  register: async (req: Request, res: Response): Promise<void> => {
    try {
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
      const services = getServices(req);

      // Check if user already exists
      const existingUser = await services.userService.getUserByEmail(email);
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'User already exists'
        });
        return;
      }

      // Create new user
      const user = await services.userService.createUser({
        name,
        email,
        password,
        phone,
        address,
        role: 'user'
      });

      if (!user) {
        res.status(500).json({
          success: false,
          message: 'Failed to create user'
        });
        return;
      }

      Logger.info('User registered successfully', { userId: user.id, email });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    } catch (error) {
      Logger.logError('Register error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Login user
  login: async (req: Request, res: Response): Promise<void> => {
    try {
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
      const services = getServices(req);

      // Get user with password
      const { user, password: hashedPassword } = await services.userService.getUserByEmailWithPassword(email);
      
      if (!user || !hashedPassword) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
        return;
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, hashedPassword);
      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
        return;
      }

      Logger.info('User logged in successfully', { userId: user.id, email });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            avatar: user.avatar,
            emailVerified: user.emailVerified,
            phoneVerified: user.phoneVerified,
            role: user.role,
            loyaltyPoints: user.loyaltyPoints,
            totalBookings: user.totalBookings,
            memberSince: user.memberSince
          }
        }
      });
    } catch (error) {
      Logger.logError('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Get user profile
  getProfile: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const services = getServices(req);
      const user = await services.userService.getUserById(userId);

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
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          avatar: user.avatar,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
          role: user.role,
          loyaltyPoints: user.loyaltyPoints,
          totalBookings: user.totalBookings,
          memberSince: user.memberSince
        }
      });
    } catch (error) {
      Logger.logError('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Update user profile
  updateProfile: async (req: Request, res: Response): Promise<void> => {
    try {
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
      const services = getServices(req);

      const user = await services.userService.updateUserProfile(userId!, { name, phone, address });

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      Logger.info('User profile updated', { userId: user.id });

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          avatar: user.avatar,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
          role: user.role,
          loyaltyPoints: user.loyaltyPoints,
          totalBookings: user.totalBookings,
          memberSince: user.memberSince
        }
      });
    } catch (error) {
      Logger.logError('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

// Export the middleware for use in routes
export { injectServices };
