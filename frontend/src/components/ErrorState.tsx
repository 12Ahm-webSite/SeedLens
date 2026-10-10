'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-xl mx-auto my-12 p-6 mc-gui-panel text-center">
      <div className="w-12 h-12 bg-[#7A1E11] border-2 border-[#A83222] border-b-[#3D0A04] border-r-[#3D0A04] mx-auto flex items-center justify-center text-[#FFFFFF] mb-3 shadow-[1px_1px_0_#000]">
        <AlertTriangle className="w-6 h-6 text-[#FADB44]" />
      </div>

      <h3 className="font-mc-heading text-lg font-bold text-[#E03B24] uppercase mb-2">
        {t.errorTitle}
      </h3>

      <div className="bg-[#DFDFDF] p-3 border-t border-l border-[#FFFFFF] border-b border-r border-[#999999] text-xs text-[#222222] font-mono font-bold leading-relaxed mb-4">
        {message}
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mc-button inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#1E1E1E] cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#5B8731]" />
          <span>{t.tryAgain}</span>
        </button>
      )}
    </div>
  );
}
