import { Request, Response } from 'express';
import { Logger } from './logger';
import { validationResult } from 'express-validator';
import { ApiResponse } from '../types';

/**
 * Common response utilities for consistent API responses
 */
export class ResponseUtils {
  /**
   * Send a successful response
   */
  static success(res: Response, message: string, data?: any, statusCode: number = 200): void {
    res.status(statusCode).json({
      success: true,
      message,
      ...(data && { data })
    });
  }

  /**
   * Send an error response
   */
  static error(res: Response, message: string, statusCode: number = 500, errors?: any[]): void {
    res.status(statusCode).json({
      success: false,
      message,
      ...(errors && { errors })
    });
  }

  /**
   * Send a validation error response
   */
  static validationError(res: Response, errors: any[]): void {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  /**
   * Send a not found response
   */
  static notFound(res: Response, message: string = 'Resource not found'): void {
    res.status(404).json({
      success: false,
      message
    });
  }

  /**
   * Send an unauthorized response
   */
  static unauthorized(res: Response, message: string = 'Unauthorized'): void {
    res.status(401).json({
      success: false,
      message
    });
  }

  /**
   * Send a forbidden response
   */
  static forbidden(res: Response, message: string = 'Forbidden'): void {
    res.status(403).json({
      success: false,
      message
    });
  }

  /**
   * Send a paginated response
   */
  static paginated(
    res: Response, 
    message: string, 
    data: any[], 
    pagination: { page: number; limit: number; total: number; pages: number }
  ): void {
    res.json({
      success: true,
      message,
      data,
      pagination
    });
  }
}

/**
 * Common validation utilities
 */
export class ValidationUtils {
  /**
   * Check validation results and send error if invalid
   */
  static checkValidation(req: Request, res: Response): boolean {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      ResponseUtils.validationError(res, errors.array());
      return false;
    }
    return true;
  }

  /**
   * Validate required fields
   */
  static validateRequired(fields: string[], data: any): string[] {
    const missing: string[] = [];
    fields.forEach(field => {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        missing.push(field);
      }
    });
    return missing;
  }

  /**
   * Validate UUID format
   */
  static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   */
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }
}

/**
 * Common error handling utilities
 */
export class ErrorUtils {
  /**
   * Handle controller errors with consistent logging and response
   */
  static handleControllerError(error: any, res: Response, operation: string): void {
    Logger.error(`${operation} error:`, error);
    
    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('not found')) {
        ResponseUtils.notFound(res, error.message);
        return;
      }
      
      if (error.message.includes('unauthorized') || error.message.includes('forbidden')) {
        ResponseUtils.unauthorized(res, error.message);
        return;
      }
      
      if (error.message.includes('validation')) {
        ResponseUtils.validationError(res, [error.message]);
        return;
      }
    }
    
    // Default internal server error
    ResponseUtils.error(res, 'Internal server error', 500);
  }

  /**
   * Handle async controller functions with error catching
   */
  static asyncHandler(fn: (req: Request, res: Response) => Promise<void>) {
    return (req: Request, res: Response) => {
      Promise.resolve(fn(req, res)).catch((error) => {
        ErrorUtils.handleControllerError(error, res, 'Controller');
      });
    };
  }
}

/**
 * Common data transformation utilities
 */
export class DataUtils {
  /**
   * Parse float safely
   */
  static parseFloat(value: any, defaultValue: number = 0): number {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  /**
   * Parse integer safely
   */
  static parseInt(value: any, defaultValue: number = 0): number {
    const parsed = parseInt(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  /**
   * Format currency
   */
  static formatCurrency(amount: number, currency: string = 'ZAR'): string {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Format date
   */
  static formatDate(date: Date | string, format: 'short' | 'long' | 'time' = 'short'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    
    switch (format) {
      case 'long':
        return d.toLocaleDateString('en-ZA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'time':
        return d.toLocaleTimeString('en-ZA', {
          hour: '2-digit',
          minute: '2-digit'
        });
      default:
        return d.toLocaleDateString('en-ZA');
    }
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  /**
   * Generate pagination metadata
   */
  static generatePagination(page: number, limit: number, total: number) {
    return {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    };
  }
}

/**
 * Common logging utilities
 */
export class LogUtils {
  /**
   * Log API request
   */
  static logRequest(req: Request, operation: string): void {
    Logger.info(`🔥 ${operation}: ${req.method} ${req.path}`);
    Logger.info(`🔥 ${operation}: User ID:`, req.user?.userId);
    Logger.info(`🔥 ${operation}: Request body:`, req.body);
  }

  /**
   * Log API response
   */
  static logResponse(operation: string, success: boolean, data?: any): void {
    Logger.info(`🔥 ${operation}: Response success:`, success);
    if (data) {
      Logger.info(`🔥 ${operation}: Response data:`, data);
    }
  }

  /**
   * Log error with context
   */
  static logError(operation: string, error: any, context?: any): void {
    Logger.error(`🔥 ${operation}: Error occurred:`, error);
    if (context) {
      Logger.error(`🔥 ${operation}: Context:`, context);
    }
  }
}
