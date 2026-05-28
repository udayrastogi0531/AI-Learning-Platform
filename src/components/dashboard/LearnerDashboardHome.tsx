'use client';

import { useAuth } from '@/lib/auth-context';
import { 
  TrendingUp, Target, Clock, 
  Play, Calendar, Zap, Star, Trophy
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import dynamic from 'next/dynamic';
import { Suspense, memo, useMemo } from 'react';
import Image from 'next/image';

// Lazy load heavy chart components for better performance
const ChartsSection = dynamic(() => import('./ChartsSection'), { 
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      <Card className="p-6 h-80 animate-shimmer"><div /></Card>
      <Card className="p-6 h-80 animate-shimmer"><div /></Card>
    </div>
  )
});

// Mock data
const skillGrowthData = [
  { month: 'Jan', mastery: 45 },
  { month: 'Feb', mastery: 52 },
  { month: 'Mar', mastery: 61 },
  { month: 'Apr', mastery: 68 },
  { month: 'May', mastery: 75 },
  { month: 'Jun', mastery: 82 },
];

const weeklyActivityData = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 3.2 },
  { day: 'Wed', hours: 1.8 },
  { day: 'Thu', hours: 4.1 },
  { day: 'Fri', hours: 2.9 },
  { day: 'Sat', hours: 5.3 },
  { day: 'Sun', hours: 3.7 },
];

const courses = [
  {
    id: 1,
    title: 'AI Fundamentals',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    progress: 75,
    lessons: 24,
    completed: 18,
    duration: '8 hours',
    instructor: 'Dr. Sarah Chen',
    difficulty: 'Intermediate' as const,
    rating: 4.8,
  },
  {
    id: 2,
    title: 'Machine Learning Essentials',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
    progress: 45,
    lessons: 32,
    completed: 14,
    duration: '12 hours',
    instructor: 'Prof. Michael Zhang',
    difficulty: 'Advanced' as const,
    rating: 4.9,
  },
  {
    id: 3,
    title: 'Python for Data Science',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
    progress: 90,
    lessons: 20,
    completed: 18,
    duration: '6 hours',
    instructor: 'Emma Rodriguez',
    difficulty: 'Beginner' as const,
    rating: 4.7,
  },
];

