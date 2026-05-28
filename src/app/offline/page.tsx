'use client';

import Link from 'next/link';
import { WifiOff, RefreshCw, Home } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <WifiOff className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            You&apos;re Offline
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            It looks like you&apos;ve lost your internet connection. Don&apos;t worry, you can still access some features while offline.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="btn-primary w-full flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
          
          <Link href="/" className="btn-secondary w-full flex items-center justify-center">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Link>
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h2 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Available Offline
          </h2>
          <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
            <li>• Browse cached content</li>
            <li>• View your profile</li>
            <li>• Access downloaded materials</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
