import { DriverRepository } from '../../repositories/driver/DriverRepository';
import { UserRepository } from '../../repositories/user/UserRepository';
import { CreateDriverRequest, UpdateDriverRequest, DriverProfile } from '../../models/driver/driverModel';
import { IDriverService } from '../../infrastructure/di/interfaces';
import { BaseService } from '../base/BaseService';

export class DriverService extends BaseService implements IDriverService {
  constructor(
    private driverRepository: DriverRepository,
    private userRepository: UserRepository
  ) {
    super();
  }

  /**
   * Get driver ID by user ID
   */
  async getDriverProfileIdByUserId(userId: string): Promise<string | null> {
    this.logMethodEntry('getDriverProfileIdByUserId', { userId });
    
    try {
      const driver = await this.driverRepository.findByUserId(userId);
      const driverId = driver?.id || null;
      
      this.logMethodExit('getDriverProfileIdByUserId', { driverId });
      return driverId;
    } catch (error) {
      this.handleError('getDriverProfileIdByUserId', error);
    }
  }

  /**
   * Set driver status
   */
  async setDriverProfileStatus(driverId: string, status: string): Promise<boolean> {
    this.logMethodEntry('setDriverProfileStatus', { driverId, status });
    
    try {
      const result = await this.driverRepository.update(driverId, { status: status as any });
      
      this.logMethodExit('setDriverProfileStatus', { success: result !== null });
      return result !== null;
    } catch (error) {
      this.handleError('setDriverProfileStatus', error);
    }
  }

  /**
   * Get driver profile by user ID
   */
  async getDriverProfileByUserId(userId: string): Promise<DriverProfile | null> {
    this.logMethodEntry('getDriverProfileProfileByUserId', { userId });
    
    try {
      const driver = await this.driverRepository.findByUserId(userId);
      
      this.logMethodExit('getDriverProfileProfileByUserId', { found: driver !== null });
      return driver;
    } catch (error) {
      this.handleError('getDriverProfileProfileByUserId', error);
    }
  }

  /**
   * Create driver profile record
   */
  async createDriverProfileRecord(driverData: CreateDriverRequest): Promise<DriverProfile | null> {
    this.logMethodEntry('createDriverProfileProfileRecord', { userId: driverData.userId });
    
    try {
      const driver = await this.driverRepository.create(driverData);
      
      this.logMethodExit('createDriverProfileProfileRecord', { driverId: driver?.id });
      return driver;
    } catch (error) {
      this.handleError('createDriverProfileProfileRecord', error);
    }
  }

  /**
   * Update driver profile by user ID
   */
  async updateDriverProfileByUserId(userId: string, updates: UpdateDriverRequest): Promise<DriverProfile | null> {
    this.logMethodEntry('updateDriverProfileProfileByUserId', { userId });
    
    try {
      const driver = await this.driverRepository.findByUserId(userId);
      if (!driver) {
        this.logMethodExit('updateDriverProfileProfileByUserId', null);
        return null;
      }
      
      const updatedDriverProfile = await this.driverRepository.update(driver.id, updates);
      
      this.logMethodExit('updateDriverProfileProfileByUserId', { driverId: updatedDriverProfile?.id });
      return updatedDriverProfile;
    } catch (error) {
      this.handleError('updateDriverProfileProfileByUserId', error);
    }
  }

  /**
   * Update driver status by user ID
   */
  async updateDriverProfileStatusByUserId(userId: string, status: string): Promise<boolean> {
    this.logMethodEntry('updateDriverProfileStatusByUserId', { userId, status });
    
    try {
      const driver = await this.driverRepository.findByUserId(userId);
      if (!driver) {
        this.logMethodExit('updateDriverProfileStatusByUserId', { success: false });
        return false;
      }
      
      const result = await this.driverRepository.update(driver.id, { status: status as any });
      
      this.logMethodExit('updateDriverProfileStatusByUserId', { success: result !== null });
      return result !== null;
    } catch (error) {
      this.handleError('updateDriverProfileStatusByUserId', error);
    }
  }

  /**
   * Check if driver profile exists
   */
  async checkDriverProfileProfileExists(userId: string): Promise<boolean> {
    this.logMethodEntry('checkDriverProfileProfileExists', { userId });
    
    try {
      const driver = await this.driverRepository.findByUserId(userId);
      const exists = driver !== null;
      
      this.logMethodExit('checkDriverProfileProfileExists', { exists });
      return exists;
    } catch (error) {
      this.handleError('checkDriverProfileProfileExists', error);
    }
  }

  /**
   * Update user role
   */
  async updateUserRole(userId: string, role: string): Promise<boolean> {
    this.logMethodEntry('updateUserRole', { userId, role });
    
    try {
      const result = await this.userRepository.update(userId, { role: role as any });
      
      this.logMethodExit('updateUserRole', { success: result !== null });
      return result !== null;
    } catch (error) {
      this.handleError('updateUserRole', error);
    }
  }

  /**
   * Get driver ID by user ID
   */
  async getDriverIdByUserId(userId: string): Promise<string | null> {
    this.logMethodEntry('getDriverIdByUserId', { userId });
    
    try {
      const driver = await this.driverRepository.findByUserId(userId);
      const driverId = driver?.id || null;
      
      this.logMethodExit('getDriverIdByUserId', { driverId });
      return driverId;
    } catch (error) {
      this.handleError('getDriverIdByUserId', error as Error);
    }
  }

  /**
   * Set driver status
   */
  async setDriverStatus(driverId: string, status: string): Promise<boolean> {
    this.logMethodEntry('setDriverStatus', { driverId, status });
    
    try {
      const result = await this.driverRepository.update(driverId, { status: status as any });
      this.logMethodExit('setDriverStatus', { success: !!result });
      return !!result;
    } catch (error) {
      this.handleError('setDriverStatus', error as Error);
    }
  }

  /**
   * Update driver status by user ID
   */
  async updateDriverStatusByUserId(userId: string, status: string): Promise<boolean> {
    this.logMethodEntry('updateDriverStatusByUserId', { userId, status });
    
    try {
      const driver = await this.driverRepository.findByUserId(userId);
      if (!driver) {
        this.logMethodExit('updateDriverStatusByUserId', { success: false, reason: 'Driver not found' });
        return false;
      }

      const result = await this.driverRepository.update(driver.id, { status: status as any });
      this.logMethodExit('updateDriverStatusByUserId', { success: !!result });
      return !!result;
    } catch (error) {
      this.handleError('updateDriverStatusByUserId', error as Error);
    }
  }

  /**
   * Check if driver profile exists
   */
  async checkDriverProfileExists(userId: string): Promise<boolean> {
    this.logMethodEntry('checkDriverProfileExists', { userId });
    
    try {
      const driver = await this.driverRepository.findByUserId(userId);
      const exists = !!driver;
      
      this.logMethodExit('checkDriverProfileExists', { exists });
      return exists;
    } catch (error) {
      this.handleError('checkDriverProfileExists', error as Error);
    }
  }
}