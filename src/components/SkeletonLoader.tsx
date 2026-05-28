import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
  height?: string;
  width?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  className = '', 
  count = 1, 
  height = 'h-4', 
  width = 'w-full' 
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`skeleton ${height} ${width} rounded ${className}`}
          role="status"
          aria-label="Loading content"
        />
      ))}
    </>
  );
};

// Specific skeleton components for different content types
export const CardSkeleton: React.FC = () => (
  <div className="card p-6 animate-pulse">
    <div className="flex items-center mb-4">
      <div className="skeleton w-12 h-12 rounded-lg mr-4" />
      <div className="flex-1">
        <SkeletonLoader height="h-5" width="w-3/4" className="mb-2" />
        <SkeletonLoader height="h-4" width="w-1/2" />
      </div>
    </div>
    <SkeletonLoader count={3} height="h-3" className="mb-2" />
    <SkeletonLoader height="h-3" width="w-2/3" />
  </div>
);

export const TestimonialSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
    <div className="flex items-center mb-4">
      <div className="skeleton w-16 h-16 rounded-full mr-4" />
      <div className="flex-1">
        <SkeletonLoader height="h-5" width="w-1/2" className="mb-2" />
        <SkeletonLoader height="h-4" width="w-1/3" />
      </div>
    </div>
    <SkeletonLoader count={4} height="h-4" className="mb-2" />
    <SkeletonLoader height="h-4" width="w-3/4" />
  </div>
);

export const DemoSkeleton: React.FC = () => (
  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden animate-pulse">
    <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
      <div className="skeleton w-20 h-20 rounded-full" />
    </div>
    <div className="p-6">
      <SkeletonLoader height="h-6" width="w-3/4" className="mb-3" />
      <SkeletonLoader count={2} height="h-4" className="mb-2" />
    </div>
  </div>
);

export default SkeletonLoader;
