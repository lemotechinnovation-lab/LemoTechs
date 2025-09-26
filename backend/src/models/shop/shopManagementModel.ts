// ========================================
// SHOP MANAGEMENT MODELS
// ========================================

export interface OrderQueueFilters {
  status?: string;
  priority?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface OrderProcessingStatus {
  orderId: string;
  status: string;
  currentStep: string;
  items: CleaningItemStatus[];
  estimatedCompletion: Date;
  assignedStaff: StaffAssignment[];
  progress: number;
}

export interface CleaningItemStatus {
  itemId: string;
  name: string;
  status: 'received' | 'assessed' | 'cleaning' | 'quality_check' | 'packaged' | 'ready';
  progress: number;
  assignedTo?: string;
  estimatedTime?: number;
  actualTime?: number;
}

export interface StaffAssignment {
  staffId: string;
  name: string;
  role: string;
  assignedAt: Date;
  estimatedCompletion: Date;
}

export interface SupplyItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPerUnit: number;
  lastRestocked: Date;
  supplier: string;
}

export interface StaffPerformance {
  staffId: string;
  name: string;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    ordersCompleted: number;
    averageProcessingTime: number;
    qualityScore: number;
    customerSatisfaction: number;
    efficiency: number;
  };
}

export interface FinancialMetrics {
  period: {
    start: Date;
    end: Date;
  };
  revenue: {
    total: number;
    daily: number[];
    byService: Record<string, number>;
  };
  expenses: {
    total: number;
    supplies: number;
    staff: number;
    overhead: number;
  };
  commission: {
    total: number;
    rate: number;
    netEarnings: number;
  };
  profit: {
    gross: number;
    net: number;
    margin: number;
  };
}

export interface CustomerMessage {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  message: string;
  attachments?: string[];
  timestamp: Date;
  isFromCustomer: boolean;
  read: boolean;
}

export interface QualityChecklist {
  id: string;
  itemType: string;
  checklist: QualityCheckItem[];
  version: string;
  lastUpdated: Date;
}

export interface QualityCheckItem {
  id: string;
  description: string;
  category: string;
  required: boolean;
  weight: number;
}

export interface NotificationSettings {
  newOrderAlerts: boolean;
  driverArrival: boolean;
  urgentOrders: boolean;
  systemUpdates: boolean;
  paymentNotifications: boolean;
  lowStockAlerts: boolean;
  staffNotifications: boolean;
  customerMessages: boolean;
}

// ========================================
// SHOP MANAGEMENT REQUEST/RESPONSE TYPES
// ========================================

export interface ItemReceiptData {
  items: Array<{
    name: string;
    type: string;
    condition?: string;
    notes?: string;
  }>;
  receiptNotes: string;
  receivedBy: string;
}

export interface ItemAssessmentData {
  condition: string;
  photos: string[];
  notes: string;
  specialRequirements: string;
  assessedBy: string;
}

export interface CleaningMethodData {
  cleaningMethod: string;
  estimatedTime: number;
  requiredSupplies: string[];
  specialInstructions: string;
  selectedBy: string;
}

export interface CleaningProgressData {
  status: string;
  progress: number;
  notes: string;
  photos: string[];
  updatedBy: string;
}

export interface QualityControlData {
  qualityChecklist: any[];
  beforePhotos: string[];
  afterPhotos: string[];
  qualityScore: number;
  passed: boolean;
  issues: string[];
  checkedBy: string;
}

export interface ItemPackagingData {
  packagingNotes: string;
  packagingPhotos: string[];
  readyForPickup: boolean;
  packagedBy: string;
}

export interface OrderPriorityUpdate {
  priority: string;
  reason: string;
  updatedBy: string;
}

export interface StaffAssignmentData {
  staffId: string;
  assignmentNotes: string;
  assignedBy: string;
}

export interface CustomerStatusUpdate {
  status: string;
  message: string;
  photos?: string[];
  estimatedCompletionTime?: Date;
  sentBy: string;
}

export interface CustomerMessageData {
  message: string;
  attachments?: string[];
  sentBy: string;
}

export interface SupplyLevelUpdate {
  supplies: Array<{
    id: string;
    currentStock: number;
    updatedBy: string;
  }>;
}

export interface OperatingHoursUpdate {
  operatingHours: Record<string, {
    open: string;
    close: string;
    isOpen: boolean;
  }>;
}

export interface ServiceOfferingsUpdate {
  services: Array<{
    name: string;
    description: string;
    price: number;
    estimatedTime: number;
    isActive: boolean;
  }>;
}

export interface CapacityManagementUpdate {
  capacity: number;
  maxOrdersPerDay: number;
}

export interface NotificationSettingsUpdate {
  settings: NotificationSettings;
}

export interface CustomerFeedbackResponse {
  response: string;
  responseType: 'apology' | 'explanation' | 'resolution' | 'follow_up';
  respondedBy: string;
}
