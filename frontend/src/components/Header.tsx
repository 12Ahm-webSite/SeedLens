'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Compass, Globe, BookOpen } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import MinecraftClockToggle from '@/components/MinecraftClockToggle';

interface HeaderProps {
  onNavigate?: (sectionId: string) => void;
  selectedVersion?: string;
  onVersionChange?: (version: string) => void;
  edition?: 'java' | 'bedrock';
}

export default function Header({
  onNavigate,
  selectedVersion = '1.20.6',
  edition = 'java',
}: HeaderProps) {
  const { t, locale, toggleLocale } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const isEnRoute = pathname?.startsWith('/en');
  const baseHref = isEnRoute ? '/en' : '/ar';
  const docHref = isEnRoute ? '/en/documentation' : '/ar/documentation';

  const handleToggleLocale = () => {
    const targetLocale = locale === 'ar' ? 'en' : 'ar';
    toggleLocale();
    if (pathname) {
      if (pathname.startsWith('/ar')) {
        router.push(pathname.replace(/^\/ar/, `/${targetLocale}`));
      } else if (pathname.startsWith('/en')) {
        router.push(pathname.replace(/^\/en/, `/${targetLocale}`));
      } else {
        router.push(`/${targetLocale}`);
      }
    }
  };

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
    <header className="sticky top-0 z-50 w-full h-16 bg-[#C6C6C6] dark:bg-[#1A1D24] border-t-2 border-l-2 border-[#FFFFFF] dark:border-[#363B47] border-b-2 border-r-2 border-[#555555] dark:border-[#101216] shadow-[0_3px_6px_rgba(0,0,0,0.25)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <Link
            href={baseHref}
            onClick={() => scrollTo('hero')}
            className="flex items-center gap-2.5 text-start focus:outline-none cursor-pointer group"
          >
            <div className="w-8 h-8 bg-[#5B8731] border-2 border-[#89BD44] border-b-[#2A4413] border-r-[#2A4413] flex items-center justify-center shadow-[1px_1px_0_#000] shrink-0">
              <Compass className="w-4 h-4 text-[#FFFFFF]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mc-heading text-lg text-[#1C1C1C] dark:text-[#F1F5F9] font-bold tracking-wider uppercase drop-shadow-[0.5px_0.5px_0_#FFF] dark:drop-shadow-[0.5px_0.5px_0_#000]">
                SeedLens
              </span>
              <span className="font-mc-mono text-[10px] bg-[#5B8731] text-[#FFFFFF] px-2 py-0.5 border-t border-l border-[#89BD44] border-b border-r border-[#2A4413] font-bold shadow-[1px_1px_0_rgba(0,0,0,0.25)] hidden xs:inline-block">
                {edition === 'bedrock'
                  ? (locale === 'ar' ? 'توافق تضاريس جافا وبيدروك' : 'BEDROCK & JAVA TERRAIN PARITY')
                  : (locale === 'ar' ? 'ذكاء ماينكرافت جافا' : 'JAVA INTELLIGENCE')}
              </span>
            </div>
          </Link>
        </div>

        {/* Center Nav Links for desktop */}
        <nav className="hidden md:flex items-center gap-2">
          <Link
            href={`${baseHref}#analyzer`}
            onClick={() => scrollTo('analyzer')}
            className="mc-button px-3 py-1 text-xs text-[#222222] dark:text-[#E2E8F0] font-bold hover:text-[#5B8731] cursor-pointer"
          >
            {t.navAnalyzer}
          </Link>
          <Link
            href={`${baseHref}#how-it-works`}
            onClick={() => scrollTo('how-it-works')}
            className="mc-button px-3 py-1 text-xs text-[#222222] dark:text-[#E2E8F0] font-bold hover:text-[#5B8731] cursor-pointer"
          >
            {t.navHowItWorks}
          </Link>
          <Link
            href={`${baseHref}#categories-info`}
            onClick={() => scrollTo('categories-info')}
            className="mc-button px-3 py-1 text-xs text-[#222222] dark:text-[#E2E8F0] font-bold hover:text-[#5B8731] cursor-pointer"
          >
            {t.navCategories}
          </Link>
          <Link
            href={docHref}
            className="mc-button px-3 py-1 text-xs text-[#222222] dark:text-[#E2E8F0] font-bold hover:text-[#5B8731] cursor-pointer flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#5B8731]" />
            <span>{t.navDocumentation || (locale === 'ar' ? 'التوثيق وسجل التحديثات' : 'Docs & Changelog')}</span>
          </Link>
        </nav>

        {/* Right Telemetry & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Minecraft Clock Day/Night Mode 180-degree Toggle */}
          <MinecraftClockToggle showLabel size="md" />

          {/* Engine Status Inset Slot */}
          <div className="hidden lg:flex items-center mc-slot px-2.5 py-1 text-[#FFFFFF] font-mc-mono text-[11px] font-bold">
            <span className="w-2 h-2 bg-[#17B85E] mr-1.5 shadow-[0_0_6px_#17B85E]"></span>
            <span>
              {locale === 'ar' ? 'المحرك:' : 'ENGINE:'}{' '}
              <span className="text-[#FADB44]">{selectedVersion}</span>{' '}
              <span className="text-[#38BDF8] text-[9px]">({edition === 'bedrock' ? 'BEDROCK' : 'JAVA'})</span>
            </span>
          </div>

          {/* POS Inset */}
          <div className="hidden sm:flex items-center bg-[#B8B8B8] dark:bg-[#181B22] px-2.5 py-1 border-t border-l border-[#FFFFFF] dark:border-[#303642] border-b border-r border-[#555555] dark:border-[#0E1014] font-mc-mono text-[11px] font-bold">
            <span className="text-[#4E4E4E] dark:text-[#94A3B8] mr-1">{locale === 'ar' ? 'الموقع' : 'POS'}</span>
            <span className="text-[#2CBAA8]">X:0 Z:0</span>
          </div>

          {/* Language Switcher Button */}
          <button
            onClick={handleToggleLocale}
            className="mc-button flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#1E1E1E] dark:text-[#E2E8F0] font-bold hover:text-[#5B8731] cursor-pointer"
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
