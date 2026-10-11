'use client';

import React from 'react';
import { Compass, Layers, Sparkles, Binary } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Binary,
      title: t.step1Title,
      description: t.step1Desc,
    },
    {
      icon: Compass,
      title: t.step2Title,
      description: t.step2Desc,
    },
    {
      icon: Layers,
      title: t.step3Title,
      description: t.step3Desc,
    },
    {
      icon: Sparkles,
      title: t.step4Title,
      description: t.step4Desc,
    },
  ];

  return (
    <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t-2 border-[#A8A8A8] dark:border-[#2E3342]">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#866043] text-[#FADB44] font-mc-mono text-[11px] font-bold mb-2 border-t border-l border-[#A87954] border-b border-r border-[#4E3523] shadow-[1px_1px_0_rgba(0,0,0,0.3)]">
          <span className="w-2 h-2 bg-[#FADB44]"></span>
          <span>{t.howItWorksBadge}</span>
        </div>
        <h2 className="font-mc-heading text-2xl sm:text-3xl font-bold text-[#1E1E1E] dark:text-[#F1F5F9] uppercase tracking-tight drop-shadow-[1px_1px_0_#FFF] dark:drop-shadow-[1px_1px_0_#000]">
          {t.howItWorksTitle}
        </h2>
        <p className="text-[#4E4E4E] dark:text-[#94A3B8] text-xs sm:text-sm font-medium mt-1">
          {t.howItWorksDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="mc-gui-panel p-5 flex flex-col justify-between hover:bg-[#D0D0D0] dark:hover:bg-[#262A34] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 bg-[#5B8731] border-2 border-[#89BD44] border-b-[#2A4413] border-r-[#2A4413] flex items-center justify-center text-[#FFFFFF] shadow-[1px_1px_0_#000] shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mc-mono text-xs font-bold px-2 py-0.5 bg-[#8B8B8B] text-[#FFFFFF] border-t border-l border-[#373737] border-b border-r border-[#FFFFFF]">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="font-mc-heading text-sm font-bold text-[#1E1E1E] dark:text-[#F1F5F9] uppercase mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs text-[#444444] dark:text-[#CBD5E1] font-medium leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
