export interface City {
  id: string;
  name: string;
  country: string;
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  timezone: string;
  currency: string;
  isActive: boolean;
  launchDate: Date;
  serviceAreas: ServiceArea[];
  pricing: CityPricing;
  demographics: CityDemographics;
  competition: CompetitorData[];
}

export interface ServiceArea {
  id: string;
  name: string;
  suburbs: string[];
  coordinates: {
    lat: number;
    lng: number;
  }[];
  isActive: boolean;
  demandLevel: 'low' | 'medium' | 'high' | 'very_high';
  averageResponseTime: number; // minutes
  activeDrivers: number;
  surgeMultiplier: number;
}

export interface CityPricing {
  basePricing: {
    laundry: number;
    ironing: number;
    drycleaning: number;
    shoes: number;
  };
  deliveryFee: number;
  expressMultiplier: number;
  bulkDiscount: {
    threshold: number;
    percentage: number;
  };
  peakHours: {
    start: string;
    end: string;
    multiplier: number;
  }[];
}

export interface CityDemographics {
  population: number;
  averageIncome: number;
  targetMarketSize: number;
  penetrationRate: number;
  growthRate: number;
  seasonalPatterns: {
    month: number;
    demandMultiplier: number;
  }[];
}

export interface CompetitorData {
  name: string;
  marketShare: number;
  avgPrice: number;
  strengths: string[];
  weaknesses: string[];
  rating: number;
}

export interface CityMetrics {
  cityId: string;
  date: Date;
  totalBookings: number;
  revenue: number;
  activeUsers: number;
  newUsers: number;
  driverUtilization: number;
  averageRating: number;
  customerAcquisitionCost: number;
  lifetimeValue: number;
  marketShare: number;
}

export interface ExpansionPlan {
  id: string;
  targetCity: string;
  launchDate: Date;
  investmentRequired: number;
  expectedRevenue: number;
  marketingBudget: number;
  driverRecruitmentTarget: number;
  milestones: ExpansionMilestone[];
  risks: Risk[];
}

export interface ExpansionMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  dependencies: string[];
}

export interface Risk {
  id: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
}
