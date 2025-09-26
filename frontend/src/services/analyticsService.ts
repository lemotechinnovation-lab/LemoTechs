
// Analytics Event Types
export interface AnalyticsEvent {
  id: string;
  userId?: string;
  sessionId: string;
  timestamp: Date;
  event: string;
  category: 'navigation' | 'user_action' | 'business' | 'performance' | 'conversion';
  properties: Record<string, any>;
  metadata?: {
    userAgent: string;
    viewport: { width: number; height: number };
    referrer: string;
    path: string;
    loadTime?: number;
    device: 'mobile' | 'tablet' | 'desktop';
  };
}

export interface UserSession {
  id: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  pageViews: number;
  events: AnalyticsEvent[];
  conversionGoals: string[];
  revenue?: number;
  source: string;
  medium: string;
  campaign?: string;
}

export interface ConversionFunnel {
  step: number;
  name: string;
  path: string;
  users: number;
  conversionRate: number;
  dropOffRate: number;
  averageTime: number;
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
  bundleSize: number;
  memoryUsage: number;
}

export interface UserBehaviorMetrics {
  scrollDepth: number;
  timeOnPage: number;
  clickHeatmap: { x: number; y: number; count: number }[];
  formInteractions: { field: string; focusTime: number; completed: boolean }[];
  navigationPattern: string[];
  exitIntent: boolean;
  engagementScore: number;
}

class AnalyticsService {
  private sessionId: string;
  private userId?: string;
  private events: AnalyticsEvent[] = [];
  private session!: UserSession;
  private heatmapData: { x: number; y: number; count: number }[] = [];
  private scrollDepth = 0;
  private startTime = Date.now();

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeSession();
    this.setupPerformanceTracking();
    this.setupUserBehaviorTracking();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSession(): void {
    this.session = {
      id: this.sessionId,
      startTime: new Date(),
      pageViews: 0,
      events: [],
      conversionGoals: [],
      source: this.getTrafficSource(),
      medium: this.getTrafficMedium(),
      campaign: this.getCampaign()
    };
  }

  private getTrafficSource(): string {
    const referrer = document.referrer;
    if (!referrer) return 'direct';
    if (referrer.includes('google')) return 'google';
    if (referrer.includes('facebook')) return 'facebook';
    if (referrer.includes('twitter')) return 'twitter';
    if (referrer.includes('linkedin')) return 'linkedin';
    return new URL(referrer).hostname;
  }

  private getTrafficMedium(): string {
    const url = new URL(window.location.href);
    const utm_medium = url.searchParams.get('utm_medium');
    if (utm_medium) return utm_medium;
    
    const referrer = document.referrer;
    if (!referrer) return 'direct';
    if (referrer.includes('google') || referrer.includes('bing')) return 'organic';
    return 'referral';
  }

