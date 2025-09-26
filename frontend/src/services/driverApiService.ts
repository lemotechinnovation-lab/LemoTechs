import { apiClient } from './apiClient';

// Driver Profile Interface
export interface DriverProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
  vehicle: string;
  licenseNumber: string;
  licenseExpiry?: string;
  vehicleRegistration?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  rating: number;
  totalJobs: number;
  totalEarnings: number;
  isActive: boolean;
  isVerified: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  status: 'offline' | 'available' | 'busy';
  lastActive?: string;
  createdAt: string;
}

// Driver Profile Creation Data
export interface CreateDriverProfileData {
  vehicle: string;
  licenseNumber: string;
  licenseExpiry?: string;
  vehicleRegistration?: string;
  vehicleModel?: string;
  vehicleColor?: string;
}

// Driver Profile Update Data
export interface UpdateDriverProfileData {
  vehicle?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  vehicleRegistration?: string;
  vehicleModel?: string;
  vehicleColor?: string;
}

// Driver Status Update Data
export interface UpdateDriverStatusData {
  status: 'offline' | 'available' | 'busy';
  currentLocation?: {
    lat: number;
    lng: number;
  };
}

// Job Interface
export interface Job {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  pickupLocation: string;
  pickupCoords?: {
    lat: number;
    lng: number;
  };
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
  createdAt: string;
}

// Available Job Interface (with distance)
export interface AvailableJob extends Job {
  distance?: number;
}

// Job Query Parameters
export interface JobQueryParams {
  status?: string;
  limit?: number;
  offset?: number;
}

// Available Jobs Query Parameters
export interface AvailableJobsQueryParams {
  lat?: number;
  lng?: number;
  limit?: number;
  offset?: number;
}

class DriverApiService {
  private basePath = '/drivers';

  // Get driver profile
  async getProfile(): Promise<DriverProfile> {
    const response = await apiClient.get<DriverProfile>(`${this.basePath}/profile`);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get driver profile');
    }
    return response.data;
  }

  // Create driver profile
  async createProfile(data: CreateDriverProfileData): Promise<DriverProfile> {
    const response = await apiClient.post<DriverProfile>(`${this.basePath}/profile`, data);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create driver profile');
    }
    return response.data;
  }

  // Update driver profile
  async updateProfile(data: UpdateDriverProfileData): Promise<DriverProfile> {
    const response = await apiClient.put<DriverProfile>(`${this.basePath}/profile`, data);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update driver profile');
    }
    return response.data;
  }

  // Update driver status
  async updateStatus(data: UpdateDriverStatusData): Promise<{ status: string; currentLocation?: any; lastActive: string }> {
    const response = await apiClient.put<{ status: string; currentLocation?: any; lastActive: string }>(`${this.basePath}/status`, data);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update driver status');
    }
    return response.data;
  }

  // Get driver jobs
  async getJobs(params: JobQueryParams = {}): Promise<Job[]> {
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `${this.basePath}/jobs${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<Job[]>(endpoint);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get driver jobs');
    }
    return response.data;
  }

  // Get available jobs
  async getAvailableJobs(params: AvailableJobsQueryParams = {}): Promise<AvailableJob[]> {
    const queryParams = new URLSearchParams();
    
    if (params.lat !== undefined) queryParams.append('lat', params.lat.toString());
    if (params.lng !== undefined) queryParams.append('lng', params.lng.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `${this.basePath}/available-jobs${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<AvailableJob[]>(endpoint);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get available jobs');
    }
    return response.data;
  }

  // Accept a job
  async acceptJob(jobId: string): Promise<{ id: string; status: string; driverId: string }> {
    const response = await apiClient.post<{ id: string; status: string; driverId: string }>(`${this.basePath}/accept-job/${jobId}`, {});
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to accept job');
    }
    return response.data;
  }

  // Get current jobs (convenience method)
  async getCurrentJobs(): Promise<Job[]> {
    return this.getJobs({ status: 'pickup,cleaning,delivery' });
  }

  // Get completed jobs (convenience method)
  async getCompletedJobs(): Promise<Job[]> {
    return this.getJobs({ status: 'completed' });
  }

  // Get job history (convenience method)
  async getJobHistory(limit: number = 50, offset: number = 0): Promise<Job[]> {
    return this.getJobs({ limit, offset });
  }

  // Update job status (if driver has permission)
  async updateJobStatus(jobId: string, status: string): Promise<Job> {
    const response = await apiClient.put<Job>(`${this.basePath}/jobs/${jobId}/status`, { status });
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update job status');
    }
    return response.data;
  }
}

// Create and export singleton instance
export const driverApiService = new DriverApiService();
