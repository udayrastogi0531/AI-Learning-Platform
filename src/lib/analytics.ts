// Google Analytics 4 wrapper with typed events
declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export interface SemanticEvent {
  event_name: 'sign_up' | 'start_trial' | 'demo_request' | 'lesson_complete' | 'chat_interaction' | 'scroll_depth' | 'feature_click' | 'pricing_view' | 'contact_form';
  event_category: 'engagement' | 'conversion' | 'learning' | 'support';
  event_label?: string;
  value?: number;
  user_id?: string;
  session_id?: string;
}

class Analytics {
  private isInitialized = false;
  private measurementId: string;

  constructor(measurementId: string = 'G-XXXXXXXXXX') {
    this.measurementId = measurementId;
  }

  // Initialize Google Analytics 4
  init() {
    if (typeof window === 'undefined' || this.isInitialized) return;

    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', this.measurementId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    this.isInitialized = true;
  }

  // Track semantic events for AI learning platform
  trackEvent(event: SemanticEvent) {
    if (!this.isInitialized || typeof window === 'undefined') return;

    window.gtag('event', event.event_name, {
      event_category: event.event_category,
      event_label: event.event_label,
      value: event.value,
      user_id: event.user_id,
      session_id: event.session_id,
      timestamp: new Date().toISOString(),
    });
  }

  // Track page views
  trackPageView(page_title: string, page_location: string) {
    if (!this.isInitialized) return;

    window.gtag('config', this.measurementId, {
      page_title,
      page_location,
    });
  }

  // Track user sign up
  trackSignUp(method: 'email' | 'google' | 'github') {
    this.trackEvent({
      event_name: 'sign_up',
      event_category: 'conversion',
      event_label: method,
      value: 1,
    });
  }

  // Track trial start
  trackTrialStart(plan: 'starter' | 'professional' | 'enterprise') {
    this.trackEvent({
      event_name: 'start_trial',
      event_category: 'conversion',
      event_label: plan,
      value: 1,
    });
  }

  // Track demo requests
  trackDemoRequest(type: 'interactive' | 'live_demo' | 'video') {
    this.trackEvent({
      event_name: 'demo_request',
      event_category: 'engagement',
      event_label: type,
      value: 1,
    });
  }

  // Track learning progress
  trackLessonComplete(course_id: string, lesson_id: string, completion_time: number) {
    this.trackEvent({
      event_name: 'lesson_complete',
      event_category: 'learning',
      event_label: `${course_id}/${lesson_id}`,
      value: completion_time,
    });
  }

  // Track AI chat interactions
  trackChatInteraction(interaction_type: 'question' | 'demo_request' | 'support') {
    this.trackEvent({
      event_name: 'chat_interaction',
      event_category: 'support',
      event_label: interaction_type,
      value: 1,
    });
  }

  // Track scroll depth for engagement
  trackScrollDepth(percentage: number) {
    this.trackEvent({
      event_name: 'scroll_depth',
      event_category: 'engagement',
      event_label: `${percentage}%`,
      value: percentage,
    });
  }

  // Track feature interactions
  trackFeatureClick(feature_name: string, section: string) {
    this.trackEvent({
      event_name: 'feature_click',
      event_category: 'engagement',
      event_label: `${section}/${feature_name}`,
      value: 1,
    });
  }

  // Track pricing page views
  trackPricingView(plan_viewed?: string) {
    this.trackEvent({
      event_name: 'pricing_view',
      event_category: 'conversion',
      event_label: plan_viewed,
      value: 1,
    });
  }

  // Track contact form submissions
  trackContactForm(form_type: 'contact' | 'demo' | 'support') {
    this.trackEvent({
      event_name: 'contact_form',
      event_category: 'conversion',
      event_label: form_type,
      value: 1,
    });
  }
}

// Core Web Vitals monitoring
export class WebVitalsMonitor {
  private static instance: WebVitalsMonitor;
  private analytics: Analytics;

  constructor(analytics: Analytics) {
    this.analytics = analytics;
  }

  static getInstance(analytics: Analytics): WebVitalsMonitor {
    if (!WebVitalsMonitor.instance) {
      WebVitalsMonitor.instance = new WebVitalsMonitor(analytics);
    }
    return WebVitalsMonitor.instance;
  }

  // Monitor Core Web Vitals
  init() {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint (LCP)
    this.observeLCP();
    
    // First Input Delay (FID)
    this.observeFID();
    
    // Cumulative Layout Shift (CLS)
    this.observeCLS();
  }

  private observeLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        this.analytics.trackEvent({
          event_name: 'scroll_depth', // Reusing for web vitals
          event_category: 'engagement',
          event_label: 'LCP',
          value: Math.round(lastEntry.startTime),
        });
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  private observeFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.analytics.trackEvent({
            event_name: 'scroll_depth', // Reusing for web vitals
            event_category: 'engagement',
            event_label: 'FID',
            value: Math.round(entry.processingStart - entry.startTime),
          });
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  private observeCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        this.analytics.trackEvent({
          event_name: 'scroll_depth', // Reusing for web vitals
          event_category: 'engagement',
          event_label: 'CLS',
          value: Math.round(clsValue * 1000), // Convert to milliseconds
        });
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }
}

// Scroll depth tracking
export class ScrollTracker {
  private analytics: Analytics;
  private thresholds = [25, 50, 75, 90, 100];
  private tracked = new Set<number>();

  constructor(analytics: Analytics) {
    this.analytics = analytics;
  }

  init() {
    if (typeof window === 'undefined') return;

    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
  }

  private handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);

    this.thresholds.forEach(threshold => {
      if (scrollPercentage >= threshold && !this.tracked.has(threshold)) {
        this.tracked.add(threshold);
        this.analytics.trackScrollDepth(threshold);
      }
    });
  }

  destroy() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }
}

// Export singleton instance
export const analytics = new Analytics();
export const webVitalsMonitor = WebVitalsMonitor.getInstance(analytics);
export const scrollTracker = new ScrollTracker(analytics);

// Initialize all monitoring
export const initializeAnalytics = () => {
  analytics.init();
  webVitalsMonitor.init();
  scrollTracker.init();
};

export default analytics;
