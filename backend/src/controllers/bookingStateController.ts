import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getServices } from '../infrastructure/di/injector';
import { Logger } from '../utils/logger';

// Save booking state
export const saveBookingState = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentStep, bookingData } = req.body;
    const userId = req.user?.userId;
    const sessionId = req.headers['x-session-id'] as string;

    if (!currentStep || !bookingData) {
      res.status(400).json({
        success: false,
        message: 'Current step and booking data are required'
      });
      return;
    }

    const { bookingStateService } = getServices(req);
    const bookingStateId = await bookingStateService.saveBookingState(
      userId || '',
      sessionId || '',
      { currentStep, ...bookingData }
    );

    res.json({
      success: true,
      message: 'Booking state saved successfully',
      data: { bookingStateId, currentStep }
    });
  } catch (error) {
    Logger.logError(error as Error, 'Save booking state error');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Load booking state
export const loadBookingState = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    let sessionId = req.headers['x-session-id'] as string;

    // If there is no authenticated user and no session yet, create a temporary session ID
    if (!userId && !sessionId) {
      sessionId = uuidv4();
      res.setHeader('x-session-id', sessionId);
    }

    const { bookingStateService } = getServices(req);
    const bookingState = await bookingStateService.loadBookingState(
      userId || '',
      sessionId || ''
    );

    if (!bookingState) {
      res.json({
        success: true,
        message: 'No in-progress booking found',
        data: null
      });
      return;
    }

    res.json({
      success: true,
      message: 'Booking state loaded successfully',
      data: bookingState
    });
  } catch (error) {
    Logger.logError(error as Error, 'Load booking state error');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete booking state
export const deleteBookingState = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const sessionId = req.headers['x-session-id'] as string;

    const { bookingStateService } = getServices(req);
    await bookingStateService.deleteBookingState(
      userId || '',
      sessionId || ''
    );

    res.json({
      success: true,
      message: 'Booking state deleted successfully'
    });
  } catch (error) {
    Logger.logError(error as Error, 'Delete booking state error');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Transfer session to user (when user logs in)
export const transferSessionToUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.body;
    const userId = req.user?.userId;

    if (!sessionId) {
      res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
      return;
    }

    const { bookingStateService } = getServices(req);
    await bookingStateService.transferSessionToUser(sessionId, userId!);

    res.json({
      success: true,
      message: 'Session transferred to user successfully'
    });
  } catch (error) {
    Logger.logError(error as Error, 'Transfer session error');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Record booking step completion
export const recordBookingStep = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId, stepName, stepData } = req.body;
    const userId = req.user?.userId;

    if (!bookingId || !stepName || !userId) {
      res.status(400).json({
        success: false,
        message: 'Booking ID, step name, and user ID are required'
      });
      return;
    }

    const { bookingStateService } = getServices(req);
    await bookingStateService.recordBookingStep(bookingId, stepName, userId, stepData);

    res.json({
      success: true,
      message: 'Booking step recorded successfully'
    });
  } catch (error) {
    Logger.logError(error as Error, 'Record booking step error');
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
