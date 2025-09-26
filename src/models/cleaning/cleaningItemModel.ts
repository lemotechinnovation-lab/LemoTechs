/**
 * Cleaning Item Models
 * Defines interfaces and types for cleaning item management
 */

export type ItemType = 'clothing' | 'shoes' | 'accessories' | 'furniture';
export type ItemCondition = 'good' | 'fair' | 'poor' | 'damaged';
export type CleaningMethod = 'dry_clean' | 'wash' | 'hand_wash' | 'specialty';
export type CleaningStatus = 'received' | 'assessed' | 'cleaning' | 'completed' | 'ready';

export interface CleaningItem {
  id: string;
  bookingId: string;
  name: string;
  type: ItemType;
  condition: ItemCondition;
  cleaningMethod: CleaningMethod;
  photos: string[];
  notes?: string;
  estimatedTime: number;
  actualTime?: number;
  status: CleaningStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCleaningItemRequest {
  bookingId: string;
  name: string;
  type: ItemType;
  condition: ItemCondition;
  cleaningMethod?: CleaningMethod;
  photos?: string[];
  notes?: string;
  estimatedTime?: number;
}

export interface UpdateCleaningItemRequest {
  name?: string;
  condition?: ItemCondition;
  cleaningMethod?: CleaningMethod;
  photos?: string[];
  notes?: string;
  estimatedTime?: number;
  actualTime?: number;
  status?: CleaningStatus;
}

export interface CleaningItemProfile {
  id: string;
  bookingId: string;
  name: string;
  type: ItemType;
  condition: ItemCondition;
  cleaningMethod: CleaningMethod;
  photos: string[];
  notes?: string;
  estimatedTime: number;
  actualTime?: number;
  status: CleaningStatus;
  createdAt: Date;
  updatedAt: Date;
  // Additional computed fields
  progressPercentage: number;
  timeRemaining?: number;
  riskLevel: 'low' | 'medium' | 'high';
  qualityScore?: number;
}

export interface CleaningItemStats {
  totalItems: number;
  itemsByStatus: {
    received: number;
    assessed: number;
    cleaning: number;
    completed: number;
    ready: number;
  };
  itemsByType: {
    clothing: number;
    shoes: number;
    accessories: number;
    furniture: number;
  };
  averageCleaningTime: number;
  qualityPassRate: number;
  onTimeDeliveryRate: number;
}

export interface CleaningItemSearchFilters {
  status?: CleaningStatus;
  type?: ItemType;
  condition?: ItemCondition;
  cleaningMethod?: CleaningMethod;
  bookingId?: string;
  shopId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
}

export interface CleaningItemAssessment {
  itemId: string;
  assessorId: string;
  condition: ItemCondition;
  photos: string[];
  notes?: string;
  specialRequirements?: string;
  recommendedMethod: CleaningMethod;
  estimatedTime: number;
  riskLevel: 'low' | 'medium' | 'high';
  qualityChecklist: {
    stains: boolean;
    damage: boolean;
    specialCare: boolean;
    colorFastness: boolean;
  };
}

export interface CleaningProgress {
  itemId: string;
  status: CleaningStatus;
  progress: number; // 0-100
  currentStep: string;
  notes?: string;
  photos?: string[];
  startedAt?: Date;
  completedAt?: Date;
  estimatedCompletion?: Date;
}

export interface QualityCheck {
  itemId: string;
  checkerId: string;
  passed: boolean;
  issues?: string[];
  photos?: string[];
  notes?: string;
  qualityScore: number; // 1-10
  approvedAt: Date;
}

export interface CleaningMethodConfig {
  method: CleaningMethod;
  name: string;
  description: string;
  estimatedTime: number;
  requiredEquipment: string[];
  requiredSupplies: string[];
  specialInstructions?: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface CleaningWorkflowStep {
  stepId: string;
  name: string;
  description: string;
  order: number;
  estimatedTime: number;
  requiredRole: 'assessor' | 'cleaner' | 'quality_checker' | 'manager';
  isRequired: boolean;
  dependencies?: string[];
}

export interface CleaningItemBatch {
  batchId: string;
  shopId: string;
  items: CleaningItem[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  assignedTo?: string;
  notes?: string;
}

export interface CleaningItemAnalytics {
  period: string;
  totalItems: number;
  completionRate: number;
  averageProcessingTime: number;
  qualityPassRate: number;
  customerSatisfactionScore: number;
  revenuePerItem: number;
  costPerItem: number;
  profitMargin: number;
  topCleaningMethods: {
    method: CleaningMethod;
    count: number;
    averageTime: number;
  }[];
  commonIssues: {
    issue: string;
    count: number;
    resolution: string;
  }[];
}

// Service Result Interfaces
export interface CleaningWorkflowResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface ItemAssessmentResult {
  item: CleaningItem;
  recommendedMethod: CleaningMethod;
  estimatedTime: number;
  riskLevel: 'low' | 'medium' | 'high';
  specialInstructions?: string;
}

export interface CleaningProgressUpdate {
  itemId: string;
  status: CleaningStatus;
  progress: number; // 0-100
  notes?: string;
  photos?: string[];
  completedAt?: Date;
}

export interface QualityCheckResult {
  itemId: string;
  passed: boolean;
  issues?: string[];
  photos?: string[];
  approvedBy: string;
  approvedAt: Date;
}
