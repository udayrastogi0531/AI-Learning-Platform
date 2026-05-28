'use client';

import { useAuth } from '@/lib/auth-context';
import { AcademicCapIcon, BookOpenIcon, QuestionMarkCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function InstructorPage() {
  const { user, userProfile } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <Card variant="glass" className="p-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-16 w-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center animate-float">
            <AcademicCapIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Instructor Console
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Manage your courses and track student progress 👨‍🏫
            </p>
          </div>
        </div>
      </Card>

      {/* Instructor Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Courses"
          value="5"
          subtitle="2 published this month"
          variant="green"
          icon={<BookOpenIcon className="h-8 w-8" />}
        />
        <StatCard
          title="Total Students"
          value="127"
          subtitle="across all courses"
          variant="blue"
          icon={<AcademicCapIcon className="h-8 w-8" />}
        />
        <StatCard
          title="Question Bank"
          value="89"
          subtitle="questions created"
          variant="purple"
          icon={<QuestionMarkCircleIcon className="h-8 w-8" />}
        />
        <StatCard
          title="Avg Completion"
          value="78%"
          subtitle="student completion rate"
          variant="orange"
          icon={<ChartBarIcon className="h-8 w-8" />}
        />
      </div>

      {/* Quick Actions */}
      <Card variant="glass" className="p-8">
        <Card.Header>
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🚀</span>
            </div>
            <Card.Title>Teaching Tools</Card.Title>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Button
              variant="gradient"
              size="lg"
              className="h-24 flex-col space-y-2"
              icon={<BookOpenIcon className="h-6 w-6" />}
            >
              <span className="font-semibold">Create Course</span>
              <span className="text-xs opacity-90">Build new learning content</span>
            </Button>
            <Button
              variant="gradient"
              size="lg"
              className="h-24 flex-col space-y-2"
              icon={<QuestionMarkCircleIcon className="h-6 w-6" />}
            >
              <span className="font-semibold">Question Bank</span>
              <span className="text-xs opacity-90">Manage quiz questions</span>
            </Button>
            <Button
              variant="gradient"
              size="lg"
              className="h-24 flex-col space-y-2"
              icon={<ChartBarIcon className="h-6 w-6" />}
            >
              <span className="font-semibold">Analytics</span>
              <span className="text-xs opacity-90">View student insights</span>
            </Button>
          </div>
        </Card.Content>
      </Card>

      {/* Recent Activity */}
      <Card variant="glass" className="p-8">
        <Card.Header>
          <Card.Title>Recent Teaching Activity</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-800/20 rounded-xl">
              <BookOpenIcon className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Published &quot;Advanced React Patterns&quot;</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">2 hours ago • 23 students enrolled</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
              <ChartBarIcon className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Reviewed student submissions</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">5 hours ago • 12 assignments graded</p>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}