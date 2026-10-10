'use client';

import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface EmptyStateProps {
  seed: string | number;
  totalClusters?: number;
  onTryAnother?: () => void;
}

export default function EmptyState({
  seed,
  totalClusters = 0,
  onTryAnother,
}: EmptyStateProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-xl mx-auto my-12 p-6 sm:p-8 mc-gui-panel text-center">
      <div className="w-12 h-12 bg-[#866043] border-2 border-[#A87954] border-b-[#4E3523] border-r-[#4E3523] mx-auto flex items-center justify-center text-[#FADB44] mb-3 shadow-[1px_1px_0_#000]">
        <Compass className="w-6 h-6" />
      </div>

      <h3 className="font-mc-heading text-lg sm:text-xl font-bold text-[#1E1E1E] uppercase mb-1">
        {t.emptyTitle}
      </h3>

      <div className="text-xs font-mc-mono text-[#555555] font-bold mb-3">
        {t.seedLabel}: <span className="text-[#5B8731]" dir="ltr">#{seed}</span>
        {totalClusters > 0 && (
          <span className="ms-2 text-[#4E4E4E]">
            ({t.evaluatedClusters.replace('{count}', String(totalClusters))})
          </span>
        )}
      </div>

      <div className="bg-[#DFDFDF] p-3 border-t border-l border-[#FFFFFF] border-b border-r border-[#999999] text-xs text-[#333333] font-medium leading-relaxed max-w-md mx-auto mb-3">
        {t.emptyDesc}
      </div>

      <p className="text-[11px] text-[#666666] font-medium mb-4">
        {t.emptySubdesc}
      </p>

      {onTryAnother && (
        <button
          onClick={onTryAnother}
          className="mc-btn-green inline-flex items-center gap-1.5 px-4 py-2 font-bold text-xs cursor-pointer uppercase"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FADB44]" />
          <span>{t.tryAnotherSeed}</span>
        </button>
      )}
    </div>
  );
}
