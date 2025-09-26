// Shop Queue Management Models
// This file contains models for managing cleaning queues and workflow

export interface QueueItem {
  id: string;
  shopId: string;
  bookingId: string;
  cleaningItemId: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'queued' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  estimatedDuration: number; // in minutes
  actualDuration?: number; // in minutes
  assignedTo?: string; // staff member ID
  queuedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  notes?: string;
  specialInstructions?: string;
}

export interface QueueStatus {
  shopId: string;
  totalItems: number;
  queuedItems: number;
  inProgressItems: number;
  completedItems: number;
  cancelledItems: number;
  averageWaitTime: number; // in minutes
  estimatedCompletionTime?: Date;
  currentCapacity: number;
  maxCapacity: number;
  utilizationRate: number; // percentage
}

export interface QueueManagementRequest {
  shopId: string;
  action: 'add' | 'remove' | 'prioritize' | 'assign' | 'complete' | 'cancel';
  itemId?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  assignedTo?: string;
  notes?: string;
}

export interface QueueManagementResult {
  success: boolean;
  message: string;
  queueStatus?: QueueStatus;
  updatedItem?: QueueItem;
  error?: string;
}

export interface StaffWorkload {
  staffId: string;
  name: string;
  currentItems: number;
  maxCapacity: number;
  utilizationRate: number;
  averageCompletionTime: number;
  isAvailable: boolean;
  nextAvailableTime?: Date;
}

export interface QueueAnalytics {
  shopId: string;
  period: 'day' | 'week' | 'month';
  totalItemsProcessed: number;
  averageProcessingTime: number;
  peakHours: string[];
  bottleneckItems: string[];
  staffEfficiency: StaffWorkload[];
  completionRate: number;
  customerSatisfactionScore: number;
}

export interface QueueOptimization {
  shopId: string;
  recommendations: {
    type: 'capacity' | 'staffing' | 'process' | 'equipment';
    priority: 'low' | 'medium' | 'high';
    description: string;
    expectedImpact: string;
    implementationCost: 'low' | 'medium' | 'high';
  }[];
  estimatedImprovement: {
    processingTimeReduction: number; // percentage
    capacityIncrease: number; // percentage
    costSavings: number; // percentage
  };
}
