import { Logger } from '../../utils/logger';
import { SMSService } from '../../models/system/smsModel';
import twilio from 'twilio';

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

class TwilioSMSService implements SMSService {
  async sendVerificationSMS(phoneNumber: string, verificationCode: string): Promise<boolean> {
    try {
      // Check if we're in development mode (no credentials)
      if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || process.env.NODE_ENV === 'development') {
        // Log to console in development
        Logger.info(`📱 [DEV] SMS Verification Code for ${phoneNumber}: ${verificationCode}`);
        Logger.info(`📱 [DEV] In production, this would be sent via Twilio SMS`);
        return true;
      }

      // In production, send real SMS via Twilio
      const message = await client.messages.create({
        body: `Your LemoTech verification code is: ${verificationCode}. This code will expire in 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
        to: phoneNumber
      });

      Logger.info(`📱 SMS sent successfully to ${phoneNumber}, SID: ${message.sid}`);
      return true;

    } catch (error) {
      Logger.error('❌ Twilio SMS error:', error);
      
      // Fallback to console logging if SMS fails
      Logger.info(`📱 [FALLBACK] SMS Verification Code for ${phoneNumber}: ${verificationCode}`);
      return false;
    }
  }
}

// Export singleton instance
export const twilioSmsService = new TwilioSMSService();

// Export the class for testing
export { TwilioSMSService };
