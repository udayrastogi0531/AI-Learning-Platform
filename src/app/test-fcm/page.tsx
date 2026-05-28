'use client';

import React, { useState, useEffect } from 'react';
import { getToken } from 'firebase/messaging';
import { messaging } from '@/lib/firebase';

export default function TestFCMPage() {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!('Notification' in window)) {
        setError('This browser does not support notifications');
        return;
      }

      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission === 'granted') {
        await getTokenFromMessaging();
      } else {
        setError('Notification permission denied');
      }
    } catch (err: any) {
      console.error('Error requesting permission:', err);
      setError(err.message || 'Failed to request permission');
    } finally {
      setLoading(false);
    }
  };

  const getTokenFromMessaging = async () => {
    try {
      if (!messaging) {
        setError('Firebase Messaging not initialized');
        return;
      }

      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        setError('VAPID key not configured in .env.local');
        return;
      }

      const currentToken = await getToken(messaging, { vapidKey });
      
      if (currentToken) {
        setToken(currentToken);
        console.log('🔔 FCM Token:', currentToken);
      } else {
        setError('Failed to generate FCM token');
      }
    } catch (err: any) {
      console.error('Error getting token:', err);
      setError(err.message || 'Failed to get FCM token');
    }
  };

  const copyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sendTestNotification = () => {
    if (permission === 'granted') {
      new Notification('🎉 Test Notification', {
        body: 'Your Firebase Cloud Messaging is working perfectly!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🔔 Firebase Cloud Messaging Test
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test your push notification setup and get your FCM token
          </p>
        </div>

        {/* Permission Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Permission Status
          </h2>
          <div className="flex items-center space-x-3">
            <div className="text-4xl">
              {permission === 'granted' ? '✅' : permission === 'denied' ? '❌' : '🔔'}
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {permission === 'granted' && 'Notifications Enabled!'}
                {permission === 'denied' && 'Notifications Blocked'}
                {permission === 'default' && 'Notifications Not Requested'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {permission === 'granted' && 'You can receive push notifications'}
                {permission === 'denied' && 'Please enable notifications in browser settings'}
                {permission === 'default' && 'Click the button below to enable notifications'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="space-y-4">
            {permission !== 'granted' && (
              <button
                onClick={requestPermission}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Requesting Permission...' : '🔔 Enable Notifications'}
              </button>
            )}

            {permission === 'granted' && !token && (
              <button
                onClick={getTokenFromMessaging}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Generating Token...' : '📱 Get FCM Token'}
              </button>
            )}

            {permission === 'granted' && token && (
              <button
                onClick={sendTestNotification}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                🚀 Send Test Notification
              </button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">❌</div>
              <div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
                  Error
                </h3>
                <p className="text-red-700 dark:text-red-300 font-mono text-sm">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* FCM Token Display */}
        {token && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-500 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              📱 Your FCM Token
            </h2>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-4">
              <code className="text-xs text-gray-800 dark:text-gray-200 break-all">
                {token}
              </code>
            </div>

            <button
              onClick={copyToken}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>{copied ? '✅ Copied!' : '📋 Copy Token'}</span>
            </button>

            <div className="mt-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                📝 How to Send Test Notification:
              </h3>
              <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-2 list-decimal list-inside">
                <li>Copy the FCM token above</li>
                <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Firebase Console</a></li>
                <li>Select your project: <strong>ai-learning-platform-24fa6</strong></li>
                <li>Navigate to <strong>Cloud Messaging</strong></li>
                <li>Click <strong>&quot;Send your first message&quot;</strong> or <strong>&quot;New campaign&quot;</strong></li>
                <li>Fill in notification title and text</li>
                <li>Click <strong>&quot;Send test message&quot;</strong></li>
                <li>Paste your FCM token</li>
                <li>Click <strong>&quot;Test&quot;</strong></li>
                <li>🎉 You should receive the notification!</li>
              </ol>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            📖 Testing Guide
          </h2>
          
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                ✅ Prerequisites Check:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>VAPID key configured in .env.local: {process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ? '✅' : '❌'}</li>
                <li>Service worker registered: Check DevTools → Application → Service Workers</li>
                <li>Browser supports notifications: {typeof window !== 'undefined' && 'Notification' in window ? '✅' : '❌'}</li>
                <li>HTTPS or localhost: {typeof window !== 'undefined' && (window.location.protocol === 'https:' || window.location.hostname === 'localhost') ? '✅' : '❌'}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                🔧 Troubleshooting:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>If permission denied: Reset in browser settings (🔒 icon → Site settings)</li>
                <li>If no token: Check console for errors and verify VAPID key</li>
                <li>If notification not showing: Check browser notification settings</li>
                <li>Clear cache and reload if issues persist</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
