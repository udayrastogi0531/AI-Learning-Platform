'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Check, 
  X, 
  Star, 
  Zap, 
  Crown, 
  Building,
  ArrowRight,
  Calculator,
  Users,
  Clock
} from 'lucide-react';

const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [teamSize, setTeamSize] = useState(10);
  const router = useRouter();

  const handleGetStarted = (planName: string) => {
    if (planName === 'Starter') {
      router.push('/register?plan=starter');
    } else if (planName === 'Professional') {
      router.push('/register?plan=professional');
    } else if (planName === 'Premium') {
      router.push('/register?plan=premium');
    } else {
      router.push('/contact?plan=enterprise');
    }
  };

  const handleStartFreeTrial = () => {
    router.push('/register');
  };

  const handleContactSales = () => {
    router.push('/contact');
  };

  const plans = [
    {
      name: "Starter",
      description: "Perfect for individual learners getting started",
      icon: Star,
      color: "gray",
      price: {
        monthly: 19,
        annual: 15
      },
      features: [
        "Access to 100+ courses",
        "Basic AI recommendations",
        "Progress tracking",
        "Mobile app access",
        "Community support",
        "Basic analytics"
      ],
      limitations: [
        "Limited to 5 skills tracks",
        "Standard support only",
        "No custom content"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Professional",
      description: "Advanced features for serious learners and professionals",
      icon: Zap,
      color: "primary",
      price: {
        monthly: 49,
        annual: 39
      },
      features: [
        "Access to 500+ courses",
        "Advanced AI personalization",
        "Skill gap analysis",
        "Career path recommendations",
        "Priority support",
        "Advanced analytics",
        "Certification tracking",
        "Offline learning",
        "Custom learning goals"
      ],
      limitations: [
        "Limited integrations"
      ],
      cta: "Get Started",
      popular: true
    },
    {
      name: "Enterprise",
      description: "Complete solution for organizations and teams",
      icon: Building,
      color: "success",
      price: {
        monthly: 99,
        annual: 79
      },
      features: [
        "Unlimited courses & content",
        "Custom AI training models",
        "Team management dashboard",
        "Advanced reporting & analytics",
        "SSO integration",
        "Custom branding",
        "Dedicated account manager",
        "24/7 premium support",
        "API access",
        "Custom content creation",
        "Compliance tracking",
        "Bulk user management"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const getColorClasses = (color: string, type: 'bg' | 'text' | 'border') => {
    const colors = {
      gray: {
        bg: 'bg-white/10',
        text: 'text-foreground-secondary',
        border: 'border-white/10'
      },
      primary: {
        bg: 'bg-white/10',
        text: 'text-primary-500',
        border: 'border-primary-500/30'
      },
      success: {
        bg: 'bg-white/10',
        text: 'text-secondary-500',
        border: 'border-secondary-500/30'
      }
    };
    return colors[color as keyof typeof colors]?.[type] || colors.gray[type];
  };

  const calculateTeamPrice = (basePrice: number) => {
    if (teamSize <= 10) return basePrice * teamSize;
    if (teamSize <= 50) return basePrice * teamSize * 0.9; // 10% discount
    if (teamSize <= 100) return basePrice * teamSize * 0.8; // 20% discount
    return basePrice * teamSize * 0.7; // 30% discount
  };

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Pricing Plans
          </h2>
          <p className="text-xl text-foreground-secondary max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your learning journey. All plans include our core AI-powered features.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white/5 border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-white/10 text-foreground shadow-sm'
                  : 'text-foreground-secondary'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                billingCycle === 'annual'
                  ? 'bg-white/10 text-foreground shadow-sm'
                  : 'text-foreground-secondary'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-white/10 text-secondary-500 px-2 py-1 rounded">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = plan.price[billingCycle];
            
            return (
              <div
                key={index}
                className={`relative card shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                  plan.popular ? 'ring-2 ring-primary-500/60' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Crown className="w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${getColorClasses(plan.color, 'bg')}`}>
                      <Icon className={`w-8 h-8 ${getColorClasses(plan.color, 'text')}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-foreground-secondary mb-6">
                      {plan.description}
                    </p>
                    
                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-foreground">
                          ${price}
                        </span>
                        <span className="text-foreground-secondary ml-2">
                          /{billingCycle === 'monthly' ? 'month' : 'year'}
                        </span>
                      </div>
                      {billingCycle === 'annual' && (
                        <div className="text-sm text-secondary-500 mt-1">
                          Save ${(plan.price.monthly * 12 - plan.price.annual * 12)} per year
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <Check className="w-5 h-5 text-secondary-500 mr-3 flex-shrink-0" />
                        <span className="text-foreground-secondary">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, limitIndex) => (
                      <div key={limitIndex} className="flex items-center opacity-60">
                        <X className="w-5 h-5 text-foreground-secondary mr-3 flex-shrink-0" />
                        <span className="text-foreground-secondary">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleGetStarted(plan.name)}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                        : 'bg-white/10 border border-white/10 text-foreground'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Team Pricing Calculator */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <Calculator className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Team Pricing Calculator
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Calculate costs for your team with automatic volume discounts
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Team Size: {teamSize} users
              </label>
              <input
                type="range"
                min="1"
                max="200"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-1">
                <span>1</span>
                <span>50</span>
                <span>100</span>
                <span>200+</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Professional Plan</h4>
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  ${Math.round(calculateTeamPrice(plans[1].price[billingCycle]))}
                  <span className="text-lg text-gray-600 dark:text-gray-400 font-normal">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  ${Math.round(calculateTeamPrice(plans[1].price[billingCycle]) / teamSize)} per user
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Enterprise Plan</h4>
                <div className="text-3xl font-bold text-success-600 dark:text-success-400 mb-2">
                  ${Math.round(calculateTeamPrice(plans[2].price[billingCycle]))}
                  <span className="text-lg text-gray-600 dark:text-gray-400 font-normal">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  ${Math.round(calculateTeamPrice(plans[2].price[billingCycle]) / teamSize)} per user
                </div>
              </div>
            </div>

            {teamSize >= 50 && (
              <div className="mt-6 p-4 bg-success-50 dark:bg-success-900/20 rounded-lg">
                <div className="flex items-center text-success-700 dark:text-success-300">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="font-medium">
                    Volume Discount Applied: {teamSize >= 100 ? '30%' : teamSize >= 50 ? '20%' : '10%'} off
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Can I change plans anytime?
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Is there a free trial?
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                All plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                What payment methods do you accept?
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We accept all major credit cards, PayPal, and bank transfers for enterprise plans.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Do you offer refunds?
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Yes, we offer a 30-day money-back guarantee for all paid plans.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Start Your Learning Journey?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already transforming their careers with AI-powered education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleStartFreeTrial}
              className="btn-primary text-lg px-8 py-4 flex items-center justify-center"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button 
              onClick={handleContactSales}
              className="btn-secondary text-lg px-8 py-4 flex items-center justify-center"
            >
              <Clock className="mr-2 w-5 h-5" />
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
