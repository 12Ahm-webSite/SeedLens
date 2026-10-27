'use client';

import React, { useState } from 'react';
import { Compass, Sparkles, Map, ShieldCheck, Search, Bookmark } from 'lucide-react';
import SeedInput from '@/components/SeedInput';
import WishlistFinder from '@/components/WishlistFinder';
import SeedComparison from '@/components/SeedComparison';
import CommunityVaultModal from '@/components/CommunityVaultModal';
import { useLanguage } from '@/context/LanguageContext';

interface HeroProps {
  onAnalyze: (seed: string, version: string) => void;
  isLoading: boolean;
  selectedVersion: string;
  onVersionChange: (version: string) => void;
  edition?: 'java' | 'bedrock';
  onEditionChange?: (edition: 'java' | 'bedrock') => void;
  initialSeed?: string;
  errorMessage?: string | null;
}

export default function Hero({
  onAnalyze,
  isLoading,
  selectedVersion,
  onVersionChange,
  edition = 'java',
  onEditionChange,
  initialSeed,
  errorMessage,
}: HeroProps) {
  const { t, locale } = useLanguage();
  const isAr = locale === 'ar';
  const [activeMode, setActiveMode] = useState<'analyzer' | 'wishlist' | 'compare'>('analyzer');
  const [showVaultModal, setShowVaultModal] = useState<boolean>(false);

  return (
    <section id="hero" className="relative pt-8 pb-10 md:pt-12 md:pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Banner */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#866043] text-[#FADB44] font-mc-mono text-[11px] font-bold mb-2 border-t-2 border-l-2 border-[#A87954] border-b-2 border-r-2 border-[#4E3523] shadow-[1px_1px_0_rgba(0,0,0,0.3)]">
              <span className="w-2 h-2 bg-[#FADB44] shadow-[0_0_6px_#FADB44]"></span>
              <span>{t.heroBadge}</span>
            </div>

            <h1 className="font-mc-heading text-3xl sm:text-4xl md:text-5xl text-[#1E1E1E] dark:text-[#F1F5F9] uppercase font-bold tracking-tight drop-shadow-[1px_1px_0_#FFF] dark:drop-shadow-[1px_1px_0_#000]">
              {t.heroTitlePrefix}{' '}
              <span className="text-[#5B8731] underline decoration-[#89BD44] decoration-4">
                {t.heroTitleHighlight}
              </span>
            </h1>

            <p className="font-medium text-sm md:text-base text-[#4A4A4A] dark:text-[#94A3B8] max-w-2xl mt-2 leading-relaxed">
              {t.heroDesc}
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs + Community Vault Button */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <button
            type="button"
            onClick={() => setActiveMode('analyzer')}
            className={`px-4 py-2.5 text-xs font-mc-heading uppercase tracking-wider rounded border-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeMode === 'analyzer'
                ? 'bg-[#866043] text-white border-b-4 border-[#4E3523] shadow-md'
                : 'bg-black/10 dark:bg-white/10 text-[#444] dark:text-[#94A3B8] border-transparent hover:bg-black/15 dark:hover:bg-white/15'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-[#FADB44]" />
            <span>{t.tabAnalyzeSeed}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('wishlist')}
            className={`px-4 py-2.5 text-xs font-mc-heading uppercase tracking-wider rounded border-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeMode === 'wishlist'
                ? 'bg-[#5B8731] text-white border-b-4 border-[#3D5A20] shadow-md'
                : 'bg-black/10 dark:bg-white/10 text-[#444] dark:text-[#94A3B8] border-transparent hover:bg-black/15 dark:hover:bg-white/15'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FADB44] animate-pulse" />
            <span>{t.tabWishlistFinder}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('compare')}
            className={`px-4 py-2.5 text-xs font-mc-heading uppercase tracking-wider rounded border-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeMode === 'compare'
                ? 'bg-[#2563EB] text-white border-b-4 border-[#1E40AF] shadow-md'
                : 'bg-black/10 dark:bg-white/10 text-[#444] dark:text-[#94A3B8] border-transparent hover:bg-black/15 dark:hover:bg-white/15'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#FADB44]" />
            <span>{t.tabCompareSeeds}</span>
          </button>

          {/* Community Vault & Bookmarks Drawer Trigger */}
          <button
            type="button"
            onClick={() => setShowVaultModal(true)}
            className="sm:ms-auto px-3.5 py-2 text-xs font-mc-heading uppercase tracking-wider rounded border-2 border-[#D97706] bg-[#D97706]/15 text-[#D97706] dark:text-[#FBBF24] hover:bg-[#D97706] hover:text-white transition-all cursor-pointer flex items-center gap-2"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{t.tabCommunityVault}</span>
          </button>
        </div>

        {/* Console Container (Cartography Analyzer vs Wishlist Finder vs Seed Comparison) */}
        <div id="analyzer" className="scroll-mt-24">
          {activeMode === 'analyzer' && (
            <SeedInput
              onAnalyze={onAnalyze}
              isLoading={isLoading}
              selectedVersion={selectedVersion}
              onVersionChange={onVersionChange}
              edition={edition}
              onEditionChange={onEditionChange}
              initialSeed={initialSeed}
              errorMessage={errorMessage}
            />
          )}

          {activeMode === 'wishlist' && (
            <WishlistFinder
              selectedVersion={selectedVersion}
              onVersionChange={onVersionChange}
              onSelectSeed={(seed, ver) => {
                onVersionChange(ver);
                onAnalyze(seed, ver);
              }}
            />
          )}

          {activeMode === 'compare' && (
            <SeedComparison
              onLoadSeedInAnalyzer={(seed, ver) => {
                onVersionChange(ver);
                onAnalyze(seed, ver);
                setActiveMode('analyzer');
              }}
            />
          )}
        </div>

        {/* Feature Highlights underneath */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-start">
          <div className="mc-stone-card p-3.5 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E1E1E] dark:text-[#F1F5F9] mb-1">
              <Compass className="w-4 h-4 text-[#5B8731] shrink-0" />
              <span className="font-mc-heading uppercase">{t.statRadiusTitle}</span>
            </div>
            <p className="text-[11px] text-[#555555] dark:text-[#94A3B8] font-medium">
              {t.statRadiusDesc}
            </p>
          </div>

          <div className="mc-stone-card p-3.5 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E1E1E] dark:text-[#F1F5F9] mb-1">
              <Sparkles className="w-4 h-4 text-[#2CBAA8] shrink-0" />
              <span className="font-mc-heading uppercase">{t.statTaxonomyTitle}</span>
            </div>
            <p className="text-[11px] text-[#555555] dark:text-[#94A3B8] font-medium">
              {t.statTaxonomyDesc}
            </p>
          </div>

          <div className="mc-stone-card p-3.5 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E1E1E] dark:text-[#F1F5F9] mb-1">
              <ShieldCheck className="w-4 h-4 text-[#866043] shrink-0" />
              <span className="font-mc-heading uppercase">{t.statCubiomesTitle}</span>
            </div>
            <p className="text-[11px] text-[#555555] dark:text-[#94A3B8] font-medium">
              {t.statCubiomesDesc}
            </p>
          </div>

          <div className="mc-stone-card p-3.5 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E1E1E] dark:text-[#F1F5F9] mb-1">
              <Map className="w-4 h-4 text-[#D49B1E] shrink-0" />
              <span className="font-mc-heading uppercase">{t.statMapTitle}</span>
            </div>
            <p className="text-[11px] text-[#555555] dark:text-[#94A3B8] font-medium">
              {t.statMapDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Community Vault & Bookmarks Modal */}
      <CommunityVaultModal
        isOpen={showVaultModal}
        onClose={() => setShowVaultModal(false)}
        onSelectSeed={(seed, ver, ed) => {
          if (ver) onVersionChange(ver);
          if (ed && onEditionChange) onEditionChange(ed);
          onAnalyze(seed, ver || selectedVersion);
          setActiveMode('analyzer');
        }}
      />
    </section>
  );
}
