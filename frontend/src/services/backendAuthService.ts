import { User } from '../hooks/useAuth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface BackendAuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    accessToken: string;
    refreshToken: string;
    isNewUser?: boolean;
  };
}

export interface PhoneVerificationResponse {
  success: boolean;
  message: string;
  data?: {
    verificationCode?: string;
    expiresIn: number;
    smsSent?: boolean;
  };
}

export class BackendAuthService {
  // Send phone verification code
  static async sendPhoneVerification(phoneNumber: string): Promise<PhoneVerificationResponse> {
    try {
      console.log('📡 BackendAuth: Sending request to:', `${API_BASE_URL}/auth/phone/send-verification`);
      console.log('📡 BackendAuth: Phone number:', phoneNumber);
      
      const response = await fetch(`${API_BASE_URL}/auth/phone/send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      console.log('📡 BackendAuth: Response status:', response.status);
      console.log('📡 BackendAuth: Response ok:', response.ok);

      const data = await response.json();
      console.log('📡 BackendAuth: Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send verification code');
      }

      return data;
    } catch (error) {
      console.error('BackendAuth: Send verification error:', error);
      throw error;
    }
  }

  // Verify phone number and get JWT tokens
  static async verifyPhoneNumber(phoneNumber: string, verificationCode: string): Promise<BackendAuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/phone/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, verificationCode }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Phone verification failed');
      }

      return data;
    } catch (error) {
      console.error('BackendAuth: Verify phone error:', error);
      throw error;
    }
  }

  // Verify Firebase token and get JWT tokens
  static async verifyFirebaseToken(firebaseToken: string): Promise<BackendAuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/firebase/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firebaseToken }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Firebase token verification failed');
      }

      return data;
    } catch (error) {
      console.error('BackendAuth: Verify Firebase token error:', error);
      throw error;
    }
  }

  // Refresh access token
  static async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Token refresh failed');
      }

      return data.data;
    } catch (error) {
      console.error('BackendAuth: Refresh token error:', error);
      throw error;
    }
  }

  // Get user profile
  static async getUserProfile(accessToken: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get user profile');
      }

      return data.data;
    } catch (error) {
      console.error('BackendAuth: Get profile error:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateUserProfile(accessToken: string, profileData: Partial<User>): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      return data.data;
    } catch (error) {
      console.error('BackendAuth: Update profile error:', error);
      throw error;
    }
  }
}

export default BackendAuthService;
