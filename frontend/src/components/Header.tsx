'use client';

import React from 'react';
import { Compass, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface HeaderProps {
  onNavigate?: (sectionId: string) => void;
  selectedVersion?: string;
  onVersionChange?: (version: string) => void;
}

export default function Header({
  onNavigate,
  selectedVersion = '1.20.6',
}: HeaderProps) {
  const { t, locale, toggleLocale } = useLanguage();

  const scrollTo = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-[#C6C6C6] border-t-2 border-l-2 border-[#FFFFFF] border-b-2 border-r-2 border-[#555555] shadow-[0_3px_6px_rgba(0,0,0,0.25)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => scrollTo('hero')}
            className="flex items-center gap-2.5 text-start focus:outline-none cursor-pointer group"
          >
            <div className="w-8 h-8 bg-[#5B8731] border-2 border-[#89BD44] border-b-[#2A4413] border-r-[#2A4413] flex items-center justify-center shadow-[1px_1px_0_#000] shrink-0">
              <Compass className="w-4 h-4 text-[#FFFFFF]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mc-heading text-lg text-[#1C1C1C] font-bold tracking-wider uppercase drop-shadow-[0.5px_0.5px_0_#FFF]">
                SeedLens
              </span>
              <span className="font-mc-mono text-[10px] bg-[#5B8731] text-[#FFFFFF] px-2 py-0.5 border-t border-l border-[#89BD44] border-b border-r border-[#2A4413] font-bold shadow-[1px_1px_0_rgba(0,0,0,0.25)] hidden xs:inline-block">
                JAVA INTELLIGENCE
              </span>
            </div>
          </button>
        </div>

        {/* Center Nav Links for desktop */}
        <nav className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scrollTo('analyzer')}
            className="mc-button px-3 py-1 text-xs text-[#222222] font-bold hover:text-[#5B8731] cursor-pointer"
          >
            {t.navAnalyzer}
          </button>
          <button
            onClick={() => scrollTo('how-it-works')}
            className="mc-button px-3 py-1 text-xs text-[#222222] font-bold hover:text-[#5B8731] cursor-pointer"
          >
            {t.navHowItWorks}
          </button>
          <button
            onClick={() => scrollTo('categories-info')}
            className="mc-button px-3 py-1 text-xs text-[#222222] font-bold hover:text-[#5B8731] cursor-pointer"
          >
            {t.navCategories}
          </button>
        </nav>

        {/* Right Telemetry & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Engine Status Inset Slot */}
          <div className="hidden lg:flex items-center mc-slot px-2.5 py-1 text-[#FFFFFF] font-mc-mono text-[11px] font-bold">
            <span className="w-2 h-2 bg-[#17B85E] mr-1.5 shadow-[0_0_6px_#17B85E]"></span>
            <span>ENGINE: <span className="text-[#FADB44]">{selectedVersion}</span></span>
          </div>

          {/* POS Inset */}
          <div className="hidden sm:flex items-center bg-[#B8B8B8] px-2.5 py-1 border-t border-l border-[#FFFFFF] border-b border-r border-[#555555] font-mc-mono text-[11px] font-bold">
            <span className="text-[#4E4E4E] mr-1">POS</span>
            <span className="text-[#2CBAA8]">X:0 Z:0</span>
          </div>

          {/* Language Switcher Button */}
          <button
            onClick={toggleLocale}
            className="mc-button flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#1E1E1E] font-bold hover:text-[#5B8731] cursor-pointer"
            title={locale === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-[#5B8731]" />
            <span className="font-mc-heading">{locale === 'ar' ? 'English' : 'العربية'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
