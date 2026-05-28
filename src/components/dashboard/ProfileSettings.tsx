'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { 
  User, Mail, Phone, Globe, Github, Linkedin, 
  Camera, Save, Eye, EyeOff, Bell, Shield, 
  Palette, Languages, Upload, X 
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface TabProps {
  activeTab: 'personal' | 'preferences' | 'privacy' | 'notifications';
  setActiveTab: (tab: 'personal' | 'preferences' | 'privacy' | 'notifications') => void;
}

const tabs = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'preferences', label: 'Preferences', icon: Palette },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export function ProfileSettings() {
  const { user, userProfile, updateUserProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'personal' | 'preferences' | 'privacy' | 'notifications'>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    bio: userProfile?.bio || '',
    interests: userProfile?.interests || '',
    learningGoal: userProfile?.learningGoal || '',
    githubUrl: userProfile?.githubUrl || '',
    linkedinUrl: userProfile?.linkedinUrl || '',
    portfolioUrl: userProfile?.portfolioUrl || '',
    language: userProfile?.preferences?.language || 'en',
    notifications: userProfile?.preferences?.notifications ?? true,
    emailNotifications: userProfile?.preferences?.emailNotifications ?? true,
    pushNotifications: userProfile?.preferences?.pushNotifications ?? false,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Sync formData with userProfile when it loads
  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        bio: userProfile.bio || '',
        interests: userProfile.interests || '',
        learningGoal: userProfile.learningGoal || '',
        githubUrl: userProfile.githubUrl || '',
        linkedinUrl: userProfile.linkedinUrl || '',
        portfolioUrl: userProfile.portfolioUrl || '',
        language: userProfile.preferences?.language || 'en',
        notifications: userProfile.preferences?.notifications ?? true,
        emailNotifications: userProfile.preferences?.emailNotifications ?? true,
        pushNotifications: userProfile.preferences?.pushNotifications ?? false,
      });
    }
  }, [userProfile]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user) {
      setSaveError('User not authenticated');
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      await updateUserProfile({
        displayName: formData.displayName,
        phone: formData.phone,
        bio: formData.bio,
        interests: formData.interests,
        learningGoal: formData.learningGoal,
        githubUrl: formData.githubUrl,
        linkedinUrl: formData.linkedinUrl,
        portfolioUrl: formData.portfolioUrl,
        preferences: {
          theme: userProfile?.preferences?.theme || 'system',
          language: formData.language,
          notifications: formData.notifications,
          emailNotifications: formData.emailNotifications,
          pushNotifications: formData.pushNotifications,
        },
      });
      
      setIsEditing(false);
      setSaveSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setSaveError(error.message || 'Failed to update profile. Please check your permissions.');
    } finally {
      setSaving(false);
    }
  };

  const TabNavigation = ({ activeTab, setActiveTab }: TabProps) => (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-1 mb-6 sm:mb-8 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg animate-slide-down">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'personal' | 'preferences' | 'privacy' | 'notifications')}
            className={`flex items-center space-x-2 px-3 py-2.5 sm:px-4 sm:py-2 rounded-md transition-all duration-300 flex-1 justify-center touch-target hover-lift ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-xs sm:text-sm font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8">
      {/* Profile Header - Enhanced & Responsive */}
      <Card variant="gradient" className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden animate-fade-in hover-lift">
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full blur-3xl -mt-16 -mr-16 sm:-mt-24 sm:-mr-24 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full blur-3xl -mb-16 -ml-16 sm:-mb-24 sm:-ml-24 animate-float animation-delay-2000"></div>
        
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
          {/* Profile Picture - Responsive */}
          <div className="relative group flex-shrink-0">
            <div className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center ring-4 ring-white/30 overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:ring-white/50">
              {profileImage || user?.photoURL ? (
                <Image 
                  src={profileImage || user?.photoURL || ''} 
                  alt="Profile" 
                  width={112}
                  height={112}
                  className="object-cover"
                />
              ) : (
                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
                </span>
              )}
            </div>
            
            {/* Upload Overlay - Touch Friendly */}
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer touch-target">
              <Camera className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                aria-label="Upload profile picture"
              />
            </label>
          </div>
          
          {/* User Info - Responsive */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 truncate">
              {userProfile?.displayName || user?.displayName || 'Your Profile'}
            </h1>
            <p className="text-blue-100 text-sm sm:text-base mb-1 sm:mb-2 truncate">
              {userProfile?.email || user?.email}
            </p>
            <p className="text-blue-100 text-xs sm:text-sm line-clamp-2">
              {userProfile?.bio || 'Add a bio to tell others about yourself'}
            </p>
          </div>
          
          {/* Edit Button - Responsive */}
          <Button
            variant={isEditing ? 'secondary' : 'primary'}
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 hover:scale-105 whitespace-nowrap text-sm sm:text-base"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>
      </Card>

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      <Card variant="glass" className="p-4 sm:p-6 lg:p-8 animate-slide-up">
        {activeTab === 'personal' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Personal Information
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Display Name */}
              <div className="animate-fade-in">
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <span className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Display Name</span>
                  </span>
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                />
              </div>
              
              {/* Email - Read Only */}
              <div className="animate-fade-in stagger-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <span className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </span>
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                  <Shield className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              
              {/* Phone */}
              <div className="animate-fade-in stagger-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <span className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>Phone Number</span>
                  </span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                />
              </div>
              
              {/* Learning Goal */}
              <div className="animate-fade-in stagger-3">
                <label htmlFor="learningGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <span className="flex items-center space-x-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span aria-label="Learning Goal">Learning Goal</span>
                  </span>
                </label>
                <select
                  id="learningGoal"
                  value={formData.learningGoal}
                  onChange={(e) => handleInputChange('learningGoal', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                >
                  <option value="">Select a goal</option>
                  <option value="career-change">🚀 Career Change</option>
                  <option value="skill-improvement">📈 Skill Improvement</option>
                  <option value="academic">🎓 Academic Learning</option>
                  <option value="personal-interest">💡 Personal Interest</option>
                </select>
              </div>
            </div>
            
            {/* Bio - Full Width */}
            <div className="animate-fade-in stagger-4">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span className="flex items-center space-x-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  <span aria-label="Bio">Bio</span>
                </span>
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                disabled={!isEditing}
                rows={4}
                placeholder="Tell us about yourself... What drives you? What are you passionate about?"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 resize-none"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>
            
            {/* Interests */}
            <div className="animate-fade-in stagger-5">
              <label htmlFor="interests" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span className="flex items-center space-x-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span aria-label="Interests and Skills">Interests & Skills</span>
                </span>
              </label>
              <input
                id="interests"
                type="text"
                value={formData.interests}
                onChange={(e) => handleInputChange('interests', e.target.value)}
                disabled={!isEditing}
                placeholder="AI, Machine Learning, Web Development, Python, React..."
                className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Separate with commas for better organization
              </p>
            </div>
            
            {/* Social Links - Enhanced */}
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fade-in stagger-6">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Social Links
                </h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* GitHub */}
                <div className="flex items-center space-x-3 group">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                    <Github className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                    disabled={!isEditing}
                    placeholder="github.com/username"
                    aria-label="GitHub profile URL"
                    className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200 text-sm"
                  />
                </div>
                
                {/* LinkedIn */}
                <div className="flex items-center space-x-3 group">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40 transition-colors">
                    <Linkedin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                    disabled={!isEditing}
                    placeholder="linkedin.com/in/username"
                    aria-label="LinkedIn profile URL"
                    className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200 text-sm"
                  />
                </div>
                
                {/* Portfolio - Full Width */}
                <div className="flex items-center space-x-3 md:col-span-2 group">
                  <div className="flex-shrink-0 h-10 w-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/40 transition-colors">
                    <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <input
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                    disabled={!isEditing}
                    placeholder="yourportfolio.com"
                    aria-label="Portfolio website URL"
                    className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Success/Error Messages */}
            {saveSuccess && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-slide-down">
                <p className="text-green-800 dark:text-green-200 text-sm flex items-center space-x-2">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Profile updated successfully!</span>
                </p>
              </div>
            )}

            {saveError && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-slide-down">
                <p className="text-red-800 dark:text-red-200 text-sm flex items-center space-x-2">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{saveError}</span>
                </p>
              </div>
            )}

            {/* Save Button - Sticky on Mobile */}
            {isEditing && (
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 sm:static bg-white dark:bg-gray-800 -mx-4 sm:mx-0 px-4 sm:px-0 py-4 sm:py-0 animate-slide-up">
                <Button 
                  variant="gradient" 
                  onClick={handleSave} 
                  icon={<Save className="h-4 w-4" />}
                  className="w-full sm:w-auto hover:scale-105 transition-transform"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-6">Learning Preferences</h3>
            
            <div className="space-y-6">
              {/* Theme Selection */}
              <div>
                <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Theme Preference
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {['light', 'dark', 'system'].map((themeOption) => (
                    <button
                      key={themeOption}
                      onClick={() => setTheme(themeOption)}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        theme === themeOption
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-r from-gray-300 to-gray-600"></div>
                      <span className="text-sm font-medium capitalize">{themeOption}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Language Selection */}
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language
                </label>
                <select
                  id="language"
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full max-w-xs px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="zh">中文</option>
                </select>
              </div>
            </div>

            <Button variant="gradient" onClick={handleSave} icon={<Save className="h-4 w-4" />}>
              Save Preferences
            </Button>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-6">Notification Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <span className="font-medium">Email Notifications</span>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
                <label htmlFor="emailNotifications" className="relative inline-flex items-center cursor-pointer">
                  <span className="sr-only">Toggle email notifications</span>
                  <input
                    id="emailNotifications"
                    type="checkbox"
                    checked={formData.emailNotifications}
                    onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <span className="font-medium">Push Notifications</span>
                  <p className="text-sm text-gray-500">Receive browser notifications</p>
                </div>
                <label htmlFor="pushNotifications" className="relative inline-flex items-center cursor-pointer">
                  <span className="sr-only">Toggle push notifications</span>
                  <input
                    id="pushNotifications"
                    type="checkbox"
                    checked={formData.pushNotifications}
                    onChange={(e) => handleInputChange('pushNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <Button variant="gradient" onClick={handleSave} icon={<Save className="h-4 w-4" />}>
              Save Notification Settings
            </Button>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-6">Privacy & Security</h3>
            
            <div className="space-y-4">
              <Card variant="glass" className="p-4 border-l-4 border-l-blue-500">
                <h4 className="font-medium mb-2">Account Security</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Your account is secured with Firebase Authentication
                </p>
                <Button variant="secondary">
                  Change Password
                </Button>
              </Card>
              
              <Card variant="glass" className="p-4 border-l-4 border-l-green-500">
                <h4 className="font-medium mb-2">Data Privacy</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Your learning data is private and secure
                </p>
                <Button variant="secondary">
                  Download My Data
                </Button>
              </Card>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}