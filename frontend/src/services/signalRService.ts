// Frontend SignalR Service for Real-time Communication
import { io, Socket } from 'socket.io-client';

export interface BookingUpdate {
  bookingId: string;
  status: string;
  message: string;
  timestamp: Date;
  driverLocation?: {
    lat: number;
    lng: number;
  };
  eta?: number;
  speed?: number;
  distance?: number;
}

export interface DriverLocationUpdate {
  bookingId: string;
  location: {
    lat: number;
    lng: number;
  };
  timestamp: Date;
  speed?: number;
  heading?: number;
  driverId?: string;
}

export interface UserNotification {
  type: string;
  message: string;
  data?: any;
  timestamp: Date;
}

class SignalRService {
  private static instance: SignalRService;
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 5000;

  // Event listeners
  private bookingUpdateListeners: Array<(update: BookingUpdate) => void> = [];
  private driverLocationListeners: Array<(update: DriverLocationUpdate) => void> = [];
  private notificationListeners: Array<(notification: UserNotification) => void> = [];
  private connectionListeners: Array<(connected: boolean) => void> = [];

  public static getInstance(): SignalRService {
    if (!SignalRService.instance) {
      SignalRService.instance = new SignalRService();
    }
    return SignalRService.instance;
  }

  // Initialize connection
  public async initialize(userId?: string): Promise<void> {
    if (this.socket?.connected) {
      return;
    }

    const serverUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
    
    try {
      this.socket = io(serverUrl, {
        path: '/hubs/bookingHub',
        transports: ['websocket', 'polling'],
        auth: {
          userId: userId
        }
      });

      this.setupEventHandlers();
      console.log('📡 SignalR Service: Initialized connection to', serverUrl);
    } catch (error) {
      console.error('❌ SignalR Service: Failed to initialize:', error);
      throw error;
    }
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ SignalR Service: Connected to server');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.notifyConnectionListeners(true);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 SignalR Service: Disconnected from server:', reason);
      this.isConnected = false;
      this.notifyConnectionListeners(false);
      
      // Attempt reconnection if not intentional
      if (reason !== 'io client disconnect') {
        this.attemptReconnection();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ SignalR Service: Connection error:', error);
      this.isConnected = false;
      this.notifyConnectionListeners(false);
    });

    // Room events
    this.socket.on('joinedRoom', (data) => {
      console.log('📡 SignalR Service: Joined room:', data);
    });

    this.socket.on('leftRoom', (data) => {
      console.log('📡 SignalR Service: Left room:', data);
    });

    // Real-time updates
    this.socket.on('bookingUpdate', (update: BookingUpdate) => {
      console.log('📡 SignalR Service: Received booking update:', update);
      this.notifyBookingUpdateListeners(update);
    });

    this.socket.on('driverLocationUpdate', (update: DriverLocationUpdate) => {
      console.log('📡 SignalR Service: Received driver location update:', update);
      this.notifyDriverLocationListeners(update);
    });

    this.socket.on('userMessage', (notification: UserNotification) => {
      console.log('📡 SignalR Service: Received notification:', notification);
      this.notifyNotificationListeners(notification);
    });
  }

  // Join booking room
  public joinBookingRoom(bookingId: string, userId: string): void {
    if (!this.socket?.connected) {
      console.warn('⚠️ SignalR Service: Not connected, cannot join room');
      return;
    }

    this.socket.emit('joinBookingRoom', { bookingId, userId });
    console.log(`📡 SignalR Service: Joining booking room ${bookingId}`);
  }

  // Leave booking room
  public leaveBookingRoom(bookingId: string, userId: string): void {
    if (!this.socket?.connected) {
      console.warn('⚠️ SignalR Service: Not connected, cannot leave room');
      return;
    }

    this.socket.emit('leaveBookingRoom', { bookingId, userId });
    console.log(`📡 SignalR Service: Leaving booking room ${bookingId}`);
  }

  // Event subscription methods
  public onBookingUpdate(callback: (update: BookingUpdate) => void): () => void {
    this.bookingUpdateListeners.push(callback);
    return () => {
      const index = this.bookingUpdateListeners.indexOf(callback);
      if (index > -1) {
        this.bookingUpdateListeners.splice(index, 1);
      }
    };
  }

  public onDriverLocationUpdate(callback: (update: DriverLocationUpdate) => void): () => void {
    this.driverLocationListeners.push(callback);
    return () => {
      const index = this.driverLocationListeners.indexOf(callback);
      if (index > -1) {
        this.driverLocationListeners.splice(index, 1);
      }
    };
  }

  public onNotification(callback: (notification: UserNotification) => void): () => void {
    this.notificationListeners.push(callback);
    return () => {
      const index = this.notificationListeners.indexOf(callback);
      if (index > -1) {
        this.notificationListeners.splice(index, 1);
      }
    };
  }

  public onConnectionChange(callback: (connected: boolean) => void): () => void {
    this.connectionListeners.push(callback);
    return () => {
      const index = this.connectionListeners.indexOf(callback);
      if (index > -1) {
        this.connectionListeners.splice(index, 1);
      }
    };
  }

  // Notification methods
  private notifyBookingUpdateListeners(update: BookingUpdate): void {
    this.bookingUpdateListeners.forEach(callback => {
      try {
        callback(update);
      } catch (error) {
        console.error('Error in booking update listener:', error);
      }
    });
  }

  private notifyDriverLocationListeners(update: DriverLocationUpdate): void {
    this.driverLocationListeners.forEach(callback => {
      try {
        callback(update);
      } catch (error) {
        console.error('Error in driver location listener:', error);
      }
    });
  }

  private notifyNotificationListeners(notification: UserNotification): void {
    this.notificationListeners.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });
  }

  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach(callback => {
      try {
        callback(connected);
      } catch (error) {
        console.error('Error in connection listener:', error);
      }
    });
  }

  // Reconnection logic
  private attemptReconnection(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ SignalR Service: Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`🔄 SignalR Service: Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);

    setTimeout(() => {
      if (this.socket && !this.socket.connected) {
        this.socket.connect();
      }
    }, this.reconnectInterval);
  }

  // Utility methods
  public isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  public getConnectionState(): string {
    if (!this.socket) return 'disconnected';
    return this.socket.connected ? 'connected' : 'disconnected';
  }

  // Cleanup
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.bookingUpdateListeners = [];
    this.driverLocationListeners = [];
    this.notificationListeners = [];
    this.connectionListeners = [];
    console.log('📡 SignalR Service: Disconnected and cleaned up');
  }
}

export const signalRService = SignalRService.getInstance();
export default signalRService;