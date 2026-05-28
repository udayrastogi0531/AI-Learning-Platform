'use client';

import { Card } from '@/components/ui/Card';
import { TrendingUp, Clock } from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';

interface ChartsSectionProps {
  skillGrowthData: Array<{ month: string; mastery: number }>;
  weeklyActivityData: Array<{ day: string; hours: number }>;
}

export default function ChartsSection({ skillGrowthData, weeklyActivityData }: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      {/* Skill Growth Chart */}
      <Card variant="glass" className="p-4 sm:p-6 animate-slide-up">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 sm:mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Skill Growth</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Your mastery over time</p>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-green-600 dark:text-green-400 font-semibold">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>+37% this year</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
          <AreaChart data={skillGrowthData}>
            <defs>
              <linearGradient id="colorMastery" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="opacity-50" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280" 
              tick={{ fontSize: 12 }}
              className="text-xs sm:text-sm"
            />
            <YAxis 
              stroke="#6b7280" 
              tick={{ fontSize: 12 }}
              className="text-xs sm:text-sm"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '14px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="mastery" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fill="url(#colorMastery)" 
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Weekly Activity Chart */}
      <Card variant="glass" className="p-4 sm:p-6 animate-slide-up stagger-1">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 sm:mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Weekly Activity</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Hours spent learning</p>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-semibold">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>23.5h total</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
          <BarChart data={weeklyActivityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="opacity-50" />
            <XAxis 
              dataKey="day" 
              stroke="#6b7280" 
              tick={{ fontSize: 12 }}
              className="text-xs sm:text-sm"
            />
            <YAxis 
              stroke="#6b7280" 
              tick={{ fontSize: 12 }}
              className="text-xs sm:text-sm"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '14px'
              }}
            />
            <Bar 
              dataKey="hours" 
              fill="url(#colorBar)" 
              radius={[8, 8, 0, 0]} 
              animationDuration={1000}
            />
            <defs>
              <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
