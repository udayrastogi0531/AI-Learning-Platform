import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  variant?: 'blue' | 'green' | 'purple' | 'orange' | 'pink';
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  variant = 'blue',
  className 
}: StatCardProps) {
  const variantClasses = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      bg: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      border: 'border-blue-200/50 dark:border-blue-700/50',
      text: 'from-blue-600 to-blue-800'
    },
    green: {
      gradient: 'from-green-500 to-green-600',
      bg: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
      border: 'border-green-200/50 dark:border-green-700/50',
      text: 'from-green-600 to-green-800'
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      bg: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      border: 'border-purple-200/50 dark:border-purple-700/50',
      text: 'from-purple-600 to-purple-800'
    },
    orange: {
      gradient: 'from-orange-500 to-orange-600',
      bg: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20',
      border: 'border-orange-200/50 dark:border-orange-700/50',
      text: 'from-orange-600 to-orange-800'
    },
    pink: {
      gradient: 'from-pink-500 to-pink-600',
      bg: 'from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20',
      border: 'border-pink-200/50 dark:border-pink-700/50',
      text: 'from-pink-600 to-pink-800'
    }
  };

  const colors = variantClasses[variant];

  return (
    <div className={cn(
      'group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl rounded-2xl p-6 border transition-all duration-300 transform hover:scale-105 hover:shadow-2xl',
      `bg-gradient-to-br ${colors.bg} ${colors.border}`,
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className={cn(
            'text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent',
            `${colors.text}`
          )}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span className={cn(
                'text-xs font-medium',
                trend.positive ? 'text-green-500' : 'text-red-500'
              )}>
                {trend.positive ? '↗' : '↘'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-400 ml-1">
                {trend.label}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn(
            'p-3 rounded-xl shadow-lg group-hover:shadow-lg transition-shadow duration-300',
            `bg-gradient-to-r ${colors.gradient}`
          )}>
            <div className="w-8 h-8 text-white">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}