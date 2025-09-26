import { City, ServiceArea, CityMetrics, ExpansionPlan, CityPricing } from '../types/cities';

// Mock data for South African cities
export const SOUTH_AFRICAN_CITIES: City[] = [
  {
    id: 'jhb',
    name: 'Johannesburg',
    country: 'South Africa',
    region: 'Gauteng',
    coordinates: { lat: -26.2041, lng: 28.0473 },
    timezone: 'Africa/Johannesburg',
    currency: 'ZAR',
    isActive: true,
    launchDate: new Date('2024-01-15'),
    serviceAreas: [
      {
        id: 'sandton',
        name: 'Sandton',
        suburbs: ['Sandhurst', 'Hyde Park', 'Illovo', 'Melrose'],
        coordinates: [
          { lat: -26.1076, lng: 28.0567 },
          { lat: -26.1276, lng: 28.0767 }
        ],
        isActive: true,
        demandLevel: 'very_high',
        averageResponseTime: 25,
        activeDrivers: 45,
        surgeMultiplier: 1.2
      },
      {
        id: 'rosebank',
        name: 'Rosebank',
        suburbs: ['Rosebank', 'Parktown', 'Parkview', 'Greenside'],
        coordinates: [
          { lat: -26.1446, lng: 28.0436 },
          { lat: -26.1646, lng: 28.0636 }
        ],
        isActive: true,
        demandLevel: 'high',
        averageResponseTime: 30,
        activeDrivers: 32,
        surgeMultiplier: 1.1
      }
    ],
    pricing: {
      basePricing: {
        laundry: 25,
        ironing: 15,
        drycleaning: 45,
        shoes: 35
      },
      deliveryFee: 15,
      expressMultiplier: 1.5,
      bulkDiscount: {
        threshold: 10,
        percentage: 15
      },
      peakHours: [
        { start: '07:00', end: '09:00', multiplier: 1.3 },
        { start: '17:00', end: '19:00', multiplier: 1.2 }
      ]
    },
    demographics: {
      population: 5635127,
      averageIncome: 450000,
      targetMarketSize: 850000,
      penetrationRate: 0.12,
      growthRate: 0.08,
      seasonalPatterns: [
        { month: 1, demandMultiplier: 1.1 },
        { month: 12, demandMultiplier: 1.3 }
      ]
    },
    competition: [
      {
        name: 'WashMaster',
        marketShare: 0.35,
        avgPrice: 28,
        strengths: ['Brand recognition', 'Wide coverage'],
        weaknesses: ['Poor app', 'Slow service'],
        rating: 3.2
      }
    ]
  },
  {
    id: 'cpt',
    name: 'Cape Town',
    country: 'South Africa',
    region: 'Western Cape',
    coordinates: { lat: -33.9249, lng: 18.4241 },
    timezone: 'Africa/Johannesburg',
    currency: 'ZAR',
    isActive: true,
    launchDate: new Date('2024-03-01'),
    serviceAreas: [
      {
        id: 'city_bowl',
        name: 'City Bowl',
        suburbs: ['Gardens', 'Tamboerskloof', 'Oranjezicht', 'Vredehoek'],
        coordinates: [
          { lat: -33.9249, lng: 18.4041 },
          { lat: -33.9449, lng: 18.4441 }
        ],
        isActive: true,
        demandLevel: 'high',
        averageResponseTime: 28,
        activeDrivers: 38,
        surgeMultiplier: 1.15
      }
    ],
    pricing: {
      basePricing: {
        laundry: 22,
        ironing: 13,
        drycleaning: 42,
        shoes: 32
      },
      deliveryFee: 12,
      expressMultiplier: 1.4,
      bulkDiscount: {
        threshold: 8,
        percentage: 12
      },
      peakHours: [
        { start: '08:00', end: '10:00', multiplier: 1.2 },
        { start: '16:00', end: '18:00', multiplier: 1.15 }
      ]
    },
    demographics: {
      population: 4618263,
      averageIncome: 380000,
      targetMarketSize: 650000,
      penetrationRate: 0.08,
      growthRate: 0.12,
      seasonalPatterns: [
        { month: 12, demandMultiplier: 1.4 }, // Summer peak
        { month: 1, demandMultiplier: 1.3 }
      ]
    },
    competition: [
      {
        name: 'CleanCape',
        marketShare: 0.28,
        avgPrice: 25,
        strengths: ['Local knowledge', 'Good pricing'],
        weaknesses: ['Limited tech', 'Small fleet'],
        rating: 3.8
      }
    ]
  }
];

