'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What is ATS score?',
    answer:
      'ATS score measures how well your resume matches a job description and formatting rules used by applicant tracking systems.',
  },
  {
    question: 'How to improve resume?',
    answer:
      'Use targeted keywords, quantify impact, and keep formatting clean. The AI Coach highlights gaps and suggests upgrades.',
  },
  {
    question: 'Can ATS read PDFs?',
    answer:
      'Yes, most ATS can parse PDFs, but clean structure matters. We provide an ATS-friendly export to avoid parsing errors.',
  },
  {
    question: 'What is a good ATS score?',
    answer:
      'A score above 75 is strong. Aim for 80+ to maximize match and shortlisting chances.',
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 sm:py-20 bg-background">
      <div className="container-responsive">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-foreground-secondary">FAQ</p>
          <h2 className="mt-4 text-3xl sm:text-4xl font-heading font-semibold text-foreground">
            Answers to common questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <button
                key={item.question}
                type="button"
                className="w-full text-left card px-5 py-4 hover:translate-y-[-2px] transition-all duration-300"
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-base sm:text-lg font-semibold text-foreground">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-foreground-secondary transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {isOpen && (
                  <p className="mt-3 text-sm text-foreground-secondary leading-relaxed">
                    {item.answer}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
