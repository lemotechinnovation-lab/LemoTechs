import { BookingHubServer as SocketBookingHub } from './bookingHub';
import { Logger } from '../utils/logger';

// Real SignalR Hub implementation using Socket.IO
export class BookingHubServer {
  private socketHub: SocketBookingHub;

  constructor(socketHub: SocketBookingHub) {
    this.socketHub = socketHub;
  }
  
  // Join booking room for real-time updates
  async joinBookingRoom(bookingId: string, userId: string): Promise<void> {
    Logger.info(`📡 User ${userId} joining booking room ${bookingId}`);
    // This will be handled by the Socket.IO connection event
  }

  // Leave booking room
  async leaveBookingRoom(bookingId: string, userId: string): Promise<void> {
    Logger.info(`📡 User ${userId} leaving booking room ${bookingId}`);
    // This will be handled by the Socket.IO disconnection event
  }

  // Update booking status and notify all users in the booking room
  async updateBookingStatus(bookingId: string, status: string, data?: any): Promise<void> {
    Logger.info(`📡 Updating booking status: ${status} for booking ${bookingId}`);
    
    const update = {
      bookingId,
      status,
      message: this.getStatusMessage(status),
      timestamp: new Date(),
      ...data
    };

    await this.socketHub.broadcastBookingUpdate(bookingId, update);
  }

  // Update driver location
  async updateDriverLocation(bookingId: string, location: { lat: number; lng: number }, driverId: string): Promise<void> {
    Logger.info(`📡 Updating driver location for booking ${bookingId}`);
    
    const locationUpdate = {
      bookingId,
      location,
      timestamp: new Date(),
      driverId
    };

    await this.socketHub.broadcastDriverLocation(bookingId, locationUpdate);
  }

  // Send notification to specific user
  async sendNotification(userId: string, type: string, message: string, data?: any): Promise<void> {
    Logger.info(`📡 Sending notification to user ${userId}: ${type}`);
    
    const notification = {
      type,
      message,
      data,
      timestamp: new Date()
    };

    await this.socketHub.sendMessageToUser(userId, notification);
  }

  // Update estimated arrival time
  async updateArrivalTime(bookingId: string, estimatedArrival: string, driverId: string): Promise<void> {
    Logger.info(`📡 Updating arrival time for booking ${bookingId}: ${estimatedArrival}`);
    
    const update = {
      bookingId,
      status: 'driver_en_route',
      message: `Driver is on the way. ETA: ${estimatedArrival}`,
      timestamp: new Date(),
      eta: parseInt(estimatedArrival) || 0,
      driverId
    };

    await this.socketHub.broadcastBookingUpdate(bookingId, update);
  }

  // Notify driver about new assignment
  async notifyDriverAssignment(driverUserId: string, bookingId: string, driverInfo: any): Promise<void> {
    Logger.info(`📡 Notifying driver ${driverUserId} about assignment for booking ${bookingId}`);
    await this.sendNotification(
      driverUserId,
      'driver_assignment',
      `New booking assigned: ${bookingId}`,
      {
        bookingId,
        driverInfo,
        timestamp: new Date().toISOString()
      }
    );
  }

  // Notify customer about driver assignment
  async notifyCustomerDriverAssigned(customerUserId: string, bookingId: string, driverInfo: any): Promise<void> {
    Logger.info(`📡 Notifying customer ${customerUserId} about driver assignment for booking ${bookingId}`);
    await this.sendNotification(
      customerUserId,
      'driver_assigned',
      `Driver ${driverInfo.name} has been assigned to your booking`,
      {
        bookingId,
        driverInfo,
        estimatedArrival: `${driverInfo.estimatedArrivalTime} minutes`,
        timestamp: new Date().toISOString()
      }
    );
  }

  // Notify about driver rejection and reassignment
  async notifyDriverRejection(bookingId: string, reason?: string): Promise<void> {
    Logger.info(`📡 Notifying about driver rejection for booking ${bookingId}`);
    
    const update = {
      bookingId,
      status: 'waiting_driver',
      message: reason ? `Driver rejected: ${reason}. Looking for another driver...` : 'Looking for another driver...',
      timestamp: new Date(),
      reason
    };

    await this.socketHub.broadcastBookingUpdate(bookingId, update);
  }

  // Notify about assignment failure
  async notifyAssignmentFailure(bookingId: string, reason: string): Promise<void> {
    Logger.info(`📡 Notifying about assignment failure for booking ${bookingId}: ${reason}`);
    
    const update = {
      bookingId,
      status: 'assignment_failed',
      message: `Unable to assign driver: ${reason}`,
      timestamp: new Date(),
      reason
    };

    await this.socketHub.broadcastBookingUpdate(bookingId, update);
  }

  // Helper method to get status messages
  private getStatusMessage(status: string): string {
    const statusMessages: { [key: string]: string } = {
      'confirmed': 'Your booking has been confirmed!',
      'waiting_driver': 'Looking for an available driver...',
      'driver_accepted': 'Driver has accepted your booking!',
      'driver_en_route': 'Driver is on the way to pickup location',
      'arrived_at_pickup': 'Driver has arrived at pickup location',
      'picked_up': 'Items have been collected',
      'at_facility': 'Items delivered to cleaning facility',
      'cleaning': 'Items are being cleaned',
      'ready_for_delivery': 'Items are ready for delivery',
      'out_for_delivery': 'Driver is delivering your items',
      'delivered': 'Items have been delivered successfully!',
      'returning_to_customer': 'Driver is returning to customer location'
    };

    return statusMessages[status] || 'Booking status updated';
  }
}
