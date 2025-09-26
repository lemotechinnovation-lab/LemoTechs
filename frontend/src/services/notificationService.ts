import type { Notification } from '../components/Common/NotificationSystem';

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  marketing: boolean;
}

export interface NotificationTemplate {
  type: 'booking' | 'driver' | 'payment' | 'promotion' | 'system' | 'support';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  actionUrl?: string;
}

class NotificationService {
  private static instance: NotificationService;
  private listeners: Array<(notification: Notification) => void> = [];
  private socket: WebSocket | null = null;
  private reconnectInterval: number = 5000;
  private maxReconnectAttempts: number = 5;
  private reconnectAttempts: number = 0;

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Initialize WebSocket connection for real-time notifications
  public initialize(userId?: string): void {
    this.connect(userId);
  }

  private connect(userId?: string): void {
    try {
      // Check if we have a valid WebSocket URL
      const wsUrl = import.meta.env.VITE_WS_URL;
      if (!wsUrl) {
        console.log('🔌 NotificationService: WebSocket URL not configured, skipping connection');
        return;
      }
      
      const url = userId ? `${wsUrl}?userId=${userId}` : wsUrl;
      console.log('🔌 NotificationService: Connecting to:', url);
      
      this.socket = new WebSocket(url);
      
      this.socket.onopen = () => {
        console.log('✅ Notification service connected');
        this.reconnectAttempts = 0;
      };
      
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleIncomingNotification(data);
        } catch (error) {
          console.error('Error parsing notification:', error);
        }
      };
      
