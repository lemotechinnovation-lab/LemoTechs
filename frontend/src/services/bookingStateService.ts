import { generateSessionId } from '../utils/sessionUtils';

export interface BookingStateData {
  location?: string;
  coordinates?: { lat: number; lng: number } | null;
  items?: { [key: string]: number };
  scheduledFor?: 'now' | 'later';
  paymentMethod?: string;
  specialInstructions?: string;
  contactPhone?: string;
  selectedCarType?: string | null;
  estimatedPrice?: number;
}

export interface InProgressBooking {
  id: string;
  userId?: string;
  sessionId?: string;
  currentStep: string;
  bookingData: BookingStateData;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

class BookingStateService {
  private baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  private sessionId: string;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
  }

  // Get or create session ID
  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('booking_session_id');
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem('booking_session_id', sessionId);
    }
    return sessionId;
  }

  // Get auth headers
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('lemotech_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'x-session-id': this.sessionId,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Save booking state
  async saveBookingState(currentStep: string, bookingData: BookingStateData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/booking-state/save`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ currentStep, bookingData }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to save booking state');
      }

      console.log(`📝 Saved booking state for step: ${currentStep}`);
      return result;
    } catch (error) {
      console.error('❌ Failed to save booking state:', error);
      throw error;
    }
  }

  // Load booking state
  async loadBookingState(): Promise<InProgressBooking | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/booking-state/load`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to load booking state');
      }

      if (result.data) {
        console.log(`📝 Loaded booking state from step: ${result.data.currentStep}`);
        return result.data;
      }

      return null;
    } catch (error) {
      console.error('❌ Failed to load booking state:', error);
      return null;
    }
  }

  // Delete booking state
  async deleteBookingState(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/booking-state/delete`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to delete booking state');
      }

      console.log('🗑️ Deleted booking state');
    } catch (error) {
      console.error('❌ Failed to delete booking state:', error);
      throw error;
    }
  }

  // Transfer session to user (when user logs in)
  async transferSessionToUser(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/booking-state/transfer-session`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ sessionId: this.sessionId }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to transfer session');
      }

      console.log('🔄 Transferred session to user');
    } catch (error) {
      console.error('❌ Failed to transfer session:', error);
      throw error;
    }
  }

  // Record booking step completion
  async recordBookingStep(bookingId: string, stepName: string, stepData?: any): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/booking-state/record-step`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ bookingId, stepName, stepData }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to record booking step');
      }

      console.log(`📊 Recorded booking step: ${stepName}`);
    } catch (error) {
      console.error('❌ Failed to record booking step:', error);
      throw error;
    }
  }

  // Get session ID
  getSessionId(): string {
    return this.sessionId;
  }
}

// Export singleton instance
export default new BookingStateService();
