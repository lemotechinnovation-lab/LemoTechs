import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsService } from '../services/analyticsService';
import { useAuth } from './useAuth';

export interface UseAnalyticsOptions {
  trackPageViews?: boolean;
  trackScrollDepth?: boolean;
  trackTimeOnPage?: boolean;
  trackClicks?: boolean;
}

export const useAnalytics = (options: UseAnalyticsOptions = {}) => {
  const location = useLocation();
  const { user } = useAuth();
  const startTimeRef = useRef<number>(Date.now());
  const previousPathRef = useRef<string>('');

  const {
    trackPageViews = true,
    trackTimeOnPage = true,
    trackClicks = true
  } = options;

  // Set user ID when user is authenticated
  useEffect(() => {
    if (user?.id) {
      analyticsService.setUserId(user.id);
    }
  }, [user]);

  // Track page views and navigation
  useEffect(() => {
    if (trackPageViews) {
      const currentPath = location.pathname;
      
      // Track navigation if not the first page
      if (previousPathRef.current && previousPathRef.current !== currentPath) {
        analyticsService.trackNavigation(previousPathRef.current, currentPath);
      }
      
      // Track page view
      analyticsService.trackPageView(currentPath, document.title);
      
      // Update refs
      previousPathRef.current = currentPath;
      startTimeRef.current = Date.now();
    }
  }, [location.pathname, trackPageViews]);

  // Track time on page when component unmounts or path changes
  useEffect(() => {
    return () => {
      if (trackTimeOnPage) {
        const timeOnPage = Date.now() - startTimeRef.current;
        analyticsService.trackEvent('time_on_page', 'user_action', {
          path: location.pathname,
          timeOnPage,
          timeOnPageMinutes: Math.round(timeOnPage / 60000 * 100) / 100
        });
      }
    };
  }, [location.pathname, trackTimeOnPage]);

  // Analytics tracking methods
  const trackEvent = useCallback((
    event: string,
    category: 'navigation' | 'user_action' | 'business' | 'performance' | 'conversion',
    properties?: Record<string, any>
  ) => {
    analyticsService.trackEvent(event, category, {
      ...properties,
      path: location.pathname
    });
  }, [location.pathname]);

  const trackClick = useCallback((elementName: string, properties?: Record<string, any>) => {
    if (trackClicks) {
      analyticsService.trackEvent('click', 'user_action', {
        element: elementName,
        path: location.pathname,
        ...properties
      });
    }
  }, [location.pathname, trackClicks]);

  const trackNavigation = useCallback((to: string, method: 'click' | 'programmatic' = 'click') => {
    analyticsService.trackNavigation(location.pathname, to, method);
  }, [location.pathname]);

  const trackConversion = useCallback((goal: string, value?: number, properties?: Record<string, any>) => {
    analyticsService.trackConversion(goal, value, {
      ...properties,
      path: location.pathname
    });
  }, [location.pathname]);

  const trackFeatureUsage = useCallback((feature: string, action: string, properties?: Record<string, any>) => {
    analyticsService.trackFeatureUsage(feature, action, {
      ...properties,
      path: location.pathname
    });
  }, [location.pathname]);

  const trackBusinessMetric = useCallback((metric: string, value: number, properties?: Record<string, any>) => {
    analyticsService.trackBusinessMetric(metric, value, {
      ...properties,
      path: location.pathname
    });
  }, [location.pathname]);

  const trackError = useCallback((error: Error, context?: Record<string, any>) => {
    analyticsService.trackError(error, {
      ...context,
      path: location.pathname
    });
  }, [location.pathname]);

  const trackFunnelStep = useCallback((step: string, properties?: Record<string, any>) => {
    analyticsService.trackFunnelStep(step, {
      ...properties,
      path: location.pathname
    });
  }, [location.pathname]);

  const trackExperiment = useCallback((experimentId: string, variant: string, properties?: Record<string, any>) => {
    analyticsService.trackExperiment(experimentId, variant, {
      ...properties,
      path: location.pathname
    });
  }, [location.pathname]);

  const trackRevenue = useCallback((amount: number, currency: string = 'ZAR', properties?: Record<string, any>) => {
    analyticsService.trackRevenue(amount, currency, {
      ...properties,
      path: location.pathname
    });
  }, [location.pathname]);

  return {
    // Event tracking
    trackEvent,
    trackClick,
    trackNavigation,
    trackConversion,
    trackFeatureUsage,
    trackBusinessMetric,
    trackError,
    trackFunnelStep,
    trackExperiment,
    trackRevenue,
    
    // Analytics data
    getSession: analyticsService.getSession.bind(analyticsService),
    getEvents: analyticsService.getEvents.bind(analyticsService),
    getHeatmapData: analyticsService.getHeatmapData.bind(analyticsService),
    getUserBehaviorMetrics: analyticsService.getUserBehaviorMetrics.bind(analyticsService)
  };
};

