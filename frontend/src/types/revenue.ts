export interface RevenueStream {
  id: string;
  name: string;
  category: 'core' | 'premium' | 'marketplace' | 'franchise' | 'data' | 'advertising';
  description: string;
  isActive: boolean;
  monthlyRevenue: number;
  growthRate: number;
  marginPercentage: number;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: {
    bookings: number;
    priority: 'standard' | 'high' | 'premium';
    discounts: number;
    support: 'basic' | 'priority' | '24/7';
  };
  isPopular: boolean;
  savings?: number;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  category: 'detergent' | 'fabric_care' | 'stain_removal' | 'accessories' | 'equipment';
  brand: string;
  price: number;
  cost: number;
  margin: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  description: string;
  images: string[];
  specifications: Record<string, string>;
  isRecommended: boolean;
}

export interface FranchisePackage {
  id: string;
  name: string;
  investmentRequired: number;
  franchiseFee: number;
  royaltyPercentage: number;
  marketingFeePercentage: number;
  territory: {
    type: 'city' | 'region' | 'exclusive';
    population: number;
    exclusivityRadius: number;
  };
  support: {
    training: string[];
    marketing: string[];
    operations: string[];
    technology: string[];
  };
  requirements: {
    minNetWorth: number;
    liquidCapital: number;
    experience: string[];
  };
  projectedRevenue: {
    year1: number;
    year2: number;
    year3: number;
  };
}

export interface DataProduct {
  id: string;
  name: string;
  description: string;
  dataType: 'market_trends' | 'consumer_behavior' | 'operational_metrics' | 'benchmarks';
  price: number;
  interval: 'monthly' | 'quarterly' | 'yearly';
  targetCustomers: string[];
  sampleData: any;
  privacyCompliant: boolean;
}

export interface AdvertisingSlot {
  id: string;
  name: string;
  location: 'app_banner' | 'email_footer' | 'sms_footer' | 'receipt' | 'driver_vehicle';
  dimensions: string;
  impressions: number;
  clickThroughRate: number;
  pricePerImpression: number;
  isAvailable: boolean;
  targetAudience: {
    demographics: string[];
    interests: string[];
    location: string[];
  };
}

export interface RevenueAnalytics {
  totalRevenue: number;
  revenueByStream: Record<string, number>;
  monthOverMonthGrowth: number;
  yearOverYearGrowth: number;
  averageRevenuePerUser: number;
  customerLifetimeValue: number;
  churnRate: number;
  conversionRates: {
    freeToBasic: number;
    basicToPremium: number;
    premiumToEnterprise: number;
  };
  topPerformingProducts: MarketplaceProduct[];
  franchiseMetrics: {
    totalFranchises: number;
    averageRevenue: number;
    satisfactionScore: number;
  };
}
