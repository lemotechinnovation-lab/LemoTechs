import * as sgMail from '@sendgrid/mail';
import * as sgClient from '@sendgrid/client';
import { SMSService } from '../../models/system/smsModel';
import { Logger } from '../../utils/logger';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
sgClient.setApiKey(process.env.SENDGRID_API_KEY || '');

class SendGridSMSService implements SMSService {
  async sendVerificationSMS(phoneNumber: string, verificationCode: string): Promise<boolean> {
    try {
      // Check if we're in development mode (no API key)
      if (!process.env.SENDGRID_API_KEY || process.env.NODE_ENV === 'development') {
        // Log to console in development
        Logger.info(`📱 [DEV] SMS Verification Code for ${phoneNumber}: ${verificationCode}`);
        Logger.info(`📱 [DEV] In production, this would be sent via SendGrid SMS`);
        return true;
      }

      // In production, send real SMS via SendGrid
      const msg = {
        to: phoneNumber,
        from: process.env.SENDGRID_FROM_PHONE || '+1234567890', // Your verified phone number
        subject: 'LemoTech Verification Code',
        text: `Your LemoTech verification code is: ${verificationCode}. This code will expire in 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #FF6B35;">LemoTech Verification</h2>
            <p>Your verification code is:</p>
            <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #FF6B35; font-size: 32px; margin: 0;">${verificationCode}</h1>
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this message.</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              LemoTech Innovations - Premium Cleaning Services
            </p>
          </div>
        `
      };

      await sgMail.send(msg);
      Logger.info(`📱 SMS sent successfully to ${phoneNumber}`);
      return true;

    } catch (error) {
      Logger.error('❌ SendGrid SMS error:', error);
      
      // Fallback to console logging if SMS fails
      Logger.info(`📱 [FALLBACK] SMS Verification Code for ${phoneNumber}: ${verificationCode}`);
      return false;
    }
  }
}

// Export singleton instance
export const smsService = new SendGridSMSService();

// Export the class for testing
export { SendGridSMSService };
