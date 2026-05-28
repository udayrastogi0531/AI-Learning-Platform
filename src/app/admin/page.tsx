'use client';

import { useAuth } from '@/lib/auth-context';
import { 
  UsersIcon, 
  BuildingOfficeIcon, 
  CogIcon, 
  ShieldCheckIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AdminPage() {
  const { user, userProfile } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <Card variant="glass" className="p-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-16 w-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center animate-float">
            <ShieldCheckIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Admin Panel
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              System administration and user management 🛡️
            </p>
          </div>
        </div>
      </Card>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value="1,247"
          subtitle="89 new this week"
          trend={{ value: 12, label: "growth", positive: true }}
          variant="blue"
          icon={<UsersIcon className="h-8 w-8" />}
        />
        <StatCard
          title="Organizations"
          value="23"
          subtitle="3 pending approval"
          variant="green"
          icon={<BuildingOfficeIcon className="h-8 w-8" />}
        />
        <StatCard
          title="System Health"
          value="99.9%"
          subtitle="uptime this month"
          variant="purple"
          icon={<ChartBarIcon className="h-8 w-8" />}
        />
        <StatCard
          title="Issues"
          value="2"
          subtitle="critical alerts"
          variant="orange"
          icon={<ExclamationTriangleIcon className="h-8 w-8" />}
        />
      </div>

      {/* Admin Tools */}
      <Card variant="glass" className="p-8">
        <Card.Header>
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">⚙️</span>
            </div>
            <Card.Title>Administration Tools</Card.Title>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Button
              variant="gradient"
              size="lg"
              className="h-24 flex-col space-y-2"
              icon={<UsersIcon className="h-6 w-6" />}
            >
              <span className="font-semibold">User Management</span>
              <span className="text-xs opacity-90">Roles & permissions</span>
            </Button>
            <Button
              variant="gradient"
              size="lg"
              className="h-24 flex-col space-y-2"
              icon={<BuildingOfficeIcon className="h-6 w-6" />}
            >
              <span className="font-semibold">Organizations</span>
              <span className="text-xs opacity-90">Manage client orgs</span>
            </Button>
            <Button
              variant="gradient"
              size="lg"
              className="h-24 flex-col space-y-2"
              icon={<CogIcon className="h-6 w-6" />}
            >
              <span className="font-semibold">System Settings</span>
              <span className="text-xs opacity-90">Configure platform</span>
            </Button>
            <Button
              variant="gradient"
              size="lg"
              className="h-24 flex-col space-y-2"
              icon={<ShieldCheckIcon className="h-6 w-6" />}
            >
              <span className="font-semibold">Security</span>
              <span className="text-xs opacity-90">Audit & compliance</span>
            </Button>
          </div>
        </Card.Content>
      </Card>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card variant="glass" className="p-8">
          <Card.Header>
            <Card.Title>System Status</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Database</span>
                </div>
                <span className="text-green-600 text-sm">Operational</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">API Services</span>
                </div>
                <span className="text-green-600 text-sm">Operational</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium">CDN</span>
                </div>
                <span className="text-yellow-600 text-sm">Degraded</span>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card variant="glass" className="p-8">
          <Card.Header>
            <Card.Title>Recent Admin Actions</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
                <UsersIcon className="h-8 w-8 text-blue-600 mr-4" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Updated user role permissions</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">1 hour ago • 12 users affected</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
                <BuildingOfficeIcon className="h-8 w-8 text-green-600 mr-4" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Approved new organization</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">3 hours ago • TechCorp Inc.</p>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}