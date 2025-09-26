import { v4 as uuidv4 } from 'uuid';
import SignalRService from '../../infrastructure/common/signalRService';
import { BookingStateData, InProgressBooking } from '../../models/booking/inProgressBookingModel';
import { InProgressBookingRepository } from '../../repositories/booking/InProgressBookingRepository';
import { BookingStepRepository } from '../../repositories/booking/BookingStepRepository';
import { BookingHistoryRepository } from '../../repositories/booking/BookingHistoryRepository';
import { IBookingStateService } from '../../infrastructure/di/interfaces';
import { BaseService } from '../base/BaseService';
import { Logger } from '../../utils/logger';

// Re-export types for controllers
export type { BookingStateData, InProgressBooking } from '../../models/booking/inProgressBookingModel';

export class BookingStateService extends BaseService implements IBookingStateService {
  constructor(
    private inProgressBookingRepository: InProgressBookingRepository,
    private bookingStepRepository: BookingStepRepository,
    private bookingHistoryRepository: BookingHistoryRepository,
    private signalRService: any
  ) {
    super();
  }

  // Save in-progress booking state
  async saveBookingState(
    userId: string,
    sessionId: string,
    bookingData: BookingStateData
  ): Promise<string> {
    this.logMethodEntry('saveBookingState', { userId, sessionId });
    
    try {
      // Clean up expired bookings first
      await this.cleanupExpiredBookings();

      // Check if user/session already has an in-progress booking
      let existingBooking = null;
      if (userId) {
        const bookings = await this.inProgressBookingRepository.findByUserId(userId);
        existingBooking = bookings.find(booking => booking.expiresAt > new Date());
      } else if (sessionId) {
        existingBooking = await this.inProgressBookingRepository.findBySessionId(sessionId);
        if (existingBooking && existingBooking.expiresAt <= new Date()) {
          existingBooking = null;
        }
      }

      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      const bookingId = existingBooking?.id || uuidv4();

      if (existingBooking) {
        // Update existing booking
        await this.inProgressBookingRepository.update(bookingId, {
          currentStep: (bookingData as any).currentStep,
          bookingData: bookingData as any,
          expiresAt,
          updatedAt: new Date()
        });
      } else {
        // Create new booking
        await this.inProgressBookingRepository.create({
          id: bookingId,
          userId: userId || undefined,
          sessionId: sessionId || undefined,
          currentStep: (bookingData as any).currentStep,
          bookingData: bookingData as any,
          expiresAt,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      Logger.info('Booking state saved', { bookingId, userId, sessionId });
      this.logMethodExit('saveBookingState', { bookingId });
      return bookingId;
    } catch (error) {
      this.handleError('saveBookingState', error);
    }
  }

  // Load in-progress booking state
  async loadBookingState(userId: string, sessionId: string): Promise<BookingStateData | null> {
    this.logMethodEntry('loadBookingState', { userId, sessionId });
    
    try {
      let booking = null;
      
      if (userId) {
        const bookings = await this.inProgressBookingRepository.findByUserId(userId);
        booking = bookings.find(b => b.expiresAt > new Date());
      } else if (sessionId) {
        booking = await this.inProgressBookingRepository.findBySessionId(sessionId);
        if (booking && booking.expiresAt <= new Date()) {
          booking = null;
        }
      }

      if (!booking) {
        this.logMethodExit('loadBookingState', null);
        return null;
      }

      // Parse booking data
      let bookingData: BookingStateData;
      try {
        bookingData = typeof booking.bookingData === 'string' 
          ? JSON.parse(booking.bookingData) 
          : booking.bookingData;
      } catch (parseError) {
        Logger.error('Failed to parse booking_data', { 
          parseError: parseError instanceof Error ? parseError.message : String(parseError), 
          rawData: booking.bookingData 
        });
        this.logMethodExit('loadBookingState', null);
        return null;
      }

      Logger.info('Booking state loaded', { bookingId: booking.id, userId, sessionId });
      this.logMethodExit('loadBookingState', { bookingId: booking.id });
      return bookingData;
    } catch (error) {
      this.handleError('loadBookingState', error);
    }
  }

  // Delete in-progress booking state
  async deleteBookingState(userId: string, sessionId: string): Promise<boolean> {
    this.logMethodEntry('deleteBookingState', { userId, sessionId });
    
    try {
      let booking = null;
      
      if (userId) {
        const bookings = await this.inProgressBookingRepository.findByUserId(userId);
        booking = bookings.find(b => b.expiresAt > new Date());
      } else if (sessionId) {
        booking = await this.inProgressBookingRepository.findBySessionId(sessionId);
      }

      if (!booking) {
        this.logMethodExit('deleteBookingState', { success: false });
        return false;
      }

      await this.inProgressBookingRepository.delete(booking.id);
      
      Logger.info('Booking state deleted', { bookingId: booking.id, userId, sessionId });
      this.logMethodExit('deleteBookingState', { success: true });
      return true;
    } catch (error) {
      this.handleError('deleteBookingState', error);
    }
  }

  // Transfer session to user
  async transferSessionToUser(sessionId: string, userId: string): Promise<boolean> {
    this.logMethodEntry('transferSessionToUser', { sessionId, userId });
    
    try {
      const booking = await this.inProgressBookingRepository.findBySessionId(sessionId);
      if (!booking) {
        this.logMethodExit('transferSessionToUser', { success: false });
        return false;
      }

      await this.inProgressBookingRepository.update(booking.id, {
        userId,
        sessionId: undefined,
        updatedAt: new Date()
      });

      Logger.info('Session transferred to user', { bookingId: booking.id, sessionId, userId });
      this.logMethodExit('transferSessionToUser', { success: true });
      return true;
    } catch (error) {
      this.handleError('transferSessionToUser', error);
    }
  }

  // Record booking step
  async recordBookingStep(bookingId: string, stepName: string, userId: string, stepData: any): Promise<boolean> {
    this.logMethodEntry('recordBookingStep', { bookingId, stepName, userId });
    
    try {
      // Get existing steps to determine proper order
      const existingSteps = await this.bookingStepRepository.findAll();
      const maxOrder = existingSteps.length > 0 
        ? Math.max(...existingSteps.map(step => step.stepOrder || 0)) 
        : 0;

      await this.bookingStepRepository.create({
        id: uuidv4(),
        // Note: BookingStep doesn't have bookingId property
        stepName,
        stepOrder: maxOrder + 1,
        description: stepData ? JSON.stringify(stepData) : undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      Logger.info('Booking step recorded', { bookingId, stepName, userId });
      this.logMethodExit('recordBookingStep', { success: true });
      return true;
    } catch (error) {
      this.handleError('recordBookingStep', error);
    }
  }

  // Clean up expired bookings
  private async cleanupExpiredBookings(): Promise<void> {
    try {
      const now = new Date();
      const allBookings = await this.inProgressBookingRepository.findAll();
      const expiredBookings = allBookings.filter(booking => {
        const bookingAge = now.getTime() - booking.createdAt.getTime();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        return bookingAge > maxAge;
      });
      
      for (const booking of expiredBookings) {
        await this.inProgressBookingRepository.delete(booking.id);
        Logger.info('Expired booking cleaned up', { bookingId: booking.id });
      }
    } catch (error) {
      Logger.error('Failed to cleanup expired bookings:', error);
    }
  }
}