  private getCampaign(): string | undefined {
    const url = new URL(window.location.href);
    return url.searchParams.get('utm_campaign') || undefined;
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private setupPerformanceTracking(): void {
    // Web Vitals tracking
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.trackEvent('performance_metric', 'performance', {
          metric: 'largest_contentful_paint',
          value: lastEntry.startTime,
          rating: lastEntry.startTime < 2500 ? 'good' : lastEntry.startTime < 4000 ? 'needs_improvement' : 'poor'
        });
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.trackEvent('performance_metric', 'performance', {
            metric: 'first_input_delay',
            value: entry.processingStart - entry.startTime,
            rating: entry.processingStart - entry.startTime < 100 ? 'good' : 
                   entry.processingStart - entry.startTime < 300 ? 'needs_improvement' : 'poor'
          });
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.trackEvent('performance_metric', 'performance', {
          metric: 'cumulative_layout_shift',
          value: clsValue,
          rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs_improvement' : 'poor'
        });
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    }

    // Page load metrics
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      this.trackEvent('page_load_complete', 'performance', {
        loadTime: navigation.loadEventEnd - navigation.fetchStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        firstByte: navigation.responseStart - navigation.fetchStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart
      });
    });
  }

  private setupUserBehaviorTracking(): void {
    // Scroll depth tracking
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        this.scrollDepth = scrollPercent;
        
        // Track milestone scroll depths
        if ([25, 50, 75, 90, 100].includes(scrollPercent)) {
          this.trackEvent('scroll_depth', 'user_action', {
            depth: scrollPercent,
            timeToDepth: Date.now() - this.startTime
          });
        }
      }
    });

    // Click heatmap tracking
    document.addEventListener('click', (event) => {
      const x = Math.round((event.clientX / window.innerWidth) * 100);
      const y = Math.round((event.clientY / window.innerHeight) * 100);
      
      const existingPoint = this.heatmapData.find(point => 
        Math.abs(point.x - x) < 5 && Math.abs(point.y - y) < 5
      );
      
      if (existingPoint) {
        existingPoint.count++;
      } else {
        this.heatmapData.push({ x, y, count: 1 });
      }
      
      this.trackEvent('click_heatmap', 'user_action', {
        x, y,
        element: (event.target as Element).tagName,
        className: (event.target as Element).className,
        id: (event.target as Element).id
      });
    });

    // Form interaction tracking
    document.addEventListener('focusin', (event) => {
      if ((event.target as Element).tagName === 'INPUT' || (event.target as Element).tagName === 'TEXTAREA') {
        const startTime = Date.now();
        const element = event.target as HTMLInputElement;
        
        element.addEventListener('focusout', () => {
          this.trackEvent('form_interaction', 'user_action', {
            field: element.name || element.id || element.placeholder,
            focusTime: Date.now() - startTime,
            completed: element.value.length > 0,
            fieldType: element.type
          });
        }, { once: true });
      }
    });

    // Exit intent detection
    document.addEventListener('mouseleave', (event) => {
      if (event.clientY <= 0) {
        this.trackEvent('exit_intent', 'user_action', {
          timeOnPage: Date.now() - this.startTime,
          scrollDepth: this.scrollDepth,
          pageViews: this.session.pageViews
        });
      }
    });

    // Visibility change tracking
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent('page_hidden', 'user_action', {
          timeVisible: Date.now() - this.startTime,
          scrollDepth: this.scrollDepth
        });
      } else {
        this.startTime = Date.now();
        this.trackEvent('page_visible', 'user_action', {});
      }
    });
  }

  // Public Methods
  setUserId(userId: string): void {
    this.userId = userId;
    this.session.userId = userId;
    this.trackEvent('user_identified', 'user_action', { userId });
  }

  trackEvent(
    event: string, 
    category: AnalyticsEvent['category'], 
    properties: Record<string, any> = {}
  ): void {
    const analyticsEvent: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date(),
      event,
      category,
      properties,
      metadata: {
        userAgent: navigator.userAgent,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        referrer: document.referrer,
        path: window.location.pathname,
        device: this.getDeviceType()
      }
    };

    this.events.push(analyticsEvent);
    this.session.events.push(analyticsEvent);

    // Send to analytics providers (Google Analytics, Mixpanel, etc.)
    this.sendToProviders(analyticsEvent);
  }

  trackPageView(path: string, title?: string): void {
    this.session.pageViews++;
    this.trackEvent('page_view', 'navigation', {
      path,
      title: title || document.title,
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    });
  }

  trackNavigation(from: string, to: string, method: 'click' | 'programmatic' = 'click'): void {
    this.trackEvent('navigation', 'navigation', {
      from,
      to,
      method,
      navigationTime: Date.now() - this.startTime
    });
  }

  trackConversion(goal: string, value?: number, properties?: Record<string, any>): void {
    this.session.conversionGoals.push(goal);
    if (value) {
      this.session.revenue = (this.session.revenue || 0) + value;
    }
    
    this.trackEvent('conversion', 'conversion', {
      goal,
      value,
      ...properties,
      sessionDuration: Date.now() - this.session.startTime.getTime(),
      pageViews: this.session.pageViews
    });
  }

  trackError(error: Error, context?: Record<string, any>): void {
    // Skip Firebase configuration errors - these are expected in demo mode
    if (error.message.includes('auth/invalid-api-key') || 
        error.message.includes('Firebase: Error (auth/invalid-api-key)') ||
        error.message.includes('Firebase not configured')) {
      return;
    }

    this.trackEvent('error', 'performance', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      context,
      url: window.location.href,
      userAgent: navigator.userAgent
    });
  }

  trackFeatureUsage(feature: string, action: string, properties?: Record<string, any>): void {
    this.trackEvent('feature_usage', 'user_action', {
      feature,
      action,
      ...properties
    });
  }

  trackBusinessMetric(metric: string, value: number, properties?: Record<string, any>): void {
    this.trackEvent('business_metric', 'business', {
      metric,
      value,
      ...properties
    });
  }

  private sendToProviders(event: AnalyticsEvent): void {
    // Google Analytics 4
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', event.event, {
        event_category: event.category,
        event_label: JSON.stringify(event.properties),
        custom_parameter_1: event.sessionId,
        custom_parameter_2: event.userId
      });
    }

    // Mixpanel
    if (typeof (window as any).mixpanel !== 'undefined') {
      (window as any).mixpanel.track(event.event, {
        ...event.properties,
        category: event.category,
        sessionId: event.sessionId,
        userId: event.userId,
        timestamp: event.timestamp
      });
    }

    // Custom analytics endpoint
    if (import.meta.env.PROD) {
      fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      }).catch(console.error);
    }
  }

  getSession(): UserSession {
    return {
      ...this.session,
      endTime: new Date(),
      duration: Date.now() - this.session.startTime.getTime()
    };
  }

  getEvents(): AnalyticsEvent[] {
    return this.events;
  }

  getHeatmapData(): { x: number; y: number; count: number }[] {
    return this.heatmapData;
  }

  getUserBehaviorMetrics(): UserBehaviorMetrics {
    return {
      scrollDepth: this.scrollDepth,
      timeOnPage: Date.now() - this.startTime,
      clickHeatmap: this.heatmapData,
      formInteractions: [], // Would be populated from actual form tracking
      navigationPattern: this.events
        .filter(e => e.category === 'navigation')
        .map(e => e.properties.to || e.properties.path),
      exitIntent: this.events.some(e => e.event === 'exit_intent'),
      engagementScore: this.calculateEngagementScore()
    };
  }

  private calculateEngagementScore(): number {
    const timeScore = Math.min((Date.now() - this.startTime) / 60000, 10) * 10; // 10 points per minute, max 100
    const scrollScore = this.scrollDepth;
    const interactionScore = Math.min(this.events.filter(e => e.category === 'user_action').length * 5, 50);
    const pageViewScore = Math.min(this.session.pageViews * 20, 100);
    
    return Math.round((timeScore + scrollScore + interactionScore + pageViewScore) / 4);
  }

  // Conversion funnel analysis
  trackFunnelStep(step: string, properties?: Record<string, any>): void {
    this.trackEvent('funnel_step', 'conversion', {
      step,
      ...properties,
      timestamp: Date.now()
    });
  }

  // A/B testing support
  trackExperiment(experimentId: string, variant: string, properties?: Record<string, any>): void {
    this.trackEvent('experiment_exposure', 'business', {
      experimentId,
      variant,
      ...properties
    });
  }

  // Revenue tracking
  trackRevenue(amount: number, currency: string = 'ZAR', properties?: Record<string, any>): void {
    this.session.revenue = (this.session.revenue || 0) + amount;
    this.trackEvent('revenue', 'business', {
      amount,
      currency,
      ...properties,
      totalSessionRevenue: this.session.revenue
    });
  }
}

// Create singleton instance
export const analyticsService = new AnalyticsService();

// Global error tracking
window.addEventListener('error', (event) => {
  analyticsService.trackError(new Error(event.message), {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

window.addEventListener('unhandledrejection', (event) => {
  analyticsService.trackError(new Error(`Unhandled Promise Rejection: ${event.reason}`), {
    type: 'unhandledrejection'
  });
});

export default analyticsService;
