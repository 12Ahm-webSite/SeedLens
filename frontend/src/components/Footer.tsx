'use client';

import React from 'react';
import { Compass, ArrowUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#C6C6C6] border-t-2 border-[#FFFFFF] border-b-2 border-[#555555] shadow-[0_-2px_4px_rgba(0,0,0,0.15)] mt-12 py-6 text-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Status bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#A8A8A8] text-xs font-mc-mono">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#5B8731] border-2 border-[#89BD44] border-b-[#2A4413] border-r-[#2A4413] flex items-center justify-center shadow-[1px_1px_0_#000]">
              <Compass className="w-3.5 h-3.5 text-[#FFFFFF]" />
            </div>
            <div>
              <span className="font-mc-heading font-bold text-sm text-[#1E1E1E]">SeedLens</span>
              <span className="text-[11px] text-[#555555] mx-2 font-bold uppercase">
                {`// MINECRAFT SEED INTELLIGENCE`}
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[11px] text-[#4E4E4E] font-bold">
            <div className="flex items-center gap-1">
              <span className="text-[#555555]">CHUNKS:</span>
              <span className="text-[#1E1E1E]">16×16 CELLS</span>
            </div>
            <span>|</span>
            <div className="flex items-center gap-1">
              <span className="text-[#555555]">COORDS:</span>
              <span className="text-[#5B8731]">Y: 64 (SEA_LEVEL)</span>
            </div>
            <span>|</span>
            <div className="flex items-center gap-1">
              <span className="text-[#555555]">ENGINE:</span>
              <span className="text-[#9E7448]">CUBIOMES C FAST FORGE</span>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className="mc-button flex items-center gap-1 px-3 py-1 text-xs text-[#1E1E1E] font-bold cursor-pointer"
          >
            <span>{t.backToTop}</span>
            <ArrowUp className="w-3 h-3 text-[#5B8731]" />
          </button>
        </div>

        {/* Disclaimer */}
        <div className="pt-4 text-center text-[11px] text-[#666666] font-medium leading-relaxed">
          <p>{t.disclaimer1}</p>
          <p className="mt-0.5">{t.disclaimer2}</p>
        </div>
      </div>
    </footer>
  );
}
