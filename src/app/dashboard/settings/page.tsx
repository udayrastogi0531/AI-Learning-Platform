'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Palette, Bell, Shield, Trash2, AlertTriangle, 
  Download, RefreshCw, Check, Settings as SettingsIcon 
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (mounted && snap.exists()) {
        const data = snap.data();
        setPrefs(data?.preferences || {});
      }
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid);
    await updateDoc(ref, { preferences: prefs });
    alert('Preferences saved successfully!');
  };

  const handleResetProgress = async () => {
    if (!user) return;
    setResetting(true);
    
    try {
      const batch = writeBatch(db);
      
      // Delete all courseProgress documents for this user
      const progressQuery = query(
        collection(db, 'courseProgress'), 
        where('userId', '==', user.uid)
      );
      const progressSnap = await getDocs(progressQuery);
      progressSnap.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      // Delete all bookmarks for this user
      const bookmarksQuery = query(
        collection(db, 'bookmarks'),
        where('userId', '==', user.uid)
      );
      const bookmarksSnap = await getDocs(bookmarksQuery);
      bookmarksSnap.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Delete all video progress for this user
      const videoProgressQuery = query(
        collection(db, 'videoProgress'),
        where('userId', '==', user.uid)
      );
      const videoProgressSnap = await getDocs(videoProgressQuery);
      videoProgressSnap.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Delete all video views for this user
      const videoViewsQuery = query(
        collection(db, 'videoViews'),
        where('userId', '==', user.uid)
      );
      const videoViewsSnap = await getDocs(videoViewsQuery);
      videoViewsSnap.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      // Commit the batch
      await batch.commit();

      // Reset user stats (streak, XP, level, etc.)
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        xp: 0,
        level: 1,
        streak: 0,
        streakStartDate: null,
        lastActivityDate: null,
        coursesCompleted: 0,
        videosWatched: 0,
        totalLearningTime: 0,
        mastery: 0,
        completedVideos: [],
        completedCourses: [],
      });
      
      alert('All progress has been reset successfully! Your stats, streak, XP, and level have been reset to defaults.');
      setShowResetConfirm(false);
      
      // Reload the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error resetting progress:', error);
      alert('Failed to reset progress. Please try again.');
    } finally {
      setResetting(false);
    }
  };

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="p-6">
        <p className="text-gray-600 dark:text-gray-400">Please sign in to update settings.</p>
      </Card>
    </div>
  );
  
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <SettingsIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your preferences and data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <Card variant="glass" className="p-4 sm:p-6 hover-lift animate-slide-up">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h3>
          </div>
          <div className="space-y-3">
            <label htmlFor="theme-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Theme
            </label>
            <select 
              id="theme-select"
              value={prefs.theme || 'system'} 
              onChange={(e) => setPrefs({...prefs, theme: e.target.value })} 
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
            >
              <option value="light">☀️ Light</option>
              <option value="dark">🌙 Dark</option>
              <option value="system">💻 System</option>
            </select>
          </div>
        </Card>

        {/* Notifications Settings */}
        <Card variant="glass" className="p-4 sm:p-6 hover-lift animate-slide-up stagger-1">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email notifications</span>
              <input 
                type="checkbox" 
                checked={!!prefs.emailNotifications} 
                onChange={(e) => setPrefs({...prefs, emailNotifications: e.target.checked })} 
                className="h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Push notifications</span>
              <input 
                type="checkbox" 
                checked={!!prefs.pushNotifications} 
                onChange={(e) => setPrefs({...prefs, pushNotifications: e.target.checked })} 
                className="h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
        </Card>
      </div>

      {/* Data Management */}
      <Card variant="glass" className="p-4 sm:p-6 animate-slide-up stagger-2">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-10 w-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Management</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your learning data and progress</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Reset Progress */}
          <div className="p-4 border-2 border-red-200 dark:border-red-900/30 rounded-lg bg-red-50 dark:bg-red-900/10">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-red-900 dark:text-red-200 mb-1">Reset All Progress</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                  This will delete all your course progress, bookmarks, and learning history. This action cannot be undone.
                </p>
                {!showResetConfirm ? (
                  <Button 
                    variant="secondary" 
                    onClick={() => setShowResetConfirm(true)}
                    icon={<RefreshCw className="h-4 w-4" />}
                    className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    Reset Progress
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-red-900 dark:text-red-200">Are you absolutely sure?</p>
                    <div className="flex space-x-2">
                      <Button 
                        variant="gradient"
                        onClick={handleResetProgress}
                        disabled={resetting}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {resetting ? 'Resetting...' : 'Yes, Reset All'}
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={() => setShowResetConfirm(false)}
                        disabled={resetting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Export Data */}
          <div className="p-4 border-2 border-green-200 dark:border-green-900/30 rounded-lg bg-green-50 dark:bg-green-900/10">
            <div className="flex items-start space-x-3">
              <Download className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-green-900 dark:text-green-200 mb-1">Export Your Data</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                  Download a copy of all your learning data, progress, and certificates.
                </p>
                <Button 
                  variant="secondary"
                  icon={<Download className="h-4 w-4" />}
                  className="border-green-300 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20"
                >
                  Export Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          variant="gradient" 
          onClick={handleSave}
          icon={<Check className="h-4 w-4" />}
          className="hover:scale-105 transition-transform"
        >
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
