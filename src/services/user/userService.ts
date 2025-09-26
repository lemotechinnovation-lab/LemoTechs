import { UserRepository } from '../../repositories/user/UserRepository';
import { PhoneVerificationRepository } from '../../repositories/system/PhoneVerificationRepository';
import { CreateUserRequest, UpdateUserRequest, UserProfile } from '../../models/user/userModel';
import { IUserService } from '../../infrastructure/di/interfaces';
import { BaseService } from '../base/BaseService';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export class UserService extends BaseService implements IUserService {
  constructor(
    private userRepository: UserRepository,
    private phoneVerificationRepository: PhoneVerificationRepository
  ) {
    super();
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<UserProfile | null> {
    this.logMethodEntry('getUserByEmail', { email });
    
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        this.logMethodExit('getUserByEmail', null);
        return null;
      }
      
      const userProfile = this.mapToUserProfile(user);
      this.logMethodExit('getUserByEmail', { userId: userProfile.id });
      return userProfile;
    } catch (error) {
      this.handleError('getUserByEmail', error);
    }
  }

  /**
   * Get user by email with password for authentication
   */
  async getUserByEmailWithPassword(email: string): Promise<{ user: UserProfile | null, password?: string }> {
    this.logMethodEntry('getUserByEmailWithPassword', { email });
    
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        this.logMethodExit('getUserByEmailWithPassword', { user: null });
        return { user: null };
      }
      
      const userProfile = this.mapToUserProfile(user);
      this.logMethodExit('getUserByEmailWithPassword', { userId: userProfile.id });
      return { user: userProfile, password: user.password };
    } catch (error) {
      this.handleError('getUserByEmailWithPassword', error);
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<UserProfile | null> {
    this.logMethodEntry('getUserById', { userId });
    
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        this.logMethodExit('getUserById', null);
        return null;
      }
      
      const userProfile = this.mapToUserProfile(user);
      this.logMethodExit('getUserById', { userId: userProfile.id });
      return userProfile;
    } catch (error) {
      this.handleError('getUserById', error);
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updates: UpdateUserRequest): Promise<UserProfile | null> {
    this.logMethodEntry('updateUserProfile', { userId, updates });
    
    try {
      const result = await this.userRepository.update(userId, updates);
      if (!result) {
        this.logMethodExit('updateUserProfile', null);
        return null;
      }
      
      const userProfile = this.mapToUserProfile(result);
      this.logMethodExit('updateUserProfile', { userId: userProfile.id });
      return userProfile;
    } catch (error) {
      this.handleError('updateUserProfile', error);
    }
  }

  /**
   * Update user password
   */
  async updateUserPassword(userId: string, newPassword: string): Promise<boolean> {
    this.logMethodEntry('updateUserPassword', { userId });
    
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      const result = await this.userRepository.update(userId, { password: hashedPassword });
      
      this.logMethodExit('updateUserPassword', { success: result !== null });
      return result !== null;
    } catch (error) {
      this.handleError('updateUserPassword', error);
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserRequest): Promise<UserProfile | null> {
    this.logMethodEntry('createUser', { email: userData.email });
    
    try {
      // Hash password if provided
      const hashedPassword = userData.password ? await bcrypt.hash(userData.password, 12) : undefined;
      
      const userDataWithHash = {
        ...userData,
        password: hashedPassword
      };
      
      const user = await this.userRepository.create(userDataWithHash);
      if (!user) {
        this.logMethodExit('createUser', null);
        return null;
      }
      
      const userProfile = this.mapToUserProfile(user);
      this.logMethodExit('createUser', { userId: userProfile.id });
      return userProfile;
    } catch (error) {
      this.handleError('createUser', error);
    }
  }

  /**
   * Store phone verification code
   */
  async storePhoneVerification(phone: string, code: string, expiresAt: Date): Promise<boolean> {
    this.logMethodEntry('storePhoneVerification', { phone });
    
    try {
      const verification = await this.phoneVerificationRepository.create({
        id: uuidv4(),
        phoneNumber: phone,
        verificationCode: code,
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      this.logMethodExit('storePhoneVerification', { success: verification !== null });
      return verification !== null;
    } catch (error) {
      this.handleError('storePhoneVerification', error);
    }
  }

  /**
   * Verify phone code
   */
  async verifyPhoneCode(phone: string, code: string): Promise<boolean> {
    this.logMethodEntry('verifyPhoneCode', { phone });
    
    try {
      const verification = await this.phoneVerificationRepository.findByPhoneNumber(phone);
      if (!verification) {
        this.logMethodExit('verifyPhoneCode', { success: false });
        return false;
      }
      
      // Check if code matches and not expired
      if (verification.verificationCode !== code || verification.expiresAt < new Date()) {
        this.logMethodExit('verifyPhoneCode', { success: false });
        return false;
      }
      
      // Verification successful - we can delete the verification record
      await this.phoneVerificationRepository.delete(verification.id);
      
      this.logMethodExit('verifyPhoneCode', { success: true });
      return true;
    } catch (error) {
      this.handleError('verifyPhoneCode', error);
    }
  }

  /**
   * Get user by phone
   */
  async getUserByPhone(phone: string): Promise<UserProfile | null> {
    this.logMethodEntry('getUserByPhone', { phone });
    
    try {
      const user = await this.userRepository.findByPhone(phone);
      if (!user) {
        this.logMethodExit('getUserByPhone', null);
        return null;
      }
      
      const userProfile = this.mapToUserProfile(user);
      this.logMethodExit('getUserByPhone', { userId: userProfile.id });
      return userProfile;
    } catch (error) {
      this.handleError('getUserByPhone', error);
    }
  }

  /**
   * Update phone verification status
   */
  async updatePhoneVerificationStatus(userId: string, phoneVerified: boolean): Promise<boolean> {
    this.logMethodEntry('updatePhoneVerificationStatus', { userId, phoneVerified });
    
    try {
      const result = await this.userRepository.update(userId, { phoneVerified });
      
      this.logMethodExit('updatePhoneVerificationStatus', { success: result !== null });
      return result !== null;
    } catch (error) {
      this.handleError('updatePhoneVerificationStatus', error);
    }
  }

  /**
   * Create user from phone verification
   */
  async createPhoneUser(phone: string, name?: string): Promise<UserProfile | null> {
    this.logMethodEntry('createPhoneUser', { phone, name });
    
    try {
      const userData = {
        name: name || 'Phone User',
        email: `${phone}@phone.user`, // Temporary email
        phone,
        role: 'user' as const,
        phoneVerified: true
      };
      
      const user = await this.userRepository.create(userData);
      if (!user) {
        this.logMethodExit('createPhoneUser', null);
        return null;
      }
      
      const userProfile = this.mapToUserProfile(user);
      this.logMethodExit('createPhoneUser', { userId: userProfile.id });
      return userProfile;
    } catch (error) {
      this.handleError('createPhoneUser', error);
    }
  }

  /**
   * Cleanup verification code
   */
  async cleanupVerificationCode(phone: string): Promise<boolean> {
    this.logMethodEntry('cleanupVerificationCode', { phone });
    
    try {
      const verification = await this.phoneVerificationRepository.findByPhoneNumber(phone);
      if (!verification) {
        this.logMethodExit('cleanupVerificationCode', { success: false });
        return false;
      }
      
      await this.phoneVerificationRepository.delete(verification.id);
      
      this.logMethodExit('cleanupVerificationCode', { success: true });
      return true;
    } catch (error) {
      this.handleError('cleanupVerificationCode', error);
    }
  }

  /**
   * Map database user to UserProfile
   */
  private mapToUserProfile(user: any): UserProfile {
    return {
      id: user.id,
      name: user.name || 'Unknown',
      email: user.email,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar,
      emailVerified: user.emailVerified || false,
      phoneVerified: user.phoneVerified || false,
      role: user.role as 'user' | 'driver' | 'shop' | 'admin',
      loyaltyPoints: user.loyaltyPoints || 0,
      totalBookings: user.totalBookings || 0,
      memberSince: user.createdAt
    };
  }
}