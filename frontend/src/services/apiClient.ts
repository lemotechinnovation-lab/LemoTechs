import { CURRENT_API_CONFIG } from '../config/api';
import { errorHandler, ApiError } from './errorHandler';

// API Client Configuration
const API_BASE_URL = CURRENT_API_CONFIG.BASE_URL;

// API Response Interface
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}


// Request Configuration Interface
interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  requiresAuth?: boolean;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Get authentication token
  public getAuthToken(): string | null {
    return localStorage.getItem('lemotech_token');
  }

  // Set authentication token
  public setAuthToken(token: string): void {
    localStorage.setItem('lemotech_token', token);
  }

  // Remove authentication token
  public removeAuthToken(): void {
    localStorage.removeItem('lemotech_token');
  }

  // Build headers for request
  private buildHeaders(config: RequestConfig): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...config.headers };
    
    if (config.requiresAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return headers;
  }

  // Make HTTP request
  private async makeRequest<T>(
    endpoint: string,
    config: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers = this.buildHeaders(config);

      const requestInit: RequestInit = {
        method: config.method,
        headers,
      };

      if (config.body && ['POST', 'PUT', 'PATCH'].includes(config.method)) {
        requestInit.body = JSON.stringify(config.body);
      }

      console.log(`🌐 API Request: ${config.method} ${url}`, {
        headers,
        body: config.body
      });

      const response = await fetch(url, requestInit);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      let responseData: any;
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      console.log(`🌐 API Response: ${response.status}`, responseData);

      // Handle HTTP errors
      if (!response.ok) {
        throw {
          message: responseData?.message || `HTTP ${response.status}`,
          status: response.status,
          data: responseData
        } as ApiError;
      }

      return responseData;
    } catch (error) {
      console.error('❌ API Request failed:', error);
      
      // Use error handler to process the error
      const processedError = errorHandler.handleApiError(error, {
        action: `${config.method} ${endpoint}`,
        component: 'ApiClient'
      });
      
      throw processedError;
    }
  }

  // GET request
  public async get<T>(endpoint: string, requiresAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'GET',
      requiresAuth
    });
  }

  // POST request
  public async post<T>(endpoint: string, data: any, requiresAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data,
      requiresAuth
    });
  }

  // PUT request
  public async put<T>(endpoint: string, data: any, requiresAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data,
      requiresAuth
    });
  }

  // DELETE request
  public async delete<T>(endpoint: string, requiresAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
      requiresAuth
    });
  }

  // Health check
  public async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/health', false);
      return response.success;
    } catch (error) {
      return false;
    }
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();

