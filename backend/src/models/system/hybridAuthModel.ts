// Hybrid Auth Model - Data Transfer Objects only
// This file contains simple data models without business logic

export interface HybridAuthResult {
  success: boolean;
  message: string;
  data?: {
    user: any;
    accessToken: string;
    refreshToken: string;
    isNewUser?: boolean;
  };
}

export interface PhoneVerificationRequest {
  phoneNumber: string;
}

export interface PhoneVerificationResponse {
  success: boolean;
  message: string;
  data?: {
    verificationCode?: string; // Only in development
    expiresIn: number;
  };
}

export interface FirebaseTokenVerificationRequest {
  firebaseToken: string;
}

export interface UserAuthData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  loyaltyPoints: number;
  totalBookings: number;
  memberSince: Date;
}
