import { Request, Response } from 'express';
import { Logger } from '../utils/logger';
import { validationResult } from 'express-validator';
import { getServices } from '../infrastructure/di/injector';
import {
  OrderQueueFilters,
  OrderProcessingStatus,
  CleaningItemStatus,
  StaffAssignment,
  SupplyItem,
  StaffPerformance,
  FinancialMetrics,
  CustomerMessage,
  QualityChecklist,
  NotificationSettings
} from '../models/shop/shopManagementModel';

// ========================================
// 1. ORDER MANAGEMENT DASHBOARD
// ========================================

// Get live order queue - real-time incoming orders from drivers
export const getLiveOrderQueue = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { status = 'pending', priority = 'all' } = req.query;
    const { shopManagementService } = getServices(req);
    
    const orders = await shopManagementService.getLiveOrderQueue(userId, {
      status: status as string,
      priority: priority as string
    });

    res.json({
      success: true,
      message: 'Live order queue retrieved successfully',
      data: orders
    });
  } catch (error) {
    Logger.error('Get live order queue error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get order processing status - track items through cleaning workflow
export const getOrderProcessingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { orderId } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const processingStatus = await shopManagementService.getOrderProcessingStatus(userId, orderId);

    res.json({
      success: true,
      message: 'Order processing status retrieved successfully',
      data: processingStatus
    });
  } catch (error) {
    Logger.error('Get order processing status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update order priority - urgent orders, VIP customers
export const updateOrderPriority = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { orderId } = req.params;
    const { priority, reason } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const updatedOrder = await shopManagementService.updateOrderPriority(userId, orderId, {
      priority,
      reason,
      updatedBy: userId
    });

    res.json({
      success: true,
      message: 'Order priority updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    Logger.error('Update order priority error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get order history - completed orders, customer details
export const getOrderHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { 
      startDate, 
      endDate, 
      status = 'completed', 
      limit = 50, 
      offset = 0 
    } = req.query;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const orderHistory = await shopManagementService.getOrderHistory(userId, {
      startDate: startDate as string,
      endDate: endDate as string,
      status: status as string,
      limit: Number(limit),
      offset: Number(offset)
    });

    res.json({
      success: true,
      message: 'Order history retrieved successfully',
      data: orderHistory
    });
  } catch (error) {
    Logger.error('Get order history error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Search and filter orders
export const searchOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { 
      query, 
      filters, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      limit = 20, 
      offset = 0 
    } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const searchResults = await shopManagementService.searchOrders(userId, {
      query,
      filters,
      sortBy,
      sortOrder,
      limit,
      offset
    });

    res.json({
      success: true,
      message: 'Order search completed successfully',
      data: searchResults
    });
  } catch (error) {
    Logger.error('Search orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// ========================================
// 2. ITEM PROCESSING WORKFLOW
// ========================================

// Item receipt - scan/confirm items received from driver
export const confirmItemReceipt = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { orderId } = req.params;
    const { items, receiptNotes, receivedBy } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const receiptConfirmation = await shopManagementService.confirmItemReceipt(userId, orderId, {
      items,
      receiptNotes,
      receivedBy
    });

    res.json({
      success: true,
      message: 'Item receipt confirmed successfully',
      data: receiptConfirmation
    });
  } catch (error) {
    Logger.error('Confirm item receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Condition assessment - photo documentation of item condition
export const assessItemCondition = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { itemId } = req.params;
    const { 
      condition, 
      photos, 
      notes, 
      specialRequirements,
      assessedBy 
    } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const assessment = await shopManagementService.assessItemCondition(userId, itemId, {
      condition,
      photos,
      notes,
      specialRequirements,
      assessedBy
    });

    res.json({
      success: true,
      message: 'Item condition assessment completed successfully',
      data: assessment
    });
  } catch (error) {
    Logger.error('Assess item condition error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Cleaning method selection - choose appropriate cleaning process
export const selectCleaningMethod = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { itemId } = req.params;
    const { 
      cleaningMethod, 
      estimatedTime, 
      requiredSupplies,
      specialInstructions,
      selectedBy 
    } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const methodSelection = await shopManagementService.selectCleaningMethod(userId, itemId, {
      cleaningMethod,
      estimatedTime,
      requiredSupplies,
      specialInstructions,
      selectedBy
    });

    res.json({
      success: true,
      message: 'Cleaning method selected successfully',
      data: methodSelection
    });
  } catch (error) {
    Logger.error('Select cleaning method error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update progress tracking - update cleaning status
export const updateCleaningProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { itemId } = req.params;
    const { 
      status, 
      progress, 
      notes, 
      photos,
      updatedBy 
    } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const progressUpdate = await shopManagementService.updateCleaningProgress(userId, itemId, {
      status,
      progress,
      notes,
      photos,
      updatedBy
    });

    res.json({
      success: true,
      message: 'Cleaning progress updated successfully',
      data: progressUpdate
    });
  } catch (error) {
    Logger.error('Update cleaning progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Quality control - before/after photos, quality checklist
export const performQualityControl = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { itemId } = req.params;
    const { 
      qualityChecklist, 
      beforePhotos, 
      afterPhotos,
      qualityScore,
      passed,
      issues,
      checkedBy 
    } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const qualityControl = await shopManagementService.performQualityControl(userId, itemId, {
      qualityChecklist,
      beforePhotos,
      afterPhotos,
      qualityScore,
      passed,
      issues,
      checkedBy
    });

    res.json({
      success: true,
      message: 'Quality control completed successfully',
      data: qualityControl
    });
  } catch (error) {
    Logger.error('Perform quality control error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Item packaging - ready for pickup confirmation
export const confirmItemPackaging = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { itemId } = req.params;
    const { 
      packagingNotes, 
      packagingPhotos,
      readyForPickup,
      packagedBy 
    } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const packagingConfirmation = await shopManagementService.confirmItemPackaging(userId, itemId, {
      packagingNotes,
      packagingPhotos,
      readyForPickup,
      packagedBy
    });

    res.json({
      success: true,
      message: 'Item packaging confirmed successfully',
      data: packagingConfirmation
    });
  } catch (error) {
    Logger.error('Confirm item packaging error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// ========================================
// 3. STAFF MANAGEMENT
// ========================================

// Get staff dashboard - assign cleaners to specific jobs
export const getStaffDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const staffDashboard = await shopManagementService.getStaffDashboard(userId);

    res.json({
      success: true,
      message: 'Staff dashboard retrieved successfully',
      data: staffDashboard
    });
  } catch (error) {
    Logger.error('Get staff dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Assign staff to job
export const assignStaffToJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { jobId } = req.params;
    const { staffId, assignmentNotes } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const assignment = await shopManagementService.assignStaffToJob(userId, jobId, {
      staffId,
      assignmentNotes,
      assignedBy: userId
    });

    res.json({
      success: true,
      message: 'Staff assigned to job successfully',
      data: assignment
    });
  } catch (error) {
    Logger.error('Assign staff to job error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get workload distribution - balance work among staff members
export const getWorkloadDistribution = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const workloadDistribution = await shopManagementService.getWorkloadDistribution(userId);

    res.json({
      success: true,
      message: 'Workload distribution retrieved successfully',
      data: workloadDistribution
    });
  } catch (error) {
    Logger.error('Get workload distribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get staff performance - track individual cleaner productivity
export const getStaffPerformance = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { 
      staffId, 
      startDate, 
      endDate, 
      period = '30' 
    } = req.query;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const staffPerformance = await shopManagementService.getStaffPerformance(userId, {
      staffId: staffId as string,
      startDate: startDate as string,
      endDate: endDate as string,
      period: period as string
    });

    res.json({
      success: true,
      message: 'Staff performance retrieved successfully',
      data: staffPerformance
    });
  } catch (error) {
    Logger.error('Get staff performance error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// ========================================
// 4. INVENTORY & SUPPLIES MANAGEMENT
// ========================================

// Get supply tracking - monitor cleaning supplies, detergents, equipment
export const getSupplyTracking = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const supplyTracking = await shopManagementService.getSupplyTracking(userId);

    res.json({
      success: true,
      message: 'Supply tracking retrieved successfully',
      data: supplyTracking
    });
  } catch (error) {
    Logger.error('Get supply tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update supply levels
export const updateSupplyLevels = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { supplies } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const updatedSupplies = await shopManagementService.updateSupplyLevels(userId, supplies);

    res.json({
      success: true,
      message: 'Supply levels updated successfully',
      data: updatedSupplies
    });
  } catch (error) {
    Logger.error('Update supply levels error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get low stock alerts - automatic reorder notifications
export const getLowStockAlerts = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const lowStockAlerts = await shopManagementService.getLowStockAlerts(userId);

    res.json({
      success: true,
      message: 'Low stock alerts retrieved successfully',
      data: lowStockAlerts
    });
  } catch (error) {
    Logger.error('Get low stock alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// ========================================
// 5. CUSTOMER COMMUNICATION
// ========================================

// Send status update to customer
export const sendCustomerStatusUpdate = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { orderId } = req.params;
    const { 
      status, 
      message, 
      photos,
      estimatedCompletionTime 
    } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const statusUpdate = await shopManagementService.sendCustomerStatusUpdate(userId, orderId, {
      status,
      message,
      photos,
      estimatedCompletionTime,
      sentBy: userId
    });

    res.json({
      success: true,
      message: 'Customer status update sent successfully',
      data: statusUpdate
    });
  } catch (error) {
    Logger.error('Send customer status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get customer messages
export const getCustomerMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { orderId } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const messages = await shopManagementService.getCustomerMessages(userId, orderId);

    res.json({
      success: true,
      message: 'Customer messages retrieved successfully',
      data: messages
    });
  } catch (error) {
    Logger.error('Get customer messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Send message to customer
export const sendMessageToCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { orderId } = req.params;
    const { message, attachments } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const sentMessage = await shopManagementService.sendMessageToCustomer(userId, orderId, {
      message,
      attachments,
      sentBy: userId
    });

    res.json({
      success: true,
      message: 'Message sent to customer successfully',
      data: sentMessage
    });
  } catch (error) {
    Logger.error('Send message to customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// ========================================
// 6. FINANCIAL MANAGEMENT
// ========================================

// Get daily earnings - track daily revenue and orders completed
export const getDailyEarnings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { date } = req.query;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const dailyEarnings = await shopManagementService.getDailyEarnings(userId, date as string);

    res.json({
      success: true,
      message: 'Daily earnings retrieved successfully',
      data: dailyEarnings
    });
  } catch (error) {
    Logger.error('Get daily earnings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get commission tracking - monitor platform commission fees
export const getCommissionTracking = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { 
      startDate, 
      endDate, 
      period = '30' 
    } = req.query;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const commissionTracking = await shopManagementService.getCommissionTracking(userId, {
      startDate: startDate as string,
      endDate: endDate as string,
      period: period as string
    });

    res.json({
      success: true,
      message: 'Commission tracking retrieved successfully',
      data: commissionTracking
    });
  } catch (error) {
    Logger.error('Get commission tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get expense tracking - monitor operational costs
export const getExpenseTracking = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { 
      startDate, 
      endDate, 
      category,
      period = '30' 
    } = req.query;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const expenseTracking = await shopManagementService.getExpenseTracking(userId, {
      startDate: startDate as string,
      endDate: endDate as string,
      category: category as string,
      period: period as string
    });

    res.json({
      success: true,
      message: 'Expense tracking retrieved successfully',
      data: expenseTracking
    });
  } catch (error) {
    Logger.error('Get expense tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// ========================================
// 7. SHOP ANALYTICS & REPORTING
// ========================================

// Get performance metrics - orders per day, average processing time
export const getPerformanceMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { 
      startDate, 
      endDate, 
      period = '30' 
    } = req.query;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const performanceMetrics = await shopManagementService.getPerformanceMetrics(userId, {
      startDate: startDate as string,
      endDate: endDate as string,
      period: period as string
    });

    res.json({
      success: true,
      message: 'Performance metrics retrieved successfully',
      data: performanceMetrics
    });
  } catch (error) {
    Logger.error('Get performance metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get customer satisfaction - ratings and reviews received
export const getCustomerSatisfaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { 
      startDate, 
      endDate, 
      period = '30' 
    } = req.query;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const customerSatisfaction = await shopManagementService.getCustomerSatisfaction(userId, {
      startDate: startDate as string,
      endDate: endDate as string,
      period: period as string
    });

    res.json({
      success: true,
      message: 'Customer satisfaction retrieved successfully',
      data: customerSatisfaction
    });
  } catch (error) {
    Logger.error('Get customer satisfaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get peak hours analysis - busiest times, staffing needs
export const getPeakHoursAnalysis = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { 
      startDate, 
      endDate, 
      period = '30' 
    } = req.query;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const peakHoursAnalysis = await shopManagementService.getPeakHoursAnalysis(userId, {
      startDate: startDate as string,
      endDate: endDate as string,
      period: period as string
    });

    res.json({
      success: true,
      message: 'Peak hours analysis retrieved successfully',
      data: peakHoursAnalysis
    });
  } catch (error) {
    Logger.error('Get peak hours analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// ========================================
// 8. SHOP SETTINGS & CONFIGURATION
// ========================================

// Update operating hours - set available hours for orders
export const updateOperatingHours = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { operatingHours } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const updatedHours = await shopManagementService.updateOperatingHours(userId, operatingHours);

    res.json({
      success: true,
      message: 'Operating hours updated successfully',
      data: updatedHours
    });
  } catch (error) {
    Logger.error('Update operating hours error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update service offerings - configure available cleaning services
export const updateServiceOfferings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { services } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const updatedServices = await shopManagementService.updateServiceOfferings(userId, services);

    res.json({
      success: true,
      message: 'Service offerings updated successfully',
      data: updatedServices
    });
  } catch (error) {
    Logger.error('Update service offerings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update capacity management - set maximum orders per day
export const updateCapacityManagement = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { capacity, maxOrdersPerDay } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const updatedCapacity = await shopManagementService.updateCapacityManagement(userId, {
      capacity,
      maxOrdersPerDay
    });

    res.json({
      success: true,
      message: 'Capacity management updated successfully',
      data: updatedCapacity
    });
  } catch (error) {
    Logger.error('Update capacity management error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// ========================================
// 9. REAL-TIME NOTIFICATIONS
// ========================================

// Get notification settings
export const getNotificationSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const notificationSettings = await shopManagementService.getNotificationSettings(userId);

    res.json({
      success: true,
      message: 'Notification settings retrieved successfully',
      data: notificationSettings
    });
  } catch (error) {
    Logger.error('Get notification settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update notification settings
export const updateNotificationSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { settings } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const updatedSettings = await shopManagementService.updateNotificationSettings(userId, settings);

    res.json({
      success: true,
      message: 'Notification settings updated successfully',
      data: updatedSettings
    });
  } catch (error) {
    Logger.error('Update notification settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// ========================================
// 10. QUALITY ASSURANCE
// ========================================

// Get quality checklist - standardized quality control process
export const getQualityChecklist = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { itemType } = req.query;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const qualityChecklist = await shopManagementService.getQualityChecklist(userId, itemType as string);

    res.json({
      success: true,
      message: 'Quality checklist retrieved successfully',
      data: qualityChecklist
    });
  } catch (error) {
    Logger.error('Get quality checklist error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get customer feedback - respond to customer ratings/reviews
export const getCustomerFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { 
      startDate, 
      endDate, 
      rating,
      limit = 20, 
      offset = 0 
    } = req.query;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const customerFeedback = await shopManagementService.getCustomerFeedback(userId, {
      startDate: startDate as string,
      endDate: endDate as string,
      rating: rating as string,
      limit: Number(limit),
      offset: Number(offset)
    });

    res.json({
      success: true,
      message: 'Customer feedback retrieved successfully',
      data: customerFeedback
    });
  } catch (error) {
    Logger.error('Get customer feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Respond to customer feedback
export const respondToCustomerFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { feedbackId } = req.params;
    const { response, responseType } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { shopManagementService } = getServices(req);
    const feedbackResponse = await shopManagementService.respondToCustomerFeedback(userId, feedbackId, {
      response,
      responseType,
      respondedBy: userId
    });

    res.json({
      success: true,
      message: 'Customer feedback response sent successfully',
      data: feedbackResponse
    });
  } catch (error) {
    Logger.error('Respond to customer feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
