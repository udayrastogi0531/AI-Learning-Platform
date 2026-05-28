'use client';

import React from 'react';
import { CheckCircle2, Download, LayoutTemplate, Sparkles, Upload, LineChart } from 'lucide-react';

const benefits = [
  {
    title: 'Free download',
    description: 'Export ATS-friendly resumes anytime, no watermark.',
    icon: Download,
  },
  {
    title: 'Pre-written examples',
    description: 'Role-based templates and bullets that stand out.',
    icon: Sparkles,
  },
  {
    title: 'Easy drag-drop',
    description: 'Reorder sections with one click and keep layout clean.',
    icon: LayoutTemplate,
  },
  {
    title: 'Progress tracking',
    description: 'See completion, ATS score, and job match in real time.',
    icon: LineChart,
  },
  {
    title: 'Resume upload',
    description: 'Import existing resume and enhance instantly.',
    icon: Upload,
  },
];

const ResumeBenefits: React.FC = () => {
  return (
    <section id="resume-benefits" className="py-16 sm:py-20 bg-background">
      <div className="container-responsive">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-foreground-secondary">
            Resume Builder Benefits
          </p>
          <h2 className="mt-4 text-3xl sm:text-4xl font-heading font-semibold text-foreground">
            Everything you need to ship a job-winning resume
          </h2>
          <p className="mt-4 text-foreground-secondary max-w-2xl mx-auto">
            Build, refine, and export with a smooth experience designed for speed and clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="card hover:translate-y-[-4px] transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-primary-500 mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-foreground-secondary">{benefit.description}</p>
                <div className="flex items-center gap-2 mt-4 text-xs text-foreground-secondary">
                  <CheckCircle2 className="w-4 h-4 text-secondary-500" />
                  Included in all plans
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ResumeBenefits;
