'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Code, 
  Globe, 
  Building, 
  GraduationCap,
  CheckCircle,
  ArrowRight,
  Users,
  Award
} from 'lucide-react';

const UseCases: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();

  const handleGetCustomSolution = () => {
    router.push('/contact');
  };

  const handleLearnMore = () => {
    router.push('/demo');
  };

  const useCases = [
    {
      id: 'professional',
      title: 'Professional Development',
      subtitle: 'Coding, Design, Marketing',
      icon: Code,
      description: 'Advance your career with in-demand technical and creative skills',
      image: '/api/placeholder/600/400',
      stats: {
        users: '500K+',
        completion: '92%',
        satisfaction: '4.9/5'
      },
      features: [
        'Full-stack development bootcamps',
        'UI/UX design masterclasses',
        'Digital marketing certification',
        'Data science and AI courses',
        'Project-based learning',
        'Industry mentor support'
      ],
      testimonial: {
        text: "The AI-powered coding curriculum helped me transition from marketing to software development in just 6 months.",
        author: "Sarah Chen",
        role: "Software Engineer at Google"
      }
    },
    {
      id: 'language',
      title: 'Language Learning',
      subtitle: 'AI-based Pronunciation',
      icon: Globe,
      description: 'Master new languages with AI-powered pronunciation and conversation practice',
      image: '/api/placeholder/600/400',
      stats: {
        users: '2M+',
        completion: '87%',
        satisfaction: '4.8/5'
      },
      features: [
        'Real-time pronunciation feedback',
        'AI conversation partners',
        'Cultural context learning',
        'Adaptive vocabulary building',
        'Speech recognition technology',
        'Immersive VR experiences'
      ],
      testimonial: {
        text: "The AI pronunciation coach helped me achieve native-level fluency in Spanish within a year.",
        author: "Marcus Johnson",
        role: "International Business Manager"
      }
    },
    {
      id: 'corporate',
      title: 'Corporate Training',
      subtitle: 'Compliance & Upskilling',
      icon: Building,
      description: 'Scale enterprise training with personalized learning paths for every employee',
      image: '/api/placeholder/600/400',
      stats: {
        users: '100K+',
        completion: '95%',
        satisfaction: '4.7/5'
      },
      features: [
        'Compliance training automation',
        'Leadership development programs',
        'Technical skills assessment',
        'Team collaboration tools',
        'Progress analytics dashboard',
        'Custom content creation'
      ],
      testimonial: {
        text: "Our employee onboarding time reduced by 60% with the AI-driven training modules.",
        author: "Jennifer Liu",
        role: "HR Director at Microsoft"
      }
    },
    {
      id: 'education',
      title: 'Student Education',
      subtitle: 'Tutoring & Homework Help',
      icon: GraduationCap,
      description: 'Personalized academic support for students of all ages and levels',
      image: '/api/placeholder/600/400',
      stats: {
        users: '1.5M+',
        completion: '89%',
        satisfaction: '4.9/5'
      },
      features: [
        '24/7 AI tutoring assistance',
        'Homework help and explanations',
        'Exam preparation tools',
        'Subject-specific learning paths',
        'Parent progress reports',
        'Peer study groups'
      ],
      testimonial: {
        text: "My daughter's math grades improved from C to A+ with the personalized AI tutor.",
        author: "David Rodriguez",
        role: "Parent"
      }
    }
  ];

  const currentUseCase = useCases[activeTab];
  const Icon = currentUseCase.icon;

  return (
    <section id="use-cases" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Use Cases
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover how our AI-driven platform transforms learning across different industries and use cases.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-12">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-2 shadow-lg">
            {useCases.map((useCase, index) => {
              const TabIcon = useCase.icon;
              return (
                <button
                  key={useCase.id}
                  onClick={() => setActiveTab(index)}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === index
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <TabIcon className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">{useCase.title}</span>
                  <span className="sm:hidden">{useCase.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left Column - Content */}
            <div className="p-8 lg:p-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center mr-4">
                  <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentUseCase.title}
                  </h3>
                  <p className="text-primary-600 dark:text-primary-400 font-medium">
                    {currentUseCase.subtitle}
                  </p>
                </div>
              </div>

              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                {currentUseCase.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-1" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentUseCase.stats.users}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="w-5 h-5 text-success-600 dark:text-success-400 mr-1" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentUseCase.stats.completion}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Award className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-1" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentUseCase.stats.satisfaction}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Key Features
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentUseCase.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-success-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <button 
                onClick={handleLearnMore}
                className="btn-primary flex items-center"
              >
                Explore {currentUseCase.title}
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>

            {/* Right Column - Visual */}
            <div className="bg-gradient-to-br from-primary-50 to-success-50 dark:from-primary-900/20 dark:to-success-900/20 p-8 lg:p-12 flex flex-col justify-center">
              {/* Placeholder for demo/screenshot */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                <div className="aspect-video bg-gradient-to-br from-primary-100 to-success-100 dark:from-primary-800 dark:to-success-800 rounded-lg flex items-center justify-center">
                  <Icon className="w-16 h-16 text-primary-600 dark:text-primary-400" />
                </div>
              </div>

              {/* Testimonial */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center mr-4">
                    <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">
                      {currentUseCase.testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 italic mb-3">
                      &ldquo;{currentUseCase.testimonial.text}&rdquo;
                    </p>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {currentUseCase.testimonial.author}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {currentUseCase.testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Transform Your Industry?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join leading organizations that have revolutionized their learning and development programs.
          </p>
          <button 
            onClick={handleGetCustomSolution}
            className="btn-primary text-lg px-8 py-4"
          >
            Get Custom Solution
          </button>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
