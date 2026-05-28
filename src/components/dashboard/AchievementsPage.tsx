'use client';

import React, { useState } from 'react';
import { 
  Award, Trophy, Medal, Star, Target, Zap, Lock, 
  Download, Share2, CheckCircle, TrendingUp, Calendar,
  Crown, Flame, BookOpen, Clock, Users
} from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  requirement?: string;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Certificate {
  id: string;
  title: string;
  course: string;
  completedAt: string;
  instructor: string;
  score: number;
  credentialId: string;
  skills: string[];
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'course' | 'achievement' | 'streak' | 'mastery';
  completed: boolean;
}

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState<'badges' | 'certificates' | 'milestones' | 'leaderboard'>('badges');

  // Sample data - replace with real data from Firestore
  const badges: Badge[] = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: <Star className="w-8 h-8" />,
      unlocked: true,
      unlockedAt: '2025-10-01',
      rarity: 'common'
    },
    {
      id: '2',
      name: 'Week Warrior',
      description: 'Learn for 7 days in a row',
      icon: <Flame className="w-8 h-8" />,
      unlocked: true,
      progress: 7,
      requirement: '7 days',
      unlockedAt: '2025-10-15',
      rarity: 'rare'
    },
    {
      id: '3',
      name: 'Speed Learner',
      description: 'Complete 5 courses in one month',
      icon: <Zap className="w-8 h-8" />,
      unlocked: true,
      unlockedAt: '2025-11-01',
      rarity: 'epic'
    },
    {
      id: '4',
      name: 'Master Scholar',
      description: 'Achieve 90% mastery in 3 subjects',
      icon: <Crown className="w-8 h-8" />,
      unlocked: false,
      progress: 2,
      requirement: '3 subjects',
      rarity: 'legendary'
    },
    {
      id: '5',
      name: 'Night Owl',
      description: 'Study after 10 PM for 5 sessions',
      icon: <Clock className="w-8 h-8" />,
      unlocked: false,
      progress: 3,
      requirement: '5 sessions',
      rarity: 'rare'
    },
    {
      id: '6',
      name: 'Social Learner',
      description: 'Help 10 other students',
      icon: <Users className="w-8 h-8" />,
      unlocked: false,
      progress: 4,
      requirement: '10 students',
      rarity: 'epic'
    }
  ];

  const certificates: Certificate[] = [
    {
      id: '1',
      title: 'Advanced JavaScript Development',
      course: 'JavaScript Mastery 2025',
      completedAt: '2025-11-05',
      instructor: 'Sarah Johnson',
      score: 95,
      credentialId: 'CERT-JS-2025-1105-X7Y9',
      skills: ['ES6+', 'Async/Await', 'DOM Manipulation', 'API Integration']
    },
    {
      id: '2',
      title: 'React & TypeScript Professional',
      course: 'Modern React Development',
      completedAt: '2025-10-20',
      instructor: 'Michael Chen',
      score: 92,
      credentialId: 'CERT-REACT-2025-1020-A3B5',
      skills: ['React Hooks', 'TypeScript', 'State Management', 'Performance']
    }
  ];

  const milestones: Milestone[] = [
    {
      id: '1',
      title: 'Completed JavaScript Fundamentals',
      description: 'Mastered the basics with 95% score',
      date: '2025-11-05',
      type: 'course',
      completed: true
    },
    {
      id: '2',
      title: '7-Day Learning Streak',
      description: 'Studied consistently for a week',
      date: '2025-10-15',
      type: 'streak',
      completed: true
    },
    {
      id: '3',
      title: '90% Mastery in React',
      description: 'Achieved expert level understanding',
      date: '2025-10-25',
      type: 'mastery',
      completed: true
    },
    {
      id: '4',
      title: 'Complete Node.js Course',
      description: 'In progress - 60% complete',
      date: '2025-11-30',
      type: 'course',
      completed: false
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'You', xp: 8420, avatar: '👤', streak: 15 },
    { rank: 2, name: 'Alex Chen', xp: 8100, avatar: '👨', streak: 12 },
    { rank: 3, name: 'Sarah Kim', xp: 7850, avatar: '👩', streak: 20 },
    { rank: 4, name: 'John Doe', xp: 7650, avatar: '👨', streak: 8 },
    { rank: 5, name: 'Emma Wilson', xp: 7420, avatar: '👩', streak: 18 }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const downloadCertificate = (cert: Certificate) => {
    console.log('Downloading certificate:', cert.id);
    // Implement PDF download
  };

  const shareCertificate = (cert: Certificate) => {
    console.log('Sharing certificate:', cert.id);
    // Implement share functionality
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Achievements & Certificates
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track your learning journey and showcase your accomplishments
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <Trophy className="w-10 h-10 mb-3 opacity-80" />
          <div className="text-3xl font-bold">12</div>
          <div className="text-sm opacity-90">Total Achievements</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <Award className="w-10 h-10 mb-3 opacity-80" />
          <div className="text-3xl font-bold">2</div>
          <div className="text-sm opacity-90">Certificates Earned</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <Flame className="w-10 h-10 mb-3 opacity-80" />
          <div className="text-3xl font-bold">15</div>
          <div className="text-sm opacity-90">Day Streak</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <TrendingUp className="w-10 h-10 mb-3 opacity-80" />
          <div className="text-3xl font-bold">8,420</div>
          <div className="text-sm opacity-90">Total XP</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8" aria-label="Achievements tabs">
          {[
            { id: 'badges', label: 'Badges', icon: Medal },
            { id: 'certificates', label: 'Certificates', icon: Award },
            { id: 'milestones', label: 'Milestones', icon: Target },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Badges Tab */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`
                relative rounded-xl p-6 transition-all duration-300 hover:scale-105
                ${badge.unlocked
                  ? 'bg-white dark:bg-gray-800 shadow-lg border-2 border-transparent hover:border-blue-400'
                  : 'bg-gray-100 dark:bg-gray-900 opacity-60'
                }
              `}
            >
              {!badge.unlocked && (
                <div className="absolute top-4 right-4">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
              )}
              
              <div className={`
                w-20 h-20 rounded-full flex items-center justify-center mb-4
                bg-gradient-to-br ${getRarityColor(badge.rarity)}
                ${badge.unlocked ? 'text-white' : 'text-gray-400'}
              `}>
                {badge.icon}
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {badge.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {badge.description}
              </p>

              {badge.unlocked ? (
                <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Unlocked {badge.unlockedAt}
                </div>
              ) : badge.progress !== undefined ? (
                <div>
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{badge.progress}/{badge.requirement}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${(badge.progress / parseInt(badge.requirement || '1')) * 100}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {badge.requirement}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certificates Tab */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Award className="w-8 h-8" />
                      <h3 className="text-2xl font-bold">{cert.title}</h3>
                    </div>
                    <p className="text-blue-100 text-sm">{cert.course}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{cert.score}%</div>
                    <div className="text-sm text-blue-100">Score</div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
                    <div className="font-medium text-gray-900 dark:text-white">{cert.completedAt}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Instructor</div>
                    <div className="font-medium text-gray-900 dark:text-white">{cert.instructor}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Credential ID</div>
                    <code className="text-xs bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded">
                      {cert.credentialId}
                    </code>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Skills Demonstrated</div>
                  <div className="flex flex-wrap gap-2">
                    {cert.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => downloadCertificate(cert)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => shareCertificate(cert)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Milestones Tab */}
      {activeTab === 'milestones' && (
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="relative flex items-start space-x-6">
                <div className={`
                  relative z-10 w-16 h-16 rounded-full flex items-center justify-center
                  ${milestone.completed
                    ? 'bg-gradient-to-br from-green-400 to-green-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  }
                  shadow-lg
                `}>
                  {milestone.type === 'course' && <BookOpen className="w-8 h-8" />}
                  {milestone.type === 'achievement' && <Trophy className="w-8 h-8" />}
                  {milestone.type === 'streak' && <Flame className="w-8 h-8" />}
                  {milestone.type === 'mastery' && <Star className="w-8 h-8" />}
                </div>

                <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {milestone.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {milestone.description}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{milestone.date}</span>
                      </div>
                    </div>
                    {milestone.completed && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Learners This Month</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">See how you rank among peers</p>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {leaderboard.map((user) => (
              <div
                key={user.rank}
                className={`
                  p-6 flex items-center justify-between transition-colors
                  ${user.rank === 1 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}
                `}
              >
                <div className="flex items-center space-x-4">
                  <div className={`
                    text-2xl font-bold w-12 h-12 rounded-full flex items-center justify-center
                    ${user.rank === 1 ? 'bg-yellow-400 text-white' : user.rank === 2 ? 'bg-gray-300 text-gray-700' : user.rank === 3 ? 'bg-orange-400 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}
                  `}>
                    {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : user.rank}
                  </div>
                  <div className="text-4xl">{user.avatar}</div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                      <span>{user.name}</span>
                      {user.rank === 1 && <Crown className="w-5 h-5 text-yellow-500" />}
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center">
                        <Flame className="w-4 h-4 mr-1 text-orange-500" />
                        {user.streak} day streak
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.xp.toLocaleString()}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">XP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
