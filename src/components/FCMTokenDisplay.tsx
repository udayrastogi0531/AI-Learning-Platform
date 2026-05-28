'use client';

import { useEffect, useState } from 'react';
import { messaging } from '@/lib/firebase';
import { getToken } from 'firebase/messaging';

export default function FCMTokenDisplay() {
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window === 'undefined' || !messaging) return;

    // Check current permission
    setPermission(Notification.permission);

    async function requestPermissionAndGetToken() {
      try {
        // Request permission
        const perm = await Notification.requestPermission();
        setPermission(perm);

        if (perm === 'granted') {
          console.log('🔔 Notification permission granted!');
          
          // Get FCM token
          const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
          if (!vapidKey) {
            setError('VAPID key not configured');
            return;
          }

          console.log('Using VAPID key (first 20 chars):', vapidKey.substring(0, 20) + '...');

          const currentToken = await getToken(messaging!, {
            vapidKey: vapidKey
          });

          if (currentToken) {
            setToken(currentToken);
            console.log('📱 FCM Token:', currentToken);
            console.log('\n✅ Copy this token and paste it in Firebase Console to send test notification!');
          } else {
            console.log('❌ No registration token available.');
            setError('No token available');
          }
        } else {
          console.log('❌ Notification permission denied');
          setError('Permission denied');
        }
      } catch (err: any) {
        console.error('Error getting FCM token:', err);
        setError(err.message);
      }
    }

    requestPermissionAndGetToken();
  }, []);

  if (!messaging) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border-2 border-blue-500 z-50">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {permission === 'granted' ? '✅' : permission === 'denied' ? '❌' : '🔔'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Push Notifications
          </h3>
          
          {permission === 'default' && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click &quot;Allow&quot; to enable notifications
            </p>
          )}

          {permission === 'denied' && (
            <p className="text-sm text-red-600">
              Permission denied. Enable in browser settings.
            </p>
          )}

          {permission === 'granted' && token && (
            <div>
              <p className="text-xs text-green-600 dark:text-green-400 mb-2">
                ✅ Notifications enabled!
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 rounded p-2">
                <p className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all">
                  {token}
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                📋 Copy this token for Firebase Console
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(token);
                  alert('Token copied to clipboard!');
                }}
                className="mt-2 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
              >
                Copy Token
              </button>
            </div>
          )}

          {error && permission === 'granted' && (
            <p className="text-xs text-red-600 mt-2">Error: {error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
