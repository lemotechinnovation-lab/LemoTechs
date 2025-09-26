// Error Handler Service
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  data?: any;
}

export interface ErrorContext {
  action: string;
  component?: string;
  userId?: string;
  timestamp: string;
  userAgent: string;
  url: string;
}

class ErrorHandler {
  private isDevelopment = import.meta.env.MODE === 'development';
  
  // Handle API errors
  handleApiError(error: any, context?: Partial<ErrorContext>): ApiError {
    const errorContext: ErrorContext = {
      action: context?.action || 'Unknown action',
      component: context?.component || 'Unknown component',
      userId: context?.userId || 'Unknown user',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...context
    };

    let apiError: ApiError;

    // Network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      apiError = {
        message: 'Network error - please check your internet connection',
        status: 0,
        code: 'NETWORK_ERROR'
      };
    }
    // HTTP errors
    else if (error.status) {
      switch (error.status) {
        case 400:
          apiError = {
            message: error.data?.message || 'Bad request - please check your input',
            status: 400,
            code: 'BAD_REQUEST',
            data: error.data
          };
          break;
        case 401:
          apiError = {
            message: 'Authentication required - please log in',
            status: 401,
            code: 'UNAUTHORIZED'
          };
          break;
        case 403:
          apiError = {
            message: 'Access denied - insufficient permissions',
            status: 403,
            code: 'FORBIDDEN'
          };
          break;
        case 404:
          apiError = {
            message: 'Resource not found',
            status: 404,
            code: 'NOT_FOUND'
          };
          break;
        case 409:
          apiError = {
            message: error.data?.message || 'Conflict - resource already exists',
            status: 409,
            code: 'CONFLICT',
            data: error.data
          };
          break;
        case 422:
          apiError = {
            message: error.data?.message || 'Validation error - please check your input',
            status: 422,
            code: 'VALIDATION_ERROR',
            data: error.data
          };
          break;
        case 429:
          apiError = {
            message: 'Too many requests - please try again later',
            status: 429,
            code: 'RATE_LIMITED'
          };
          break;
        case 500:
          apiError = {
            message: 'Server error - please try again later',
            status: 500,
            code: 'SERVER_ERROR'
          };
          break;
        case 502:
        case 503:
        case 504:
          apiError = {
            message: 'Service temporarily unavailable - please try again later',
            status: error.status,
            code: 'SERVICE_UNAVAILABLE'
          };
          break;
        default:
          apiError = {
            message: error.data?.message || error.message || 'An unexpected error occurred',
            status: error.status,
            code: 'UNKNOWN_ERROR',
            data: error.data
          };
      }
    }
    // Generic errors
    else {
      apiError = {
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        data: error
      };
    }

    // Log error in development
    if (this.isDevelopment) {
      console.error('🚨 API Error:', {
        error: apiError,
        context: errorContext,
        originalError: error
      });
    }

    // Send error to logging service in production
    if (!this.isDevelopment) {
      this.logError(apiError, errorContext);
    }

    return apiError;
  }

  // Handle general application errors
  handleApplicationError(error: Error, context?: Partial<ErrorContext>): void {
    const errorContext: ErrorContext = {
      action: context?.action || 'Unknown action',
      component: context?.component || 'Unknown component',
      userId: context?.userId || 'Unknown user',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...context
    };

    // Log error in development
    if (this.isDevelopment) {
      console.error('🚨 Application Error:', {
        error: error.message,
        stack: error.stack,
        context: errorContext
      });
    }

    // Send error to logging service in production
    if (!this.isDevelopment) {
      this.logError({
        message: error.message,
        code: 'APPLICATION_ERROR'
      }, errorContext);
    }
  }

  // Log error to external service
  private async logError(error: ApiError, context: ErrorContext): Promise<void> {
    try {
      // In a real application, you would send this to your logging service
      // For now, we'll just store it in localStorage for debugging
      const errorLog = {
        error,
        context,
        timestamp: new Date().toISOString()
      };

      const existingLogs = JSON.parse(localStorage.getItem('error_logs') || '[]');
      existingLogs.push(errorLog);
      
      // Keep only the last 50 errors
      if (existingLogs.length > 50) {
        existingLogs.splice(0, existingLogs.length - 50);
      }
      
      localStorage.setItem('error_logs', JSON.stringify(existingLogs));
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  }

  // Get user-friendly error message
  getUserFriendlyMessage(error: ApiError): string {
    // Return user-friendly messages based on error type
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Please check your internet connection and try again.';
      case 'UNAUTHORIZED':
        return 'Please log in to continue.';
      case 'FORBIDDEN':
        return 'You do not have permission to perform this action.';
      case 'NOT_FOUND':
        return 'The requested resource was not found.';
      case 'VALIDATION_ERROR':
        return error.data?.details 
          ? `Please fix the following issues: ${error.data.details.join(', ')}`
          : 'Please check your input and try again.';
      case 'RATE_LIMITED':
        return 'Too many requests. Please wait a moment and try again.';
      case 'SERVER_ERROR':
        return 'Something went wrong on our end. Please try again later.';
      case 'SERVICE_UNAVAILABLE':
        return 'Service is temporarily unavailable. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  }

  // Check if error is retryable
  isRetryableError(error: ApiError): boolean {
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    const retryableCodes = ['NETWORK_ERROR', 'RATE_LIMITED', 'SERVER_ERROR', 'SERVICE_UNAVAILABLE'];
    
    return retryableStatuses.includes(error.status || 0) || 
           retryableCodes.includes(error.code || '');
  }

  // Get error logs for debugging
  getErrorLogs(): any[] {
    try {
      return JSON.parse(localStorage.getItem('error_logs') || '[]');
    } catch {
      return [];
    }
  }

  // Clear error logs
  clearErrorLogs(): void {
    localStorage.removeItem('error_logs');
  }
}

// Create and export singleton instance
export const errorHandler = new ErrorHandler();

