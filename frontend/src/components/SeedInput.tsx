'use client';

import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  X,
  AlertCircle,
  Sparkles,
  Dices,
  Copy,
  Check,
} from 'lucide-react';
import { SUPPORTED_VERSIONS, validateAndResolveSeed } from '@/lib/validation';
import { useLanguage } from '@/context/LanguageContext';

interface SeedInputProps {
  onAnalyze: (seed: string, version: string) => void;
  isLoading: boolean;
  selectedVersion: string;
  onVersionChange: (version: string) => void;
  edition?: 'java' | 'bedrock';
  onEditionChange?: (edition: 'java' | 'bedrock') => void;
  initialSeed?: string;
  errorMessage?: string | null;
}

export default function SeedInput({
  onAnalyze,
  isLoading,
  selectedVersion,
  onVersionChange,
  edition = 'java',
  onEditionChange,
  initialSeed = '',
  errorMessage,
}: SeedInputProps) {
  const { t, dir, locale } = useLanguage();
  const [seed, setSeed] = useState(initialSeed);
  const [prevInitialSeed, setPrevInitialSeed] = useState(initialSeed);
  const [clientError, setClientError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [textConversionNote, setTextConversionNote] = useState<string | null>(
    null
  );

  const presetSeeds = [
    { label: t.presetTrading, seed: '123456789' },
    { label: t.presetSpawn, seed: '42' },
    { label: t.presetStrategic, seed: '2026' },
    { label: t.presetNegative, seed: '-123456789' },
    { label: t.presetEmpty, seed: '1040' },
  ];

  if (initialSeed !== prevInitialSeed) {
    setPrevInitialSeed(initialSeed);
    setSeed(initialSeed);
  }

  const handleInputChange = (val: string) => {
    setSeed(val);
    if (clientError) setClientError(null);

    const trimmed = val.trim();
    if (!trimmed) {
      setTextConversionNote(null);
      return;
    }

    if (!/^-?\d+$/.test(trimmed)) {
      const res = validateAndResolveSeed(trimmed);
      if (res.valid && res.seedString) {
        setTextConversionNote(
          `${t.textSeedNotePrefix}${trimmed}${t.textSeedNoteSuffix}${res.seedString}`
        );
      } else {
        setTextConversionNote(null);
      }
    } else {
      setTextConversionNote(null);
    }
  };

  const handleRandomize = () => {
    // Generate a valid 64-bit signed integer strictly within Minecraft bounds [-2^63, 2^63 - 1]
    let randSeed: string;
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const buf = new BigInt64Array(1);
      window.crypto.getRandomValues(buf);
      randSeed = buf[0].toString();
    } else {
      const high = BigInt(Math.floor(Math.random() * 0x7fffffff));
      const mid = BigInt(Math.floor(Math.random() * 0xffffffff));
      let val = (high << BigInt(32)) | mid;
      if (Math.random() > 0.5) val = -val;
      randSeed = val.toString();
    }
    setSeed(randSeed);
    setTextConversionNote(null);
    if (clientError) setClientError(null);
  };

  const handleCopy = () => {
    if (!seed) return;
    navigator.clipboard.writeText(seed);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    const trimmed = seed.trim();
    if (!trimmed) {
      setClientError(t.errorEmptySeed);
      return;
    }

    const validation = validateAndResolveSeed(trimmed);
    if (!validation.valid) {
      if (validation.errorCode === 'OUT_OF_RANGE') {
        setClientError(t.errorOutOfRange);
      } else {
        setClientError(validation.error || t.errorInvalidSeed);
      }
      return;
    }

    setClientError(null);
    onAnalyze(trimmed, selectedVersion);
  };

  const handleSelectPreset = (presetSeed: string) => {
    setSeed(presetSeed);
    setClientError(null);
    setTextConversionNote(null);
    onAnalyze(presetSeed, selectedVersion);
  };

  const displayError = clientError || errorMessage;
  const isOutOfRange =
    Boolean(displayError && (
      displayError === t.errorOutOfRange ||
      displayError.includes('64-bit') ||
      displayError.includes('64-بت')
    ));
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="w-full">
      {/* Quick Action Badges */}
      <div className="flex items-center gap-2 font-mc-mono text-xs flex-wrap mb-3">
        <span className="text-[#555555] dark:text-[#94A3B8] font-bold uppercase text-[11px] flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#5B8731]" />
          <span>{t.trySampleSeeds}:</span>
        </span>
        {presetSeeds.map((preset) => (
          <button
            key={preset.seed}
            type="button"
            onClick={() => handleSelectPreset(preset.seed)}
            disabled={isLoading}
            className="px-2.5 py-1 mc-button hover:bg-[#E0E0E0] dark:hover:bg-[#313745] text-[#222222] dark:text-[#E2E8F0] font-bold hover:text-[#5B8731] transition-colors cursor-pointer"
          >
            <span>#{preset.seed}</span>{' '}
            <span className="text-[10px] text-[#555555] dark:text-[#94A3B8] font-normal">
              ({preset.label})
            </span>
          </button>
        ))}
      </div>

      {/* Crafting Cartography Table Console */}
      <form onSubmit={handleSubmit} className="w-full mc-gui-panel p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Input Well: Seed Value */}
          <div className="lg:col-span-5 flex flex-col gap-1">
            <label className="font-mc-mono text-[11px] text-[#333333] dark:text-[#CBD5E1] font-bold uppercase flex items-center justify-between">
              <span>{t.seedLabel} / {locale === 'ar' ? 'كلمة مفتاحية' : 'Keyphrase'}</span>
              <span className="text-[#5B8731] font-bold">
                {edition === 'bedrock'
                  ? (locale === 'ar' ? 'بذرة 64-بت مشتركة' : 'BEDROCK & JAVA PARITY')
                  : (locale === 'ar' ? 'جاهز لمعالجة 64-بت جافا' : 'JAVA 64-BIT HASH READY')}
              </span>
            </label>
            <div className="relative flex items-center mc-slot px-3 py-2">
              <span className="font-mc-mono text-[#FADB44] font-bold me-2 select-none text-base">
                #
              </span>
              <input
                type="text"
                value={seed}
                onChange={(e) => handleInputChange(e.target.value)}
                disabled={isLoading}
                placeholder={t.inputPlaceholder}
                className="w-full bg-transparent text-[#FFFFFF] font-mc-mono text-sm font-semibold focus:outline-none placeholder-[#B0B0B0]"
                dir="ltr"
              />
              <div className="flex items-center gap-1">
                {seed && !isLoading && (
                  <button
                    type="button"
                    onClick={() => {
                      setSeed('');
                      setTextConversionNote(null);
                      setClientError(null);
                    }}
                    className="p-1 text-[#E0E0E0] hover:text-[#E03B24] cursor-pointer"
                    title={t.clearInput}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleRandomize}
                  disabled={isLoading}
                  className="p-1 text-[#E0E0E0] hover:text-[#FADB44] transition-colors cursor-pointer"
                  title={locale === 'ar' ? 'بذرة عشوائية' : 'Random Seed'}
                >
                  <Dices className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1 text-[#E0E0E0] hover:text-[#17B85E] transition-colors cursor-pointer"
                  title={locale === 'ar' ? 'نسخ البذرة' : 'Copy Seed'}
                >
                  {copied ? <Check className="w-4 h-4 text-[#17B85E]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Version & Edition Selector */}
          <div className="lg:col-span-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="font-mc-mono text-[11px] text-[#333333] dark:text-[#CBD5E1] font-bold uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#5B8731]"></span>
                <span>{t.versionLabel} {locale === 'ar' ? 'المولّد' : 'Generator'}</span>
              </label>

              {/* Edition Switcher Pill */}
              <div className="flex items-center bg-[#252830] p-0.5 border border-[#444855] shadow-inner">
                <button
                  type="button"
                  onClick={() => onEditionChange && onEditionChange('java')}
                  className={`px-2 py-0.5 font-mc-mono text-[10px] font-bold transition-all cursor-pointer ${
                    edition === 'java'
                      ? 'bg-[#5B8731] text-white shadow-[1px_1px_0_#2A4413]'
                      : 'text-[#94A3B8] hover:text-[#FFFFFF]'
                  }`}
                >
                  ☕ Java
                </button>
                <button
                  type="button"
                  onClick={() => onEditionChange && onEditionChange('bedrock')}
                  className={`px-2 py-0.5 font-mc-mono text-[10px] font-bold transition-all cursor-pointer ${
                    edition === 'bedrock'
                      ? 'bg-[#0284C7] text-white shadow-[1px_1px_0_#075985]'
                      : 'text-[#94A3B8] hover:text-[#FFFFFF]'
                  }`}
                  title={locale === 'ar' ? 'تطابق تضاريسي وبيومي 100% مع بذور جافا' : '100% terrain & biome parity with 64-bit Java seeds'}
                >
                  🪨 Bedrock
                </button>
              </div>
            </div>

            <div className="relative mc-slot px-3 py-2">
              <select
                value={selectedVersion}
                onChange={(e) => onVersionChange(e.target.value)}
                disabled={isLoading}
                className="w-full bg-transparent text-[#FFFFFF] font-mc-mono text-xs font-semibold focus:outline-none cursor-pointer"
              >
                {SUPPORTED_VERSIONS.map((v) => (
                  <option key={v} value={v} className="bg-[#4A4A4A] dark:bg-[#1E2128] text-[#FFFFFF]">
                    {v === '26.3'
                      ? `Minecraft ${edition === 'bedrock' ? 'Bedrock / Java' : 'Java'} 26.3 (2026 Drops)`
                      : `Minecraft ${edition === 'bedrock' ? 'Bedrock / Java' : 'Java'} ${v}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Emerald Action Button */}
          <div className="lg:col-span-3 flex flex-col justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mc-btn-green font-mc-heading text-base uppercase px-4 py-2.5 flex items-center justify-center gap-2 transition-all font-bold cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#FFFFFF]/30 border-t-[#FFFFFF] rounded-full animate-spin" />
                  <span>{t.analyzingButton}</span>
                </>
              ) : (
                <>
                  <Compass className="w-5 h-5 shrink-0" />
                  <span>{t.analyzeButton}</span>
                  <ArrowIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Text Conversion Preview */}
        {textConversionNote && (
          <div className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-[#4A4A4A] border-t-2 border-l-2 border-[#1A1C20] border-b-2 border-r-2 border-[#555555] text-xs text-[#4DEDF4] font-mc-mono">
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#FADB44]" />
            <span>{textConversionNote}</span>
          </div>
        )}

        {/* Bedrock Parity Notice */}
        {edition === 'bedrock' && (
          <div className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-[#0284C7]/20 border border-[#0284C7]/50 text-xs text-[#38BDF8] font-mc-mono">
            <span className="shrink-0 text-sm">🪨</span>
            <span>
              {locale === 'ar'
                ? 'إصدار Bedrock: التضاريس، الفوهات، الجبال، والبحيرات متطابقة 100% مع Java لنفس البذور 64-بت (منذ 1.18).'
                : 'Bedrock Edition: Terrain, calderas, lakes, and biomes share 100% block-for-block parity with 64-bit Java seeds (1.18+).'}
            </span>
          </div>
        )}

        {/* Error message */}
        {displayError && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-3 py-2 bg-[#7A1E11] text-[#FFFFFF] font-mc-mono text-xs border-t-2 border-l-2 border-[#A83222] border-b-2 border-r-2 border-[#3D0A04]">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#FADB44]" />
              <span className="font-bold">{displayError}</span>
            </div>
            {isOutOfRange && (
              <button
                type="button"
                onClick={handleRandomize}
                className="mc-btn-green px-3 py-1.5 text-xs font-bold text-white flex items-center gap-1.5 shrink-0 cursor-pointer shadow-[1px_1px_0_#2A4413] animate-pulse"
              >
                <Dices className="w-3.5 h-3.5 text-[#FADB44]" />
                <span>{t.generateRandomSeedBtn}</span>
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
