'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, ShieldCheck, Stars } from 'lucide-react';

const Hero: React.FC = () => {
  const router = useRouter();

  const handleStartBuilding = () => {
    router.push('/register');
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      <div className="absolute inset-0 animated-gradient opacity-20" />
      <div className="absolute inset-0">
        <div className="absolute top-24 left-8 w-40 h-40 bg-primary-500/30 blur-3xl rounded-full animate-float" />
        <div className="absolute top-32 right-10 w-52 h-52 bg-secondary-500/25 blur-3xl rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-primary-500/15 blur-[120px] rounded-full animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 container-responsive py-24 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 border border-white/10 text-foreground-secondary text-xs tracking-[0.2em] uppercase">
              <Sparkles className="w-4 h-4 text-secondary-500" />
              AI Learning OS
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-heading font-semibold text-foreground leading-tight">
              Build Job-Winning Resume with AI
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-foreground-secondary">
              ATS Score, Job Match, Interview Prep — All in One
            </p>
            <p className="mt-6 text-base text-foreground-secondary max-w-xl">
              NeuroLearn powers AI Learning OS with resume intelligence, company-specific job matching, and interview readiness in one clean workflow.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleStartBuilding}
                className="btn-primary w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 group"
              >
                Start Building →
                <ArrowRight className="ml-2 w-5 h-5 inline-block group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="btn-secondary w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                See Live Demo
              </button>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-foreground-secondary">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-secondary-500" />
                ATS-proof templates
              </div>
              <div className="flex items-center gap-2">
                <Stars className="w-4 h-4 text-primary-500" />
                Premium AI suggestions
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="card p-6 sm:p-8 backdrop-blur-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-foreground-secondary">ATS Score</span>
                <span className="text-sm font-semibold text-secondary-500">92 / 100</span>
              </div>
              <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[92%] bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full" />
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground-secondary">Job Match</span>
                  <span className="text-foreground">87%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground-secondary">Interview Ready</span>
                  <span className="text-foreground">4/5</span>
                </div>
              </div>
            </div>

            <div className="absolute -left-10 top-10 w-40 sm:w-48 card p-4 animate-float">
              <p className="text-xs text-foreground-secondary">AI Suggestion</p>
              <p className="mt-2 text-sm text-foreground">
                Add 2 leadership bullets for higher ATS match.
              </p>
            </div>

            <div className="absolute -right-6 bottom-8 w-44 card p-4 animate-float" style={{ animationDelay: '3s' }}>
              <p className="text-xs text-foreground-secondary">Interview Prep</p>
              <p className="mt-2 text-sm text-foreground">Mock question pack ready.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
