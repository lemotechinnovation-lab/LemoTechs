import { useState, useCallback } from 'react';
import { bookingService, Driver, BookingRequest, BookingResponse } from '../services';
import { LocationCoordinates } from '../types/booking';

export interface UseBookingState {
  // Booking flow state
  currentStep: 'location' | 'items' | 'driver' | 'payment' | 'confirmation';
  isLoading: boolean;
  error: string | null;
  
  // Booking data
  pickupLocation: string;
  pickupCoords: LocationCoordinates | null;
  selectedItems: string[];
  selectedDriver: Driver | null;
  paymentMethod: 'card' | 'cash' | 'mobile';
  
  // Drivers
  availableDrivers: Driver[];
  isLoadingDrivers: boolean;
  
  // Booking result
  bookingResult: BookingResponse | null;
}

export interface UseBookingActions {
  // Step navigation
  goToStep: (step: UseBookingState['currentStep']) => void;
  nextStep: () => void;
  previousStep: () => void;
  
  // Location actions
  setPickupLocation: (location: string, coords?: LocationCoordinates) => void;
  
  // Items actions
  addItem: (item: string) => void;
  removeItem: (item: string) => void;
  setSelectedItems: (items: string[]) => void;
  
  // Driver actions
  loadDrivers: (location: LocationCoordinates) => Promise<void>;
  selectDriver: (driver: Driver) => void;
  
  // Payment actions
  setPaymentMethod: (method: 'card' | 'cash' | 'mobile') => void;
  
  // Booking actions
  createBooking: (bookingData: Partial<BookingRequest>) => Promise<BookingResponse | null>;
  
  // Reset
  resetBooking: () => void;
  
  // Utility
  clearError: () => void;
}

const initialState: UseBookingState = {
  currentStep: 'location',
  isLoading: false,
  error: null,
  pickupLocation: '',
  pickupCoords: null,
  selectedItems: [],
  selectedDriver: null,
  paymentMethod: 'card',
  availableDrivers: [],
  isLoadingDrivers: false,
  bookingResult: null,
};

export const useBooking = (): UseBookingState & UseBookingActions => {
  const [state, setState] = useState<UseBookingState>(initialState);

  // Step navigation
  const goToStep = useCallback((step: UseBookingState['currentStep']) => {
    setState(prev => ({ ...prev, currentStep: step, error: null }));
  }, []);

  const nextStep = useCallback(() => {
    const steps: UseBookingState['currentStep'][] = ['location', 'items', 'driver', 'payment', 'confirmation'];
    const currentIndex = steps.indexOf(state.currentStep);
    if (currentIndex < steps.length - 1) {
      goToStep(steps[currentIndex + 1]);
    }
  }, [state.currentStep, goToStep]);

  const previousStep = useCallback(() => {
    const steps: UseBookingState['currentStep'][] = ['location', 'items', 'driver', 'payment', 'confirmation'];
    const currentIndex = steps.indexOf(state.currentStep);
    if (currentIndex > 0) {
      goToStep(steps[currentIndex - 1]);
    }
  }, [state.currentStep, goToStep]);

  // Location actions
  const setPickupLocation = useCallback((location: string, coords?: LocationCoordinates) => {
    setState(prev => ({
      ...prev,
      pickupLocation: location,
      pickupCoords: coords || null,
      error: null
    }));
  }, []);

  // Items actions
  const addItem = useCallback((item: string) => {
    setState(prev => ({
      ...prev,
      selectedItems: [...prev.selectedItems, item],
      error: null
    }));
  }, []);

  const removeItem = useCallback((item: string) => {
    setState(prev => ({
      ...prev,
      selectedItems: prev.selectedItems.filter(i => i !== item),
      error: null
    }));
  }, []);

  const setSelectedItems = useCallback((items: string[]) => {
    setState(prev => ({ ...prev, selectedItems: items, error: null }));
  }, []);

  // Driver actions
  const loadDrivers = useCallback(async (location: LocationCoordinates) => {
    setState(prev => ({ ...prev, isLoadingDrivers: true, error: null }));
    
    try {
      const drivers = await bookingService.getAvailableDrivers(location);
      setState(prev => ({
        ...prev,
        availableDrivers: drivers,
        isLoadingDrivers: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load drivers',
        isLoadingDrivers: false
      }));
    }
  }, []);

  const selectDriver = useCallback((driver: Driver) => {
    setState(prev => ({ ...prev, selectedDriver: driver, error: null }));
  }, []);

  // Payment actions
  const setPaymentMethod = useCallback((method: 'card' | 'cash' | 'mobile') => {
    setState(prev => ({ ...prev, paymentMethod: method, error: null }));
  }, []);

  // Booking actions
  const createBooking = useCallback(async (bookingData: Partial<BookingRequest>): Promise<BookingResponse | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const fullBookingData: BookingRequest = {
        pickupLocation: state.pickupLocation,
        items: state.selectedItems,
        driverId: state.selectedDriver?.id || '',
        contactPhone: '',
        specialInstructions: '',
        paymentMethod: state.paymentMethod,
        amount: 0,
        serviceType: 'standard',
        scheduledDate: null,
        scheduledTime: null,
        coordinates: state.pickupCoords,
        ...bookingData
      };

      const result = await bookingService.createBooking(fullBookingData);
      
      setState(prev => ({
        ...prev,
        bookingResult: result,
        isLoading: false,
        currentStep: 'confirmation'
      }));
      
      return result;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create booking',
        isLoading: false
      }));
      return null;
    }
  }, [state.pickupLocation, state.selectedItems, state.selectedDriver, state.paymentMethod]);

  // Reset
  const resetBooking = useCallback(() => {
    setState(initialState);
  }, []);

  // Utility
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    goToStep,
    nextStep,
    previousStep,
    setPickupLocation,
    addItem,
    removeItem,
    setSelectedItems,
    loadDrivers,
    selectDriver,
    setPaymentMethod,
    createBooking,
    resetBooking,
    clearError,
  };
};
