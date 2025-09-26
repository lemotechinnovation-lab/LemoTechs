import { 
  RevenueStream, 
  SubscriptionTier, 
  MarketplaceProduct, 
  FranchisePackage, 
  DataProduct,
  RevenueAnalytics 
} from '../types/revenue';

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'basic',
    name: 'LemoBasic',
    price: 99,
    interval: 'monthly',
    features: [
      '5 bookings per month',
      'Standard pickup & delivery',
      'Basic customer support',
      'Mobile app access',
      'Email notifications'
    ],
    limits: {
      bookings: 5,
      priority: 'standard',
      discounts: 5,
      support: 'basic'
    },
    isPopular: false
  },
  {
    id: 'premium',
    name: 'LemoPremium',
    price: 199,
    interval: 'monthly',
    features: [
      'Unlimited bookings',
      'Priority pickup & delivery',
      'Premium customer support',
      'Real-time tracking',
      'Express service included',
      '15% discount on all services',
      'Free monthly stain treatment'
    ],
    limits: {
      bookings: -1, // unlimited
      priority: 'high',
      discounts: 15,
      support: 'priority'
    },
    isPopular: true
  },
  {
    id: 'enterprise',
    name: 'LemoEnterprise',
    price: 499,
    interval: 'monthly',
    features: [
      'Unlimited bookings for team',
      'Dedicated account manager',
      '24/7 premium support',
      'Custom pickup schedules',
      'Bulk pricing discounts',
      'Advanced analytics dashboard',
      'API access',
      'White-label options'
    ],
    limits: {
      bookings: -1,
      priority: 'premium',
      discounts: 25,
      support: '24/7'
    },
    isPopular: false
  }
];

export const MARKETPLACE_PRODUCTS: MarketplaceProduct[] = [
  {
    id: 'detergent_premium',
    name: 'LemoClean Premium Detergent',
    category: 'detergent',
    brand: 'LemoTech',
    price: 89.99,
    cost: 35.00,
    margin: 61.1,
    rating: 4.8,
    reviews: 2847,
    inStock: true,
    description: 'Professional-grade detergent used by our cleaning experts',
    images: ['/api/placeholder/400/400'],
    specifications: {
      'Volume': '2L',
      'Scent': 'Fresh Lemon',
      'Suitable for': 'All fabric types',
      'Biodegradable': 'Yes'
    },
    isRecommended: true
  },
  {
    id: 'stain_remover_pro',
    name: 'StainAway Pro Treatment',
    category: 'stain_removal',
    brand: 'CleanMaster',
    price: 45.99,
    cost: 18.00,
    margin: 60.9,
    rating: 4.6,
    reviews: 1523,
    inStock: true,
    description: 'Industrial strength stain remover for tough stains',
    images: ['/api/placeholder/400/400'],
    specifications: {
      'Volume': '500ml',
      'Type': 'Spray',
      'Safe for': 'Colors & whites',
      'Effectiveness': '99.9%'
    },
    isRecommended: true
  },
  {
    id: 'garment_bags',
    name: 'Premium Garment Storage Bags',
    category: 'accessories',
    brand: 'StoreSafe',
    price: 129.99,
    cost: 45.00,
    margin: 65.4,
    rating: 4.7,
    reviews: 892,
    inStock: true,
    description: 'Breathable garment bags for long-term clothing storage',
    images: ['/api/placeholder/400/400'],
    specifications: {
      'Material': 'Non-woven fabric',
      'Size': 'Large (60x100cm)',
      'Quantity': 'Pack of 5',
      'Features': 'Dust-proof, breathable'
    },
    isRecommended: false
  }
];

