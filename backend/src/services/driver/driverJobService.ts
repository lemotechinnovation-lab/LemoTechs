import { DriverJob, DriverLocation } from '../../models/driver/driverJobModel';
import { DriverJobRepository } from '../../repositories/driver/DriverJobRepository';
import { DriverRepository } from '../../repositories/driver/DriverRepository';
import { DriverLocationRepository } from '../../repositories/driver/DriverLocationRepository';
import { IDriverJobService } from '../../infrastructure/di/interfaces';
import { BaseService } from '../base/BaseService';

export class DriverJobService extends BaseService implements IDriverJobService {
  constructor(
    private driverJobRepository: DriverJobRepository,
    private driverRepository: DriverRepository,
    private driverLocationRepository: DriverLocationRepository
  ) {
    super();
  }

  // Create a new driver job
  async createJob(userId: string, jobData: Partial<DriverJob>): Promise<DriverJob> {
    this.logMethodEntry('createJob', { userId });
    
    try {
      const driver = await this.driverRepository.findByUserId(userId);
      if (!driver) {
        throw new Error('Driver not found');
      }

      const job = await this.driverJobRepository.create({
        id: jobData.id || `job_${Date.now()}`,
        driverId: driver.id,
        bookingId: jobData.bookingId || '',
        status: jobData.status || 'assigned',
        assignedAt: new Date(),
        startedAt: jobData.startedAt,
        completedAt: jobData.completedAt,
        notes: jobData.notes,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      this.logMethodExit('createJob', { jobId: job.id });
      return job;
    } catch (error) {
      this.handleError('createJob', error);
    }
  }

  // Get jobs for a driver
  async getJobs(userId: string, filters: any): Promise<any> {
    this.logMethodEntry('getJobs', { userId, filters });
    
    try {
      const driver = await this.driverRepository.findByUserId(userId);
      if (!driver) {
        throw new Error('Driver not found');
      }

      const jobs = await this.driverJobRepository.findByDriverId(driver.id);
      
      this.logMethodExit('getJobs', { count: jobs.length });
      return jobs;
    } catch (error) {
      this.handleError('getJobs', error);
    }
  }

  // Get job by ID
  async getJobById(userId: string, jobId: string): Promise<any> {
    this.logMethodEntry('getJobById', { userId, jobId });
    
    try {
      const driver = await this.driverRepository.findByUserId(userId);
      if (!driver) {
        throw new Error('Driver not found');
      }

      const job = await this.driverJobRepository.findById(jobId);
      if (!job || job.driverId !== driver.id) {
        this.logMethodExit('getJobById', null);
        return null;
      }

      this.logMethodExit('getJobById', { jobId: job.id });
      return job;
    } catch (error) {
      this.handleError('getJobById', error);
    }
  }

  // Accept a job
  async acceptJob(userId: string, jobId: string): Promise<any> {
    this.logMethodEntry('acceptJob', { userId, jobId });
    
    try {
      const driver = await this.driverRepository.findByUserId(userId);
      if (!driver) {
        throw new Error('Driver not found');
      }

      const job = await this.driverJobRepository.findById(jobId);
      if (!job || job.driverId !== driver.id) {
        throw new Error('Job not found');
      }

      const updatedJob = await this.driverJobRepository.update(jobId, {
        status: 'in_progress',
        startedAt: new Date(),
        updatedAt: new Date()
      });

      this.logMethodExit('acceptJob', { jobId: updatedJob?.id });
      return updatedJob;
    } catch (error) {
      this.handleError('acceptJob', error);
    }
  }

  // Update job status
  async updateJobStatus(userId: string, jobId: string, status: string, location?: any): Promise<any> {
    this.logMethodEntry('updateJobStatus', { userId, jobId, status });
    
    try {
      const driver = await this.driverRepository.findByUserId(userId);
      if (!driver) {
        throw new Error('Driver not found');
      }

      const job = await this.driverJobRepository.findById(jobId);
      if (!job || job.driverId !== driver.id) {
        throw new Error('Job not found');
      }

      const updateData: any = {
        status,
        updatedAt: new Date()
      };

      if (status === 'completed') {
        updateData.completedAt = new Date();
      }

      const updatedJob = await this.driverJobRepository.update(jobId, updateData);

      // Update driver location if provided
      if (location) {
        await this.updateLocation(userId, location);
      }

      this.logMethodExit('updateJobStatus', { jobId: updatedJob?.id });
      return updatedJob;
    } catch (error) {
      this.handleError('updateJobStatus', error);
    }
  }

  // Update driver location
  async updateLocation(userId: string, location: any): Promise<boolean> {
    this.logMethodEntry('updateLocation', { userId });
    
    try {
      const driver = await this.driverRepository.findByUserId(userId);
      if (!driver) {
        throw new Error('Driver not found');
      }

      const driverLocation: DriverLocation = {
        id: `loc_${Date.now()}`,
        driverId: driver.id,
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.driverLocationRepository.create(driverLocation);

      this.logMethodExit('updateLocation', { success: true });
      return true;
    } catch (error) {
      this.handleError('updateLocation', error);
    }
  }

  // Get optimized route
  async getOptimizedRoute(userId: string, jobIds: string[]): Promise<any> {
    this.logMethodEntry('getOptimizedRoute', { userId, jobCount: jobIds.length });
    
    try {
      // Basic route optimization - sort jobs by distance from driver location
      const jobs = await Promise.all(jobIds.map(id => this.driverJobRepository.findById(id)));
      const validJobs = jobs.filter(job => job !== null);
      
      // Simple sorting by assignment time (in production, use proper routing algorithm)
      const sortedJobs = validJobs.sort((a, b) => {
        return a!.assignedAt.getTime() - b!.assignedAt.getTime();
      });

      const route = {
        jobs: sortedJobs.map(job => job!.id),
        totalDistance: sortedJobs.length * 5, // Estimate 5km per job
        estimatedTime: sortedJobs.length * 30, // Estimate 30 minutes per job
        waypoints: [] // Will be populated from booking pickup locations
      };

      this.logMethodExit('getOptimizedRoute', route);
      return route;
    } catch (error) {
      this.handleError('getOptimizedRoute', error);
    }
  }

  // Get driver statistics
  async getStats(userId: string, period: string): Promise<any> {
    this.logMethodEntry('getStats', { userId, period });
    
    try {
      const driver = await this.driverRepository.findByUserId(userId);
      if (!driver) {
        throw new Error('Driver not found');
      }

      const jobs = await this.driverJobRepository.findByDriverId(driver.id);
      const completedJobs = jobs.filter(job => job.status === 'completed');
      
      const stats = {
        totalJobs: jobs.length,
        completedJobs: completedJobs.length,
        completionRate: jobs.length > 0 ? (completedJobs.length / jobs.length) * 100 : 0,
        averageRating: driver.rating || 4.5,
        totalEarnings: completedJobs.reduce((sum, job) => sum + ((job as any).amount || 0), 0),
        period
      };

      this.logMethodExit('getStats', stats);
      return stats;
    } catch (error) {
      this.handleError('getStats', error);
    }
  }

  // Complete a job
  async completeJob(userId: string, jobId: string): Promise<any> {
    this.logMethodEntry('completeJob', { userId, jobId });
    
    try {
      const driver = await this.driverRepository.findByUserId(userId);
      if (!driver) {
        throw new Error('Driver not found');
      }

      const job = await this.driverJobRepository.findById(jobId);
      if (!job || job.driverId !== driver.id) {
        throw new Error('Job not found');
      }

      const updatedJob = await this.driverJobRepository.update(jobId, {
        status: 'completed',
        completedAt: new Date(),
        updatedAt: new Date()
      });

      this.logMethodExit('completeJob', { jobId: updatedJob?.id });
      return updatedJob;
    } catch (error) {
      this.handleError('completeJob', error);
    }
  }

  // Get available jobs
  async getAvailableJobs(userId: string, radius: number): Promise<any> {
    this.logMethodEntry('getAvailableJobs', { userId, radius });
    
    try {
      const driver = await this.driverRepository.findByUserId(userId);
      if (!driver) {
        this.logMethodExit('getAvailableJobs', { error: 'Driver not found' });
        return [];
      }

      // Find available jobs within radius
      const allJobs = await this.driverJobRepository.findAll();
      const availableJobs = allJobs.filter(job => {
        if (job.status !== 'assigned') return false;
        
        // For now, return all assigned jobs (in production, calculate actual distance)
        return true;
      });

      this.logMethodExit('getAvailableJobs', { count: availableJobs.length });
      return availableJobs;
    } catch (error) {
      this.handleError('getAvailableJobs', error);
    }
  }
}