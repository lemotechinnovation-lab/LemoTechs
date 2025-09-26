// Loading State Management Service
export interface LoadingState {
  [key: string]: boolean;
}

export interface LoadingContext {
  component?: string;
  action?: string;
  timeout?: number;
}

class LoadingService {
  private loadingStates: LoadingState = {};
  private listeners: Set<(states: LoadingState) => void> = new Set();
  private timeouts: Map<string, number> = new Map();

  // Subscribe to loading state changes
  subscribe(listener: (states: LoadingState) => void): () => void {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Notify all listeners of state changes
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.loadingStates);
      } catch (error) {
        console.error('Error in loading state listener:', error);
      }
    });
  }

  // Set loading state for a specific key
  setLoading(key: string, isLoading: boolean, context?: LoadingContext): void {
    // Clear existing timeout if any
    const existingTimeout = this.timeouts.get(key);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      this.timeouts.delete(key);
    }

    if (isLoading) {
      this.loadingStates[key] = true;
      
      // Set timeout if specified
      if (context?.timeout) {
        const timeout = setTimeout(() => {
          console.warn(`Loading state for "${key}" timed out after ${context.timeout}ms`);
          this.setLoading(key, false);
        }, context.timeout);
        
        this.timeouts.set(key, timeout);
      }
    } else {
      delete this.loadingStates[key];
    }

    console.log(`🔄 Loading state "${key}":`, isLoading, context);
    this.notifyListeners();
  }

  // Check if a specific key is loading
  isLoading(key: string): boolean {
    return !!this.loadingStates[key];
  }

  // Check if any loading states are active
  isAnyLoading(): boolean {
    return Object.keys(this.loadingStates).length > 0;
  }

  // Get all loading states
  getLoadingStates(): LoadingState {
    return { ...this.loadingStates };
  }

  // Get loading keys
  getLoadingKeys(): string[] {
    return Object.keys(this.loadingStates);
  }

  // Clear all loading states
  clearAll(): void {
    // Clear all timeouts
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
    
    this.loadingStates = {};
    this.notifyListeners();
  }

  // Clear loading state for a specific key
  clear(key: string): void {
    const existingTimeout = this.timeouts.get(key);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      this.timeouts.delete(key);
    }

    delete this.loadingStates[key];
    this.notifyListeners();
  }

  // Create a loading wrapper for async operations
  async withLoading<T>(
    key: string,
    operation: () => Promise<T>,
    context?: LoadingContext
  ): Promise<T> {
    this.setLoading(key, true, context);
    
    try {
      const result = await operation();
      return result;
    } finally {
      this.setLoading(key, false);
    }
  }

  // Create multiple loading states
  setMultipleLoading(states: Partial<LoadingState>): void {
    Object.entries(states).forEach(([key, isLoading]) => {
      if (isLoading !== undefined) {
        this.setLoading(key, isLoading);
      }
    });
  }

  // Check if multiple keys are loading
  areLoading(keys: string[]): boolean {
    return keys.some(key => this.isLoading(key));
  }

  // Get loading state summary
  getSummary(): {
    total: number;
    keys: string[];
    hasAny: boolean;
  } {
    const keys = this.getLoadingKeys();
    return {
      total: keys.length,
      keys,
      hasAny: keys.length > 0
    };
  }
}

// Create and export singleton instance
export const loadingService = new LoadingService();

// Common loading keys
export const LOADING_KEYS = {
  // Authentication
  AUTH_LOGIN: 'auth.login',
  AUTH_REGISTER: 'auth.register',
  AUTH_LOGOUT: 'auth.logout',
  AUTH_REFRESH: 'auth.refresh',
  
  // Driver operations
  DRIVER_PROFILE: 'driver.profile',
  DRIVER_JOBS: 'driver.jobs',
  DRIVER_ACCEPT_JOB: 'driver.accept_job',
  DRIVER_UPDATE_STATUS: 'driver.update_status',
  
  // Shop operations
  SHOP_PROFILE: 'shop.profile',
  SHOP_BOOKINGS: 'shop.bookings',
  SHOP_ANALYTICS: 'shop.analytics',
  SHOP_UPDATE_BOOKING: 'shop.update_booking',
  
  // Booking operations
  BOOKING_CREATE: 'booking.create',
  BOOKING_UPDATE: 'booking.update',
  BOOKING_CANCEL: 'booking.cancel',
  
  // File uploads
  UPLOAD_IMAGE: 'upload.image',
  UPLOAD_DOCUMENT: 'upload.document',
  
  // General
  APP_INIT: 'app.init',
  DATA_SYNC: 'data.sync'
} as const;

// Types are already exported above as interfaces
