import { DriverLocation } from '../../models/driver/driverJobModel';
import { DriverMatch, AssignmentRequest, AssignmentResult } from '../../models/driver/driverAssignmentModel';
import { DRIVER_ASSIGNMENT } from '../../utils/constants';
import { Logger } from '../../utils/logger';
import { DriverRepository } from '../../repositories/driver/DriverRepository';
import { DriverLocationRepository } from '../../repositories/driver/DriverLocationRepository';
import { DriverJobRepository } from '../../repositories/driver/DriverJobRepository';
import { BookingRepository } from '../../repositories/booking/BookingRepository';
import { IDriverAssignmentService } from '../../infrastructure/di/interfaces';
import { BaseService } from '../base/BaseService';
import { v4 as uuidv4 } from 'uuid';

// Re-export types for controllers
export type { AssignmentRequest, AssignmentResult, DriverMatch } from '../../models/driver/driverAssignmentModel';

export class DriverAssignmentService extends BaseService implements IDriverAssignmentService {
  constructor(
    private driverRepository: DriverRepository,
    private driverLocationRepository: DriverLocationRepository,
    private driverJobRepository: DriverJobRepository,
    private bookingRepository: BookingRepository
  ) {
    super();
  }

  /**
   * Find the best available driver for a booking
   */
  async findBestDriver(request: AssignmentRequest): Promise<AssignmentResult> {
    this.logMethodEntry('findBestDriver', { bookingId: request.bookingId });
    
    try {
      Logger.info('🚗 Finding best driver for booking', { bookingId: request.bookingId });

      // Get available drivers within search radius
      const availableDrivers = await this.getAvailableDriversInRadius(
        request.pickupLocation,
        DRIVER_ASSIGNMENT.MAX_SEARCH_RADIUS_KM
      );

      if (availableDrivers.length === 0) {
        const result = {
          success: false,
          message: 'No drivers available in your area',
          estimatedWaitTime: 30 // Default wait time
        };
        this.logMethodExit('findBestDriver', result);
        return result;
      }

      // Score and rank drivers
      const scoredDrivers = await this.scoreDrivers(availableDrivers, request);

      // Sort by score (highest first)
      scoredDrivers.sort((a, b) => b.score - a.score);

      // Check if we have any drivers after scoring
      if (scoredDrivers.length === 0) {
        const result = {
          success: false,
          message: 'No suitable drivers found',
          alternativeDrivers: [],
          estimatedWaitTime: 30
        };
        this.logMethodExit('findBestDriver', result);
        return result;
      }

      const bestDriver = scoredDrivers[0];
      if (!bestDriver) {
        Logger.warn('No available drivers found');
        return {
          success: false,
          message: 'No available drivers found',
          alternativeDrivers: [],
          estimatedWaitTime: 0
        };
      }

      const alternativeDrivers = scoredDrivers.slice(1, 4); // Top 3 alternatives

      // Calculate estimated wait time based on distance
      const estimatedWaitTime = Math.max(5, Math.round(bestDriver.distance * 2)); // 2 minutes per km

      const result = {
          success: true,
        driver: bestDriver,
        alternativeDrivers,
        estimatedWaitTime,
        message: `Driver ${bestDriver.driverId} assigned successfully`
      };

      Logger.info('✅ Best driver found', { 
        driverId: bestDriver.driverId, 
        score: bestDriver.score,
        distance: bestDriver.distance 
      });

      this.logMethodExit('findBestDriver', result);
      return result;
    } catch (error) {
      this.handleError('findBestDriver', error);
    }
  }

  /**
   * Get available drivers in radius (public method for controllers)
   */
  async getAvailableDriversInRadiusPublic(lat: number, lng: number, radius: number): Promise<any[]> {
    this.logMethodEntry('getAvailableDriversInRadiusPublic', { lat, lng, radius });
    
    try {
      const drivers = await this.getAvailableDriversInRadius({ lat, lng }, radius);
      
      this.logMethodExit('getAvailableDriversInRadiusPublic', { count: drivers.length });
      return drivers;
    } catch (error) {
      this.handleError('getAvailableDriversInRadiusPublic', error);
    }
  }

