'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Users,
  Clock,
  Target,
  Award,
  Zap,
  BookOpen,
  Lightbulb,
  Shield
} from 'lucide-react';

const Benefits: React.FC = () => {
  const router = useRouter();

  const handleStartFreeTrial = () => {
    router.push('/register');
  };

  const handleScheduleDemo = () => {
    router.push('/contact');
  };

  const benefits = [
    {
      icon: Clock,
      title: "Faster Learning with Personalization",
      description: "Learn 3x faster with AI-powered personalized content delivery",
      stats: "65% reduction in learning time",
      features: [
        "Adaptive content sequencing",
        "Personalized difficulty adjustment",
        "Optimal learning schedule recommendations",
        "AI-powered skill gap analysis"
      ]
    },
    {
      icon: Target,
      title: "Measurable Career Growth",
      description: "Track and achieve specific career milestones with guided skill development",
      stats: "87% job placement rate",
      features: [
        "Industry-aligned skill mapping",
        "Career path visualization",
        "Achievement tracking and badges"
      ]
    },
    {
      icon: Users,
      title: "Collaborative Learning Environment",
      description: "Connect with peers and mentors in a supportive AI-facilitated community",
      stats: "94% learner satisfaction",
      features: [
        "AI-powered study groups",
        "Expert mentor matching",
        "Peer learning opportunities"
      ]
    }
  ];

  const comparisonData = [
    {
      feature: "Learning Speed",
      traditional: "Fixed pace curriculum",
      aiDriven: "Personalized adaptive pacing",
      improvement: "+300%"
    },
    {
      feature: "Engagement Rate",
      traditional: "45% completion rate",
      aiDriven: "90% completion rate",
      improvement: "+100%"
    },
    {
      feature: "Skill Relevance",
      traditional: "Generic curriculum",
      aiDriven: "Industry-specific skills",
      improvement: "+85%"
    },
    {
      feature: "Support Availability",
      traditional: "Business hours only",
      aiDriven: "24/7 AI assistance",
      improvement: "Always on"
    }
  ];

  return (
    <section id="benefits" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-success-100 dark:bg-success-900/50 text-success-700 dark:text-success-300 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Proven Results
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Benefits
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience measurable improvements in learning outcomes, engagement,
            and career advancement with our AI-driven approach.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-20">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="card p-8 group hover:shadow-2xl">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-success-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {benefit.description}
                    </p>
                    <div className="bg-primary-50 dark:bg-primary-900/50 rounded-lg p-3 mb-4">
                      <p className="text-primary-700 dark:text-primary-300 font-semibold text-sm">
                        {benefit.stats}
                      </p>
                    </div>
                    <ul className="space-y-2">
                      {benefit.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <CheckCircle className="w-4 h-4 text-success-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Section */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Traditional Learning vs AI-Driven Learning
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              See the measurable difference our AI-powered platform makes
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-600">
                  <th className="text-left py-4 px-6 text-gray-900 dark:text-white font-semibold">Feature</th>
                  <th className="text-center py-4 px-6 text-gray-600 dark:text-gray-400 font-medium">Traditional Learning</th>
                  <th className="text-center py-4 px-6 text-primary-600 dark:text-primary-400 font-semibold">AI-Driven Learning</th>
                  <th className="text-center py-4 px-6 text-success-600 dark:text-success-400 font-semibold">Improvement</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">{row.feature}</td>
                    <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-400">{row.traditional}</td>
                    <td className="py-4 px-6 text-center text-primary-600 dark:text-primary-400 font-medium">{row.aiDriven}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-success-100 dark:bg-success-900/50 text-success-700 dark:text-success-300 text-sm font-medium">
                        {row.improvement}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Transform Your Learning Experience?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who have accelerated their careers with our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStartFreeTrial}
              className="btn-primary text-lg px-8 py-4 flex items-center justify-center hover:scale-105 transition-all duration-200"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button
              onClick={handleScheduleDemo}
              className="btn-secondary text-lg px-8 py-4 hover:scale-105 transition-all duration-200"
            >
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
