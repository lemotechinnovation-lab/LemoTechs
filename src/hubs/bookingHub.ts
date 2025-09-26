import { Logger } from '../utils/logger';
import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

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
}

export class BookingHubServer {
  private io: SocketIOServer;
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId
  private bookingRooms: Map<string, Set<string>> = new Map(); // bookingId -> Set of socketIds

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: ["http://localhost:5173", "http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true
      },
      path: '/hubs/bookingHub'
    });

    this.setupEventHandlers();
    Logger.info('📡 BookingHubServer: Initialized with Socket.IO');
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket: any) => {
      Logger.info(`📡 Client connected: ${socket.id}`);

      // Join booking room
      socket.on('joinBookingRoom', (data: { bookingId: string; userId: string }) => {
        const { bookingId, userId } = data;
        Logger.info(`📡 User ${userId} joining booking room ${bookingId}`);
        
        socket.join(`booking_${bookingId}`);
        this.connectedUsers.set(userId, socket.id);
        
        if (!this.bookingRooms.has(bookingId)) {
          this.bookingRooms.set(bookingId, new Set());
        }
        this.bookingRooms.get(bookingId)!.add(socket.id);
        
        socket.emit('joinedRoom', { bookingId, success: true });
        Logger.info(`📡 User ${userId} successfully joined booking room ${bookingId}`);
      });

      // Leave booking room
      socket.on('leaveBookingRoom', (data: { bookingId: string; userId: string }) => {
        const { bookingId, userId } = data;
        Logger.info(`📡 User ${userId} leaving booking room ${bookingId}`);
        
        socket.leave(`booking_${bookingId}`);
        this.connectedUsers.delete(userId);
        
        const room = this.bookingRooms.get(bookingId);
        if (room) {
          room.delete(socket.id);
          if (room.size === 0) {
            this.bookingRooms.delete(bookingId);
          }
        }
        
        socket.emit('leftRoom', { bookingId, success: true });
        Logger.info(`📡 User ${userId} successfully left booking room ${bookingId}`);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        Logger.info(`📡 Client disconnected: ${socket.id}`);
        
        // Clean up user mappings
        for (const [userId, socketId] of this.connectedUsers.entries()) {
          if (socketId === socket.id) {
            this.connectedUsers.delete(userId);
            break;
          }
        }
        
        // Clean up room mappings
        for (const [bookingId, room] of this.bookingRooms.entries()) {
          room.delete(socket.id);
          if (room.size === 0) {
            this.bookingRooms.delete(bookingId);
          }
        }
      });
    });
  }

  // Broadcast booking update to all users in a booking room
  async broadcastBookingUpdate(bookingId: string, update: BookingUpdate): Promise<void> {
    Logger.info(`📡 Broadcasting booking update for ${bookingId}:`, update);
    
    this.io.to(`booking_${bookingId}`).emit('bookingUpdate', update);
    
    // Also send to specific user if they're connected
    if (update.bookingId) {
      const room = this.bookingRooms.get(bookingId);
      if (room && room.size > 0) {
        Logger.info(`📡 Update sent to ${room.size} connected users in booking ${bookingId}`);
      }
    }
  }

  // Broadcast driver location update
  async broadcastDriverLocation(bookingId: string, locationUpdate: DriverLocationUpdate): Promise<void> {
    Logger.info(`📡 Broadcasting driver location for ${bookingId}:`, locationUpdate);
    
    this.io.to(`booking_${bookingId}`).emit('driverLocationUpdate', locationUpdate);
  }

  // Send message to specific user
  async sendMessageToUser(userId: string, message: any): Promise<void> {
    Logger.info(`📡 Sending message to user ${userId}:`, message);
    
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit('userMessage', message);
      Logger.info(`📡 Message sent to user ${userId} via socket ${socketId}`);
    } else {
      Logger.info(`📡 User ${userId} not connected, message not sent`);
    }
  }

  // Get connection status
  isConnected(): boolean {
    return this.io.engine.clientsCount > 0;
  }

  // Get connected users count
  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  // Get active booking rooms count
  getActiveBookingRoomsCount(): number {
    return this.bookingRooms.size;
  }
}