export const EXPANSION_TARGETS: ExpansionPlan[] = [
  {
    id: 'durban_expansion',
    targetCity: 'Durban',
    launchDate: new Date('2024-06-15'),
    investmentRequired: 2500000,
    expectedRevenue: 8500000,
    marketingBudget: 450000,
    driverRecruitmentTarget: 60,
    milestones: [
      {
        id: 'market_research',
        title: 'Complete Market Research',
        description: 'Analyze Durban market, competition, and pricing',
        targetDate: new Date('2024-04-01'),
        status: 'completed',
        dependencies: []
      },
      {
        id: 'driver_recruitment',
        title: 'Recruit Initial Driver Fleet',
        description: 'Hire and train 30 drivers for launch',
        targetDate: new Date('2024-05-15'),
        status: 'in_progress',
        dependencies: ['market_research']
      }
    ],
    risks: [
      {
        id: 'competition_risk',
        description: 'Strong local competitor may respond aggressively',
        probability: 'medium',
        impact: 'medium',
        mitigation: 'Competitive pricing and superior service quality'
      }
    ]
  }
];

class CityService {
  private cities: City[] = SOUTH_AFRICAN_CITIES;
  private expansionPlans: ExpansionPlan[] = EXPANSION_TARGETS;

  async getCities(): Promise<City[]> {
    return this.cities.filter(city => city.isActive);
  }

  async getCityById(cityId: string): Promise<City | null> {
    return this.cities.find(city => city.id === cityId) || null;
  }

  async getCityByLocation(lat: number, lng: number): Promise<City | null> {
    // Find city based on coordinates (simplified logic)
    const DISTANCE_THRESHOLD = 0.5; // degrees
    
    return this.cities.find(city => {
      const distance = Math.sqrt(
        Math.pow(city.coordinates.lat - lat, 2) + 
        Math.pow(city.coordinates.lng - lng, 2)
      );
      return distance < DISTANCE_THRESHOLD && city.isActive;
    }) || null;
  }

  async getServiceAreasForCity(cityId: string): Promise<ServiceArea[]> {
    const city = await this.getCityById(cityId);
    return city?.serviceAreas.filter(area => area.isActive) || [];
  }

  async getPricingForCity(cityId: string): Promise<CityPricing | null> {
    const city = await this.getCityById(cityId);
    return city?.pricing || null;
  }

  async calculateDynamicPricing(
    cityId: string, 
    serviceAreaId: string, 
    serviceType: string, 
    requestTime: Date
  ): Promise<number> {
    const city = await this.getCityById(cityId);
    if (!city) return 0;

    const basePrice = city.pricing.basePricing[serviceType as keyof typeof city.pricing.basePricing] || 0;
    const serviceArea = city.serviceAreas.find(area => area.id === serviceAreaId);
    
    let finalPrice = basePrice;

    // Apply surge pricing
    if (serviceArea) {
      finalPrice *= serviceArea.surgeMultiplier;
    }

    // Apply peak hour pricing
    const hour = requestTime.getHours();
    const minute = requestTime.getMinutes();
    const currentTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    for (const peakHour of city.pricing.peakHours) {
      if (currentTime >= peakHour.start && currentTime <= peakHour.end) {
        finalPrice *= peakHour.multiplier;
        break;
      }
    }

    return Math.round(finalPrice);
  }

  async getCityMetrics(cityId: string, startDate: Date, endDate: Date): Promise<CityMetrics[]> {
    // Mock metrics data
    const metrics: CityMetrics[] = [];
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      metrics.push({
        cityId,
        date,
        totalBookings: Math.floor(Math.random() * 100) + 50,
        revenue: Math.floor(Math.random() * 50000) + 25000,
        activeUsers: Math.floor(Math.random() * 500) + 200,
        newUsers: Math.floor(Math.random() * 50) + 10,
        driverUtilization: Math.random() * 0.3 + 0.7,
        averageRating: Math.random() * 0.5 + 4.5,
        customerAcquisitionCost: Math.floor(Math.random() * 100) + 50,
        lifetimeValue: Math.floor(Math.random() * 2000) + 1000,
        marketShare: Math.random() * 0.1 + 0.15
      });
    }

    return metrics;
  }

  async getExpansionPlans(): Promise<ExpansionPlan[]> {
    return this.expansionPlans;
  }

  async createExpansionPlan(plan: Omit<ExpansionPlan, 'id'>): Promise<ExpansionPlan> {
    const newPlan: ExpansionPlan = {
      ...plan,
      id: `expansion_${Date.now()}`
    };
    
    this.expansionPlans.push(newPlan);
    return newPlan;
  }

  async updateExpansionMilestone(planId: string, milestoneId: string, status: string): Promise<boolean> {
    const plan = this.expansionPlans.find(p => p.id === planId);
    if (!plan) return false;

    const milestone = plan.milestones.find(m => m.id === milestoneId);
    if (!milestone) return false;

    milestone.status = status as any;
    return true;
  }
}

export const cityService = new CityService();
