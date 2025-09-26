// SMS Model - Data Transfer Objects only
// This file contains simple data models without business logic

export interface SMSService {
  sendVerificationSMS(phoneNumber: string, verificationCode: string): Promise<boolean>;
}

export interface SMSMessage {
  to: string;
  from: string;
  body: string;
  subject?: string;
  html?: string;
}

export interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface VerificationSMSData {
  phoneNumber: string;
  verificationCode: string;
  expiresInMinutes: number;
}
