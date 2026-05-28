'use client';

import React from 'react';

const companies = [
  'Google',
  'Amazon',
  'Tesla',
  'Deloitte',
  'Microsoft',
  'Netflix',
  'Meta',
  'Apple',
];

const TrustSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-background">
      <div className="container-responsive">
        <div className="text-center mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-foreground-secondary">
            Trusted by teams at
          </p>
        </div>
        <div className="relative overflow-hidden">
          <div className="marquee flex items-center gap-8 sm:gap-12">
            {[...companies, ...companies].map((name, index) => (
              <div
                key={`${name}-${index}`}
                className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-foreground-secondary text-sm sm:text-base"
              >
                {name}
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