// Memoized Course Card Component for better performance
const CourseCard = memo(({ course }: { course: typeof courses[0] }) => (
  <Card variant="glass" className="group hover:shadow-2xl transition-all duration-300 overflow-hidden hover-lift animate-card-reveal">
    {/* Course Thumbnail */}
    <div className="relative h-40 sm:h-48 lg:h-52 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
      <Image 
        src={course.thumbnail} 
        alt={course.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover group-hover:scale-110 transition-transform duration-300"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      
      {/* Difficulty Badge */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
        <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
          course.difficulty === 'Beginner' ? 'bg-green-500/80 text-white' :
          course.difficulty === 'Intermediate' ? 'bg-blue-500/80 text-white' :
          'bg-purple-500/80 text-white'
        }`}>
          {course.difficulty}
        </span>
      </div>

      {/* Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <button className="h-12 w-12 sm:h-16 sm:w-16 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm hover:scale-110 transition-transform cursor-pointer touch-target-large">
          <Play className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 ml-1" />
        </button>
      </div>
    </div>

    {/* Course Info */}
    <div className="p-4 sm:p-5 lg:p-6">
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
          {course.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
          By {course.instructor}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-3 sm:mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            {course.completed}/{course.lessons} lessons
          </span>
          <span className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400">
            {course.progress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Course Meta */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
        <div className="flex items-center space-x-1">
          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>{course.duration}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
          <span>{course.rating}</span>
        </div>
      </div>

      {/* Continue Button */}
      <Button 
        variant="gradient" 
        className="w-full text-sm sm:text-base"
        icon={<Play className="h-3 w-3 sm:h-4 sm:w-4" />}
      >
        Continue Learning
      </Button>
    </div>
  </Card>
));
CourseCard.displayName = 'CourseCard';

export function LearnerDashboardHome() {
  const { user } = useAuth();

  // Memoize user initial for performance
  const userInitial = useMemo(() => {
    return user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U';
  }, [user]);

  const userName = useMemo(() => {
    return user?.displayName || user?.email?.split('@')[0] || 'Student';
  }, [user]);

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      {/* Hero Card - Responsive */}
      <Card variant="gradient" className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl -mt-16 -mr-16 sm:-mt-32 sm:-mr-32"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl -mb-16 -ml-16 sm:-mb-32 sm:-ml-32"></div>
        
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center space-x-4 sm:space-x-6 w-full sm:w-auto">
            {/* Profile Picture */}
            <div className="relative group flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center ring-4 ring-white/30">
                {user?.photoURL ? (
                  <Image 
                    src={user.photoURL} 
                    alt="Profile" 
                    fill
                    sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 96px"
                    className="rounded-full object-cover" 
                  />
                ) : (
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-bold">{userInitial}</span>
                )}
              </div>
            </div>
            
            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 sm:mb-2 truncate">
                Welcome back, {userName}! 👋
              </h1>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">
                Continue your learning journey
              </p>
              
              {/* Learning Streak */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-6">
                <div className="flex items-center space-x-1 sm:space-x-2 bg-white/20 backdrop-blur-sm px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm">
                  <Zap className="h-3 w-3 sm:h-5 sm:w-5 text-yellow-300" />
                  <span className="font-semibold">7 Day Streak</span>
                  <span className="text-base sm:text-2xl">🔥</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 bg-white/20 backdrop-blur-sm px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm">
                  <Star className="h-3 w-3 sm:h-5 sm:w-5 text-yellow-300" />
                  <span className="font-semibold">1,250 XP</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 bg-white/20 backdrop-blur-sm px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm">
                  <Trophy className="h-3 w-3 sm:h-5 sm:w-5 text-yellow-300" />
                  <span className="font-semibold">Level 12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Progress Overview Cards - Responsive Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Overall Mastery"
          value="82%"
          subtitle="Excellent progress"
          trend={{ value: 12, label: "vs last month", positive: true }}
          variant="blue"
          icon={<Target className="h-6 w-6 sm:h-8 sm:w-8" />}
        />
        <StatCard
          title="Learning Time Today"
          value="3.5h"
          subtitle="2h 15m remaining"
          trend={{ value: 25, label: "vs yesterday", positive: true }}
          variant="green"
          icon={<Clock className="h-6 w-6 sm:h-8 sm:w-8" />}
        />
        <StatCard
          title="Next Lesson"
          value="ML Models"
          subtitle="Starts in 45 minutes"
          variant="purple"
          icon={<Calendar className="h-6 w-6 sm:h-8 sm:w-8" />}
        />
        <StatCard
          title="This Week"
          value="23.5h"
          subtitle="5 courses in progress"
          trend={{ value: 18, label: "vs last week", positive: true }}
          variant="orange"
          icon={<TrendingUp className="h-6 w-6 sm:h-8 sm:w-8" />}
        />
      </div>

      {/* Charts Section - Lazy Loaded */}
      <Suspense fallback={
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <Card className="p-6 h-80 animate-shimmer"><div /></Card>
          <Card className="p-6 h-80 animate-shimmer"><div /></Card>
        </div>
      }>
        <ChartsSection 
          skillGrowthData={skillGrowthData} 
          weeklyActivityData={weeklyActivityData} 
        />
      </Suspense>

      {/* Course Cards Grid - Responsive */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Continue Learning</h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Pick up where you left off</p>
          </div>
          <Button variant="secondary" className="w-full sm:w-auto text-sm sm:text-base">View All Courses</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {courses.map((course, index) => (
            <div 
              key={course.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