// Specialized hooks for different use cases
export const useNavigationAnalytics = () => {
  const { trackClick, trackNavigation, trackFeatureUsage } = useAnalytics();
  
  const trackNavClick = useCallback((destination: string, elementName: string) => {
    trackClick(`nav_${elementName}`);
    trackNavigation(destination);
    trackFeatureUsage('navigation', 'click', { destination, element: elementName });
  }, [trackClick, trackNavigation, trackFeatureUsage]);

  const trackMobileMenuToggle = useCallback((isOpen: boolean) => {
    trackFeatureUsage('mobile_menu', isOpen ? 'open' : 'close');
  }, [trackFeatureUsage]);

  const trackSearchUsage = useCallback((query: string, results: number) => {
    trackFeatureUsage('search', 'query', { query, results });
  }, [trackFeatureUsage]);

  return {
    trackNavClick,
    trackMobileMenuToggle,
    trackSearchUsage
  };
};

export const useFormAnalytics = () => {
  const { trackEvent, trackConversion, trackError } = useAnalytics();

  const trackFormStart = useCallback((formName: string) => {
    trackEvent('form_start', 'user_action', { formName });
  }, [trackEvent]);

  const trackFormComplete = useCallback((formName: string, completionTime: number) => {
    trackEvent('form_complete', 'user_action', { formName, completionTime });
    trackConversion(`form_completion_${formName}`);
  }, [trackEvent, trackConversion]);

  const trackFormError = useCallback((formName: string, field: string, error: string) => {
    trackError(new Error(`Form validation error: ${error}`), {
      formName,
      field,
      type: 'form_validation'
    });
  }, [trackError]);

  const trackFieldInteraction = useCallback((formName: string, field: string, action: string) => {
    trackEvent('field_interaction', 'user_action', { formName, field, action });
  }, [trackEvent]);

  return {
    trackFormStart,
    trackFormComplete,
    trackFormError,
    trackFieldInteraction
  };
};

export const useBookingAnalytics = () => {
  const { trackEvent, trackConversion, trackRevenue, trackFunnelStep } = useAnalytics();

  const trackBookingStart = useCallback(() => {
    trackFunnelStep('booking_start');
    trackEvent('booking_start', 'conversion');
  }, [trackFunnelStep, trackEvent]);

  const trackServiceSelection = useCallback((services: string[], totalPrice: number) => {
    trackFunnelStep('service_selection');
    trackEvent('service_selection', 'conversion', { services, totalPrice });
  }, [trackFunnelStep, trackEvent]);

  const trackAddressEntry = useCallback((addressType: 'pickup' | 'delivery') => {
    trackFunnelStep(`address_${addressType}`);
    trackEvent('address_entry', 'conversion', { addressType });
  }, [trackFunnelStep, trackEvent]);

  const trackPaymentMethod = useCallback((method: string) => {
    trackFunnelStep('payment_method');
    trackEvent('payment_method_selected', 'conversion', { method });
  }, [trackFunnelStep, trackEvent]);

  const trackBookingComplete = useCallback((bookingId: string, totalAmount: number, services: string[]) => {
    trackFunnelStep('booking_complete');
    trackConversion('booking_completed', totalAmount, {
      bookingId,
      services,
      serviceCount: services.length
    });
    trackRevenue(totalAmount, 'ZAR', {
      bookingId,
      services,
      revenueType: 'booking'
    });
  }, [trackFunnelStep, trackConversion, trackRevenue]);

  const trackBookingCancellation = useCallback((step: string, reason?: string) => {
    trackEvent('booking_cancelled', 'conversion', { 
      cancellationStep: step, 
      reason 
    });
  }, [trackEvent]);

  return {
    trackBookingStart,
    trackServiceSelection,
    trackAddressEntry,
    trackPaymentMethod,
    trackBookingComplete,
    trackBookingCancellation
  };
};

export const useBusinessAnalytics = () => {
  const { trackBusinessMetric, trackConversion, trackRevenue } = useAnalytics();

  const trackSubscriptionUpgrade = useCallback((fromTier: string, toTier: string, price: number) => {
    trackConversion('subscription_upgrade', price, { fromTier, toTier });
    trackRevenue(price, 'ZAR', { type: 'subscription', tier: toTier });
    trackBusinessMetric('subscription_upgrades', 1, { fromTier, toTier });
  }, [trackConversion, trackRevenue, trackBusinessMetric]);

  const trackMarketplacePurchase = useCallback((productId: string, price: number, category: string) => {
    trackConversion('marketplace_purchase', price, { productId, category });
    trackRevenue(price, 'ZAR', { type: 'marketplace', productId, category });
    trackBusinessMetric('marketplace_revenue', price, { productId, category });
  }, [trackConversion, trackRevenue, trackBusinessMetric]);

  const trackFranchiseInquiry = useCallback((packageType: string, investmentAmount: number) => {
    trackConversion('franchise_inquiry', 0, { packageType, investmentAmount });
    trackBusinessMetric('franchise_inquiries', 1, { packageType });
  }, [trackConversion, trackBusinessMetric]);

  return {
    trackSubscriptionUpgrade,
    trackMarketplacePurchase,
    trackFranchiseInquiry
  };
};

// Named exports only - no default export
