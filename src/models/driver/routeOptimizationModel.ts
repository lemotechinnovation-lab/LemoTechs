// Driver Route Optimization Models
// This file contains models for advanced route optimization and driver management

export interface RoutePoint {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  type: 'pickup' | 'delivery' | 'shop' | 'depot';
  bookingId?: string;
  shopId?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  timeWindow?: {
    start: Date;
    end: Date;
  };
  estimatedDuration: number; // minutes
  actualDuration?: number;
  notes?: string;
}

export interface RouteOptimizationRequest {
  driverId: string;
  points: RoutePoint[];
  constraints: {
    maxDistance?: number; // km
    maxDuration?: number; // minutes
    vehicleCapacity?: number;
    fuelEfficiency?: number; // km/liter
    avoidTolls?: boolean;
    avoidHighways?: boolean;
    preferredRouteType?: 'fastest' | 'shortest' | 'most_economical';
  };
  preferences: {
    startTime?: Date;
    endTime?: Date;
    breakDuration?: number; // minutes
    maxConsecutiveHours?: number;
  };
}

export interface OptimizedRoute {
  id: string;
  driverId: string;
  totalDistance: number; // km
  totalDuration: number; // minutes
  totalCost: number; // estimated cost
  fuelConsumption: number; // liters
  waypoints: RoutePoint[];
  segments: RouteSegment[];
  estimatedArrivalTimes: Date[];
  optimizationScore: number; // 0-100
  createdAt: Date;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
}

export interface RouteSegment {
  from: RoutePoint;
  to: RoutePoint;
  distance: number; // km
  duration: number; // minutes
  instructions: string[];
  trafficConditions?: 'light' | 'moderate' | 'heavy' | 'severe';
  roadType?: 'highway' | 'arterial' | 'local' | 'residential';
}

export interface RouteOptimizationResult {
  success: boolean;
  message: string;
  optimizedRoute?: OptimizedRoute;
  alternatives?: OptimizedRoute[];
  warnings?: string[];
  error?: string;
}

export interface DriverLocation {
  driverId: string;
  latitude: number;
  longitude: number;
  accuracy: number; // meters
  heading: number; // degrees
  speed: number; // km/h
  timestamp: Date;
  status: 'idle' | 'en_route' | 'at_pickup' | 'at_delivery' | 'break';
}

export interface TrafficData {
  segmentId: string;
  currentSpeed: number; // km/h
  freeFlowSpeed: number; // km/h
  congestionLevel: 'light' | 'moderate' | 'heavy' | 'severe';
  incident?: {
    type: 'accident' | 'construction' | 'weather' | 'other';
    description: string;
    severity: 'low' | 'medium' | 'high';
    estimatedDuration: number; // minutes
  };
  lastUpdated: Date;
}

export interface RouteAnalytics {
  routeId: string;
  driverId: string;
  date: Date;
  plannedDistance: number;
  actualDistance: number;
  plannedDuration: number;
  actualDuration: number;
  fuelEfficiency: number;
  stopsCompleted: number;
  stopsCancelled: number;
  customerSatisfaction: number; // 1-5 rating
  delays: {
    reason: string;
    duration: number; // minutes
    impact: 'low' | 'medium' | 'high';
  }[];
  optimizations: {
    type: 'time_saved' | 'distance_saved' | 'fuel_saved';
    amount: number;
    percentage: number;
  }[];
}

export interface RouteOptimizationSettings {
  algorithm: 'genetic' | 'simulated_annealing' | 'nearest_neighbor' | 'christofides';
  populationSize?: number;
  maxGenerations?: number;
  mutationRate?: number;
  crossoverRate?: number;
  timeLimit?: number; // seconds
  qualityThreshold?: number; // 0-100
  enableRealTimeUpdates: boolean;
  trafficDataIntegration: boolean;
  weatherIntegration: boolean;
}

export interface MultiStopJob {
  id: string;
  driverId: string;
  jobType: 'pickup' | 'delivery' | 'mixed';
  stops: RoutePoint[];
  totalDistance: number;
  estimatedDuration: number;
  actualDuration?: number;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  constraints: {
    maxStops: number;
    maxDistance: number;
    timeWindow: {
      start: Date;
      end: Date;
    };
  };
}

export interface RouteOptimizationMetrics {
  totalRoutesOptimized: number;
  averageTimeSaved: number; // minutes
  averageDistanceSaved: number; // km
  averageFuelSaved: number; // liters
  customerSatisfactionScore: number;
  onTimeDeliveryRate: number; // percentage
  routeEfficiencyScore: number; // 0-100
  lastOptimized: Date;
  performanceTrends: {
    period: string;
    efficiency: number;
    satisfaction: number;
    costSavings: number;
  }[];
}
