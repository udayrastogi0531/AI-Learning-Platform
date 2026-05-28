'use client';

import { ProfileSettings } from '@/components/dashboard/ProfileSettings';

export default function ProfilePage() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header - Responsive */}
      <div className="px-4 sm:px-6 lg:px-0">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Profile & Settings
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Manage your account and preferences
        </p>
      </div>
      <ProfileSettings />
    </div>
  );
}
