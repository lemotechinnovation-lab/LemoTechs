import { Request, Response } from 'express';
import { getServices } from '../infrastructure/di/injector';
import { Logger } from '../utils/logger';

export const optimizeRouteController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { driverId, points, constraints, preferences } = req.body;
    
    if (!driverId || !points || !Array.isArray(points) || points.length < 2) {
      res.status(400).json({
        success: false,
        message: 'Driver ID and at least 2 route points are required'
      });
      return;
    }

    const services = getServices(req);
    const request = {
      driverId,
      points,
      constraints: constraints || {},
      preferences: preferences || {}
    };
    
    const result = await services.routeOptimizationService.optimizeRoute(request);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          optimizedRoute: result.optimizedRoute,
          alternatives: result.alternatives,
          warnings: result.warnings
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    Logger.error('Optimize route controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const createMultiStopJobController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { driverId, stops, constraints } = req.body;
    
    if (!driverId || !stops || !Array.isArray(stops) || stops.length < 2) {
      res.status(400).json({
        success: false,
        message: 'Driver ID and at least 2 stops are required'
      });
      return;
    }

    const services = getServices(req);
    const job = await services.routeOptimizationService.createMultiStopJob(driverId, stops, constraints || {});
    
    res.status(201).json({
      success: true,
      message: 'Multi-stop job created successfully',
      data: job
    });
  } catch (error) {
    Logger.error('Create multi-stop job controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getRealTimeRouteUpdatesController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { routeId } = req.params;
    
    if (!routeId) {
      res.status(400).json({
        success: false,
        message: 'Route ID is required'
      });
      return;
    }

    const services = getServices(req);
    const updates = await services.routeOptimizationService.getRealTimeRouteUpdates(routeId);
    
    res.status(200).json({
      success: true,
      data: updates
    });
  } catch (error) {
    Logger.error('Get real-time route updates controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const calculateETAController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { routeId } = req.params;
    const { currentLocation } = req.body;
    
    if (!routeId || !currentLocation) {
      res.status(400).json({
        success: false,
        message: 'Route ID and current location are required'
      });
      return;
    }

    const services = getServices(req);
    const eta = await services.routeOptimizationService.calculateETA(routeId, currentLocation);
    
    res.status(200).json({
      success: true,
      data: {
        routeId,
        eta,
        calculatedAt: new Date()
      }
    });
  } catch (error) {
    Logger.error('Calculate ETA controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getRouteAnalyticsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { routeId } = req.params;
    const { period = 'week' } = req.query;
    
    if (!routeId) {
      res.status(400).json({
        success: false,
        message: 'Route ID is required'
      });
      return;
    }

    const services = getServices(req);
    const analytics = await services.routeOptimizationService.getRouteAnalytics(
      routeId, 
      period as 'day' | 'week' | 'month'
    );
    
    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    Logger.error('Get route analytics controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getOptimizationMetricsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { driverId } = req.query;
    
    const services = getServices(req);
    const metrics = await services.routeOptimizationService.getOptimizationMetrics(
      driverId as string
    );
    
    res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    Logger.error('Get optimization metrics controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
