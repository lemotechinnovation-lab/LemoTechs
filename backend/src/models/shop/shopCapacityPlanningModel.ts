// Shop Capacity Planning Models
// This file contains models for advanced capacity planning and resource management

export interface CapacityPlan {
  id: string;
  shopId: string;
  planType: 'daily' | 'weekly' | 'monthly' | 'seasonal';
  period: {
    startDate: Date;
    endDate: Date;
  };
  capacity: {
    maxConcurrentJobs: number;
    maxDailyJobs: number;
    maxWeeklyJobs: number;
    processingCapacity: number; // items per hour
    storageCapacity: number; // items
  };
  resources: {
    staffCount: number;
    equipmentCount: number;
    workstationCount: number;
    vehicleCapacity: number;
  };
  constraints: {
    operatingHours: {
      start: string; // HH:MM format
      end: string;
      daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
    };
    breakTimes: {
      duration: number; // minutes
      frequency: number; // every X hours
    };
    maintenanceWindows: {
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      duration: number; // minutes
    }[];
  };
  utilization: {
    currentUtilization: number; // percentage
    peakUtilization: number;
    averageUtilization: number;
    efficiency: number; // 0-100
  };
  forecasts: {
    expectedDemand: number;
    capacityGap: number;
    recommendedActions: string[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  };
  status: 'draft' | 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface CapacityForecast {
  id: string;
  shopId: string;
  forecastPeriod: {
    startDate: Date;
    endDate: Date;
  };
  methodology: 'historical' | 'trend' | 'seasonal' | 'machine_learning';
  dataPoints: {
    date: Date;
    demand: number;
    capacity: number;
    utilization: number;
    factors: {
      weather?: string;
      events?: string[];
      seasonality?: number;
      trends?: number;
    };
  }[];
  predictions: {
    date: Date;
    predictedDemand: number;
    predictedCapacity: number;
    predictedUtilization: number;
    confidence: number; // 0-100
    factors: {
      weather?: string;
      events?: string[];
      seasonality?: number;
      trends?: number;
    };
  }[];
  accuracy: {
    mape: number; // Mean Absolute Percentage Error
    rmse: number; // Root Mean Square Error
    lastValidation: Date;
  };
  recommendations: {
    type: 'increase_capacity' | 'reduce_capacity' | 'optimize_schedule' | 'hire_staff' | 'equipment_upgrade';
    priority: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    impact: string;
    cost: number;
    timeline: string;
  }[];
  createdAt: Date;
}

export interface ResourceAllocation {
  id: string;
  shopId: string;
  allocationDate: Date;
  resources: {
    staff: {
      total: number;
      allocated: number;
      available: number;
      skills: {
        skill: string;
        count: number;
        utilization: number;
      }[];
    };
    equipment: {
      total: number;
      allocated: number;
      available: number;
      maintenance: number;
      types: {
        type: string;
        count: number;
        utilization: number;
      }[];
    };
    workstations: {
      total: number;
      allocated: number;
      available: number;
      efficiency: number;
    };
  };
  jobs: {
    scheduled: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    averageProcessingTime: number; // minutes
  };
  efficiency: {
    resourceUtilization: number;
    throughput: number; // jobs per hour
    qualityScore: number;
    customerSatisfaction: number;
  };
  bottlenecks: {
    resource: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    impact: string;
    suggestedAction: string;
  }[];
  createdAt: Date;
}

export interface CapacityOptimization {
  id: string;
  shopId: string;
  optimizationType: 'immediate' | 'short_term' | 'long_term';
  currentState: {
    utilization: number;
    efficiency: number;
    bottlenecks: string[];
    costs: number;
  };
  targetState: {
    utilization: number;
    efficiency: number;
    bottlenecks: string[];
    costs: number;
  };
  strategies: {
    strategy: 'staff_reallocation' | 'equipment_upgrade' | 'process_improvement' | 'schedule_optimization' | 'capacity_expansion';
    description: string;
    impact: {
      utilization: number;
      efficiency: number;
      cost: number;
      timeline: string;
    };
    implementation: {
      steps: string[];
      resources: string[];
      timeline: string;
      cost: number;
    };
    risks: {
      risk: string;
      probability: number;
      impact: string;
      mitigation: string;
    }[];
  }[];
  recommendations: {
    priority: 'low' | 'medium' | 'high' | 'critical';
    action: string;
    expectedBenefit: string;
    implementationCost: number;
    paybackPeriod: number; // months
  }[];
  metrics: {
    expectedImprovement: number; // percentage
    costSavings: number;
    efficiencyGain: number;
    customerSatisfactionImprovement: number;
  };
  createdAt: Date;
}

export interface CapacityAlert {
  id: string;
  shopId: string;
  alertType: 'capacity_exceeded' | 'low_utilization' | 'bottleneck_detected' | 'resource_shortage' | 'quality_decline';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details: {
    currentValue: number;
    threshold: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    impact: string;
  };
  recommendations: {
    action: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    timeline: string;
    cost: number;
  }[];
  isResolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  createdAt: Date;
}

export interface CapacityReport {
  id: string;
  shopId: string;
  reportPeriod: {
    startDate: Date;
    endDate: Date;
  };
  reportType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  summary: {
    totalJobs: number;
    averageUtilization: number;
    peakUtilization: number;
    efficiency: number;
    customerSatisfaction: number;
    revenue: number;
    costs: number;
    profit: number;
  };
  capacityAnalysis: {
    currentCapacity: number;
    utilizedCapacity: number;
    availableCapacity: number;
    capacityGap: number;
    utilizationTrend: 'increasing' | 'decreasing' | 'stable';
  };
  resourceAnalysis: {
    staffUtilization: number;
    equipmentUtilization: number;
    workstationUtilization: number;
    bottlenecks: string[];
    inefficiencies: string[];
  };
  performanceMetrics: {
    throughput: number; // jobs per hour
    processingTime: number; // average minutes per job
    qualityScore: number;
    onTimeDelivery: number; // percentage
    customerRetention: number; // percentage
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  forecasts: {
    nextPeriodDemand: number;
    capacityRequirements: number;
    resourceNeeds: string[];
    investmentRequirements: number;
  };
  createdAt: Date;
}

export interface CapacityPlanningRequest {
  shopId: string;
  planType: 'daily' | 'weekly' | 'monthly' | 'seasonal';
  period: {
    startDate: Date;
    endDate: Date;
  };
  constraints?: {
    budget?: number;
    staffLimits?: number;
    equipmentLimits?: number;
    qualityRequirements?: number;
  };
  objectives?: {
    maximizeUtilization?: boolean;
    minimizeCosts?: boolean;
    improveQuality?: boolean;
    increaseThroughput?: boolean;
  };
}

export interface CapacityPlanningResult {
  success: boolean;
  message: string;
  capacityPlan?: CapacityPlan;
  forecasts?: CapacityForecast;
  recommendations?: string[];
  warnings?: string[];
  error?: string;
}
