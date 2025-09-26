import { CarType } from '../types/booking';

export const CAR_TYPES: CarType[] = [
  {
    id: 'standard',
    name: 'LemoClean Standard',
    description: 'Affordable cleaning service',
    icon: '🚗',
    capacity: 4,
    priceMultiplier: 1.0,
    estimatedTime: '5-8 min',
    features: ['Professional cleaning', 'Eco-friendly products', 'Insured service'],
    popular: true
  },
  {
    id: 'premium',
    name: 'LemoClean Premium',
    description: 'Enhanced cleaning with premium service',
    icon: '🚙',
    capacity: 6,
    priceMultiplier: 1.3,
    estimatedTime: '3-5 min',
    features: ['Premium cleaning products', 'Express service', 'Priority support', 'Quality guarantee']
  },
  {
    id: 'luxury',
    name: 'LemoClean Luxury',
    description: 'Luxury cleaning experience',
    icon: '🚘',
    capacity: 8,
    priceMultiplier: 1.8,
    estimatedTime: '2-4 min',
    features: ['Luxury vehicles', 'White-glove service', 'Concierge support', 'Same-day delivery']
  },
  {
    id: 'express',
    name: 'LemoClean Express',
    description: 'Fastest cleaning service',
    icon: '🏎️',
    capacity: 2,
    priceMultiplier: 1.5,
    estimatedTime: '1-3 min',
    features: ['Ultra-fast service', 'Express lane', 'Priority pickup']
  },
  {
    id: 'family',
    name: 'LemoClean Family',
    description: 'Large capacity for families',
    icon: '🚐',
    capacity: 10,
    priceMultiplier: 1.2,
    estimatedTime: '4-6 min',
    features: ['Large capacity', 'Family-friendly', 'Bulk discounts']
  }
];

export const getCarTypeById = (id: string): CarType | undefined => {
  return CAR_TYPES.find(carType => carType.id === id);
};

export const getPopularCarTypes = (): CarType[] => {
  return CAR_TYPES.filter(carType => carType.popular);
};
