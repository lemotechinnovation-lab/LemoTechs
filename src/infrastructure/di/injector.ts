/**
 * Dependency Injection Decorators and Utilities
 */

import { Request, Response, NextFunction } from 'express';
import { SimpleServiceFactory } from './simpleServiceFactory';
import { Logger } from '../../utils/logger';

// Extend Express Request interface to include services
declare global {
  namespace Express {
    interface Request {
      services: {
        userService: any;
        bookingService: any;
        driverService: any;
        shopService: any;
        fileService: any;
        adminService: any;
        driverAssignmentService: any;
        bookingStateService: any;
        driverJobService: any;
        shopOrderService: any;
      shopManagementService: any;
      payfastService: any;
      hybridAuthService: any;
        cleaningWorkflowService: any;
        shopQueueService: any;
        shopInventoryTrackingService: any;
        routeOptimizationService: any;
      };
      user?: {
        userId: string;
        email: string;
        type: 'access' | 'refresh';
        role?: string;
        driverId?: string;
        shopId?: string;
        permissions?: string[];
        firebaseUid?: string;
      };
      firebaseUser?: {
        uid: string;
        email?: string;
        name?: string;
        picture?: string;
        phone_number?: string;
        email_verified?: boolean;
        phone_number_verified?: boolean;
        provider?: string;
        custom_claims?: any;
      };
    }
  }
}

/**
 * Middleware to inject services into request object
 */
export const injectServices = (req: Request, res: Response, next: NextFunction): void => {
  try {
    req.services = {
      userService: SimpleServiceFactory.getService('userService'),
      bookingService: SimpleServiceFactory.getService('bookingService'),
      driverService: SimpleServiceFactory.getService('driverService'),
      shopService: SimpleServiceFactory.getService('shopService'),
      fileService: SimpleServiceFactory.getService('fileService'),
      adminService: SimpleServiceFactory.getService('adminService'),
      driverAssignmentService: SimpleServiceFactory.getService('driverAssignmentService'),
      bookingStateService: SimpleServiceFactory.getService('bookingStateService'),
      driverJobService: SimpleServiceFactory.getService('driverJobService'),
      shopOrderService: SimpleServiceFactory.getService('shopOrderService'),
      shopManagementService: SimpleServiceFactory.getService('shopManagementService'),
      payfastService: SimpleServiceFactory.getService('payfastService'),
      hybridAuthService: SimpleServiceFactory.getService('hybridAuthService'),
      cleaningWorkflowService: SimpleServiceFactory.getService('cleaningWorkflowService'),
    shopQueueService: SimpleServiceFactory.getService('shopQueueService'),
    shopInventoryTrackingService: SimpleServiceFactory.getService('shopInventoryTrackingService'),
    routeOptimizationService: SimpleServiceFactory.getService('routeOptimizationService')
    };
    next();
  } catch (error) {
    Logger.error('Failed to inject services:', error);
    res.status(500).json({
      success: false,
      message: 'Service initialization error'
    });
  }
};

/**
 * Utility function to get services from request
 */
export const getServices = (req: Request) => {
  return req.services;
};
