'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function QuickAuthTest() {
  const [status, setStatus] = useState<'idle' | 'creating' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const { signUp, signIn } = useAuth();
  
  const createTestAccount = async () => {
    setStatus('creating');
    setMessage('Creating test account...');
    
    try {
      // Try to create account
      await signUp('test@example.com', '123456', 'Test User');
      setStatus('success');
      setMessage('✅ Test account created! Redirecting to dashboard...');
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
      
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        // Account exists, try to login
        try {
          await signIn('test@example.com', '123456');
          setStatus('success');
          setMessage('✅ Test account exists! Logging in...');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1500);
        } catch (loginError) {
          setStatus('error');
          setMessage('❌ Test account exists but login failed. Try manual login.');
        }
      } else {
        setStatus('error');
        setMessage(`❌ Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg max-w-sm z-50">
      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
        🚀 Quick Auth Test
      </h4>
      
      {status === 'idle' && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create/login with test account instantly:
          </p>
          <button
            onClick={createTestAccount}
            className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
          >
            Create Test Account
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Email: test@example.com<br />
            Password: 123456
          </p>
        </div>
      )}
      
      {status !== 'idle' && (
        <div className="text-sm">
          <p className={`${
            status === 'success' ? 'text-green-600' : 
            status === 'error' ? 'text-red-600' : 
            'text-blue-600'
          }`}>
            {message}
          </p>
        </div>
      )}
    </div>
  );
}