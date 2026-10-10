'use client';

import React from 'react';
import { Compass, Sparkles, Map, ShieldCheck } from 'lucide-react';
import SeedInput from '@/components/SeedInput';
import { useLanguage } from '@/context/LanguageContext';

interface HeroProps {
  onAnalyze: (seed: string, version: string) => void;
  isLoading: boolean;
  selectedVersion: string;
  onVersionChange: (version: string) => void;
  initialSeed?: string;
  errorMessage?: string | null;
}

export default function Hero({
  onAnalyze,
  isLoading,
  selectedVersion,
  onVersionChange,
  initialSeed,
  errorMessage,
}: HeroProps) {
  const { t } = useLanguage();

  return (
    <section id="hero" className="relative pt-8 pb-10 md:pt-12 md:pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Banner */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#866043] text-[#FADB44] font-mc-mono text-[11px] font-bold mb-2 border-t-2 border-l-2 border-[#A87954] border-b-2 border-r-2 border-[#4E3523] shadow-[1px_1px_0_rgba(0,0,0,0.3)]">
              <span className="w-2 h-2 bg-[#FADB44] shadow-[0_0_6px_#FADB44]"></span>
              <span>CHUNK SCANNER v3.1 // MINECRAFT WORLD FORGE</span>
            </div>

            <h1 className="font-mc-heading text-3xl sm:text-4xl md:text-5xl text-[#1E1E1E] uppercase font-bold tracking-tight drop-shadow-[1px_1px_0_#FFF]">
              {t.heroTitlePrefix}{' '}
              <span className="text-[#5B8731] underline decoration-[#89BD44] decoration-4">
                {t.heroTitleHighlight}
              </span>
            </h1>

            <p className="font-medium text-sm md:text-base text-[#4A4A4A] max-w-2xl mt-2 leading-relaxed">
              {t.heroDesc}
            </p>
          </div>
        </div>

        {/* Seed Input Console (Cartography GUI) */}
        <div id="analyzer" className="scroll-mt-24">
          <SeedInput
            onAnalyze={onAnalyze}
            isLoading={isLoading}
            selectedVersion={selectedVersion}
            onVersionChange={onVersionChange}
            initialSeed={initialSeed}
            errorMessage={errorMessage}
          />
        </div>

        {/* Feature Highlights underneath */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-start">
          <div className="mc-stone-card p-3.5 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E1E1E] mb-1">
              <Compass className="w-4 h-4 text-[#5B8731] shrink-0" />
              <span className="font-mc-heading uppercase">{t.statRadiusTitle}</span>
            </div>
            <p className="text-[11px] text-[#555555] font-medium">
              {t.statRadiusDesc}
            </p>
          </div>

          <div className="mc-stone-card p-3.5 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E1E1E] mb-1">
              <Sparkles className="w-4 h-4 text-[#2CBAA8] shrink-0" />
              <span className="font-mc-heading uppercase">{t.statTaxonomyTitle}</span>
            </div>
            <p className="text-[11px] text-[#555555] font-medium">
              {t.statTaxonomyDesc}
            </p>
          </div>

          <div className="mc-stone-card p-3.5 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E1E1E] mb-1">
              <ShieldCheck className="w-4 h-4 text-[#866043] shrink-0" />
              <span className="font-mc-heading uppercase">{t.statCubiomesTitle}</span>
            </div>
            <p className="text-[11px] text-[#555555] font-medium">
              {t.statCubiomesDesc}
            </p>
          </div>

          <div className="mc-stone-card p-3.5 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E1E1E] mb-1">
              <Map className="w-4 h-4 text-[#D49B1E] shrink-0" />
              <span className="font-mc-heading uppercase">{t.statMapTitle}</span>
            </div>
            <p className="text-[11px] text-[#555555] font-medium">
              {t.statMapDesc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
