'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  TrendingUp, Target, Clock, Award, Zap, BookOpen, 
  CheckCircle, Star, Calendar, BarChart3, PieChart, Activity 
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

export default function ProgressPage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      const q = query(collection(db, 'courseProgress'), where('userId', '==', user.uid));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (mounted) setProgress(data);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [user]);

  // Mock enhanced data for visualization
  const weeklyProgress = [
    { day: 'Mon', hours: 2.5, lessons: 3 },
    { day: 'Tue', hours: 3.2, lessons: 4 },
    { day: 'Wed', hours: 1.8, lessons: 2 },
    { day: 'Thu', hours: 4.1, lessons: 5 },
    { day: 'Fri', hours: 2.9, lessons: 3 },
    { day: 'Sat', hours: 5.3, lessons: 7 },
    { day: 'Sun', hours: 3.7, lessons: 4 },
  ];

  const skillsData = [
    { skill: 'JavaScript', mastery: 85 },
    { skill: 'Python', mastery: 78 },
    { skill: 'React', mastery: 92 },
    { skill: 'ML', mastery: 65 },
    { skill: 'Cloud', mastery: 72 },
    { skill: 'Data Science', mastery: 80 },
  ];

  const categoryProgress = [
    { name: 'Programming', value: 85, color: '#3b82f6' },
    { name: 'Data Science', value: 72, color: '#8b5cf6' },
    { name: 'AI/ML', value: 65, color: '#f59e0b' },
    { name: 'Cloud', value: 70, color: '#10b981' },
  ];

  const monthlyGrowth = [
    { month: 'Jul', mastery: 45, xp: 300 },
    { month: 'Aug', mastery: 52, xp: 450 },
    { month: 'Sep', mastery: 61, xp: 620 },
    { month: 'Oct', mastery: 68, xp: 780 },
    { month: 'Nov', mastery: 82, xp: 1250 },
  ];

  const stats = {
    totalHours: progress.reduce((acc, p) => acc + (p.totalTimeSpent || 0), 0) / 60,
    totalLessons: progress.reduce((acc, p) => acc + (p.lessonsCompleted || 0), 0),
    averageProgress: progress.length > 0 
      ? progress.reduce((acc, p) => acc + (p.overallProgress || 0), 0) / progress.length 
      : 0,
    streak: 7,
    xp: 1250,
    level: 12,
  };

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-xl text-gray-600 dark:text-gray-400">Please sign in to view your progress</p>
      </div>
    </div>
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading your progress...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mt-32 -mr-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mb-32 -ml-32"></div>
        
        <div className="relative">
          <h1 className="text-4xl font-bold mb-2 flex items-center space-x-3">
            <TrendingUp className="h-10 w-10" />
            <span>Your Learning Progress</span>
          </h1>
          <p className="text-lg text-white/90 mb-6">
            Track your journey to mastery
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="h-5 w-5 text-yellow-300" />
                <span className="text-sm font-medium">Streak</span>
              </div>
              <div className="text-2xl font-bold">{stats.streak} days 🔥</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="h-5 w-5 text-yellow-300" />
                <span className="text-sm font-medium">Total XP</span>
              </div>
              <div className="text-2xl font-bold">{stats.xp}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-5 w-5 text-green-300" />
                <span className="text-sm font-medium">Level</span>
              </div>
              <div className="text-2xl font-bold">{stats.level}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-blue-300" />
                <span className="text-sm font-medium">Total Hours</span>
              </div>
              <div className="text-2xl font-bold">{Math.round(stats.totalHours)}h</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="glass" className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
              +12%
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.averageProgress.toFixed(0)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Average Progress</div>
        </Card>

        <Card variant="glass" className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
              +8
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.totalLessons}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Lessons Completed</div>
        </Card>

        <Card variant="glass" className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {progress.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Courses in Progress</div>
        </Card>

        <Card variant="glass" className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Award className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
              New
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {Math.floor(stats.totalLessons / 10)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Certificates Earned</div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Growth */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Monthly Growth</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Mastery & XP over time</p>
            </div>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyGrowth}>
              <defs>
                <linearGradient id="colorMastery" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorXP" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="mastery" stroke="#3b82f6" fill="url(#colorMastery)" strokeWidth={2} name="Mastery %" />
              <Area type="monotone" dataKey="xp" stroke="#8b5cf6" fill="url(#colorXP)" strokeWidth={2} name="XP" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Weekly Activity */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Weekly Activity</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Learning hours per day</p>
            </div>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="hours" fill="url(#colorBar)" radius={[8, 8, 0, 0]} name="Hours" />
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

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Radar */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Skills Mastery</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your skill proficiency</p>
            </div>
            <Target className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={skillsData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="skill" stroke="#6b7280" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6b7280" />
              <Radar name="Mastery" dataKey="mastery" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} strokeWidth={2} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Learning Focus</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Time spent by category</p>
            </div>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={categoryProgress}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name}: ${((entry.percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryProgress.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Course Progress List */}
      <Card variant="glass" className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Course Progress Details</h3>
        <div className="space-y-4">
          {progress.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No courses in progress yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Start learning to see your progress here!</p>
            </div>
          ) : (
            progress.map(p => (
              <div key={p.id} className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                      {p.courseId}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4" />
                        <span>{p.lessonsCompleted || 0}/{p.totalLessons || 0} lessons</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{Math.round(p.totalTimeSpent || 0)} min</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {p.overallProgress?.toFixed?.(0) || 0}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Complete</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${p.overallProgress || 0}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
