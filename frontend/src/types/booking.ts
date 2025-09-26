// Shared interfaces and types for booking components

export interface CarType {
  id: string;
  name: string;
  description: string;
  icon: string;
  capacity: number;
  priceMultiplier: number;
  estimatedTime: string;
  features: string[];
  popular?: boolean;
}

export interface Driver {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  location: string;
  estimatedTime: string;
  priceMultiplier: number;
  carModel: string;
  carType: string; // References CarType.id
  available: boolean;
  distance: string;
}

export interface Store {
  id: string;
  name: string;
  location: string;
  rating: number;
  services: string[];
  estimatedTime: string;
}

export interface BookingDetails {
  pickupTime: string;
  specialInstructions: string;
  contactPhone: string;
  estimatedPrice: number;
}

export interface ItemOption {
  name: string;
  price: number;
  icon: string;
}

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface BookingData {
  pickupLocation: string;
  dropoffLocation: string;
  items: string[];
  driver?: Driver;
  estimatedPrice: number;
  paymentMethod: 'card' | 'cash' | 'mobile';
  contactPhone: string;
  specialInstructions: string;
  pickupTime: string;
}

export type BookingStep = 'location' | 'items' | 'driver' | 'payment' | 'confirmation';
export type PaymentMethod = 'card' | 'cash' | 'mobile';

// Event handler types
export interface BookingEventHandlers {
  onLocationChange: (pickup: string, coords: LocationCoordinates | null) => void;
  onItemsChange: (items: string[]) => void;
  onDriverSelect: (driverId: string) => void;
  onShowMapView: (show: boolean) => void;
  onBackToHome: () => void;
}

// Component props interfaces
export interface BookingFormProps extends BookingEventHandlers {
  showMapView: boolean;
}

export interface MapViewProps {
  pickupLocation: string;
  pickupCoords: LocationCoordinates | null;
  drivers: Driver[];
  selectedDriver: string | null;
  onDriverSelect: (driverId: string) => void;
  showDriversList: boolean;
}

export interface RideBookingProps {
  onBackToHome: () => void;
}
