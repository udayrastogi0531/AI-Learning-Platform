/**
 * Performance Optimization Utilities
 * Provides utilities for lazy loading, memoization, and performance monitoring
 */

import { ComponentType, lazy, LazyExoticComponent } from 'react';

/**
 * Retry logic for lazy loaded components
 * Retries loading a component up to 3 times with exponential backoff
 */
const componentRetry = (
  fn: () => Promise<{ default: ComponentType<any> }>,
  retriesLeft = 3,
  interval = 500
): Promise<{ default: ComponentType<any> }> => {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            reject(error);
            return;
          }

          // Retry
          componentRetry(fn, retriesLeft - 1, interval * 2).then(resolve, reject);
        }, interval);
      });
  });
};

/**
 * Enhanced lazy loading with retry logic
 */
export const lazyWithRetry = (
  componentImport: () => Promise<{ default: ComponentType<any> }>
): LazyExoticComponent<ComponentType<any>> => {
  return lazy(() => componentRetry(componentImport));
};

/**
 * Debounce function for search inputs and filters
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for scroll events and animations
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Image preloader for optimized loading
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Intersection Observer hook for lazy loading images/components
 */
export const useInView = (
  callback: () => void,
  options: IntersectionObserverInit = {}
) => {
  if (typeof window === 'undefined') return null;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback();
      }
    });
  }, options);
  
  return observer;
};

/**
 * Performance monitoring utilities
 */
export const performanceMonitor = {
  mark: (name: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      performance.mark(name);
    }
  },
  
  measure: (name: string, startMark: string, endMark: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name)[0];
        console.log(`${name}: ${measure.duration.toFixed(2)}ms`);
        return measure.duration;
      } catch (e) {
        console.warn('Performance measure failed:', e);
      }
    }
    return 0;
  },
  
  clearMarks: () => {
    if (typeof window !== 'undefined' && window.performance) {
      performance.clearMarks();
      performance.clearMeasures();
    }
  }
};

/**
 * Batch multiple state updates together
 */
export const batchUpdate = <T>(updates: Array<() => T>): T[] => {
  return updates.map(update => update());
};

/**
 * Create a memoized selector for filtering/sorting data
 */
export const createMemoizedSelector = <T, R>(
  selector: (data: T) => R
) => {
  let lastData: T;
  let lastResult: R;
  
  return (data: T): R => {
    if (data === lastData) {
      return lastResult;
    }
    lastData = data;
    lastResult = selector(data);
    return lastResult;
  };
};

/**
 * Optimize Firestore batch reads
 */
export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Local storage with expiration
 */
export const cachedStorage = {
  set: (key: string, value: any, ttl: number = 3600000) => { // 1 hour default
    const item = {
      value,
      expiry: Date.now() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  },
  
  get: (key: string) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    
    const item = JSON.parse(itemStr);
    if (Date.now() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value;
  },
  
  remove: (key: string) => {
    localStorage.removeItem(key);
  }
};
