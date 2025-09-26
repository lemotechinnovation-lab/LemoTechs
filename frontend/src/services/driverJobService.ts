// Driver Job Management Service - Focused on mobile delivery operations
import { apiCall } from './apiConfig';

export interface DriverJob {
  id: string;
  bookingId: string; // Reference to original booking
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCoordinates: { lat: number; lng: number };
  shopName: string;
  shopAddress: string;
  shopCoordinates: { lat: number; lng: number };
  items: DeliveryItem[];
  status: 'assigned' | 'accepted' | 'en_route_pickup' | 'arrived_pickup' | 'items_collected' | 'en_route_shop' | 'arrived_shop' | 'items_dropped' | 'waiting_cleaning' | 'items_ready' | 'en_route_delivery' | 'arrived_delivery' | 'delivered' | 'completed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  estimatedPickupTime: Date;
  estimatedDeliveryTime: Date;
  actualPickupTime?: Date;
  actualDeliveryTime?: Date;
  specialInstructions?: string;
  paymentMethod: 'card' | 'cash' | 'mobile';
  totalAmount: number;
  driverEarnings: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveryItem {
  id: string;
  name: string;
  type: 'clothing' | 'shoes' | 'accessories' | 'furniture' | 'other';
  condition: 'good' | 'fair' | 'poor' | 'damaged';
  photos?: string[];
  notes?: string;
}

export interface DriverLocation {
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  timestamp: Date;
}

export interface DriverStats {
  totalJobs: number;
  completedJobs: number;
  totalEarnings: number;
  averageRating: number;
  totalDistance: number; // in kilometers
  averageJobTime: number; // in minutes
  currentStreak: number; // consecutive days worked
}

export interface RouteOptimization {
  jobs: DriverJob[];
  optimizedRoute: Array<{
    jobId: string;
    address: string;
    coordinates: { lat: number; lng: number };
    estimatedArrival: Date;
    estimatedDuration: number; // minutes
  }>;
  totalDistance: number;
  totalTime: number;
}

export const driverJobService = {
  // Get all jobs assigned to the driver
  async getDriverJobs(status?: string): Promise<DriverJob[]> {
    try {
      const params = status ? `?status=${status}` : '';
      const data = await apiCall(`/api/driver/jobs${params}`);
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch driver jobs:', error);
      return [];
    }
  },

  // Get a specific job
  async getDriverJob(jobId: string): Promise<DriverJob | null> {
    try {
      const data = await apiCall(`/api/driver/jobs/${jobId}`);
      return data.data;
    } catch (error) {
      console.error('Failed to fetch driver job:', error);
      return null;
    }
  },

  // Accept a job
  async acceptJob(jobId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const data = await apiCall(`/api/driver/jobs/${jobId}/accept`, {
        method: 'POST',
        body: JSON.stringify({
          timestamp: new Date().toISOString()
        })
      });
      return {
        success: true,
        message: data.message || 'Job accepted successfully'
      };
    } catch (error) {
      console.error('Failed to accept job:', error);
      return {
        success: false,
        message: 'Failed to accept job. Please try again.'
      };
    }
  },

  // Update job status
  async updateJobStatus(jobId: string, status: string, location?: DriverLocation): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const data = await apiCall(`/api/driver/jobs/${jobId}/status`, {
        method: 'PUT',
        body: JSON.stringify({
          status,
          location,
          timestamp: new Date().toISOString()
        })
      });
      return {
        success: true,
        message: data.message || 'Status updated successfully'
      };
    } catch (error) {
      console.error('Failed to update job status:', error);
      return {
        success: false,
        message: 'Failed to update status. Please try again.'
      };
    }
  },

  // Update driver location
  async updateLocation(location: DriverLocation): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const data = await apiCall('/api/driver/location', {
        method: 'PUT',
        body: JSON.stringify(location)
      });
      return {
        success: true,
        message: data.message || 'Location updated successfully'
      };
    } catch (error) {
      console.error('Failed to update location:', error);
      return {
        success: false,
        message: 'Failed to update location. Please try again.'
      };
    }
  },

  // Get optimized route for multiple jobs
  async getOptimizedRoute(jobIds: string[]): Promise<RouteOptimization | null> {
    try {
      const data = await apiCall('/api/driver/route-optimization', {
        method: 'POST',
        body: JSON.stringify({ jobIds })
      });
      return data.data;
    } catch (error) {
      console.error('Failed to get optimized route:', error);
      return null;
    }
  },

  // Send message to customer
  async messageCustomer(jobId: string, message: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const data = await apiCall(`/api/driver/jobs/${jobId}/message-customer`, {
        method: 'POST',
        body: JSON.stringify({
          message,
          timestamp: new Date().toISOString()
        })
      });
      return {
        success: true,
        message: data.message || 'Message sent successfully'
      };
    } catch (error) {
      console.error('Failed to send message:', error);
      return {
        success: false,
        message: 'Failed to send message. Please try again.'
      };
    }
  },

  // Send message to shop
  async messageShop(jobId: string, message: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const data = await apiCall(`/api/driver/jobs/${jobId}/message-shop`, {
        method: 'POST',
        body: JSON.stringify({
          message,
          timestamp: new Date().toISOString()
        })
      });
      return {
        success: true,
        message: data.message || 'Message sent successfully'
      };
    } catch (error) {
      console.error('Failed to send message:', error);
      return {
        success: false,
        message: 'Failed to send message. Please try again.'
      };
    }
  },

  // Get driver statistics
  async getDriverStats(period: 'day' | 'week' | 'month' | 'year' = 'week'): Promise<DriverStats> {
    try {
      const data = await apiCall(`/api/driver/stats?period=${period}`);
      return data.data || {
        totalJobs: 0,
        completedJobs: 0,
        totalEarnings: 0,
        averageRating: 0,
        totalDistance: 0,
        averageJobTime: 0,
        currentStreak: 0
      };
    } catch (error) {
      console.error('Failed to fetch driver stats:', error);
      return {
        totalJobs: 0,
        completedJobs: 0,
        totalEarnings: 0,
        averageRating: 0,
        totalDistance: 0,
        averageJobTime: 0,
        currentStreak: 0
      };
    }
  },

  // Mark job as completed
  async completeJob(jobId: string, notes?: string, photos?: string[]): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const data = await apiCall(`/api/driver/jobs/${jobId}/complete`, {
        method: 'POST',
        body: JSON.stringify({
          notes,
          photos,
          completedAt: new Date().toISOString()
        })
      });
      return {
        success: true,
        message: data.message || 'Job completed successfully'
      };
    } catch (error) {
      console.error('Failed to complete job:', error);
      return {
        success: false,
        message: 'Failed to complete job. Please try again.'
      };
    }
  },

  // Get available jobs in area
  async getAvailableJobs(radius: number = 10): Promise<DriverJob[]> {
    try {
      const data = await apiCall(`/api/driver/available-jobs?radius=${radius}`);
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch available jobs:', error);
      return [];
    }
  }
};