      this.socket.onclose = () => {
        console.log('🔌 Notification service disconnected');
        this.attemptReconnection(userId);
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect to notification service:', error);
      this.attemptReconnection(userId);
    }
  }

  private attemptReconnection(userId?: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect(userId);
      }, this.reconnectInterval);
    } else {
      console.error('❌ Max reconnection attempts reached');
    }
  }

  private handleIncomingNotification(data: any): void {
    const notification: Notification = {
      id: data.id || Date.now().toString(),
      type: data.type || 'system',
      priority: data.priority || 'medium',
      title: data.title || 'New Notification',
      message: data.message || '',
      timestamp: new Date(data.timestamp || Date.now()),
      isRead: false,
      actionUrl: data.actionUrl,
      metadata: data.metadata
    };

    // Notify all listeners
    this.listeners.forEach(listener => listener(notification));

    // Show browser notification if permission granted
    this.showBrowserNotification(notification);
  }

  // Subscribe to real-time notifications
  public subscribe(listener: (notification: Notification) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Send notification (for testing or admin purposes)
  public sendNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        action: 'send',
        notification
      }));
    }
  }

  // Request browser notification permission
  public async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  // Show browser notification
  private showBrowserNotification(notification: Notification): void {
    if (Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/icons/android-chrome-192x192.png',
        badge: '/icons/android-chrome-192x192.png',
        tag: notification.id,
        requireInteraction: notification.priority === 'urgent',
      });

      browserNotification.onclick = () => {
        window.focus();
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl;
        }
        browserNotification.close();
      };

      // Auto close after 5 seconds for non-urgent notifications
      if (notification.priority !== 'urgent') {
        setTimeout(() => {
          browserNotification.close();
        }, 5000);
      }
    }
  }

  // Mark notification as read
  public async markAsRead(notificationId: string): Promise<void> {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('lemotech_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Fetch notification history
  public async fetchNotifications(options?: {
    limit?: number;
    offset?: number;
    type?: string;
    isRead?: boolean;
  }): Promise<Notification[]> {
    try {
      const params = new URLSearchParams();
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.offset) params.append('offset', options.offset.toString());
      if (options?.type) params.append('type', options.type);
      if (options?.isRead !== undefined) params.append('isRead', options.isRead.toString());

      const response = await fetch(`/api/notifications?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('lemotech_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      return data.notifications || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  // Update notification preferences
  public async updatePreferences(preferences: NotificationPreferences): Promise<void> {
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('lemotech_token')}`
        },
        body: JSON.stringify(preferences)
      });

      if (!response.ok) {
        throw new Error('Failed to update notification preferences');
      }
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  // Get notification preferences
  public async getPreferences(): Promise<NotificationPreferences> {
    try {
      const response = await fetch('/api/notifications/preferences', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('lemotech_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notification preferences');
      }

      const data = await response.json();
      return data.preferences || {
        email: true,
        sms: true,
        push: true,
        marketing: false
      };
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      return {
        email: true,
        sms: true,
        push: true,
        marketing: false
      };
    }
  }

  // Create booking-specific notifications
  public createBookingNotifications = {
    confirmed: (bookingId: string, scheduledTime: string): NotificationTemplate => ({
      type: 'booking',
      priority: 'high',
      title: 'Booking Confirmed! 🎉',
      message: `Your LemoTech cleaning service has been confirmed for ${scheduledTime}.`,
      actionUrl: `/track/booking/${bookingId}`
    }),

    driverAssigned: (driverName: string, bookingId: string): NotificationTemplate => ({
      type: 'driver',
      priority: 'medium',
      title: 'Driver Assigned 🚗',
      message: `${driverName} has been assigned to your order and will arrive soon.`,
      actionUrl: `/track/booking/${bookingId}`
    }),

    enRoute: (driverName: string, eta: string): NotificationTemplate => ({
      type: 'driver',
      priority: 'medium',
      title: 'Driver En Route 📍',
      message: `${driverName} is on the way to your location. ETA: ${eta}`,
      actionUrl: `/track`
    }),

    itemsCollected: (itemCount: number): NotificationTemplate => ({
      type: 'booking',
      priority: 'medium',
      title: 'Items Collected ✅',
      message: `${itemCount} items have been collected and are being transported for cleaning.`,
      actionUrl: `/track`
    }),

    inCleaning: (estimatedCompletion: string): NotificationTemplate => ({
      type: 'booking',
      priority: 'low',
      title: 'Cleaning in Progress 🧽',
      message: `Your items are currently being professionally cleaned. Estimated completion: ${estimatedCompletion}`,
      actionUrl: `/track`
    }),

    cleaningComplete: (): NotificationTemplate => ({
      type: 'booking',
      priority: 'medium',
      title: 'Cleaning Complete! ✨',
      message: 'Your items have been professionally cleaned and are ready for delivery.',
      actionUrl: `/track`
    }),

    outForDelivery: (eta: string): NotificationTemplate => ({
      type: 'driver',
      priority: 'high',
      title: 'Out for Delivery 🚚',
      message: `Your freshly cleaned items are on the way back to you! ETA: ${eta}`,
      actionUrl: `/track`
    }),

    delivered: (rating: boolean = false): NotificationTemplate => ({
      type: 'booking',
      priority: 'high',
      title: 'Order Delivered! 🎊',
      message: rating 
        ? 'Your items have been delivered successfully! How was your experience?'
        : 'Your items have been delivered successfully! Thank you for choosing LemoTech.',
      actionUrl: rating ? `/rate` : `/dashboard`
    })
  };

  // Create payment notifications
  public createPaymentNotifications = {
    successful: (amount: number, orderId: string): NotificationTemplate => ({
      type: 'payment',
      priority: 'medium',
      title: 'Payment Successful ✅',
      message: `Your payment of R${amount} has been processed successfully.`,
      actionUrl: `/receipt/${orderId}`
    }),

    failed: (amount: number, reason?: string): NotificationTemplate => ({
      type: 'payment',
      priority: 'high',
      title: 'Payment Failed ❌',
      message: reason 
        ? `Payment of R${amount} failed: ${reason}. Please try again.`
        : `Payment of R${amount} failed. Please try again.`,
      actionUrl: `/payment/retry`
    }),

    refund: (amount: number, orderId: string): NotificationTemplate => ({
      type: 'payment',
      priority: 'medium',
      title: 'Refund Processed 💰',
      message: `A refund of R${amount} has been processed and will appear in your account within 3-5 business days.`,
      actionUrl: `/receipt/${orderId}`
    })
  };

  // Create promotional notifications
  public createPromotionalNotifications = {
    discount: (percentage: number, validUntil: string): NotificationTemplate => ({
      type: 'promotion',
      priority: 'low',
      title: `${percentage}% Off Special! 🎉`,
      message: `Get ${percentage}% off your next cleaning service! Valid until ${validUntil}.`,
      actionUrl: `/book?promo=SAVE${percentage}`
    }),

    loyalty: (points: number, reward?: string): NotificationTemplate => ({
      type: 'promotion',
      priority: 'low',
      title: 'Loyalty Points Earned! ⭐',
      message: reward 
        ? `You earned ${points} points! You've unlocked: ${reward}`
        : `You earned ${points} points! Check out available rewards.`,
      actionUrl: `/dashboard?tab=rewards`
    }),

    referral: (reward: string): NotificationTemplate => ({
      type: 'promotion',
      priority: 'medium',
      title: 'Referral Reward! 🎁',
      message: `Your friend signed up! You've earned: ${reward}`,
      actionUrl: `/dashboard?tab=rewards`
    })
  };

  // Disconnect service
  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.listeners = [];
  }
}

export const notificationService = NotificationService.getInstance();
export default notificationService;
