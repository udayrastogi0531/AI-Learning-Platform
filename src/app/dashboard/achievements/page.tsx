'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Trophy, Award, Star, Target, Flame, Zap, Crown,
  TrendingUp, Calendar, CheckCircle, Lock, Share2,
  Download, Medal, BookOpen, Clock, Brain
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: 'milestone' | 'streak' | 'mastery' | 'social' | 'special';
  requirement: string;
  progress: number;
  target: number;
  unlocked: boolean;
  unlockedAt?: Date;
  xpReward: number;
  badge: string;
}

interface UserStats {
  level: number;
  xp: number;
  streak: number;
  coursesCompleted: number;
  videosWatched: number;
  totalLearningTime: number; // in hours
  mastery: number;
  achievements: number;
}

export default function AchievementsPage() {
  const { user, userProfile } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    level: 12,
    xp: 1250,
    streak: 7,
    coursesCompleted: 5,
    videosWatched: 23,
    totalLearningTime: 23.5,
    mastery: 82,
    achievements: 8,
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAchievements();
    loadUserStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadUserStats = async () => {
    if (!user) return;

    try {
      // Load completed courses
      const coursesQuery = query(
        collection(db, 'courseProgress'),
        where('userId', '==', user.uid),
        where('completed', '==', true)
      );
      const coursesSnap = await getDocs(coursesQuery);

      // Load video progress
      const videosQuery = query(
        collection(db, 'videoProgress'),
        where('userId', '==', user.uid)
      );
      const videosSnap = await getDocs(videosQuery);

      // Calculate stats
      const completedCourses = coursesSnap.size;
      const watchedVideos = videosSnap.size;

      setStats(prev => ({
        ...prev,
        coursesCompleted: completedCourses,
        videosWatched: watchedVideos,
      }));
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadAchievements = () => {
    const allAchievements: Achievement[] = [
      // Milestone Achievements
      {
        id: 'first-course',
        title: 'First Steps',
        description: 'Complete your first course',
        icon: BookOpen,
        category: 'milestone',
        requirement: 'Complete 1 course',
        progress: Math.min(stats.coursesCompleted, 1),
        target: 1,
        unlocked: stats.coursesCompleted >= 1,
        unlockedAt: stats.coursesCompleted >= 1 ? new Date() : undefined,
        xpReward: 50,
        badge: '🎓',
      },
      {
        id: '5-courses',
        title: 'Learning Enthusiast',
        description: 'Complete 5 courses',
        icon: Target,
        category: 'milestone',
        requirement: 'Complete 5 courses',
        progress: Math.min(stats.coursesCompleted, 5),
        target: 5,
        unlocked: stats.coursesCompleted >= 5,
        unlockedAt: stats.coursesCompleted >= 5 ? new Date() : undefined,
        xpReward: 150,
        badge: '🏆',
      },
      {
        id: '10-courses',
        title: 'Course Master',
        description: 'Complete 10 courses',
        icon: Crown,
        category: 'milestone',
        requirement: 'Complete 10 courses',
        progress: Math.min(stats.coursesCompleted, 10),
        target: 10,
        unlocked: stats.coursesCompleted >= 10,
        xpReward: 300,
        badge: '👑',
      },
      
      // Streak Achievements
      {
        id: '3-day-streak',
        title: 'Getting Started',
        description: 'Maintain a 3-day learning streak',
        icon: Flame,
        category: 'streak',
        requirement: '3 day streak',
        progress: Math.min(stats.streak, 3),
        target: 3,
        unlocked: stats.streak >= 3,
        unlockedAt: stats.streak >= 3 ? new Date() : undefined,
        xpReward: 30,
        badge: '🔥',
      },
      {
        id: '7-day-streak',
        title: 'Dedicated Learner',
        description: 'Maintain a 7-day learning streak',
        icon: Flame,
        category: 'streak',
        requirement: '7 day streak',
        progress: Math.min(stats.streak, 7),
        target: 7,
        unlocked: stats.streak >= 7,
        unlockedAt: stats.streak >= 7 ? new Date() : undefined,
        xpReward: 100,
        badge: '🔥🔥',
      },
      {
        id: '30-day-streak',
        title: 'Consistency King',
        description: 'Maintain a 30-day learning streak',
        icon: Flame,
        category: 'streak',
        requirement: '30 day streak',
        progress: Math.min(stats.streak, 30),
        target: 30,
        unlocked: stats.streak >= 30,
        xpReward: 500,
        badge: '🔥🔥🔥',
      },

      // Mastery Achievements
      {
        id: 'mastery-50',
        title: 'Half Way There',
        description: 'Reach 50% overall mastery',
        icon: Star,
        category: 'mastery',
        requirement: '50% mastery',
        progress: Math.min(stats.mastery, 50),
        target: 50,
        unlocked: stats.mastery >= 50,
        unlockedAt: stats.mastery >= 50 ? new Date() : undefined,
        xpReward: 100,
        badge: '⭐',
      },
      {
        id: 'mastery-75',
        title: 'Expert in Progress',
        description: 'Reach 75% overall mastery',
        icon: Star,
        category: 'mastery',
        requirement: '75% mastery',
        progress: Math.min(stats.mastery, 75),
        target: 75,
        unlocked: stats.mastery >= 75,
        unlockedAt: stats.mastery >= 75 ? new Date() : undefined,
        xpReward: 250,
        badge: '⭐⭐',
      },
      {
        id: 'mastery-100',
        title: 'Perfect Mastery',
        description: 'Reach 100% overall mastery',
        icon: Crown,
        category: 'mastery',
        requirement: '100% mastery',
        progress: Math.min(stats.mastery, 100),
        target: 100,
        unlocked: stats.mastery >= 100,
        xpReward: 1000,
        badge: '👑⭐',
      },

      // Time-based Achievements
      {
        id: '10-hours',
        title: 'Time Invested',
        description: 'Spend 10 hours learning',
        icon: Clock,
        category: 'milestone',
        requirement: '10 hours',
        progress: Math.min(stats.totalLearningTime, 10),
        target: 10,
        unlocked: stats.totalLearningTime >= 10,
        unlockedAt: stats.totalLearningTime >= 10 ? new Date() : undefined,
        xpReward: 80,
        badge: '⏰',
      },
      {
        id: '50-hours',
        title: 'Dedicated Student',
        description: 'Spend 50 hours learning',
        icon: Clock,
        category: 'milestone',
        requirement: '50 hours',
        progress: Math.min(stats.totalLearningTime, 50),
        target: 50,
        unlocked: stats.totalLearningTime >= 50,
        xpReward: 400,
        badge: '⏰⏰',
      },

      // Level Achievements
      {
        id: 'level-5',
        title: 'Rising Star',
        description: 'Reach level 5',
        icon: TrendingUp,
        category: 'milestone',
        requirement: 'Reach level 5',
        progress: Math.min(stats.level, 5),
        target: 5,
        unlocked: stats.level >= 5,
        unlockedAt: stats.level >= 5 ? new Date() : undefined,
        xpReward: 100,
        badge: '🌟',
      },
      {
        id: 'level-10',
        title: 'Experienced Learner',
        description: 'Reach level 10',
        icon: TrendingUp,
        category: 'milestone',
        requirement: 'Reach level 10',
        progress: Math.min(stats.level, 10),
        target: 10,
        unlocked: stats.level >= 10,
        unlockedAt: stats.level >= 10 ? new Date() : undefined,
        xpReward: 250,
        badge: '🌟🌟',
      },
      {
        id: 'level-20',
        title: 'Master Learner',
        description: 'Reach level 20',
        icon: Crown,
        category: 'milestone',
        requirement: 'Reach level 20',
        progress: Math.min(stats.level, 20),
        target: 20,
        unlocked: stats.level >= 20,
        xpReward: 500,
        badge: '👑',
      },

      // Video Achievements
      {
        id: '10-videos',
        title: 'Video Viewer',
        description: 'Watch 10 videos',
        icon: Award,
        category: 'milestone',
        requirement: 'Watch 10 videos',
        progress: Math.min(stats.videosWatched, 10),
        target: 10,
        unlocked: stats.videosWatched >= 10,
        unlockedAt: stats.videosWatched >= 10 ? new Date() : undefined,
        xpReward: 50,
        badge: '📺',
      },
      {
        id: '50-videos',
        title: 'Binge Learner',
        description: 'Watch 50 videos',
        icon: Award,
        category: 'milestone',
        requirement: 'Watch 50 videos',
        progress: Math.min(stats.videosWatched, 50),
        target: 50,
        unlocked: stats.videosWatched >= 50,
        xpReward: 200,
        badge: '📺📺',
      },

      // Special Achievements
      {
        id: 'early-bird',
        title: 'Early Bird',
        description: 'Learn before 8 AM',
        icon: Brain,
        category: 'special',
        requirement: 'Learn before 8 AM',
        progress: 0,
        target: 1,
        unlocked: false,
        xpReward: 50,
        badge: '🌅',
      },
      {
        id: 'night-owl',
        title: 'Night Owl',
        description: 'Learn after 10 PM',
        icon: Brain,
        category: 'special',
        requirement: 'Learn after 10 PM',
        progress: 0,
        target: 1,
        unlocked: false,
        xpReward: 50,
        badge: '🦉',
      },
    ];

    setAchievements(allAchievements);
    setLoading(false);
  };

  const categories = [
    { id: 'all', label: 'All', icon: Trophy },
    { id: 'milestone', label: 'Milestones', icon: Target },
    { id: 'streak', label: 'Streaks', icon: Flame },
    { id: 'mastery', label: 'Mastery', icon: Star },
    { id: 'special', label: 'Special', icon: Crown },
  ];

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = filteredAchievements.filter(a => !a.unlocked);
  const unlockedFiltered = filteredAchievements.filter(a => a.unlocked);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mt-32 -mr-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mb-32 -ml-32"></div>
        
        <div className="relative">
          <div className="flex items-center space-x-3 mb-4">
            <Trophy className="h-10 w-10" />
            <h1 className="text-4xl font-bold">Achievements</h1>
          </div>
          <p className="text-lg text-white/90 mb-6">
            Track your learning milestones and unlock rewards
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Trophy className="h-5 w-5" />
                <span className="text-sm font-medium">Unlocked</span>
              </div>
              <div className="text-2xl font-bold">{unlockedAchievements.length}/{achievements.length}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Star className="h-5 w-5" />
                <span className="text-sm font-medium">Level</span>
              </div>
              <div className="text-2xl font-bold">{stats.level}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Flame className="h-5 w-5" />
                <span className="text-sm font-medium">Streak</span>
              </div>
              <div className="text-2xl font-bold">{stats.streak} days</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Zap className="h-5 w-5" />
                <span className="text-sm font-medium">Total XP</span>
              </div>
              <div className="text-2xl font-bold">{stats.xp}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <Card variant="glass" className="p-6">
        <div className="flex flex-wrap gap-3">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{category.label}</span>
                {category.id === 'all' && (
                  <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {achievements.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Unlocked Achievements */}
      {unlockedFiltered.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <span>Unlocked ({unlockedFiltered.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unlockedFiltered.map(achievement => {
              const Icon = achievement.icon;
              return (
                <Card
                  key={achievement.id}
                  variant="glass"
                  className="p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-500/50 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-14 w-14 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-2xl">{achievement.badge}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {achievement.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-green-600 dark:text-green-400 font-medium">
                      <Zap className="h-4 w-4" />
                      <span>+{achievement.xpReward} XP</span>
                    </div>
                    {achievement.unlockedAt && (
                      <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>{achievement.unlockedAt.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button variant="secondary" size="sm" icon={<Share2 className="h-4 w-4" />} className="flex-1">
                      Share
                    </Button>
                    <Button variant="secondary" size="sm" icon={<Download className="h-4 w-4" />}>
                      Save
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Lock className="h-6 w-6 text-gray-400" />
            <span>Locked ({lockedAchievements.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lockedAchievements.map(achievement => {
              const Icon = achievement.icon;
              const progressPercent = (achievement.progress / achievement.target) * 100;
              
              return (
                <Card
                  key={achievement.id}
                  variant="glass"
                  className="p-6 opacity-75 hover:opacity-100 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-14 w-14 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center relative">
                      <Icon className="h-7 w-7 text-gray-400" />
                      <Lock className="absolute -bottom-1 -right-1 h-5 w-5 text-gray-500 bg-white dark:bg-gray-800 rounded-full p-0.5" />
                    </div>
                    <span className="text-2xl grayscale">{achievement.badge}</span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {achievement.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                      <span>{achievement.requirement}</span>
                      <span>{achievement.progress}/{achievement.target}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                    <Zap className="h-4 w-4" />
                    <span>Reward: {achievement.xpReward} XP</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
