// Simple Phone Verification Model - Data Transfer Objects only
// This file contains simple data models without business logic

export interface CreatePhoneVerificationRequest {
  phoneNumber: string;
  verificationCode: string;
  expiresAt: Date;
}

export interface PhoneVerificationProfile {
  id: string;
  phoneNumber: string;
  verificationCode: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface PhoneVerificationSearchFilters {
  phoneNumber?: string;
  expired?: boolean;
  active?: boolean;
}

export interface PhoneVerificationStats {
  totalVerifications: number;
  activeVerifications: number;
  expiredVerifications: number;
}
