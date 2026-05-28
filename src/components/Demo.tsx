'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Play, 
  Pause, 
  Volume2, 
  Maximize, 
  Monitor,
  Smartphone,
  Tablet,
  ArrowRight,
  MessageCircle
} from 'lucide-react';

const Demo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('desktop');
  const router = useRouter();

  const demoFeatures = [
    {
      title: "AI-Powered Dashboard",
      description: "Personalized learning analytics and progress tracking",
      timestamp: "0:15"
    },
    {
      title: "Adaptive Learning Path",
      description: "Watch how content adjusts to learner performance",
      timestamp: "0:45"
    },
    {
      title: "Interactive AI Tutor",
      description: "Real-time assistance and personalized guidance",
      timestamp: "1:20"
    },
    {
      title: "Skill Assessment",
      description: "Dynamic evaluation and gap analysis",
      timestamp: "1:55"
    }
  ];

  const screenshots = [
    {
      title: "Learning Dashboard",
      description: "Comprehensive overview of your learning journey"
    },
    {
      title: "Course Interface",
      description: "Interactive lessons with AI-powered assistance"
    },
    {
      title: "Progress Analytics",
      description: "Detailed insights into your learning performance"
    },
    {
      title: "AI Chat Assistant",
      description: "24/7 intelligent support for all your questions"
    }
  ];

  const handleTryInteractiveDemo = () => {
    // Check if we're already on the demo page
    if (typeof window !== 'undefined' && window.location.pathname === '/demo') {
      // Scroll to top of demo section
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/demo');
    }
  };

  const handleStartInteractiveDemo = () => {
    // Check if we're already on the demo page
    if (typeof window !== 'undefined' && window.location.pathname === '/demo') {
      // Scroll to top of demo section
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/demo');
    }
  };

  const handleScheduleLiveDemo = () => {
    router.push('/contact');
  };

  return (
    <section id="demo" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Platform Demo
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience the power of AI-driven learning with our interactive platform demonstration.
          </p>
        </div>

        {/* Main Demo Video Section */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-primary-600 to-success-600 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white ml-1" />
                    )}
                  </button>
                </div>
                
                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-4">
                      <button onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>
                      <Volume2 className="w-5 h-5" />
                      <span className="text-sm">2:30 / 3:45</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Maximize className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-2 bg-white/20 rounded-full h-1">
                    <div className="bg-primary-400 h-1 rounded-full w-2/3"></div>
                  </div>
                </div>
              </div>

              {/* Device Preview Options */}
              <div className="flex justify-center mt-6 space-x-4">
                {[
                  { id: 'desktop', icon: Monitor, label: 'Desktop' },
                  { id: 'tablet', icon: Tablet, label: 'Tablet' },
                  { id: 'mobile', icon: Smartphone, label: 'Mobile' }
                ].map((device) => {
                  const Icon = device.icon;
                  return (
                    <button
                      key={device.id}
                      onClick={() => setSelectedDevice(device.id)}
                      className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                        selectedDevice === device.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {device.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Demo Features List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Demo Highlights
              </h3>
              {demoFeatures.map((feature, index) => (
                <div key={index} className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                    <span className="text-xs text-primary-600 dark:text-primary-400 font-mono bg-primary-50 dark:bg-primary-900/50 px-2 py-1 rounded">
                      {feature.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={handleTryInteractiveDemo}
                className="w-full btn-primary mt-6 flex items-center justify-center hover:scale-105 transition-all duration-200"
              >
                Try Interactive Demo
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Screenshot Gallery */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Platform Screenshots
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {screenshots.map((screenshot, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                  <div className="aspect-video bg-gradient-to-br from-primary-100 to-success-100 dark:from-primary-800 dark:to-success-800 flex items-center justify-center">
                    <div className="text-center">
                      <Monitor className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                      <p className="text-primary-600 dark:text-primary-400 font-medium">
                        {screenshot.title}
                      </p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {screenshot.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {screenshot.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Demo CTA */}
        <div className="bg-gradient-to-r from-primary-600 to-success-600 rounded-2xl p-8 lg:p-12 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Experience AI-Powered Learning?
            </h3>
            <p className="text-xl mb-8 text-primary-100">
              Get hands-on with our platform and discover how AI can transform your learning journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleStartInteractiveDemo}
                className="bg-white text-primary-600 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <Play className="mr-2 w-5 h-5" />
                Start Interactive Demo
              </button>
              <button 
                onClick={handleScheduleLiveDemo}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Schedule Live Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
