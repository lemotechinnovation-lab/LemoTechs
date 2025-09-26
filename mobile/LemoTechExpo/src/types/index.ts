// Common mobile types
export type BookingStep = 'location' | 'login' | 'items' | 'confirm';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface AddressSuggestion {
  id: string;
  label: string;
  description?: string;
  location?: Coordinates;
}


