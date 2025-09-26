/**
 * Base Service Class
 * Provides common functionality for all services
 */

import { Logger } from '../../utils/logger';

export abstract class BaseService {
  protected logger: typeof Logger;

  constructor() {
    this.logger = Logger;
  }

  /**
   * Log service method entry
   */
  protected logMethodEntry(methodName: string, params?: any): void {
    this.logger.debug(`Service method ${methodName} called`, { params });
  }

  /**
   * Log service method exit
   */
  protected logMethodExit(methodName: string, result?: any): void {
    this.logger.debug(`Service method ${methodName} completed`, { result });
  }

  /**
   * Log service error
   */
  protected logError(methodName: string, error: any): void {
    this.logger.error(`Service method ${methodName} error:`, error);
  }

  /**
   * Handle service errors consistently
   */
  protected handleError(methodName: string, error: any): never {
    this.logError(methodName, error);
    throw error;
  }

  /**
   * Validate required parameters
   */
  protected validateRequired(params: Record<string, any>, requiredFields: string[]): void {
    for (const field of requiredFields) {
      if (params[field] === undefined || params[field] === null) {
        throw new Error(`Required field '${field}' is missing`);
      }
    }
  }

  /**
   * Sanitize input data
   */
  protected sanitizeInput(data: any): any {
    if (typeof data === 'string') {
      return data.trim();
    }
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeInput(value);
      }
      return sanitized;
    }
    return data;
  }
}
