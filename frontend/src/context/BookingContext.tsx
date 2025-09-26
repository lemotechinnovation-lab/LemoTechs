import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BookingContextType {
  isBookingActive: boolean;
  setIsBookingActive: (active: boolean) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [isBookingActive, setIsBookingActive] = useState(false);

  return (
    <BookingContext.Provider value={{ isBookingActive, setIsBookingActive }}>
      {children}
    </BookingContext.Provider>
  );
};
