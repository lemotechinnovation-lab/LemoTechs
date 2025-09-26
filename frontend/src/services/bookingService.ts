// Booking API service wired to backend endpoints
import { apiCall } from './apiConfig';
export interface BookingRequest {
  pickupLocation: string;
  items: string[];
  driverId?: string;
  contactPhone: string;
  specialInstructions?: string;
  paymentMethod: 'card' | 'cash' | 'mobile';
  paymentId?: string;
  amount: number;
  serviceType: string;
  scheduledDate: Date | null;
  scheduledTime: Date | null;
  coordinates: { lat: number; lng: number } | null;
}

export interface BookingResponse {
  bookingId: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  estimatedPickupTime: string;
  estimatedDeliveryTime: string;
  totalAmount: number;
  driverInfo: {
    name: string;
    phone: string;
    vehicle: string;
    rating: number;
  };
}

export interface Driver {
  id: string;
  name: string;
  rating: number;
  vehicle: string;
  estimatedArrival: string;
  location: { lat: number; lng: number };
  photo: string;
  phone: string;
  completedJobs: number;
}

// Simulated API functions
export const bookingService = {
  // Get available drivers near a location
  async getAvailableDrivers(location: { lat: number; lng: number }): Promise<Driver[]> {
    const params = new URLSearchParams({ lat: String(location.lat), lng: String(location.lng) });
    const data = await apiCall(`/api/bookings/drivers?${params.toString()}`);
    return (data.data || []) as Driver[];
  },

  // Create a new booking
  async createBooking(bookingData: BookingRequest): Promise<BookingResponse> {
    // Format phone number to match backend validation
    const formatPhoneNumber = (phone: string): string => {
      const cleaned = phone.replace(/\D/g, '');
      
      // If it's 9 digits without prefix, add +27
      if (cleaned.length === 9 && !cleaned.startsWith('0')) {
        return `+27${cleaned}`;
      }
      
      // If it's 10 digits starting with 0, convert to +27
      if (cleaned.length === 10 && cleaned.startsWith('0')) {
        return `+27${cleaned.substring(1)}`;
      }
      
      // If it's already 11 digits starting with 27, add +
      if (cleaned.length === 11 && cleaned.startsWith('27')) {
        return `+${cleaned}`;
      }
      
      // Return as is if already properly formatted
      return phone;
    };

    const data = await apiCall('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        pickupLocation: bookingData.pickupLocation,
        pickupCoords: bookingData.coordinates,
        items: bookingData.items,
        driverId: undefined,
        paymentMethod: bookingData.paymentMethod,
        paymentId: bookingData.paymentId,
        amount: bookingData.amount,
        contactPhone: formatPhoneNumber(bookingData.contactPhone),
        specialInstructions: bookingData.specialInstructions
      })
    });

    const res = data.data;
    return {
      bookingId: res.bookingId,
      status: res.status,
      estimatedPickupTime: res.estimatedPickupTime,
      estimatedDeliveryTime: res.estimatedDeliveryTime,
      totalAmount: res.totalAmount,
      driverInfo: res.driverInfo || {
        name: '',
        phone: '',
        vehicle: '',
        rating: 0
      }
    } as BookingResponse;
  },

  // Get booking status (derives from getBookingById)
  async getBookingStatus(bookingId: string): Promise<{
    status: 'confirmed' | 'pickup' | 'cleaning' | 'delivery' | 'completed';
    driverStatus: 'en-route' | 'arrived' | 'picked-up' | 'delivering';
    estimatedCompletion: string;
  }> {
    const details = await this.getBookingDetails(bookingId);
    // Map backend status to tracking summary
    const status = (details.status as any) || 'confirmed';
    let driverStatus: 'en-route' | 'arrived' | 'picked-up' | 'delivering' = 'en-route';
    if (status === 'pickup') driverStatus = 'arrived';
    if (status === 'delivery') driverStatus = 'delivering';
    if (status === 'cleaning') driverStatus = 'picked-up';
    return {
      status,
      driverStatus,
      estimatedCompletion: details.estimatedDeliveryTime || new Date(Date.now() + 2 * 60 * 60000).toISOString()
    };
  },

  // Get booking details
  async getBookingDetails(bookingId: string): Promise<any> {
    const data = await apiCall(`/api/bookings/${bookingId}`);
    return data.data;
  },

  // Get list of user bookings
  async getUserBookings(params?: { page?: number; limit?: number; status?: string }): Promise<any> {
    const search = new URLSearchParams();
    if (params?.page) search.set('page', String(params.page));
    if (params?.limit) search.set('limit', String(params.limit));
    if (params?.status) search.set('status', params.status);
    return await apiCall(`/api/bookings?${search.toString()}`);
  },

  // Role-based action methods
  async updateBookingStatus(bookingId: string, status: string, userRole: 'user' | 'driver' | 'shop'): Promise<{
    success: boolean;
    message: string;
    newStatus: string;
  }> {
    try {
      const data = await apiCall(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        body: JSON.stringify({
          status,
          updatedBy: userRole,
          timestamp: new Date().toISOString()
        })
      });
      return {
        success: true,
        message: data.message || 'Status updated successfully',
        newStatus: data.status || status
      };
    } catch (error) {
      console.error('Failed to update booking status:', error);
      return {
        success: false,
        message: 'Failed to update status. Please try again.',
        newStatus: status
      };
    }
  },

  // Send message to driver/customer/shop
  async sendMessage(bookingId: string, message: string, fromRole: 'user' | 'driver' | 'shop', toRole: 'user' | 'driver' | 'shop'): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const data = await apiCall(`/api/bookings/${bookingId}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          message,
          fromRole,
          toRole,
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

  // Get contact information for role-based communication
  async getContactInfo(bookingId: string, role: 'user' | 'driver' | 'shop'): Promise<{
    phone: string;
    name: string;
    available: boolean;
  }> {
    try {
      const data = await apiCall(`/api/bookings/${bookingId}/contact/${role}`);
      return {
        phone: data.phone || '',
        name: data.name || '',
        available: data.available || false
      };
    } catch (error) {
      console.error('Failed to get contact info:', error);
      return {
        phone: '',
        name: '',
        available: false
      };
    }
  },

  // Process payment (delegated to payments API already wired in paymentService)
  async processPayment(bookingId: string, paymentMethod: string, amount: number): Promise<{
    success: boolean;
    transactionId: string;
    message: string;
  }> {
    const data = await apiCall(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      body: JSON.stringify({ paymentMethod, amount })
    });
    return {
      success: true,
      transactionId: data.data?.paymentId || '',
      message: 'Payment linked to booking'
    };
  },

  // Cancel booking
  async cancelBooking(bookingId: string): Promise<{
    success: boolean;
    refundAmount?: number;
    message: string;
  }> {
    const data = await apiCall(`/api/bookings/${bookingId}`, {
      method: 'DELETE'
    });
    return {
      success: true,
      refundAmount: data.refundAmount,
      message: data.message || 'Booking cancelled successfully'
    };
  }
};
