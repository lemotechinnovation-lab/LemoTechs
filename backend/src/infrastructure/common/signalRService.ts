import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Logger } from '../../utils/logger';

export class SignalRService {
  private static instance: SignalRService;
  private connection: HubConnection | null = null;

  private constructor() {}

  public static getInstance(): SignalRService {
    if (!SignalRService.instance) {
      SignalRService.instance = new SignalRService();
    }
    return SignalRService.instance;
  }

  // Initialize SignalR connection (for server-side operations)
  public async initialize(): Promise<void> {
    if (this.connection) {
      return;
    }

    try {
      this.connection = new HubConnectionBuilder()
        .withUrl(`http://localhost:${process.env.PORT || 3001}/bookingHub`)
        .configureLogging(LogLevel.Information)
        .build();

      await this.connection.start();
      Logger.info('📡 SignalR connection established');
    } catch (error) {
      Logger.error('❌ SignalR connection failed:', error);
      throw error;
    }
  }

  // Get connection instance
  public getConnection(): HubConnection | null {
    return this.connection;
  }

  // Send booking status update to all clients in booking room
  public async updateBookingStatus(bookingId: string, status: string, data?: any): Promise<void> {
    if (!this.connection) {
      await this.initialize();
    }

    try {
      await this.connection?.invoke('UpdateBookingStatus', bookingId, status, data);
      Logger.info(`📡 Sent booking status update: ${status} for booking ${bookingId}`);
    } catch (error) {
      Logger.error('❌ Failed to send booking status update:', error);
    }
  }

  // Send driver location update
  public async updateDriverLocation(bookingId: string, location: { lat: number; lng: number }, driverId: string): Promise<void> {
    if (!this.connection) {
      await this.initialize();
    }

    try {
      await this.connection?.invoke('UpdateDriverLocation', bookingId, location, driverId);
      Logger.info(`📡 Sent driver location update for booking ${bookingId}`);
    } catch (error) {
      Logger.error('❌ Failed to send driver location update:', error);
    }
  }

  // Send notification to specific user
  public async sendNotification(userId: string, type: string, message: string, data?: any): Promise<void> {
    if (!this.connection) {
      await this.initialize();
    }

    try {
      await this.connection?.invoke('SendNotification', userId, type, message, data);
      Logger.info(`📡 Sent notification to user ${userId}: ${type}`);
    } catch (error) {
      Logger.error('❌ Failed to send notification:', error);
    }
  }

  // Update estimated arrival time
  public async updateArrivalTime(bookingId: string, estimatedArrival: string, driverId: string): Promise<void> {
    if (!this.connection) {
      await this.initialize();
    }

    try {
      await this.connection?.invoke('UpdateArrivalTime', bookingId, estimatedArrival, driverId);
      Logger.info(`📡 Sent arrival time update for booking ${bookingId}: ${estimatedArrival}`);
    } catch (error) {
      Logger.error('❌ Failed to send arrival time update:', error);
    }
  }

  // Close connection
  public async close(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      Logger.info('📡 SignalR connection closed');
    }
  }
}

export default SignalRService.getInstance();
