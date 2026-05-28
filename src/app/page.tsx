'use client';

import { Suspense } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Pricing from '@/components/Pricing';
import TrustSection from '@/components/TrustSection';
import ResumeBenefits from '@/components/ResumeBenefits';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import AIAssistant from '@/components/AIAssistant';
import SkeletonLoader from '@/components/SkeletonLoader';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <Header />
      
      <main id="main-content">
        <Hero />

        <Suspense fallback={<SkeletonLoader />}>
          <TrustSection />
        </Suspense>

        <Suspense fallback={<SkeletonLoader />}>
          <Features />
        </Suspense>

        <Suspense fallback={<SkeletonLoader />}>
          <ResumeBenefits />
        </Suspense>

        <Suspense fallback={<SkeletonLoader />}>
          <FAQ />
        </Suspense>

        <Suspense fallback={<SkeletonLoader />}>
          <Pricing />
        </Suspense>
      </main>
      
      <Footer />
      <AIAssistant />
    </div>
  );
}
