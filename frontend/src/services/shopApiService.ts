import { apiClient } from './apiClient';

// Shop Profile Interface
export interface ShopProfile {
  id: string;
  userId: string;
  name: string;
  description?: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  phone?: string;
  email?: string;
  operatingHours?: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
  services?: string[];
  rating: number;
  totalBookings: number;
  totalRevenue: number;
  isActive: boolean;
  isVerified: boolean;
  capacity: number;
  currentLoad: number;
  createdAt: string;
}

// Shop Profile Creation Data
export interface CreateShopProfileData {
  name: string;
  description?: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  phone?: string;
  email?: string;
  operatingHours?: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
  services?: string[];
  capacity?: number;
}

// Shop Profile Update Data
export interface UpdateShopProfileData {
  name?: string;
  description?: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  phone?: string;
  email?: string;
  operatingHours?: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
  services?: string[];
  capacity?: number;
}

// Booking Interface
export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  pickupLocation: string;
  items: string[];
  status: string;
  paymentMethod: string;
  amount: number;
  contactPhone: string;
  specialInstructions?: string;
  estimatedPickupTime?: string;
  estimatedDeliveryTime?: string;
  actualPickupTime?: string;
  actualDeliveryTime?: string;
  cleaningStartedAt?: string;
  cleaningCompletedAt?: string;
  createdAt: string;
}

// Booking Status Update Data
export interface UpdateBookingStatusData {
  status: 'pickup' | 'cleaning' | 'delivery' | 'completed';
}

// Shop Analytics Interface
export interface ShopAnalytics {
  totalBookings: number;
  totalRevenue: number;
  avgOrderValue: number;
  completedBookings: number;
  activeBookings: number;
  recentBookings: number;
  recentRevenue: number;
  period: string;
}

// Booking Query Parameters
export interface BookingQueryParams {
  status?: string;
  limit?: number;
  offset?: number;
}

// Analytics Query Parameters
export interface AnalyticsQueryParams {
  period?: string; // e.g., '30', '7', '90' days
}

class ShopApiService {
  private basePath = '/shops';

  // Get shop profile
  async getProfile(): Promise<ShopProfile> {
    const response = await apiClient.get<ShopProfile>(`${this.basePath}/profile`);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get shop profile');
    }
    return response.data;
  }

  // Create shop profile
  async createProfile(data: CreateShopProfileData): Promise<ShopProfile> {
    const response = await apiClient.post<ShopProfile>(`${this.basePath}/profile`, data);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create shop profile');
    }
    return response.data;
  }

  // Update shop profile
  async updateProfile(data: UpdateShopProfileData): Promise<ShopProfile> {
    const response = await apiClient.put<ShopProfile>(`${this.basePath}/profile`, data);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update shop profile');
    }
    return response.data;
  }

  // Get shop bookings
  async getBookings(params: BookingQueryParams = {}): Promise<Booking[]> {
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `${this.basePath}/bookings${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<Booking[]>(endpoint);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get shop bookings');
    }
    return response.data;
  }

  // Update booking status
  async updateBookingStatus(bookingId: string, data: UpdateBookingStatusData): Promise<{
    id: string;
    status: string;
    cleaningStartedAt?: string;
    cleaningCompletedAt?: string;
    updatedAt: string;
  }> {
    const response = await apiClient.put<{
      id: string;
      status: string;
      cleaningStartedAt?: string;
      cleaningCompletedAt?: string;
      updatedAt: string;
    }>(`${this.basePath}/bookings/${bookingId}/status`, data);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update booking status');
    }
    return response.data;
  }

  // Get shop analytics
  async getAnalytics(params: AnalyticsQueryParams = {}): Promise<ShopAnalytics> {
    const queryParams = new URLSearchParams();
    
    if (params.period) queryParams.append('period', params.period);
    
    const queryString = queryParams.toString();
    const endpoint = `${this.basePath}/analytics${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<ShopAnalytics>(endpoint);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get shop analytics');
    }
    return response.data;
  }

  // Get active bookings (convenience method)
  async getActiveBookings(): Promise<Booking[]> {
    return this.getBookings({ status: 'pickup,cleaning,delivery' });
  }

  // Get completed bookings (convenience method)
  async getCompletedBookings(): Promise<Booking[]> {
    return this.getBookings({ status: 'completed' });
  }

  // Get pending bookings (convenience method)
  async getPendingBookings(): Promise<Booking[]> {
    return this.getBookings({ status: 'pickup' });
  }

  // Get cleaning bookings (convenience method)
  async getCleaningBookings(): Promise<Booking[]> {
    return this.getBookings({ status: 'cleaning' });
  }

  // Get delivery bookings (convenience method)
  async getDeliveryBookings(): Promise<Booking[]> {
    return this.getBookings({ status: 'delivery' });
  }

  // Start cleaning (convenience method)
  async startCleaning(bookingId: string): Promise<{
    id: string;
    status: string;
    cleaningStartedAt?: string;
    cleaningCompletedAt?: string;
    updatedAt: string;
  }> {
    return this.updateBookingStatus(bookingId, { status: 'cleaning' });
  }

  // Complete cleaning (convenience method)
  async completeCleaning(bookingId: string): Promise<{
    id: string;
    status: string;
    cleaningStartedAt?: string;
    cleaningCompletedAt?: string;
    updatedAt: string;
  }> {
    return this.updateBookingStatus(bookingId, { status: 'completed' });
  }

  // Get recent analytics (convenience method)
  async getRecentAnalytics(days: number = 30): Promise<ShopAnalytics> {
    return this.getAnalytics({ period: days.toString() });
  }
}

// Create and export singleton instance
export const shopApiService = new ShopApiService();
