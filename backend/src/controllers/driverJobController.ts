import { Request, Response } from 'express';
import { getServices } from '../infrastructure/di/injector';
import { DriverJob, DriverLocation, DriverStats, RouteOptimization } from '../types';
import { Logger } from '../utils/logger';

// Driver Job Management Controller
export class DriverJobController {
  // Get all jobs for a driver
  static async getJobs(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { status, page = 1, limit = 20 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const { driverJobService } = getServices(req);
      const jobs = await driverJobService.getJobs(userId, {
        status: status as string,
        limit: Number(limit),
        offset
      });

      res.json({
        success: true,
        message: 'Jobs retrieved successfully',
        data: jobs
      });
    } catch (error) {
      Logger.error('Error getting driver jobs:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve jobs',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get a specific job
  static async getJobById(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { jobId } = req.params;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { driverJobService } = getServices(req);
      const job = await driverJobService.getJobById(userId, jobId!);

      if (!job) {
        res.status(404).json({ success: false, message: 'Job not found' });
        return;
      }

      res.json({
        success: true,
        message: 'Job retrieved successfully',
        data: job
      });
    } catch (error) {
      Logger.error('Error getting driver job:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve job',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Accept a job
  static async acceptJob(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { jobId } = req.params;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { driverJobService } = getServices(req);
      const updatedJob = await driverJobService.acceptJob(userId, jobId!);

      res.json({
        success: true,
        message: 'Job accepted successfully',
        data: updatedJob
      });
    } catch (error) {
      Logger.error('Error accepting job:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to accept job',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update job status
  static async updateJobStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { jobId } = req.params;
      const { status, location } = req.body;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { driverJobService } = getServices(req);
      const updatedJob = await driverJobService.updateJobStatus(userId, jobId!, status, location);

      res.json({
        success: true,
        message: 'Job status updated successfully',
        data: updatedJob
      });
    } catch (error) {
      Logger.error('Error updating job status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update job status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update driver location
  static async updateLocation(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { lat, lng, heading, speed } = req.body;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const location: DriverLocation = {
        lat,
        lng,
        heading,
        speed,
        timestamp: new Date()
      };

      const { driverJobService } = getServices(req);
      await driverJobService.updateLocation(userId, location);

      res.json({
        success: true,
        message: 'Location updated successfully'
      });
    } catch (error) {
      Logger.error('Error updating location:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update location',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get optimized route
  static async getOptimizedRoute(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { jobIds } = req.body;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      if (!jobIds || !Array.isArray(jobIds) || jobIds.length < 2) {
        res.status(400).json({
          success: false,
          message: 'At least 2 job IDs are required for route optimization'
        });
        return;
      }

      const { driverJobService } = getServices(req);
      const optimizedRoute = await driverJobService.getOptimizedRoute(userId, jobIds);

      if (!optimizedRoute) {
        res.status(404).json({
          success: false,
          message: 'Could not optimize route for the provided jobs'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Route optimized successfully',
        data: optimizedRoute
      });
    } catch (error) {
      Logger.error('Error optimizing route:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to optimize route',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Send message to customer
  static async messageCustomer(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { jobId } = req.params;
      const { message } = req.body;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      // This would integrate with your messaging system (SignalR, SMS, etc.)
      Logger.info(`Driver ${userId} sending message to customer for job ${jobId}: ${message}`);

      res.json({
        success: true,
        message: 'Message sent successfully'
      });
    } catch (error) {
      Logger.error('Error sending message to customer:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send message',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Send message to shop
  static async messageShop(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { jobId } = req.params;
      const { message } = req.body;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      // This would integrate with your messaging system (SignalR, SMS, etc.)
      Logger.info(`Driver ${userId} sending message to shop for job ${jobId}: ${message}`);

      res.json({
        success: true,
        message: 'Message sent successfully'
      });
    } catch (error) {
      Logger.error('Error sending message to shop:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send message',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get driver statistics
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { period = 'week' } = req.query;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { driverJobService } = getServices(req);
      const stats = await driverJobService.getStats(userId, period as 'day' | 'week' | 'month' | 'year');

      res.json({
        success: true,
        message: 'Statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      Logger.error('Error getting driver stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve statistics',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Complete job
  static async completeJob(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { jobId } = req.params;
      const { notes, photos } = req.body;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { driverJobService } = getServices(req);
      const updatedJob = await driverJobService.completeJob(userId, jobId!);

      res.json({
        success: true,
        message: 'Job completed successfully',
        data: updatedJob
      });
    } catch (error) {
      Logger.error('Error completing job:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to complete job',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get available jobs in area
  static async getAvailableJobs(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { radius = 10 } = req.query;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { driverJobService } = getServices(req);
      const availableJobs = await driverJobService.getAvailableJobs(userId, Number(radius));

      res.json({
        success: true,
        message: 'Available jobs retrieved successfully',
        data: availableJobs
      });
    } catch (error) {
      Logger.error('Error getting available jobs:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve available jobs',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
