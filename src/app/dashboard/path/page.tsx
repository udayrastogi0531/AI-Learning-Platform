'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { 
  Target, CheckCircle, Circle, Lock, TrendingUp, 
  BookOpen, Award, Zap, ArrowRight, Play, Star,
  Clock, BarChart3
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface PathStep {
  id: string;
  title: string;
  description: string;
  courseId: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'completed' | 'in-progress' | 'locked' | 'available';
  progress?: number;
  skills: string[];
  order: number;
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  category: string;
  totalDuration: string;
  steps: PathStep[];
  completion: number;
}

export default function LearningPathPage() {
  const { user } = useAuth();
  const [selectedPath, setSelectedPath] = useState<string>('web-dev');

  // Mock learning paths - replace with real data from Firestore
  const paths: LearningPath[] = [
    {
      id: 'web-dev',
      name: 'Full-Stack Web Development',
      description: 'Master modern web development from frontend to backend',
      category: 'Web Development',
      totalDuration: '120 hours',
      completion: 45,
      steps: [
        {
          id: '1',
          title: 'HTML & CSS Fundamentals',
          description: 'Learn the building blocks of web pages',
          courseId: 'html-css-basics',
          duration: '15 hours',
          difficulty: 'Beginner',
          status: 'completed',
          progress: 100,
          skills: ['HTML5', 'CSS3', 'Responsive Design'],
          order: 1
        },
        {
          id: '2',
          title: 'JavaScript Essentials',
          description: 'Master the programming language of the web',
          courseId: 'javascript-fundamentals',
          duration: '25 hours',
          difficulty: 'Beginner',
          status: 'in-progress',
          progress: 60,
          skills: ['ES6+', 'DOM', 'Event Handling', 'APIs'],
          order: 2
        },
        {
          id: '3',
          title: 'React & Modern Frontend',
          description: 'Build interactive UIs with React',
          courseId: 'react-complete',
          duration: '30 hours',
          difficulty: 'Intermediate',
          status: 'available',
          skills: ['React', 'Hooks', 'Context API', 'Redux'],
          order: 3
        },
        {
          id: '4',
          title: 'Node.js & Express',
          description: 'Create powerful backend services',
          courseId: 'nodejs-backend',
          duration: '25 hours',
          difficulty: 'Intermediate',
          status: 'locked',
          skills: ['Node.js', 'Express', 'REST APIs', 'Authentication'],
          order: 4
        },
        {
          id: '5',
          title: 'Database Design & MongoDB',
          description: 'Store and manage application data',
          courseId: 'mongodb-mastery',
          duration: '15 hours',
          difficulty: 'Intermediate',
          status: 'locked',
          skills: ['MongoDB', 'Mongoose', 'Database Design', 'Queries'],
          order: 5
        },
        {
          id: '6',
          title: 'Full-Stack Project',
          description: 'Build a complete MERN application',
          courseId: 'mern-project',
          duration: '10 hours',
          difficulty: 'Advanced',
          status: 'locked',
          skills: ['MERN Stack', 'Deployment', 'DevOps', 'Best Practices'],
          order: 6
        }
      ]
    },
    {
      id: 'data-science',
      name: 'Data Science & Machine Learning',
      description: 'From Python basics to advanced ML models',
      category: 'Data Science',
      totalDuration: '150 hours',
      completion: 20,
      steps: [
        {
          id: '1',
          title: 'Python Programming',
          description: 'Learn Python from scratch',
          courseId: 'python-basics',
          duration: '20 hours',
          difficulty: 'Beginner',
          status: 'completed',
          progress: 100,
          skills: ['Python', 'Data Types', 'Functions', 'OOP'],
          order: 1
        },
        {
          id: '2',
          title: 'Data Analysis with Pandas',
          description: 'Manipulate and analyze data',
          courseId: 'pandas-numpy',
          duration: '25 hours',
          difficulty: 'Beginner',
          status: 'in-progress',
          progress: 40,
          skills: ['Pandas', 'NumPy', 'Data Cleaning', 'Analysis'],
          order: 2
        },
        {
          id: '3',
          title: 'Data Visualization',
          description: 'Create compelling visualizations',
          courseId: 'data-viz',
          duration: '20 hours',
          difficulty: 'Intermediate',
          status: 'available',
          skills: ['Matplotlib', 'Seaborn', 'Plotly', 'Storytelling'],
          order: 3
        },
        {
          id: '4',
          title: 'Machine Learning Fundamentals',
          description: 'Introduction to ML algorithms',
          courseId: 'ml-intro',
          duration: '35 hours',
          difficulty: 'Intermediate',
          status: 'locked',
          skills: ['Supervised Learning', 'Regression', 'Classification', 'Scikit-learn'],
          order: 4
        },
        {
          id: '5',
          title: 'Deep Learning with TensorFlow',
          description: 'Neural networks and deep learning',
          courseId: 'deep-learning',
          duration: '40 hours',
          difficulty: 'Advanced',
          status: 'locked',
          skills: ['Neural Networks', 'TensorFlow', 'Keras', 'CNN', 'RNN'],
          order: 5
        },
        {
          id: '6',
          title: 'ML Projects & Deployment',
          description: 'Deploy ML models to production',
          courseId: 'ml-deployment',
          duration: '10 hours',
          difficulty: 'Advanced',
          status: 'locked',
          skills: ['Model Deployment', 'MLOps', 'APIs', 'Cloud Services'],
          order: 6
        }
      ]
    }
  ];

  const currentPath = paths.find(p => p.id === selectedPath) || paths[0];

  const getStatusIcon = (status: PathStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'in-progress':
        return <Circle className="h-6 w-6 text-blue-500 animate-pulse" />;
      case 'available':
        return <Circle className="h-6 w-6 text-gray-400" />;
      case 'locked':
        return <Lock className="h-6 w-6 text-gray-300" />;
    }
  };

  const getStatusColor = (status: PathStep['status']) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'in-progress':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'available':
        return 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500';
      case 'locked':
        return 'border-gray-200 dark:border-gray-800 opacity-60';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mt-32 -mr-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mb-32 -ml-32"></div>
        
        <div className="relative">
          <h1 className="text-4xl font-bold mb-2 flex items-center space-x-3">
            <Target className="h-10 w-10" />
            <span>Your Learning Path</span>
          </h1>
          <p className="text-lg text-white/90">
            Follow a structured journey to mastery
          </p>
        </div>
      </div>

      {/* Path Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paths.map((path) => (
          <div
            key={path.id}
            onClick={() => setSelectedPath(path.id)}
            onKeyDown={(e) => e.key === 'Enter' && setSelectedPath(path.id)}
            role="button"
            tabIndex={0}
          >
          <Card
            variant="glass"
            className={`p-6 cursor-pointer transition-all ${
              selectedPath === path.id
                ? 'ring-2 ring-blue-500 shadow-lg'
                : 'hover:shadow-lg'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {path.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {path.description}
                </p>
              </div>
              {selectedPath === path.id && (
                <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 ml-4" />
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {path.steps.length} courses
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {path.totalDuration}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                <span>Progress</span>
                <span>{path.completion}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${path.completion}%` }}
                ></div>
              </div>
            </div>
          </Card>
          </div>
        ))}
      </div>

      {/* Current Path Details */}
      <Card variant="glass" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {currentPath.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {currentPath.steps.filter(s => s.status === 'completed').length} of {currentPath.steps.length} completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {currentPath.completion}%
            </div>
            <div className="text-sm text-gray-500">Complete</div>
          </div>
        </div>

        {/* Path Steps */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

          {/* Steps */}
          <div className="space-y-6">
            {currentPath.steps.sort((a, b) => a.order - b.order).map((step, index) => (
              <div key={step.id} className="relative">
                {/* Step Connector Icon */}
                <div className="absolute left-0 top-4 z-10">
                  <div className="h-12 w-12 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                    {getStatusIcon(step.status)}
                  </div>
                </div>

                {/* Step Card */}
                <div className={`ml-20 border-2 rounded-xl p-6 transition-all ${getStatusColor(step.status)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {step.order}. {step.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          step.difficulty === 'Beginner' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                          step.difficulty === 'Intermediate' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' :
                          'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                        }`}>
                          {step.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {step.description}
                      </p>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {step.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Duration */}
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{step.duration}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="ml-4">
                      {step.status === 'locked' ? (
                        <Button variant="secondary" size="sm" disabled>
                          <Lock className="h-4 w-4 mr-2" />
                          Locked
                        </Button>
                      ) : (
                        <Link href={`/dashboard/courses/${step.courseId}`}>
                          <Button 
                            variant={step.status === 'completed' ? 'secondary' : 'gradient'}
                            size="sm"
                          >
                            {step.status === 'completed' ? (
                              <>
                                <Award className="h-4 w-4 mr-2" />
                                Review
                              </>
                            ) : step.status === 'in-progress' ? (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Continue
                              </>
                            ) : (
                              <>
                                <ArrowRight className="h-4 w-4 mr-2" />
                                Start
                              </>
                            )}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar for In-Progress Courses */}
                  {step.status === 'in-progress' && step.progress !== undefined && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{step.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${step.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Recommendations */}
      <Card variant="glass" className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Zap className="h-6 w-6 mr-2 text-yellow-500" />
          Recommended Next Steps
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Complete &ldquo;JavaScript Essentials&rdquo; to unlock React course
            </span>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Star className="h-5 w-5 text-purple-600" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Maintain your 15-day streak to unlock bonus content
            </span>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <BarChart3 className="h-5 w-5 text-green-600" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              You&apos;re 45% faster than the average learner - keep it up!
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
