import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, Database, Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface LoadingStateProps {
  seed: string;
}

export default function LoadingState({ seed }: LoadingStateProps) {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { icon: Search, label: t.loadingStep1 },
    { icon: Database, label: t.loadingStep2 },
    { icon: Compass, label: t.loadingStep3 },
    { icon: Sparkles, label: t.loadingStep4 },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 700);

    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="w-full max-w-xl mx-auto my-12 p-6 mc-gui-panel text-center">
      {/* Voxel Compass Indicator */}
      <div className="w-12 h-12 bg-[#5B8731] border-2 border-[#89BD44] border-b-[#2A4413] border-r-[#2A4413] mx-auto flex items-center justify-center text-[#FFFFFF] shadow-[1px_1px_0_#000] mb-3">
        <Compass className="w-6 h-6 text-[#FFFFFF] animate-spin" />
      </div>

      <h3 className="font-mc-heading text-lg font-bold text-[#1E1E1E] uppercase mb-1">
        {t.loadingTitle}
      </h3>
      <p className="font-mc-mono text-xs text-[#555555] font-bold mb-4">
        {t.seedLabel}: <span className="text-[#5B8731]" dir="ltr">#{seed}</span>
      </p>

      {/* Steps Visual Progress */}
      <div className="space-y-2 max-w-md mx-auto text-start mb-4">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-2.5 p-2 font-mc-mono text-xs font-bold transition-all ${
                isDone
                  ? 'mc-slot text-[#FADB44]'
                  : isCurrent
                  ? 'bg-[#5B8731] text-[#FFFFFF] border-t-2 border-l-2 border-[#89BD44] border-b-2 border-r-2 border-[#2A4413] shadow-[1px_1px_0_#000]'
                  : 'bg-[#B8B8B8] text-[#555555] border-t border-l border-[#FFFFFF] border-b border-r border-[#737373]'
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <span className="w-4 h-4 bg-[#17B85E] text-[#FFFFFF] inline-flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                ) : isCurrent ? (
                  <div className="w-3.5 h-3.5 border-2 border-[#FFFFFF] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Skeletons */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="h-20 mc-slot animate-pulse" />
        <div className="h-20 mc-slot animate-pulse" />
      </div>
    </div>
  );
}
