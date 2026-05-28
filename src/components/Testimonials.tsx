'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Quote, ChevronLeft, ChevronRight, Award, TrendingUp } from 'lucide-react';

const Testimonials: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const router = useRouter();

  const handleViewCaseStudies = () => {
    router.push('/demo');
  };

  const handleJoinSuccessStories = () => {
    router.push('/register');
  };

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Google",
      image: "/api/placeholder/80/80",
      rating: 5,
      text: "The AI-powered coding curriculum helped me transition from marketing to software development in just 6 months. The personalized learning path was exactly what I needed.",
      achievement: "Career Transition Success",
      timeFrame: "6 months"
    },
    {
      name: "Marcus Johnson",
      role: "International Business Manager",
      company: "Amazon",
      image: "/api/placeholder/80/80",
      rating: 5,
      text: "The AI pronunciation coach helped me achieve native-level fluency in Spanish within a year. The real-time feedback was incredibly accurate and helpful.",
      achievement: "Language Mastery",
      timeFrame: "12 months"
    },
    {
      name: "Jennifer Liu",
      role: "HR Director",
      company: "Microsoft",
      image: "/api/placeholder/80/80",
      rating: 5,
      text: "Our employee onboarding time reduced by 60% with the AI-driven training modules. The platform scales beautifully across our global workforce.",
      achievement: "60% Time Reduction",
      timeFrame: "3 months implementation"
    },
    {
      name: "David Rodriguez",
      role: "Parent & Educator",
      company: "Local School District",
      image: "/api/placeholder/80/80",
      rating: 5,
      text: "My daughter's math grades improved from C to A+ with the personalized AI tutor. The platform adapts perfectly to her learning style and pace.",
      achievement: "Grade Improvement C→A+",
      timeFrame: "1 semester"
    },
    {
      name: "Dr. Emily Watson",
      role: "Learning & Development Director",
      company: "IBM",
      image: "/api/placeholder/80/80",
      rating: 5,
      text: "The analytics and progress tracking features give us unprecedented insights into our team's skill development. ROI has been exceptional.",
      achievement: "300% ROI Increase",
      timeFrame: "6 months"
    }
  ];

  const companies = [
    { name: "Google", logo: "/api/placeholder/120/40" },
    { name: "Microsoft", logo: "/api/placeholder/120/40" },
    { name: "Amazon", logo: "/api/placeholder/120/40" },
    { name: "IBM", logo: "/api/placeholder/120/40" },
    { name: "Apple", logo: "/api/placeholder/120/40" },
    { name: "Meta", logo: "/api/placeholder/120/40" },
    { name: "Netflix", logo: "/api/placeholder/120/40" },
    { name: "Tesla", logo: "/api/placeholder/120/40" }
  ];

  const stats = [
    { number: "500K+", label: "Active Learners", icon: TrendingUp },
    { number: "95%", label: "Completion Rate", icon: Award },
    { number: "4.9/5", label: "Average Rating", icon: Star },
    { number: "50+", label: "Countries", icon: TrendingUp }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Testimonials & Social Proof
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of successful learners and leading organizations who have transformed 
            their skills and careers with our AI-powered platform.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Testimonial Carousel */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 lg:p-12 mb-16 relative overflow-hidden">
          <div className="absolute top-6 left-6">
            <Quote className="w-12 h-12 text-primary-200 dark:text-primary-800" />
          </div>
          
          <div className="relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Rating Stars */}
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                &ldquo;{testimonials[currentTestimonial].text}&rdquo;
              </blockquote>

              {/* Achievement Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-success-100 dark:bg-success-900/50 text-success-700 dark:text-success-300 rounded-full text-sm font-medium mb-6">
                <Award className="w-4 h-4 mr-2" />
                {testimonials[currentTestimonial].achievement} in {testimonials[currentTestimonial].timeFrame}
              </div>

              {/* Author Info */}
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 dark:text-primary-400 font-bold text-xl">
                    {testimonials[currentTestimonial].name.charAt(0)}
                  </span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {testimonials[currentTestimonial].role}
                  </div>
                  <div className="text-primary-600 dark:text-primary-400 font-medium">
                    {testimonials[currentTestimonial].company}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentTestimonial
                    ? 'bg-primary-600 dark:bg-primary-400'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Company Logos */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-8">
            Trusted by leading organizations worldwide
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center opacity-60 hover:opacity-100 transition-opacity duration-300">
            {companies.map((company, index) => (
              <div key={index} className="flex items-center justify-center">
                <div className="w-24 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {company.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Case Studies CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Want to See More Success Stories?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Explore detailed case studies and learn how organizations like yours have achieved 
            remarkable results with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleViewCaseStudies}
              className="btn-primary"
            >
              View Case Studies
            </button>
            <button 
              onClick={handleJoinSuccessStories}
              className="btn-secondary"
            >
              Join Success Stories
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
