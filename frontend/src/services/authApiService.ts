import { apiClient } from './apiClient';

// User Interface
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: 'user' | 'driver' | 'shop' | 'admin';
  loyaltyPoints: number;
  totalBookings: number;
  memberSince: string;
}

// Login Data Interface
export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Register Data Interface
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  acceptTerms: boolean;
}

// Phone Verification Data
export interface PhoneVerificationData {
  phoneNumber: string;
  verificationCode: string;
}

// Auth Response Interface
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Phone Verification Response
export interface PhoneVerificationResponse {
  verificationCode: string;
  expiresIn: number;
  smsSent: boolean;
}

// Profile Update Data
export interface ProfileUpdateData {
  name?: string;
  phone?: string;
  address?: string;
}

// Password Change Data
export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

class AuthApiService {
  private basePath = '/auth';

  // Login user
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(`${this.basePath}/login`, data, false);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Login failed');
    }
    
    // Store tokens
    apiClient.setAuthToken(response.data.accessToken);
    localStorage.setItem('refresh_token', response.data.refreshToken);
    
    return response.data;
  }

  // Register user
  async register(data: RegisterData): Promise<AuthResponse> {
    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const response = await apiClient.post<AuthResponse>(`${this.basePath}/register`, data, false);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Registration failed');
    }
    
    // Store tokens
    apiClient.setAuthToken(response.data.accessToken);
    localStorage.setItem('refresh_token', response.data.refreshToken);
    
    return response.data;
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Try to call logout endpoint if it exists
      await apiClient.post(`${this.basePath}/logout`, {}, true);
    } catch (error) {
      // Ignore logout errors, still clear local storage
      console.warn('Logout endpoint failed:', error);
    } finally {
      // Always clear local storage
      apiClient.removeAuthToken();
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('lemotech_user');
    }
  }

  // Get current user profile
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>(`${this.basePath}/profile`);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get profile');
    }
    return response.data;
  }

  // Update user profile
  async updateProfile(data: ProfileUpdateData): Promise<User> {
    const response = await apiClient.put<User>(`${this.basePath}/profile`, data);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update profile');
    }
    return response.data;
  }

  // Change password
  async changePassword(data: PasswordChangeData): Promise<void> {
    const response = await apiClient.put<{ message: string }>(`${this.basePath}/change-password`, data);
    if (!response.success) {
      throw new Error(response.message || 'Failed to change password');
    }
  }

  // Send phone verification code
  async sendPhoneVerification(phoneNumber: string): Promise<PhoneVerificationResponse> {
    const response = await apiClient.post<PhoneVerificationResponse>(`${this.basePath}/send-phone-verification`, {
      phoneNumber
    }, false);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to send verification code');
    }
    return response.data;
  }

  // Verify phone number
  async verifyPhoneNumber(data: PhoneVerificationData): Promise<AuthResponse & { isNewUser: boolean }> {
    const response = await apiClient.post<AuthResponse & { isNewUser: boolean }>(`${this.basePath}/verify-phone`, data, false);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Phone verification failed');
    }
    
    // Store tokens
    apiClient.setAuthToken(response.data.accessToken);
    localStorage.setItem('refresh_token', response.data.refreshToken);
    
    return response.data;
  }

  // Refresh access token
  async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<{ accessToken: string; refreshToken: string }>(`${this.basePath}/refresh-token`, {
      refreshToken
    }, false);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Token refresh failed');
    }
    
    // Update stored tokens
    apiClient.setAuthToken(response.data.accessToken);
    localStorage.setItem('refresh_token', response.data.refreshToken);
    
    return response.data;
  }

  // Verify Firebase token (for social login)
  async verifyFirebaseToken(firebaseToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(`${this.basePath}/verify-firebase-token`, {
      firebaseToken
    }, false);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Firebase token verification failed');
    }
    
    // Store tokens
    apiClient.setAuthToken(response.data.accessToken);
    localStorage.setItem('refresh_token', response.data.refreshToken);
    
    return response.data;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = apiClient.getAuthToken();
    const refreshToken = localStorage.getItem('refresh_token');
    return !!(token && refreshToken);
  }

  // Get stored user data
  getStoredUser(): User | null {
    try {
      const storedUser = localStorage.getItem('lemotech_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Failed to parse stored user:', error);
      return null;
    }
  }

  // Store user data
  storeUser(user: User): void {
    localStorage.setItem('lemotech_user', JSON.stringify(user));
  }

  // Clear stored user data
  clearStoredUser(): void {
    localStorage.removeItem('lemotech_user');
  }

  // Validate token and refresh if needed
  async validateAndRefreshToken(): Promise<boolean> {
    try {
      // Try to get profile with current token
      await this.getProfile();
      return true;
    } catch (error) {
      try {
        // If profile fetch fails, try to refresh token
        await this.refreshToken();
        return true;
      } catch (refreshError) {
        // If refresh fails, user needs to login again
        this.logout();
        return false;
      }
    }
  }
}

// Create and export singleton instance
export const authApiService = new AuthApiService();