  /**
   * Update driver location
   */
  async updateDriverLocation(driverId: string, location: any): Promise<boolean> {
    this.logMethodEntry('updateDriverLocation', { driverId });
    
    try {
      const driverLocation: DriverLocation = {
        id: uuidv4(),
        driverId,
        latitude: location.lat,
        longitude: location.lng,
        accuracy: location.accuracy,
        timestamp: location.timestamp || new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.driverLocationRepository.create(driverLocation);

      Logger.info('Driver location updated', { driverId, lat: location.lat, lng: location.lng });
      this.logMethodExit('updateDriverLocation', { success: true });
      return true;
    } catch (error) {
      this.handleError('updateDriverLocation', error);
    }
  }

  /**
   * Handle driver rejection
   */
  async handleDriverRejection(driverId: string, bookingId: string, reason: string): Promise<any> {
    this.logMethodEntry('handleDriverRejection', { driverId, bookingId, reason });
    
    try {
      // Update booking status
      await this.bookingRepository.update(bookingId, {
        status: 'pending',
        driverId: undefined
      });

      // Update driver status
      await this.driverRepository.update(driverId, { status: 'available' });

      Logger.info('Driver rejection handled', { driverId, bookingId, reason });
      
      const result = {
        success: true, 
        message: 'Driver rejection processed',
        bookingId,
        driverId
      };

      this.logMethodExit('handleDriverRejection', result);
      return result;
    } catch (error) {
      this.handleError('handleDriverRejection', error);
    }
  }

  /**
   * Get driver statistics
   */
  async getDriverStats(driverId: string): Promise<any> {
    this.logMethodEntry('getDriverStats', { driverId });
    
    try {
      const driver = await this.driverRepository.findById(driverId);
      if (!driver) {
        this.logMethodExit('getDriverStats', null);
        return null;
      }

      const jobs = await this.driverJobRepository.findByDriverId(driverId);
      const completedJobs = jobs.filter(job => job.status === 'completed');
      
      const stats = {
        totalJobs: jobs.length,
        completedJobs: completedJobs.length,
        completionRate: jobs.length > 0 ? (completedJobs.length / jobs.length) * 100 : 0,
        averageRating: driver.rating || 4.5,
        totalEarnings: completedJobs.reduce((sum, job) => sum + ((job as any).amount || 0), 0),
        lastActive: jobs.length > 0 ? jobs.reduce((latest, job) => 
          job.createdAt > latest ? job.createdAt : latest, jobs[0]!.createdAt
        ) : new Date()
      };

      this.logMethodExit('getDriverStats', stats);
      return stats;
    } catch (error) {
      this.handleError('getDriverStats', error);
    }
  }

  /**
   * Batch assign jobs to drivers
   */
  async batchAssignJobs(requests: AssignmentRequest[]): Promise<any[]> {
    this.logMethodEntry('batchAssignJobs', { count: requests.length });
    
    try {
      const results = [];
      
      for (const request of requests) {
        const result = await this.findBestDriver(request);
        results.push(result);
      }

      this.logMethodExit('batchAssignJobs', { processed: results.length });
      return results;
    } catch (error) {
      this.handleError('batchAssignJobs', error);
    }
  }

  /**
   * Get alternative drivers for a booking
   */
  async getAlternativeDrivers(bookingId: string, excludedDriverIds: string[]): Promise<any[]> {
    this.logMethodEntry('getAlternativeDrivers', { bookingId, excludedCount: excludedDriverIds.length });
    
    try {
      const booking = await this.bookingRepository.findById(bookingId);
      if (!booking || !booking.pickupCoords) {
        this.logMethodExit('getAlternativeDrivers', []);
        return [];
      }

    const availableDrivers = await this.getAvailableDriversInRadius(
        booking.pickupCoords,
        DRIVER_ASSIGNMENT.MAX_SEARCH_RADIUS_KM
      );

      const alternativeDrivers = availableDrivers.filter(driver => 
        !excludedDriverIds.includes(driver.driverId)
      );

      this.logMethodExit('getAlternativeDrivers', { count: alternativeDrivers.length });
      return alternativeDrivers;
    } catch (error) {
      this.handleError('getAlternativeDrivers', error);
    }
  }

  /**
   * Get available drivers within radius
   */
  private async getAvailableDriversInRadius(pickupLocation: { lat: number; lng: number }, radiusKm: number): Promise<DriverMatch[]> {
    try {
      const drivers = await this.driverRepository.findDriversInRadius(
        pickupLocation,
        radiusKm
      );

      return drivers.map(driver => ({
        driverId: driver.id,
        userId: driver.userId,
        name: driver.name || 'Unknown Driver',
        phone: driver.phone || 'Unknown',
        rating: driver.rating || 4.5,
        distance: 0, // Will be calculated in scoring
        estimatedArrivalTime: 0, // Will be calculated in scoring
        currentLocation: { lat: 0, lng: 0 }, // Will be set from location data
        vehicle: 'Unknown Vehicle',
        totalJobs: 0,
        lastActive: new Date(),
        score: 0, // Will be calculated in scoring
        isAvailable: true // All drivers returned are available
      }));
    } catch (error) {
      Logger.error('Failed to get available drivers:', error);
      return [];
    }
  }

  /**
   * Score drivers based on multiple factors
   */
  private async scoreDrivers(drivers: DriverMatch[], request: AssignmentRequest): Promise<DriverMatch[]> {
    try {
      const scoredDrivers = [];

      for (const driver of drivers) {
        // Get driver's current location
        const location = await this.driverLocationRepository.findLatestByDriverId(driver.driverId);
        if (!location) continue;

        // Calculate distance
        const distance = this.calculateDistance(
          request.pickupLocation.lat,
          request.pickupLocation.lng,
          location.latitude,
          location.longitude
        );

        // Update driver data
        driver.distance = distance;
        driver.currentLocation = { lat: location.latitude, lng: location.longitude };
        driver.estimatedArrivalTime = Math.round(distance * 2); // 2 minutes per km

        // Calculate score
        const score = await this.calculateDriverScore(driver, request);
        driver.score = score;

        // Only include drivers with positive scores
        if (score > 0) {
          scoredDrivers.push(driver);
        }
      }

      return scoredDrivers;
    } catch (error) {
      Logger.error('Failed to score drivers:', error);
      return [];
    }
  }

  /**
   * Calculate driver score based on multiple factors
   */
  private async calculateDriverScore(driver: DriverMatch, request: AssignmentRequest): Promise<number> {
    const weights = DRIVER_ASSIGNMENT.SCORING_WEIGHTS;
    
    // Distance score (closer is better)
    const maxDistance = DRIVER_ASSIGNMENT.MAX_SEARCH_RADIUS_KM;
    const distanceScore = Math.max(0, 1 - (driver.distance / maxDistance));
    
    // Rating score (higher is better)
    const ratingScore = driver.rating / 5;
    
    // Response time score (faster is better)
    const responseTimeScore = Math.max(0, 1 - (driver.estimatedArrivalTime / 60)); // Normalize to 1 hour
    
    // Load balance score (less busy is better)
    const currentJobs = await this.driverJobRepository.findByDriverId(driver.driverId);
    const activeJobs = currentJobs.filter(job => job.status === 'in_progress' || job.status === 'assigned');
    const loadBalanceScore = Math.max(0, 1 - (activeJobs.length / 5)); // Normalize to max 5 concurrent jobs
    
    // Priority bonus
    const priorityBonus = request.priority === 'high' ? 0.1 : 0;
    
    const totalScore = 
      (distanceScore * weights.DISTANCE) +
      (ratingScore * weights.RATING) +
      (responseTimeScore * weights.RESPONSE_TIME) +
      (loadBalanceScore * weights.LOAD_BALANCE) +
      priorityBonus;
    
    return Math.round(totalScore * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  /**
   * Convert degrees to radians
   */
  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
}