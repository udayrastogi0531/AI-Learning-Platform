'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Brain, 
  Target, 
  MessageCircle, 
  TrendingUp, 
  BarChart3,
  ArrowRight 
} from 'lucide-react';

const Features: React.FC = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const router = useRouter();

  const handleExploreFeatures = () => {
    router.push('/demo');
  };

  const features = [
    {
      icon: BarChart3,
      title: 'ATS Analyzer',
      description: 'Score your resume with realistic ATS logic and section-by-section feedback.',
      details: 'Skills 40%, keywords 30%, experience 20%, formatting 10% for actionable optimization.',
      color: 'primary'
    },
    {
      icon: TrendingUp,
      title: 'Job Match AI',
      description: 'Match your profile against a job description and get missing skills.',
      details: 'Company-based recommendations with Apply-Ready indicator.',
      color: 'blue'
    },
    {
      icon: Target,
      title: 'Resume Builder',
      description: 'Build ATS-friendly resumes with drag, reorder, and live preview.',
      details: 'Pre-filled suggestions and instant improvements from AI.',
      color: 'success'
    },
    {
      icon: MessageCircle,
      title: 'AI Interview',
      description: 'Generate role-based questions and score your answers.',
      details: 'Voice input, feedback, and progress tracking included.',
      color: 'indigo'
    },
    {
      icon: Brain,
      title: 'Career Coach',
      description: 'Chat with an AI coach that remembers your goals and history.',
      details: 'Streaming feel, typing animation, and saved chat history.',
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      primary: "bg-white/10 text-primary-500 group-hover:bg-white/15",
      success: "bg-white/10 text-secondary-500 group-hover:bg-white/15",
      purple: "bg-white/10 text-primary-400 group-hover:bg-white/15",
      blue: "bg-white/10 text-secondary-500 group-hover:bg-white/15",
      orange: "bg-white/10 text-secondary-500 group-hover:bg-white/15",
      red: "bg-white/10 text-primary-500 group-hover:bg-white/15",
      green: "bg-white/10 text-secondary-500 group-hover:bg-white/15",
      indigo: "bg-white/10 text-primary-500 group-hover:bg-white/15"
    };
    return colors[color as keyof typeof colors] || colors.primary;
  };

  return (
    <section id="features" className="py-16 sm:py-20 bg-background">
      <div className="container-responsive">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-foreground-secondary">Features</p>
          <h2 className="mt-4 text-3xl sm:text-4xl font-heading font-semibold text-foreground">
            The AI Career Copilot you can ship today
          </h2>
          <p className="mt-4 text-foreground-secondary max-w-3xl mx-auto px-4 leading-relaxed">
            Everything from ATS scoring to job matching and interview prep, built into one smooth workflow.
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group card p-6 cursor-pointer relative overflow-hidden hover:translate-y-[-4px] transition-all duration-300"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                {/* Background Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300 ${getColorClasses(feature.color)}`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3 group-hover:text-secondary-500 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-foreground-secondary text-sm leading-relaxed mb-3 sm:mb-4">
                    {feature.description}
                  </p>

                  {/* Expanded Details on Hover - Hidden on mobile for better performance */}
                  <div className={`hidden sm:block transition-all duration-300 overflow-hidden ${
                    hoveredFeature === index ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <p className="text-xs text-foreground-secondary leading-relaxed border-t border-white/10 pt-3">
                      {feature.details}
                    </p>
                  </div>

                  {/* Learn More Arrow - Hidden on mobile */}
                  <div className={`hidden sm:flex items-center text-secondary-500 text-sm font-medium mt-4 transition-all duration-300 ${
                    hoveredFeature === index ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
                  }`}>
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 sm:mt-16 px-4">
          <p className="text-base sm:text-lg text-foreground-secondary mb-4 sm:mb-6">
            Ready to make every resume job-ready?
          </p>
          <button
            onClick={handleExploreFeatures}
            className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto min-h-touch"
          >
            Explore All Features
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;