export const FRANCHISE_PACKAGES: FranchisePackage[] = [
  {
    id: 'city_franchise',
    name: 'LemoTech City Franchise',
    investmentRequired: 750000,
    franchiseFee: 150000,
    royaltyPercentage: 6,
    marketingFeePercentage: 2,
    territory: {
      type: 'city',
      population: 500000,
      exclusivityRadius: 25
    },
    support: {
      training: ['2-week intensive training', 'Operations manual', 'Staff training materials'],
      marketing: ['Launch campaign', 'Digital marketing templates', 'Brand materials'],
      operations: ['Software license', 'Quality standards', 'Supply chain access'],
      technology: ['Mobile app license', 'Backend systems', 'Analytics dashboard']
    },
    requirements: {
      minNetWorth: 1500000,
      liquidCapital: 500000,
      experience: ['Business management', 'Customer service', 'Team leadership']
    },
    projectedRevenue: {
      year1: 2500000,
      year2: 4200000,
      year3: 6800000
    }
  },
  {
    id: 'regional_franchise',
    name: 'LemoTech Regional Franchise',
    investmentRequired: 2000000,
    franchiseFee: 400000,
    royaltyPercentage: 5,
    marketingFeePercentage: 2,
    territory: {
      type: 'region',
      population: 2000000,
      exclusivityRadius: 100
    },
    support: {
      training: ['4-week comprehensive training', 'Regional management course', 'Multi-location operations'],
      marketing: ['Regional marketing strategy', 'Media buying support', 'PR assistance'],
      operations: ['Multi-location software', 'Regional supply chain', 'Quality assurance program'],
      technology: ['Enterprise software suite', 'Advanced analytics', 'Custom integrations']
    },
    requirements: {
      minNetWorth: 5000000,
      liquidCapital: 1500000,
      experience: ['Multi-unit operations', 'Regional business management', 'Franchise experience preferred']
    },
    projectedRevenue: {
      year1: 8500000,
      year2: 15200000,
      year3: 24500000
    }
  }
];

export const DATA_PRODUCTS: DataProduct[] = [
  {
    id: 'market_insights',
    name: 'Cleaning Industry Market Insights',
    description: 'Comprehensive market trends, consumer behavior, and competitive analysis',
    dataType: 'market_trends',
    price: 2499,
    interval: 'monthly',
    targetCustomers: ['Cleaning companies', 'Investors', 'Market researchers', 'Consultants'],
    sampleData: {
      marketSize: 'R12.5B',
      growthRate: '8.2%',
      topTrends: ['Eco-friendly products', 'On-demand services', 'Subscription models']
    },
    privacyCompliant: true
  },
  {
    id: 'operational_benchmarks',
    name: 'Operational Benchmarks Report',
    description: 'Industry benchmarks for operational efficiency, pricing, and performance metrics',
    dataType: 'operational_metrics',
    price: 1899,
    interval: 'quarterly',
    targetCustomers: ['Cleaning businesses', 'Operations managers', 'Business consultants'],
    sampleData: {
      avgResponseTime: '28 minutes',
      customerSatisfaction: '4.6/5',
      driverUtilization: '78%'
    },
    privacyCompliant: true
  }
];

export const REVENUE_STREAMS: RevenueStream[] = [
  {
    id: 'core_services',
    name: 'Core Cleaning Services',
    category: 'core',
    description: 'Primary laundry, dry cleaning, and specialty services',
    isActive: true,
    monthlyRevenue: 2850000,
    growthRate: 0.12,
    marginPercentage: 35
  },
  {
    id: 'subscription_fees',
    name: 'Premium Subscriptions',
    category: 'premium',
    description: 'Monthly and yearly subscription plans',
    isActive: true,
    monthlyRevenue: 485000,
    growthRate: 0.25,
    marginPercentage: 85
  },
  {
    id: 'marketplace_sales',
    name: 'Product Marketplace',
    category: 'marketplace',
    description: 'Cleaning products and accessories sales',
    isActive: true,
    monthlyRevenue: 320000,
    growthRate: 0.18,
    marginPercentage: 62
  },
  {
    id: 'franchise_fees',
    name: 'Franchise Revenue',
    category: 'franchise',
    description: 'Franchise fees and ongoing royalties',
    isActive: true,
    monthlyRevenue: 180000,
    growthRate: 0.08,
    marginPercentage: 75
  },
  {
    id: 'data_licensing',
    name: 'Data & Analytics',
    category: 'data',
    description: 'Market insights and operational data licensing',
    isActive: true,
    monthlyRevenue: 95000,
    growthRate: 0.30,
    marginPercentage: 90
  },
  {
    id: 'advertising',
    name: 'Advertising Revenue',
    category: 'advertising',
    description: 'In-app and partner advertising placements',
    isActive: true,
    monthlyRevenue: 65000,
    growthRate: 0.22,
    marginPercentage: 95
  }
];

