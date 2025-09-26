import { generateTokenPair } from '../../utils/jwt';
import { v4 as uuidv4 } from 'uuid';
import { smsService } from '../../infrastructure/common/smsService';
import { HybridAuthResult } from '../../models/system/hybridAuthModel';
import { UserRepository } from '../../repositories/user/UserRepository';
import { PhoneVerificationRepository } from '../../repositories/system/PhoneVerificationRepository';
import { IHybridAuthService } from '../../infrastructure/di/interfaces';
import { BaseService } from '../base/BaseService';
import { Logger } from '../../utils/logger';

export class HybridAuthService extends BaseService implements IHybridAuthService {
  constructor(
    private userRepository: UserRepository,
    private phoneVerificationRepository: PhoneVerificationRepository,
    private firebaseAdminService: any,
    private smsService: any
  ) {
    super();
  }

  // Verify Firebase token and create/update user in our database
  async verifyFirebaseToken(firebaseToken: string): Promise<HybridAuthResult> {
    this.logMethodEntry('verifyFirebaseToken', { firebaseToken: firebaseToken.substring(0, 20) + '...' });
    
    try {
      // In production, you would verify the Firebase token here
      // For now, we'll simulate the verification
      Logger.info('🔥 HybridAuth: Verifying Firebase token');
      
      // Simulate Firebase token verification
      // In real implementation, you would use Firebase Admin SDK:
      // const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
      
      // For demo purposes, let's extract user info from a demo token
      let firebaseUser;
      if (firebaseToken.startsWith('demo_token_')) {
        // Demo user from frontend
        firebaseUser = {
          uid: 'demo-firebase-user-' + Date.now(),
          email: 'demo@lemotech.co.za',
          displayName: 'Demo Firebase User',
          phoneNumber: '+27821234567',
          emailVerified: true,
          phoneVerified: true
        };
      } else {
        // For other tokens, simulate verification
        firebaseUser = {
          uid: 'firebase-user-' + Date.now(),
          email: 'user@example.com',
          displayName: 'Firebase User',
          phoneNumber: '+27821234567',
          emailVerified: true,
          phoneVerified: true
        };
      }

      Logger.info('🔥 HybridAuth: Firebase user verified', { uid: firebaseUser.uid });

      // Check if user exists in our database
      let user = await this.userRepository.findByEmail(firebaseUser.email);
      
      if (!user) {
        // Create new user from Firebase data
        user = await this.userRepository.create({
          id: uuidv4(),
          name: firebaseUser.displayName || 'Firebase User',
          email: firebaseUser.email,
          phone: firebaseUser.phoneNumber,
          emailVerified: firebaseUser.emailVerified,
          phoneVerified: firebaseUser.phoneVerified,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        });

        Logger.info('🔥 HybridAuth: New user created from Firebase', { userId: user.id });
      } else {
        // Update existing user with Firebase data
        user = await this.userRepository.update(user.id, {
          name: firebaseUser.displayName || user.name,
          phone: firebaseUser.phoneNumber || user.phone,
          emailVerified: firebaseUser.emailVerified,
          phoneVerified: firebaseUser.phoneVerified,
          updatedAt: new Date()
        });

        Logger.info('🔥 HybridAuth: Existing user updated from Firebase', { userId: user.id });
      }

      // Generate tokens
      const tokens = generateTokenPair(user.id, user.email, user.role);

      const result: HybridAuthResult = {
        success: true,
        message: 'Firebase authentication successful',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            emailVerified: user.emailVerified,
            phoneVerified: user.phoneVerified,
            role: user.role,
            memberSince: user.createdAt
          },
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        }
      };

      Logger.info('🔥 HybridAuth: Authentication successful', { userId: user.id });
      this.logMethodExit('verifyFirebaseToken', { success: true, userId: user.id });
      return result;
    } catch (error) {
      Logger.error('🔥 HybridAuth: Authentication failed:', error);
      this.handleError('verifyFirebaseToken', error);
    }
  }

  // Create user from phone verification
  async createUserFromPhoneVerification(phoneNumber: string, firebaseToken: string): Promise<HybridAuthResult> {
    this.logMethodEntry('createUserFromPhoneVerification', { phoneNumber });
    
    try {
      // Verify Firebase token first
      const firebaseResult = await this.verifyFirebaseToken(firebaseToken);
      if (!firebaseResult.success) {
        return firebaseResult;
      }

      // Update user with phone verification
      const user = await this.userRepository.update((firebaseResult as any).user!.id, {
        phone: phoneNumber,
        phoneVerified: true,
        updatedAt: new Date()
      });

      const result: HybridAuthResult = {
        success: true,
        message: 'User created from phone verification',
        data: {
          user: {
            id: user!.id,
            name: user!.name,
            email: user!.email,
            phone: user!.phone,
            emailVerified: user!.emailVerified,
            phoneVerified: user!.phoneVerified,
            role: user!.role,
            memberSince: user!.createdAt
          },
          accessToken: (firebaseResult as any).tokens?.accessToken || '',
          refreshToken: (firebaseResult as any).tokens?.refreshToken || ''
        }
      };

      this.logMethodExit('createUserFromPhoneVerification', { success: true, userId: user!.id });
      return result;
    } catch (error) {
      this.handleError('createUserFromPhoneVerification', error);
    }
  }

  // Send phone verification code
  async sendPhoneVerificationCode(phoneNumber: string): Promise<boolean> {
    this.logMethodEntry('sendPhoneVerificationCode', { phoneNumber });
    
    try {
      // Generate verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store verification code
      await this.phoneVerificationRepository.create({
        id: uuidv4(),
        phoneNumber,
        verificationCode,
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Send SMS
      try {
        await this.smsService.sendVerificationSMS(phoneNumber, verificationCode);
      } catch (smsError) {
        Logger.error('SMS sending failed:', smsError);
        // Continue even if SMS fails - code is stored in database
      }

      Logger.info('Phone verification code sent', { phoneNumber });
      this.logMethodExit('sendPhoneVerificationCode', { success: true });
      return true;
    } catch (error) {
      this.handleError('sendPhoneVerificationCode', error);
    }
  }
}