class RevenueService {
  private revenueStreams: RevenueStream[] = REVENUE_STREAMS;
  private subscriptionTiers: SubscriptionTier[] = SUBSCRIPTION_TIERS;
  private marketplaceProducts: MarketplaceProduct[] = MARKETPLACE_PRODUCTS;
  private franchisePackages: FranchisePackage[] = FRANCHISE_PACKAGES;
  private dataProducts: DataProduct[] = DATA_PRODUCTS;

  async getRevenueStreams(): Promise<RevenueStream[]> {
    return this.revenueStreams.filter(stream => stream.isActive);
  }

  async getSubscriptionTiers(): Promise<SubscriptionTier[]> {
    return this.subscriptionTiers;
  }

  async getMarketplaceProducts(category?: string): Promise<MarketplaceProduct[]> {
    let products = this.marketplaceProducts.filter(p => p.inStock);
    
    if (category) {
      products = products.filter(p => p.category === category);
    }

    return products.sort((a, b) => b.rating - a.rating);
  }

  async getFranchisePackages(): Promise<FranchisePackage[]> {
    return this.franchisePackages;
  }

  async getDataProducts(): Promise<DataProduct[]> {
    return this.dataProducts;
  }

  async getRevenueAnalytics(): Promise<RevenueAnalytics> {
    const totalRevenue = this.revenueStreams.reduce((sum, stream) => sum + stream.monthlyRevenue, 0);
    
    const revenueByStream = this.revenueStreams.reduce((acc, stream) => {
      acc[stream.name] = stream.monthlyRevenue;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRevenue,
      revenueByStream,
      monthOverMonthGrowth: 0.15,
      yearOverYearGrowth: 1.85,
      averageRevenuePerUser: 285,
      customerLifetimeValue: 2850,
      churnRate: 0.08,
      conversionRates: {
        freeToBasic: 0.12,
        basicToPremium: 0.28,
        premiumToEnterprise: 0.15
      },
      topPerformingProducts: this.marketplaceProducts
        .sort((a, b) => (b.price * b.reviews) - (a.price * a.reviews))
        .slice(0, 5),
      franchiseMetrics: {
        totalFranchises: 12,
        averageRevenue: 3200000,
        satisfactionScore: 4.7
      }
    };
  }

  async calculateSubscriptionRevenue(userId: string, tierId: string): Promise<number> {
    const tier = this.subscriptionTiers.find(t => t.id === tierId);
    if (!tier) return 0;

    // Apply any user-specific discounts or promotions
    let price = tier.price;
    
    // Example: Long-term customer discount
    if (this.isLongTermCustomer(userId)) {
      price *= 0.9; // 10% discount
    }

    return price;
  }

  async recommendProducts(_userId: string, _orderHistory: any[]): Promise<MarketplaceProduct[]> {
    // AI-powered product recommendations based on order history
    const recommendedProducts = this.marketplaceProducts
      .filter(p => p.isRecommended && p.inStock)
      .slice(0, 4);

    return recommendedProducts;
  }

  async calculateFranchiseROI(packageId: string): Promise<{
    initialInvestment: number;
    projectedROI: number;
    breakEvenMonths: number;
    netPresentValue: number;
  }> {
    const franchisePackage = this.franchisePackages.find(p => p.id === packageId);
    if (!franchisePackage) {
      throw new Error('Franchise package not found');
    }

    const initialInvestment = franchisePackage.investmentRequired;
    const year1Revenue = franchisePackage.projectedRevenue.year1;
    const year3Revenue = franchisePackage.projectedRevenue.year3;
    
    const projectedROI = ((year3Revenue - initialInvestment) / initialInvestment) * 100;
    const breakEvenMonths = Math.ceil((initialInvestment / year1Revenue) * 12);
    
    // Simplified NPV calculation
    const discountRate = 0.1;
    const npv = -initialInvestment + 
      (franchisePackage.projectedRevenue.year1 / Math.pow(1 + discountRate, 1)) +
      (franchisePackage.projectedRevenue.year2 / Math.pow(1 + discountRate, 2)) +
      (franchisePackage.projectedRevenue.year3 / Math.pow(1 + discountRate, 3));

    return {
      initialInvestment,
      projectedROI,
      breakEvenMonths,
      netPresentValue: npv
    };
  }

  private isLongTermCustomer(_userId: string): boolean {
    // Mock logic - in reality, check user registration date
    return Math.random() > 0.7;
  }
}

export const revenueService = new RevenueService();
